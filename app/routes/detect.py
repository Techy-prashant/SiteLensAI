"""
SiteLens AI — /api/detect route

Single-frame hazard detection endpoint.
Accepts an uploaded image (multipart), base64 form field, OR JSON body
{"frame": "<Base64_JPEG>"} (required by the Android mobile client).

Runs the full pipeline:
  VLM → Classifier → RAG → Rule Engine → Alert → Audit

Returns the mobile-contract HazardAlert JSON.
"""

from __future__ import annotations

import base64
import io
import logging
import time
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import BaseModel

from app.hazard.alert_formatter import AlertFormatter, HazardAlert
from app.hazard.classifier import HazardClassifier
from app.hazard.mobile_contract import normalize_for_mobile
from app.hazard.prompt_engine import PromptEngine
from app.hazard.safeguards import apply_safeguards

logger = logging.getLogger("sitelens.routes.detect")

router = APIRouter(prefix="/api", tags=["detection"])

# Module-level singletons (injected at startup via main.py)
_vlm_engine = None
_classifier = HazardClassifier()
_alert_formatter = AlertFormatter()
_prompt_engine = PromptEngine()
_retriever = None
_rule_engine = None
_audit_db = None


def set_vlm_engine(engine):
    """Called from main.py lifespan to inject the VLM engine."""
    global _vlm_engine
    _vlm_engine = engine


def set_retriever(retriever):
    """Called from main.py lifespan to inject the RAG retriever."""
    global _retriever
    _retriever = retriever


def set_rule_engine(engine):
    """Called from main.py lifespan to inject the rule engine."""
    global _rule_engine
    _rule_engine = engine


def set_audit_db(db):
    """Called from main.py lifespan to inject the audit database."""
    global _audit_db
    _audit_db = db


# ── Pydantic model for JSON body (Android mobile client) ────────────────

class FrameRequest(BaseModel):
    """JSON request body accepted from the Android mobile client."""
    frame: str  # Base64-encoded JPEG


# ── Endpoint ─────────────────────────────────────────────────────────────

@router.post("/detect", response_model=None)
async def detect_hazards(
    request: Request,
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    worker_query: Optional[str] = Form(None),
):
    """
    Analyze a single frame for construction site hazards.

    Full pipeline: VLM → Classifier → RAG → Rule Engine → Alert → Audit

    Accepts (in priority order):
      1. JSON body: {"frame": "<Base64_JPEG>"}  ← Android mobile client
      2. Multipart upload: ``image`` file field
      3. Multipart form:   ``image_base64`` field

    Returns the mobile-contract HazardAlert JSON object.
    """
    if _vlm_engine is None:
        raise HTTPException(status_code=503, detail="VLM engine not initialized.")

    # ── 1. Get image bytes ──
    # Priority: JSON body (Android) > multipart file > multipart base64 form field
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            frame_b64 = body.get("frame")
            if not frame_b64:
                raise HTTPException(status_code=400, detail="JSON body missing 'frame' field.")
            try:
                image_bytes = base64.b64decode(frame_b64 + "==" * (4 - len(frame_b64) % 4 or 4))
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid base64 in 'frame' field.")
            worker_query = body.get("worker_query")  # optional
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=400, detail="Malformed JSON body.")
    elif image is not None:
        image_bytes = await image.read()
    elif image_base64 is not None:
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data.")
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide JSON body {\"frame\":\"...\"}  or multipart 'image' / 'image_base64' field.",
        )

    if len(image_bytes) < 100:
        raise HTTPException(status_code=400, detail="Image data too small.")

    # ── 2. Run VLM analysis ──
    start = time.time()
    try:
        vlm_prompt = _prompt_engine.build_vlm_prompt(worker_query)
        vlm_output = await _vlm_engine.analyze_frame(image_bytes, prompt=vlm_prompt)

    except Exception as e:
        logger.exception("VLM analysis failed")
        raise HTTPException(status_code=500, detail=f"VLM analysis error: {e}")

    vlm_time = time.time() - start

    # ── 3. Classify hazards ──
    classification = _classifier.classify(vlm_output)

    # ── 4. RAG retrieval (enrich with SOPs) ──
    sop_texts = []
    sop_reference = ""
    if _retriever and classification.hazards:
        try:
            rag_query = _prompt_engine.build_rag_query(
                vlm_output, worker_query
            )
            rag_results = await _retriever.retrieve(rag_query, top_k=3)
            sop_texts = [r["content"] for r in rag_results]
            if rag_results:
                sop_reference = f"{rag_results[0].get('source_file', '')} — {rag_results[0].get('section', '')}"
        except Exception as e:
            logger.warning("RAG retrieval failed (continuing without): %s", e)

    # ── 5. Rule Engine decision ──
    decision_info = None
    if _rule_engine:
        try:
            decision = await _rule_engine.decide(
                classification=classification,
                vlm_output=vlm_output,
                sop_texts=sop_texts,
                worker_query=worker_query,
            )
            decision_info = decision

            # If LLM produced structured alert JSON, use it
            if decision.used_llm and decision.llm_alert_json:
                alert = _alert_formatter.from_llm_response(
                    decision.llm_alert_json, classification
                )
            else:
                alert = _alert_formatter.from_classification(classification)
        except Exception as e:
            logger.warning("Rule engine failed (using classifier only): %s", e)
            alert = _alert_formatter.from_classification(classification)
    else:
        alert = _alert_formatter.from_classification(classification)

    # Inject SOP reference if RAG found something
    if sop_reference and not alert.sop_reference:
        alert.sop_reference = sop_reference

    # ── 6. Apply ethical AI safeguards ──
    result = alert.to_dict()
    result = apply_safeguards(result)

    # Add metadata
    result["processing_time_ms"] = round(vlm_time * 1000)
    result["raw_model_response"] = vlm_output.get("raw_model_response", "")
    if decision_info:
        result["decision"] = decision_info.decision.value
        result["decision_reasoning"] = decision_info.reasoning
        result["rule_engine_latency_ms"] = decision_info.latency_ms

    # ── 7. Audit logging ──
    if _audit_db and result.get("hazard_detected"):
        try:
            await _audit_db.log_incident(result)
        except Exception as e:
            logger.warning("Audit logging failed: %s", e)

    logger.info(
        "Detection complete: severity=%s, hazards=%d, time=%.1fs, decision=%s",
        alert.severity_level,
        len(alert.hazards_detail),
        vlm_time,
        decision_info.decision.value if decision_info else "CLASSIFIER_ONLY",
    )

    # ── 8. Normalize to mobile contract ──
    mobile_result = normalize_for_mobile(
        result,
        frame_number=0,  # single-shot — no frame sequence
        processing_time_ms=round(vlm_time * 1000),
        msg_type="alert",
    )
    import json as _json
    logger.info("[POST /api/detect → client] %s", _json.dumps(mobile_result, indent=2))
    return mobile_result

