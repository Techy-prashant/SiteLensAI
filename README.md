# 🔍 SiteLens AI — Multimodal Spatial & Visual Intelligence System (vlm branch)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12%2B-blueviolet)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104%2B-009688)](https://fastapi.tiangolo.com/)

**Real-time hazard detection on construction sites via multimodal AI and wearable devices.** SiteLens AI delivers instant safety intelligence using vision language models (VLMs), semantic search (RAG), and deterministic rule engines—enabling hands-free alerts, SOP compliance checks, and automated incident logging for site managers.

---

## 🎯 Overview

SiteLens AI is a full-stack construction safety platform that transforms raw video frames from smart glasses or mobile devices into **actionable safety intelligence**. It combines:

- **Vision Language Models (VLMs)** — Qwen2-VL, Grok, or Ollama for scene understanding
- **Retrieval-Augmented Generation (RAG)** — FAISS-backed semantic search over safety procedures
- **Hazard Classification** — Deterministic mapping of visual risks to severity levels
- **Real-time Streaming** — WebSocket-based frame processing with sub-second latency
- **Voice Integration** — Groq Whisper transcription + voice-activated queries
- **Audit Trail** — SQLite database for compliance reporting and incident investigation

**Use Cases:**
- ✅ **Field Workers** — Hands-free safety alerts via audio + visual feedback
- ✅ **Site Managers** — Real-time hazard dashboard, audit trails for compliance audits
- ✅ **Safety Engineers** — Procedural compliance verification against ingested SOPs
- ✅ **Regulatory Reporting** — Automated incident logging for OSHA/HSE compliance

---

## 🏗️ Architecture

### High-Level Flow
```text
Frame (JPEG)
↓
[VLM Analysis] ← Grok/Ollama/Transformers
├─ Scene description
├─ Hazards detected
├─ Worker count
└─ PPE compliance
↓
[Hazard Classification] ← Deterministic rules + keyword maps
├─ Severity: CRITICAL | WARNING | INFO | NONE
├─ Hazard type mapping
└─ Escalation logic
↓
[RAG Retrieval] ← FAISS + SentenceTransformers
├─ Semantic search over SOPs
├─ Context injection for prompt
└─ Fallback for no-match scenarios
↓
[Rule Engine] ← Business logic layer
├─ Final decision + reasoning
├─ SOP reference extraction
└─ Audio alert generation
↓
[Response] → JSON (REST) or WebSocket
```

### Directory Structure
```text
├── app/
│   ├── init.py
│   ├── main.py                 # FastAPI app init, lifespan manager
│   ├── config.py               # Pydantic Settings (env-driven)
│   │
│   ├── models/
│   │   ├── vlm_engine.py       # VLM dispatch (Grok/Ollama/Transformers)
│   │   ├── stt_engine.py       # Groq Whisper wrapper
│   │   └── database.py         # SQLite audit logger
│   │
│   ├── hazard/
│   │   ├── classifier.py       # VLM → severity mapping (CRITICAL/WARNING/INFO/NONE)
│   │   ├── prompt_engine.py    # Prompt templates + context injection
│   │   ├── rule_engine.py      # Decision logic + SOP reference
│   │   ├── alert_formatter.py  # JSON/audio response formatting
│   │   ├── mobile_contract.py  # OpenAPI schema for mobile clients
│   │   └── safeguards.py       # Rate limiting, input validation
│   │
│   ├── rag/
│   │   ├── embeddings.py       # SentenceTransformers wrapper (all-MiniLM-L6-v2)
│   │   ├── vector_store.py     # FAISS index management
│   │   ├── retriever.py        # Semantic search interface
│   │   └── ingest.py           # SOP markdown → chunks → index
│   │
│   ├── routes/
│   │   ├── detect.py           # POST /api/detect (single frame)
│   │   ├── stream.py           # WebSocket /ws/stream (continuous)
│   │   ├── rag_query.py        # POST /api/query (SOP search)
│   │   ├── voice.py            # POST /api/voice/* (STT + intent)
│   │   ├── alerts.py           # GET /api/alerts (history)
│   │   └── audit.py            # GET /api/audit/* (compliance)
│   │
│   └── static/
│       └── index.html          # Dashboard UI (React/Vue placeholder)
│
├── data/
│   ├── faiss_index/            # Vector store (auto-created, auto-ingested)
│   └── sops/                   # SOP markdown files (*.md)
│
├── .env.example                # Configuration template
├── requirements.txt            # Python dependencies
├── pyproject.toml              # Project metadata
└── test_mobile_api.py          # Contract validation tests
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+**
- **API Key** (if using cloud backend):
  - Grok API key (xAI) — `GROK_API_KEY`
  - Groq API key (Whisper) — `GROQ_API_KEY`
- **GPU** (optional) — CUDA 11.8+ for local VLM inference

### Installation

1. **Clone & setup environment:**
   ```bash
   git clone [https://github.com/Techy-prashant/SiteLensAI.git](https://github.com/Techy-prashant/SiteLensAI.git)
   cd SiteLensAI
   git checkout vlm
   ```
   
2. Create virtual environment:
```Bash
python3.12 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```Bash
pip install -r requirements.txt
```

4. Configure environment:
```Bash
cp .env.example .env
# Edit .env with your API keys and backend preferences
```

5. Running the Server
```Bash
# Start FastAPI server (default: http://localhost:8000)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Access the interactive API docs at http://localhost:8000/docs.

---

## 📡 API Endpoints
* Health Check
```Bash
GET /health
```

Response:
```bash
JSON
{
  "status": "healthy",
  "vlm_backend": "grok",
  "vector_backend": "faiss",
  "yolo_enabled": false,
  "rag_enabled": true,
  "stt_enabled": true,
  "audit_enabled": true
}
```

* Frame Detection (Single Frame)
```Bash
POST /api/detect
Content-Type: application/json

{
  "frame": "<base64-encoded JPEG>"
}
```

Response (200 OK):
```bash
JSON
{
  "type": "alert",
  "frame_number": 42,
  "processing_time_ms": 2341,
  "hazard_detected": true,
  "severity_level": "warning",
  "hazards_detail": "Worker without hard hat near scaffolding edge",
  "sop_reference": "SOP-005: Fall Prevention",
  "decision": "Alert site supervisor immediately",
  "decision_reasoning": "PPE violation + proximity to fall risk"
}
```

* Real-Time Streaming (WebSocket)
```bash
JavaScript
const ws = new WebSocket('ws://localhost:8000/ws/stream');
ws.onopen = () => {
  ws.send(JSON.stringify({ frame: '<base64>' }));
};
ws.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  if (alert.type === 'alert') {
    console.log(`🚨 ${alert.severity_level}: ${alert.hazards_detail}`);
  }
};
```

* RAG Query (SOP Search)
```Bash
POST /api/query
Content-Type: application/json

{
  "query": "How do we prevent falls from heights?"
}
```

Response:
```bash
JSON
{
  "results": [
    {
      "content": "All workers at heights >6ft must wear full-body harness...",
      "source_file": "SOP-005.md",
      "section": "Fall Prevention",
      "score": 0.8934,
      "rank": 1
    }
  ]
}
```

* Voice Query (STT + RAG)
```Bash
POST /api/voice/query
Content-Type: audio/wav

<audio data>
```

Response:
```bash
JSON
{
  "transcription": "What should I do if I see a trench without shoring?",
  "intent": "safety_procedure",
  "rag_results": [...],
  "audio_response": "<base64-encoded audio>"
}
```

* Audit Incidents
```Bash
GET /api/audit/incidents?start_time=2026-08-14T10:00:00Z&end_time=2026-08-14T18:00:00Z&min_severity=warning
```

Response:
```bash
JSON
{
  "total": 12,
  "incidents": [
    {
      "incident_id": "inc-001",
      "timestamp": "2026-08-14T14:32:15Z",
      "severity": "critical",
      "hazard_type": "Fall Risk",
      "description": "Unharnessed worker at height",
      "frame_data": null,
      "location_gps": null,
      "worker_id": null
    }
  ]
}
```

---

## ⚙️ Configuration
All settings are environment-driven via ```bash.env```. Key options:

```Bash
# --- VLM Backend ---
VLM_BACKEND=grok                    # Options: grok | ollama | groq | transformers
GROK_API_KEY=your-key-here
GROK_MODEL=grok-2-vision-latest

# Fallback to Ollama (local)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3-vl

# --- Vector Store ---
VECTOR_BACKEND=faiss                # Options: faiss | supabase
FAISS_INDEX_PATH=data/faiss_index

# --- Embeddings ---
EMBEDDING_MODEL=all-MiniLM-L6-v2

# --- YOLO Edge Detection (optional) ---
YOLO_ENABLED=false
YOLO_MODEL=yolo11n.pt
YOLO_CONFIDENCE=0.5

# --- Server ---
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info

# --- Alert Constraints ---
CRITICAL_AUDIO_MAX_WORDS=25         # Truncate critical alerts to 25 words for TTS
FRAME_SKIP=3                        # Process 1 in every N frames (WebSocket)
```

---

 ## 🧠 Core Modules
```bash hazard/classifier.py``` — Deterministic Severity Mapping
Converts VLM JSON output → structured hazard classification with guardrails:

```Python
CRITICAL_KEYWORDS = {
    "unharnessed at height", "high-voltage", "active electrocution",
    "structural collapse", "trench cave-in", ...
}

# Softeners (prevent false CRITICAL):
# - If guardrails present → MAX is WARNING
# - If "near edge" without active risk → WARNING/INFO
# - Only genuine life-threat keywords trigger CRITICAL
```

```bash hazard/rule_engine.py ``` — Decision Logic & SOP Binding

Post-VLM processing:
1. Applies business rules (site-specific overrides, escalation policies)
2. Retrieves relevant SOPs via RAG
3. Generates reasoning + decision
4. Formats audio/JSON response

```python
# Example rule:
if severity == CRITICAL and worker_in_danger:
    escalate_to_supervisor()
    trigger_audio_alert(max_words=25)  # TTS constraint
    log_to_audit_db()
```

```bash rag/``` — Semantic Search Over SOPs
Pipeline:
1. Ingest (ingest.py) — Parse SOP markdown, chunk by section
2. Embed (embeddings.py) — SentenceTransformers (all-MiniLM-L6-v2)
3. Index (vector_store.py) — FAISS (CPU, fast, 1M+ doc scaling)
4. Retrieve (retriever.py) — Top-K cosine similarity search

```Python
# Query example: "How to prevent falls from heights?"
# Retrieval: 
#   1. Embed query → 384-dim vector
#   2. FAISS search → top-5 SOP chunks (min_score=0.2)
#   3. Inject into VLM prompt for context
```

```bash routes/stream.py``` — Real-Time WebSocket
Frame processing pipeline:
* Frame Skipping — Process 1 in N frames (configurable)
* Concurrent Inference — Queue-based async processing
* Response Streaming — ```bash frame_skipped, processing, alert, error```
* Heartbeat — Keep-alive for mobile clients

```Python
# Client sends: {"frame": "base64-jpeg"}
# Server yields:
#   - {"type": "frame_skipped", "frame_number": 42}
#   - {"type": "processing", ...}
#   - {"type": "alert", "severity_level": "warning", ...}
```

---

## 🧪 Testing
* Contract Validation
```bash
# Ensure API matches mobile client expectations
python test_mobile_api.py
```

Tests:
✅ ```bash GET /health``` — server readiness
✅ ```bash POST /api/detect``` — single-frame detection contract
✅ ```bash WebSocket /ws/stream``` — real-time alert contract

Expected output:
────────────────────────────────────────────────────────
  TEST 1 — GET /health
────────────────────────────────────────────────────────
  Status : 200
  ✅ PASS

────────────────────────────────────────────────────────
  TEST 2 — POST /api/detect (JSON body {"frame": "..."})
────────────────────────────────────────────────────────
  Status : 200
  ✅ PASS — contract keys present, severity lowercase, hazards_detail is string

────────────────────────────────────────────────────────
  TEST 3 — WebSocket /ws/stream
────────────────────────────────────────────────────────
  Connected ✓
  ✅ PASS — alert contract valid

* Unit Testing
```Bash
# Test individual modules
pytest tests/test_classifier.py -v
pytest tests/test_rag.py -v
pytest tests/test_rule_engine.py -v
```

Optimization Tips:
* Use ```bashFRAME_SKIP=3 ``` or higher for real-time (process 1 in 3 frames)
* Deploy VLM to GPU or use Grok API for sub-2s latency
* Pre-ingest SOPs at startup (cached embeddings)
* Use ```bashmin_score=0.3``` in RAG to reduce false positives

---


## 🔐 Security & Compliance
* Input Validation — Pydantic models + ```bashsafeguards.py```
* Rate Limiting — Configurable per-worker limits
* Audit Trail — SQLite DB with immutable incident logs
* Privacy — No frame storage by default (configurable)
* API Auth — Bearer token support (extend in routes/)


## 📝 Logging & Monitoring
All logs go to ```bashstdout``` with structured format:
```bash
12:34:56 │ sitelens.hazard.classifier │ INFO    │ Classification: 2 hazards, overall=warning, escalate=False
12:34:57 │ sitelens.rag.retriever     │ INFO    │ Retrieved 3/5 results for query: 'Fall risk prevention...'
12:34:58 │ sitelens.routes.stream     │ INFO    │ WebSocket frame 42: processing_time=2341ms
```

Key Metrics to Monitor
* VLM Response Time — Alert if >5s (model overload)
* RAG Hit Rate — % queries with score >0.5 (SOP coverage)
* False Positive Rate — Classifier severity_level mismatches
* WebSocket Avg Latency — Target <2.5s end-to-end


## 🤝 Contributing
1. Fork & branch: ```bash git checkout -b feature/my-feature```
2. Write tests for new hazard types in ```bash app/hazard/classifier.py```
3. Update ```bash.env.example``` if new configs added
4. Run ```bashtest_mobile_api.py``` to validate contract compliance
5. Submit PR with test results


## 🛠️ Troubleshooting
"VLM engine not ready (503)"
* Check ```bashGROK_API_KEY``` or Ollama connectivity
* Verify ```bashVLM_BACKEND``` is set correctly in ```bash.env```
* Stream endpoint will auto-retry with exponential backoff

"Vector store is empty"
* Ensure SOP files exist in ```bashdata/sops/``` (```bash*.md```)
* Restart server — ```bashmain.py``` auto-ingests on first run
* Check ```bashFAISS_INDEX_PATH``` directory permissions

"WebSocket timeout"
* Increase frame skip: ```bashFRAME_SKIP=5``` (process fewer frames)
* Check VLM latency via ```bash/health``` endpoint
* Monitor network round-trip time

## 📄 LicenseMIT 
License — See LICENSE for details.

---

## 🙌 Acknowledgments
* Qwen2-VL (Alibaba) — VLM backbone
* Grok API (xAI) — Cloud inference
* FAISS (Meta) — Vector search
* FastAPI — Web frameworkGroq — Whisper STT

---
