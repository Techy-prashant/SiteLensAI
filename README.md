# 🔍 SiteLens AI

**Multimodal Spatial & Visual Intelligence System for Construction-Site Safety**

SiteLens AI is a vision-powered construction safety platform designed to combine **computer vision, multimodal AI, RAG-based SOP retrieval, rule-based hazard decisions, voice interaction, real-time streaming, audit logging, and an administrative dashboard** into a single system.

The `AdminDashboard` branch contains both the **FastAPI intelligence backend** and a **Next.js/React administration dashboard**.

> **Branch:** `AdminDashboard`

---

## ✨ What SiteLens AI Does

SiteLens AI is designed around a simple workflow:

**Camera / Smart Glasses → VLM → Hazard Classification → SOP Retrieval → Rule Engine → Safety Decision → Alert → Audit → Dashboard**

The system can:

- Analyze construction-site images for potential hazards.
- Process live camera frames through a WebSocket stream.
- Use a Vision-Language Model (VLM) for scene understanding.
- Classify detected hazards into structured safety information.
- Retrieve relevant construction SOPs using embeddings and FAISS.
- Apply a rule engine to determine the appropriate response.
- Generate structured safety alerts.
- Push alerts to supervisors through Server-Sent Events (SSE).
- Accept worker voice/audio input and perform speech-to-text.
- Answer safety questions using the RAG pipeline.
- Maintain an audit trail of detected incidents.
- Provide a role-oriented administrative dashboard.
- Manage supervisors, site managers, field workers, construction sites, tasks, reports, and smart-glasses sessions.
- Fall back to local mock data in the dashboard when backend APIs are unavailable.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │   Construction Site  │
                         │ Cameras / Smart Glass │
                         └──────────┬───────────┘
                                    │
                     Image / Video / Audio Input
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │       FastAPI Backend     │
                    │        app/main.py        │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
          ▼                       ▼                        ▼
   ┌─────────────┐        ┌──────────────┐        ┌─────────────┐
   │     VLM     │        │     RAG      │        │  Voice/STT  │
   │ Scene/Frame │        │ SOP Retrieval│        │   Whisper   │
   │  Analysis   │        │ FAISS + Emb. │        │             │
   └──────┬──────┘        └──────┬───────┘        └──────┬──────┘
          │                       │                       │
          └───────────────┬───────┴───────────────────────┘
                          ▼
                 ┌───────────────────┐
                 │ Hazard Classifier │
                 └─────────┬─────────┘
                           ▼
                 ┌───────────────────┐
                 │    Rule Engine    │
                 │ Decision + Safety │
                 └─────────┬─────────┘
                           ▼
                 ┌───────────────────┐
                 │ Alert Formatter   │
                 │ + Safeguards      │
                 └─────────┬─────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        REST Response     SSE        Audit DB
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                 ┌───────────────────┐
                 │ Next.js Dashboard │
                 │   Admin / Ops UI  │
                 └───────────────────┘
```

---

# 🧩 Repository Structure

```text
SiteLensAI/
│
├── app/
│   ├── hazard/
│   │   ├── alert_formatter.py
│   │   ├── classifier.py
│   │   ├── mobile_contract.py
│   │   ├── prompt_engine.py
│   │   ├── rule_engine.py
│   │   └── safeguards.py
│   │
│   ├── rag/
│   │   ├── embeddings.py
│   │   ├── ingest.py
│   │   ├── retriever.py
│   │   └── vector_store.py
│   │
│   ├── routes/
│   │   ├── alerts.py
│   │   ├── audit.py
│   │   ├── detect.py
│   │   ├── rag_query.py
│   │   ├── stream.py
│   │   └── voice.py
│   │
│   ├── static/
│   │   └── Backend-served web assets
│   │
│   ├── config.py
│   └── main.py
│
├── admin-dashboard/
│   ├── app/
│   │   ├── analytics/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── forgot-password/
│   │   ├── home/
│   │   ├── login/
│   │   ├── meta-glasses/
│   │   ├── permissions/
│   │   ├── role-management/
│   │   ├── settings/
│   │   ├── system-configuration/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── error / not-found handlers
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── devices/
│   │   ├── employees/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── EmployeeProfileModal.tsx
│   │   ├── SearchCommand.tsx
│   │   ├── theme-customizer.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   │
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-vlm-alerts.ts
│   │
│   ├── lib/
│   │   ├── stores/
│   │   ├── api.ts
│   │   ├── dashboard-data.ts
│   │   ├── devices-data.ts
│   │   ├── employees-data.ts
│   │   ├── mock-data.ts
│   │   ├── mock-store.ts
│   │   ├── navigation.ts
│   │   ├── settings-data.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── netlify.toml
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── data/
│   ├── faiss_index/
│   └── sops/
│
├── camera_scanner.py
├── test_mobile_api.py
├── requirements.txt
├── pyproject.toml
├── .env.example
└── README.md
```

---

# 🧠 Backend

The backend is built with **FastAPI** and acts as the orchestration layer for SiteLens AI.

The application startup sequence initializes:

1. VLM engine
2. RAG embedding engine
3. FAISS vector store
4. SOP retriever
5. Speech-to-text engine
6. Hazard rule engine
7. Audit database
8. API routes
9. Static UI

The backend is intentionally designed so that individual AI components can fail without necessarily preventing the HTTP server from starting.

For example, if the VLM fails to initialize, the server can still start while `/api/detect` returns an appropriate service-unavailable response.

---

## 🔍 Single-Frame Detection

### `POST /api/detect`

This is the main hazard-detection endpoint.

Supported input forms include:

- Multipart image upload
- Base64 image
- JSON `image_base64`
- JSON `frame`

Optional worker context can be supplied using `worker_query`.

### Processing Pipeline

```text
Image
  ↓
VLM Prompt Generation
  ↓
Vision-Language Model
  ↓
Hazard Classifier
  ↓
RAG / SOP Retrieval
  ↓
Rule Engine
  ↓
Alert Formatter
  ↓
Ethical Safeguards
  ↓
Mobile Contract Normalization
  ↓
Alert History
  ↓
Audit Database
  ↓
JSON Response
```

The route is implemented in:

```text
app/routes/detect.py
```

---

# 📡 Real-Time Camera Streaming

### `WebSocket /ws/stream`

The WebSocket endpoint enables continuous frame processing.

Clients send:

```json
{
  "frame": "<base64-image>"
}
```

The server processes frames according to the configured `FRAME_SKIP` value.

Additional messages include:

```json
{
  "type": "ping"
}
```

and worker queries:

```json
{
  "type": "query",
  "text": "What should I do near this hazard?"
}
```

The streaming pipeline is:

```text
Camera Frame
    ↓
Frame Skip Check
    ↓
VLM
    ↓
Classifier
    ↓
RAG
    ↓
Rule Engine
    ↓
Safeguards
    ↓
Mobile Alert
    ↓
WebSocket Response
```

The backend also maintains a WebSocket connection manager for broadcasting escalation events.

---

# 🚨 Real-Time Alerts

SiteLens AI maintains an in-memory alert history with a maximum capacity of 500 alerts.

### REST

```http
GET /api/alerts
```

Optional parameters:

```text
limit
severity
```

Example:

```text
/api/alerts?limit=20&severity=CRITICAL
```

### Server-Sent Events

```http
GET /api/alerts/stream
```

The dashboard uses this stream to receive live safety events.

Critical and high-severity events can trigger immediate dashboard notifications.

---

# 📚 RAG / SOP Intelligence

The RAG pipeline uses:

- `sentence-transformers`
- `all-MiniLM-L6-v2` by default
- FAISS
- Construction SOP documents

Core modules:

```text
app/rag/
├── embeddings.py
├── ingest.py
├── retriever.py
└── vector_store.py
```

The backend can automatically ingest SOPs when the FAISS index is empty.

### Query Endpoint

```http
POST /api/query
```

Request:

```json
{
  "query": "What PPE is required for this activity?",
  "top_k": 5
}
```

Response contains:

- Original query
- Contextual answer
- SOP references
- Whether matching documents were found

---

# 🎙️ Voice / STT

The voice layer provides hands-free interaction for workers.

Endpoints:

```http
POST /api/voice/transcribe
POST /api/voice/query
```

The intended flow is:

```text
Worker Audio
    ↓
Speech-to-Text
    ↓
Text Query
    ↓
RAG Retrieval
    ↓
Safety Guidance
```

The system is designed around a Groq Whisper STT implementation while keeping the engine behind an abstraction so it can be replaced later.

---

# 🛡️ Hazard Decision System

The hazard subsystem contains:

```text
app/hazard/
├── classifier.py
├── prompt_engine.py
├── rule_engine.py
├── alert_formatter.py
├── safeguards.py
└── mobile_contract.py
```

### Classifier

Transforms VLM output into structured hazard information.

### Prompt Engine

Creates:

- VLM scene-analysis prompts
- RAG search queries

### Rule Engine

Combines:

- VLM results
- Hazard classification
- SOP context
- Worker context

to produce a structured safety decision.

### Alert Formatter

Converts model/classifier results into the alert schema consumed by downstream services.

### Safeguards

Applies safety-oriented normalization and constraints before alerts are exposed to clients.

### Mobile Contract

Normalizes alerts into a stable format suitable for smart-glasses/mobile clients.

---

# 🗃️ Audit System

SiteLens AI includes an asynchronous SQLite audit database.

Detected incidents can be recorded with information such as:

- Alert ID
- Hazard type
- Severity
- Decision
- Processing time
- SOP reference
- Model response
- Incident metadata

The audit API is exposed through:

```http
GET /api/audit/incidents
```

This is intended to provide traceability for safety events.

---

# 🖥️ Admin Dashboard

The frontend is a **Next.js 13.5.1 + React 18 + TypeScript** application.

Styling is implemented with:

- Tailwind CSS
- Radix UI primitives
- Lucide icons
- Recharts
- Sonner notifications
- Zustand
- React Hook Form
- Zod

The frontend lives entirely under:

```text
admin-dashboard/
```

---

## 📊 Dashboard

The main dashboard provides role-aware operational views for:

- Super Admin
- Supervisor
- Site Manager

It displays information including:

- Supervisors
- Site managers
- Field workers
- Active sites
- Smart glasses currently in use
- Tasks
- Reports
- Safety alerts

The dashboard also contains creation workflows for:

- Supervisors
- Site managers
- Field workers
- Sites
- Tasks
- Reports

Task completion has an explicit confirmation workflow.

---

# 👥 Employee Management

The employee section supports operational management of personnel.

The dashboard includes:

- Employee records
- Employee search
- Role information
- Employee profile modal
- Worker/site relationships

Detailed employee profiles are restricted to the Super Admin role within the current dashboard logic.

---

# 🥽 Smart Glasses

The `meta-glasses` section is intended to represent smart-glasses operations and telemetry.

The dashboard integrates the VLM alert hook so the interface can show:

- Connection state
- VLM status
- Active scanning state
- Live safety alerts
- Hazard details
- SOP references
- Processing time
- Worker-danger status

---

# 📈 Analytics

The analytics section provides the dashboard structure for operational and safety metrics.

Charts and visualization capabilities are supported through **Recharts**.

---

# 🔐 Authentication & Roles

The frontend contains login and password-recovery flows.

Current dashboard role IDs include:

| Role ID | Role |
|---:|---|
| 1 | Super Admin |
| 2 | Supervisor |
| 3 | Site Manager |

The frontend API layer first attempts to communicate with the FastAPI backend.

If the backend is unavailable, it falls back to the Zustand-based mock store.

> **Important:** The current mock authentication should not be considered production-grade authentication. Passwords and mock credentials are handled locally for demonstration/development purposes.

---

# 🔌 Frontend API Layer

The central frontend API abstraction is:

```text
admin-dashboard/lib/api.ts
```

It provides operations for:

- Login
- Employee search
- Creating supervisors
- Creating site managers
- Creating field workers
- Creating sites
- Creating tasks
- Updating task status
- Submitting reports

The pattern is:

```text
Frontend Request
      ↓
FastAPI
      │
      ├── Success → Return API response
      │
      └── Failure → Local Zustand Mock Store
```

This makes the dashboard usable during frontend development even when the backend is unavailable.

---

# ⚡ Live VLM Alerts in the Frontend

The hook:

```text
admin-dashboard/hooks/use-vlm-alerts.ts
```

handles the live VLM alert experience.

It:

1. Fetches recent alerts.
2. Fetches audit incidents.
3. Connects to the backend SSE stream.
4. Normalizes backend alerts.
5. Displays emergency notifications.
6. Supports manual VLM scans.
7. Tracks backend connectivity.
8. Tracks scanning state.

Critical/high alerts trigger prominent notifications, while lower-severity alerts use standard warning notifications.

---

# 🗂️ Frontend Data Layer

The frontend contains both real API abstractions and development data sources.

```text
lib/
├── api.ts
├── dashboard-data.ts
├── devices-data.ts
├── employees-data.ts
├── mock-data.ts
├── mock-store.ts
├── navigation.ts
├── settings-data.ts
├── types.ts
├── utils.ts
└── stores/
```

The mock store allows the UI to simulate:

- Users
- Employees
- Sites
- Tasks
- Reports
- Smart glasses
- Role switching

This is particularly useful for UI development and demonstrations.

---

# ⚙️ Configuration

Backend configuration is loaded using `pydantic-settings`.

Create a `.env` file from the provided template:

```bash
cp .env.example .env
```

### Important Variables

```env
VLM_BACKEND=grok

GROK_API_KEY=your-grok-api-key
GROK_MODEL=grok-2-vision-latest

GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=qwen/qwen3.6-27b

VECTOR_BACKEND=faiss
FAISS_INDEX_PATH=data/faiss_index

EMBEDDING_MODEL=all-MiniLM-L6-v2

YOLO_ENABLED=false
YOLO_MODEL=yolo11n.pt
YOLO_CONFIDENCE=0.5

HOST=0.0.0.0
PORT=8000

CRITICAL_AUDIO_MAX_WORDS=25
FRAME_SKIP=3
```

Available VLM backends in the configuration include:

```text
ollama
grok
groq
transformers
```

Available vector backends include:

```text
faiss
supabase
```

---

# 🧰 Requirements

## Backend

The project targets:

```text
Python >= 3.12
```

Major backend dependencies include:

- FastAPI
- Uvicorn
- WebSockets
- Pydantic Settings
- HTTPX
- PyTorch
- Transformers
- Pillow
- Sentence Transformers
- FAISS CPU
- aiosqlite
- python-multipart
- orjson

Optional integrations include:

- Supabase
- Ultralytics YOLO

---

## Frontend

The dashboard uses:

```text
Node.js
Next.js 13.5.1
React 18.2
TypeScript 5.2
Tailwind CSS 3.3
```

Additional libraries include Radix UI, Zustand, Recharts, React Hook Form, Zod, Sonner, Lucide React, and the Netlify Next.js plugin.

---

# 🚀 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Techy-prashant/SiteLensAI.git
cd SiteLensAI
git checkout AdminDashboard
```

---

## 2. Set up Python

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure environment

```bash
cp .env.example .env
```

Then add the required API credentials.

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

---

## 4. Start the FastAPI backend

From the repository root:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

Health check:

```text
http://localhost:8000/health
```

---

## 5. Start the Next.js dashboard

Open a second terminal:

```bash
cd admin-dashboard
npm install
npm run dev
```

The dashboard normally runs on:

```text
http://localhost:3000
```

---

# 🔗 Frontend Environment Variables

The dashboard supports:

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

`NEXT_PUBLIC_BACKEND_URL` is used by the live VLM alert hook for direct backend communication.

---

# 🧪 Useful Development Commands

### Backend

```bash
uvicorn app.main:app --reload
```

### Frontend development

```bash
cd admin-dashboard
npm run dev
```

### Frontend production build

```bash
cd admin-dashboard
npm run build
```

### Start production dashboard

```bash
cd admin-dashboard
npm start
```

### Type checking

```bash
cd admin-dashboard
npm run typecheck
```

### Linting

```bash
cd admin-dashboard
npm run lint
```

---

# 🌐 Deployment

The dashboard contains a `netlify.toml` configured for Netlify's Next.js plugin.

Build configuration:

```text
Build command: npx next build
Publish directory: .next
Plugin: @netlify/plugin-nextjs
```

For production deployment, configure the required environment variables in the hosting provider rather than committing secrets to the repository.

The FastAPI backend should be deployed separately to an environment capable of running Python 3.12 and the required AI dependencies.

---

# 🔄 API Reference

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Service information / UI |
| `GET` | `/health` | Backend health status |
| `POST` | `/api/detect` | Analyze a single image |
| `WS` | `/ws/stream` | Real-time camera frame processing |
| `GET` | `/api/alerts` | Retrieve alert history |
| `GET` | `/api/alerts/stream` | Live SSE alert stream |
| `POST` | `/api/alerts/escalate` | Escalate an alert |
| `POST` | `/api/query` | RAG/SOP query |
| `POST` | `/api/voice/transcribe` | Speech-to-text |
| `POST` | `/api/voice/query` | Voice → STT → RAG |
| `GET` | `/api/audit/incidents` | Retrieve audit incidents |

Additional application-management endpoints are exposed through the dashboard's API abstraction and can be extended as the backend integration matures.

---

# 🔐 Security Considerations

Before production deployment, the following areas should be hardened:

- Replace wildcard CORS with explicit trusted origins.
- Replace mock authentication with real authentication.
- Never store plaintext passwords.
- Add authentication/authorization middleware to backend endpoints.
- Validate and limit uploaded image/audio sizes.
- Protect API keys through deployment secrets.
- Add rate limiting to public endpoints.
- Move in-memory alert history to persistent storage.
- Add structured audit access controls.
- Restrict administrative operations by role on the backend, not only in the UI.
- Validate WebSocket clients before allowing camera streams.
- Add monitoring and error tracking.

The current backend explicitly allows all CORS origins for development:

```python
allow_origins=["*"]
```

This should be tightened before production use.

---

# ⚠️ Current Architecture Notes

### In-memory alert history

The alert service currently stores recent alerts in an in-memory deque with a capacity of 500.

Restarting the backend therefore clears this history.

### Mock-store fallback

The dashboard intentionally falls back to local Zustand data when backend requests fail.

This is useful for development but should be clearly separated from production behavior.

### RAG fallback

If the RAG pipeline cannot initialize, the backend continues running and returns fallback guidance for RAG requests.

### VLM startup

The backend attempts to initialize the configured VLM during application startup. If initialization fails, the API remains available but detection endpoints may return `503`.

---

# 🧭 Design Philosophy

SiteLens AI follows a modular architecture rather than coupling every feature to a single AI model.

The system separates:

```text
Perception
   ↓
Classification
   ↓
Knowledge Retrieval
   ↓
Decision Logic
   ↓
Safety Guardrails
   ↓
Alert Delivery
   ↓
Audit
```

This makes it possible to replace individual components without rebuilding the entire platform.

For example:

- VLM provider can be changed.
- FAISS can be replaced with another vector backend.
- YOLO can be enabled as an edge-detection layer.
- STT can be replaced with another transcription engine.
- The dashboard can continue operating against mock data while backend services are being developed.

---

# 🛣️ Suggested Future Improvements

The existing architecture provides a strong foundation for further development.

Potential next steps:

1. **Production authentication**
   - JWT/session-based authentication
   - Password hashing
   - Refresh tokens
   - Role-based backend authorization

2. **Persistent alert storage**
   - Store all alerts in PostgreSQL/Supabase instead of memory.

3. **Device management**
   - Register individual smart glasses.
   - Track device health.
   - Track battery/connectivity.
   - Associate devices with workers and sites.

4. **Improved RAG**
   - Metadata filtering by site/project.
   - SOP versioning.
   - Document permissions.
   - Better chunking and reranking.

5. **Computer vision edge layer**
   - Enable YOLO for fast object detection.
   - Use VLM for deeper scene reasoning.

6. **Observability**
   - Request tracing.
   - Model latency metrics.
   - Error tracking.
   - Alert delivery metrics.

7. **Production streaming**
   - Persistent camera sessions.
   - Better reconnect handling.
   - Backpressure management.
   - Per-device stream authorization.

8. **Safety analytics**
   - Hazard frequency by site.
   - Repeated violations.
   - Worker exposure trends.
   - Mean response time.
   - Incident severity trends.

---

# 📜 Project Status

SiteLens AI is an actively developed prototype/engineering project.

The `AdminDashboard` branch currently combines:

- AI inference orchestration
- Hazard classification
- RAG/SOP retrieval
- Rule-based safety decisions
- Voice interaction
- Real-time WebSocket processing
- SSE alert delivery
- Audit logging
- Next.js administration
- Smart-glasses dashboard concepts
- Mock-data development infrastructure

Some components are explicitly designed as fallback or development implementations and should be hardened before deployment in a real construction environment.

---

# 👨‍💻 Repository

**GitHub:**  
https://github.com/Techy-prashant/SiteLensAI

**Branch:**  
`AdminDashboard`

---

## 📄 License

Add the project's intended license here before public distribution.

---

## 🤝 Contributing

Contributions, improvements, bug fixes, and architectural suggestions are welcome.

For significant changes:

1. Create a feature branch.
2. Keep backend and frontend changes isolated where possible.
3. Run frontend type checks and builds.
4. Test affected API endpoints.
5. Document new environment variables.
6. Update this README when architecture or setup changes.

---

**SiteLens AI — Turning construction-site vision into actionable safety intelligence.**
