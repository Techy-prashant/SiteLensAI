# SiteLens AI Monorepo

This repository contains the foundational monorepo for SiteLens AI:

- `backend/`: FastAPI backend services
- `frontend/`: Next.js web dashboard
- `mobile/`: Android companion app placeholder

## Prerequisites

- Docker + Docker Compose
- Python 3.10+
- Node.js 20+
- npm 10+

## 1) Start shared infrastructure

```bash
docker compose up -d
```

This starts:
- PostgreSQL with pgvector on `localhost:5432`
- Redis on `localhost:6379`

## 2) Run backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend API is available at `http://localhost:8000`.

## 3) Run frontend dashboard

```bash
cd frontend
npm install
npm run dev
```

Frontend is available at `http://localhost:3000`.

## 4) Mobile companion placeholder

The Android placeholder project lives under `mobile/` and includes a basic Compose `MainActivity`.
