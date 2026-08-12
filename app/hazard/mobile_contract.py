"""
SiteLens AI — Mobile Client Contract Normalizer

Converts the internal HazardAlert / pipeline result dict to the exact
JSON structure required by the Android app.

Contract (per mobile spec):
{
    "type": "alert",
    "frame_number": 123,
    "processing_time_ms": 450,
    "hazard_detected": true,
    "severity_level": "critical",
    "image_summary": "⛔ CRITICAL — 2 workers. Crane active overhead. No helmets worn. Stop all work.",
    "hazards_detail": "Worker without helmet near crane at foreground",
    "sop_reference": "OSHA Section 1926.100",
    "decision": "Stop work immediately",
    "decision_reasoning": "High risk of head injury in active zone"
}

Frame-skip message:
    {"type": "frame_skipped", "frame_number": N}
"""

from __future__ import annotations

import logging
import re
from typing import Any

logger = logging.getLogger("sitelens.mobile_contract")

# ── Severity normalizer ──────────────────────────────────────────────────

_SEVERITY_MAP: dict[str, str] = {
    "CRITICAL": "critical",
    "WARNING":  "warning",
    "INFO":     "info",
    "NONE":     "none",
    "critical": "critical",
    "warning":  "warning",
    "info":     "info",
    "none":     "none",
}

_VALID_SEVERITIES = {"critical", "warning", "info", "none"}

_SEVERITY_ICON: dict[str, str] = {
    "critical": "⛔ CRITICAL",
    "warning":  "⚠️ WARNING",
    "info":     "ℹ️ INFO",
    "none":     "✅ CLEAR",
}

_SEVERITY_ACTION: dict[str, str] = {
    "critical": "Stop work immediately",
    "warning":  "Pause and fix the issue",
    "info":     "Stay alert",
    "none":     "No action required",
}

_SEVERITY_REASONING: dict[str, str] = {
    "critical": "Immediate risk of serious injury or fatality detected",
    "warning":  "Safety violation that could escalate to critical risk",
    "info":     "Observation flagged for safety awareness",
    "none":     "Scene appears safe",
}


def _normalize_severity(raw: Any) -> str:
    s = str(raw).strip() if raw else "none"
    normalized = _SEVERITY_MAP.get(s, "none")
    return normalized if normalized in _VALID_SEVERITIES else "none"


# ── Think-block stripper ─────────────────────────────────────────────────

def _strip_think(text: str) -> str:
    """Remove <think>…</think> reasoning blocks left by Qwen3 / thinking models."""
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()


# ── Polished image_summary builder ──────────────────────────────────────

def _build_image_summary(result: dict[str, Any], severity_lc: str) -> str:
    """
    Build a crisp, worker-facing summary line from VLM output.

    Format:
      ⛔ CRITICAL — 2 workers on site. Crane load overhead. No helmets worn.
      Immediate action: Stop work. Clear swing radius.
    """
    lines: list[str] = []

    # ── Line 1: severity badge + worker count + scene snapshot ──
    icon = _SEVERITY_ICON.get(severity_lc, "ℹ️ INFO")
    worker_count: int = result.get("worker_count", 0)
    scene: str = _strip_think(str(result.get("scene_description") or "")).strip()

    # Truncate raw scene to one clean sentence (strip trailing fluff)
    if scene:
        # Keep only the first sentence / 100 chars
        first_sentence = re.split(r"[.!?\n]", scene)[0].strip()
        scene_snippet = first_sentence[:100]
    else:
        scene_snippet = ""

    worker_str = f"{worker_count} worker{'s' if worker_count != 1 else ''} on site" if worker_count else ""

    header_parts = [icon]
    if worker_str:
        header_parts.append(worker_str)
    if scene_snippet:
        header_parts.append(scene_snippet)

    lines.append(" — ".join(header_parts) + ".")

    # ── Line 2: hazards list (compact) ──
    hazards = result.get("hazards_detail", [])
    if isinstance(hazards, list) and hazards:
        hazard_summaries: list[str] = []
        for h in hazards[:3]:           # max 3 hazards shown
            if isinstance(h, dict):
                desc = (h.get("description") or h.get("type") or "").strip()
                desc = _strip_think(desc)
                # strip to ≤60 chars
                if len(desc) > 60:
                    desc = desc[:57].rstrip() + "…"
                if desc:
                    hazard_summaries.append(desc)
        if hazard_summaries:
            lines.append("Hazards: " + " | ".join(hazard_summaries))

    elif isinstance(hazards, str) and hazards and hazards != "No specific hazard detail.":
        clean = _strip_think(hazards)[:120]
        lines.append("Hazards: " + clean)

    # ── Line 3: PPE compliance note (only if violation) ──
    ppe = _strip_think(str(result.get("ppe_compliance") or "")).strip()
    if ppe and not any(p in ppe.lower() for p in [
        "all workers wearing", "full compliance", "no ppe violations",
        "properly equipped", "all required ppe", "wearing all required",
    ]):
        short_ppe = ppe[:80].rstrip()
        if len(ppe) > 80:
            short_ppe += "…"
        lines.append("PPE: " + short_ppe)

    # ── Line 4: required action ──
    action = _SEVERITY_ACTION.get(severity_lc, "")
    if action and severity_lc in ("critical", "warning"):
        lines.append(f"Action: {action}.")

    return "  ".join(lines)


# ── hazards_detail flattener ─────────────────────────────────────────────

def _flatten_hazards_detail(detail: Any) -> str:
    """Convert hazards_detail (list[dict] or str) to a plain string."""
    if isinstance(detail, str):
        return _strip_think(detail).strip()

    if isinstance(detail, list):
        parts: list[str] = []
        for item in detail:
            if isinstance(item, dict):
                desc = _strip_think(item.get("description") or item.get("type") or "")
                loc  = item.get("location", "")
                sev  = item.get("severity", "")
                chunk = desc.strip()
                if loc and loc.lower() not in ("unknown", ""):
                    chunk = f"{chunk} at {loc}"
                if sev:
                    chunk = f"[{sev.upper()}] {chunk}"
                if chunk:
                    parts.append(chunk)
            elif isinstance(item, str) and item:
                parts.append(_strip_think(item))
        return "; ".join(parts) if parts else "No hazards detected."

    return "No hazards detected."


# ── Decision resolver ─────────────────────────────────────────────────────

def _resolve_decision(result: dict[str, Any], severity_lc: str) -> tuple[str, str]:
    """Return (decision_text, decision_reasoning) from pipeline result or defaults."""
    decision = result.get("decision") or _SEVERITY_ACTION.get(severity_lc, "No action required")
    reasoning = (
        result.get("decision_reasoning")
        or result.get("reasoning")
        or _SEVERITY_REASONING.get(severity_lc, "")
    )
    return _strip_think(str(decision)), _strip_think(str(reasoning))


# ── Main normalization function ───────────────────────────────────────────

def normalize_for_mobile(
    result: dict[str, Any],
    *,
    frame_number: int = 0,
    processing_time_ms: int = 0,
    msg_type: str = "alert",
) -> dict[str, Any]:
    """
    Convert an internal pipeline result dict to the strict mobile client JSON.

    Parameters
    ----------
    result : dict
        Raw dict from ``alert.to_dict()`` after ``apply_safeguards()``.
    frame_number : int
        Frame sequence number (WebSocket context or 0 for single-shot).
    processing_time_ms : int
        Wall-clock time for the full pipeline, in milliseconds.
    msg_type : str
        Top-level ``"type"`` field (default ``"alert"``).

    Returns
    -------
    dict matching the mobile contract.
    """
    severity_lc      = _normalize_severity(result.get("severity_level", "none"))
    hazard_detected  = bool(result.get("hazard_detected", False))
    hazards_detail   = _flatten_hazards_detail(result.get("hazards_detail", []))
    sop_reference    = _strip_think(str(result.get("sop_reference") or "")).strip()
    decision, reason = _resolve_decision(result, severity_lc)
    image_summary    = _build_image_summary(result, severity_lc)

    logger.info(
        "\n" + "─" * 60 +
        "\n[image_summary] frame=%d\n%s" +
        "\n" + "─" * 60,
        frame_number,
        image_summary,
    )

    raw_hazards_detail = result.get("hazards_detail", [])
    hazards_list = raw_hazards_detail if isinstance(raw_hazards_detail, list) else []

    return {
        "type":               msg_type,
        "frame_number":       frame_number,
        "processing_time_ms": processing_time_ms,
        "hazard_detected":    hazard_detected,
        "severity_level":     severity_lc,
        "image_summary":      image_summary,
        "hazards_detail":     hazards_detail,
        "hazards_list":       hazards_list,
        "sop_reference":      sop_reference,
        "decision":           decision,
        "decision_reasoning": reason,
        "scene_description":  _strip_think(str(result.get("scene_description") or "")),
        "raw_model_response": result.get("raw_model_response") or result.get("scene_description") or "",
        "worker_count":       result.get("worker_count", 0),
        "audio_alert_text":   result.get("audio_alert_text", ""),
        "hud_display_card":   result.get("hud_display_card", ""),
        "recommended_action": result.get("recommended_action", ""),
    }


def frame_skipped_message(frame_number: int) -> dict[str, Any]:
    """Standard frame-skip notification message."""
    return {"type": "frame_skipped", "frame_number": frame_number}
