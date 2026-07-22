from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="SiteLens AI Backend", version="0.1.0")

# Open CORS for local development clients.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")


class Task(TaskCreate):
    id: int
    created_at: str


mock_alerts = [
    {
        "id": 1,
        "severity": "high",
        "message": "Worker detected without helmet in Zone B",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 2,
        "severity": "medium",
        "message": "Forklift route obstruction detected",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    },
]

mock_tasks: list[Task] = []


@app.get("/api/alerts")
def get_alerts() -> dict[str, Any]:
    return {"alerts": mock_alerts}


@app.get("/api/tasks")
def get_tasks() -> dict[str, Any]:
    return {"tasks": mock_tasks}


@app.post("/api/tasks", status_code=201)
def create_task(task: TaskCreate) -> dict[str, Any]:
    try:
        new_task = Task(
            id=len(mock_tasks) + 1,
            title=task.title,
            priority=task.priority,
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        mock_tasks.append(new_task)
        return {"task": new_task}
    except Exception as exc:  # pragma: no cover - defensive path
        raise HTTPException(status_code=500, detail="Unable to create task") from exc


@app.websocket("/ws/glasses-telemetry")
async def glasses_telemetry(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            payload = await websocket.receive_json()
            await websocket.send_json(
                {
                    "status": "received",
                    "received_at": datetime.now(timezone.utc).isoformat(),
                    "payload": payload,
                }
            )
    except WebSocketDisconnect:
        # Client disconnected normally.
        return
    except Exception:
        await websocket.send_json({"status": "error", "detail": "Invalid telemetry payload"})
        await websocket.close(code=1003)
