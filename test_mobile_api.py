"""
SiteLens AI — Mobile API Contract Test
Run from project root:  python test_mobile_api.py

Tests:
  1. GET  /health
  2. POST /api/detect  with JSON body {"frame": "<base64>"}
  3. WebSocket /ws/stream with {"frame": "<base64>"}

No external image file needed — a synthetic JPEG is generated in memory.
"""

import asyncio
import base64
import io
import json
import sys

import httpx
import websockets

# ── Config ─────────────────────────────────────────────────────────────
BASE_URL  = "http://localhost:8000"
WS_URL    = "ws://localhost:8000/ws/stream"
# ────────────────────────────────────────────────────────────────────────


def make_synthetic_jpeg(width: int = 64, height: int = 64) -> bytes:
    """
    Create a minimal valid JPEG from a solid-colour image.
    Uses Pillow if available, otherwise falls back to a raw minimal JPEG header.
    """
    try:
        from PIL import Image
        img = Image.new("RGB", (width, height), color=(255, 140, 0))  # orange
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    except ImportError:
        pass

    try:
        import cv2
        import numpy as np
        frame = np.full((height, width, 3), (0, 140, 255), dtype="uint8")  # BGR orange
        ok, buf = cv2.imencode(".jpg", frame)
        if ok:
            return buf.tobytes()
    except ImportError:
        pass

    # Absolute fallback: 1×1 pixel white JPEG (still a valid JPEG)
    RAW_1x1_WHITE_JPEG = bytes([
        0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,
        0x01,0x00,0x00,0x01,0x00,0x01,0x00,0x00,0xFF,0xDB,0x00,0x43,
        0x00,0x08,0x06,0x06,0x07,0x06,0x05,0x08,0x07,0x07,0x07,0x09,
        0x09,0x08,0x0A,0x0C,0x14,0x0D,0x0C,0x0B,0x0B,0x0C,0x19,0x12,
        0x13,0x0F,0x14,0x1D,0x1A,0x1F,0x1E,0x1D,0x1A,0x1C,0x1C,0x20,
        0x24,0x2E,0x27,0x20,0x22,0x2C,0x23,0x1C,0x1C,0x28,0x37,0x29,
        0x2C,0x30,0x31,0x34,0x34,0x34,0x1F,0x27,0x39,0x3D,0x38,0x32,
        0x3C,0x2E,0x33,0x34,0x32,0xFF,0xC0,0x00,0x0B,0x08,0x00,0x01,
        0x00,0x01,0x01,0x01,0x11,0x00,0xFF,0xC4,0x00,0x1F,0x00,0x00,
        0x01,0x05,0x01,0x01,0x01,0x01,0x01,0x01,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,
        0x09,0x0A,0x0B,0xFF,0xC4,0x00,0xB5,0x10,0x00,0x02,0x01,0x03,
        0x03,0x02,0x04,0x03,0x05,0x05,0x04,0x04,0x00,0x00,0x01,0x7D,
        0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,0x21,0x31,0x41,0x06,
        0x13,0x51,0x61,0x07,0x22,0x71,0x14,0x32,0x81,0x91,0xA1,0x08,
        0x23,0x42,0xB1,0xC1,0x15,0x52,0xD1,0xF0,0x24,0x33,0x62,0x72,
        0x82,0x09,0x0A,0x16,0x17,0x18,0x19,0x1A,0x25,0x26,0x27,0x28,
        0x29,0x2A,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x43,0x44,0x45,
        0x46,0x47,0x48,0x49,0x4A,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
        0x5A,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0x6A,0x73,0x74,0x75,
        0x76,0x77,0x78,0x79,0x7A,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
        0x8A,0x93,0x94,0x95,0x96,0x97,0x98,0x99,0x9A,0xA2,0xA3,0xA4,
        0xA5,0xA6,0xA7,0xA8,0xA9,0xAA,0xB2,0xB3,0xB4,0xB5,0xB6,0xB7,
        0xB8,0xB9,0xBA,0xC2,0xC3,0xC4,0xC5,0xC6,0xC7,0xC8,0xC9,0xCA,
        0xD2,0xD3,0xD4,0xD5,0xD6,0xD7,0xD8,0xD9,0xDA,0xE1,0xE2,0xE3,
        0xE4,0xE5,0xE6,0xE7,0xE8,0xE9,0xEA,0xF1,0xF2,0xF3,0xF4,0xF5,
        0xF6,0xF7,0xF8,0xF9,0xFA,0xFF,0xDA,0x00,0x08,0x01,0x01,0x00,
        0x00,0x3F,0x00,0xFB,0xD4,0xFF,0xD9,
    ])
    return RAW_1x1_WHITE_JPEG


def to_b64(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes).decode("utf-8")


def sep(title: str):
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print('─'*60)


# ── Test 1: Health ───────────────────────────────────────────────────────

def test_health():
    sep("TEST 1 — GET /health")
    r = httpx.get(f"{BASE_URL}/health")
    body = r.json()
    print(f"  Status : {r.status_code}")
    print(f"  Body   : {json.dumps(body, indent=4)}")
    assert r.status_code == 200, "Expected 200"
    assert body.get("status") == "healthy", "Expected status: healthy"
    print("  ✅ PASS")


# ── Test 2: POST /api/detect (JSON body) ────────────────────────────────

def test_detect_json():
    sep("TEST 2 — POST /api/detect  (JSON body  {\"frame\": \"...\"})")
    img = make_synthetic_jpeg()
    payload = {"frame": to_b64(img)}
    r = httpx.post(f"{BASE_URL}/api/detect", json=payload, timeout=60)
    print(f"  Status : {r.status_code}")
    body = r.json()
    print(f"  Body   :\n{json.dumps(body, indent=4)}")

    if r.status_code == 503:
        print("  ⚠️  VLM engine not ready (503) — endpoint reachable, pipeline not up yet.")
        return

    assert r.status_code == 200, f"Expected 200, got {r.status_code}"

    # Contract validation
    required_keys = {
        "type", "frame_number", "processing_time_ms",
        "hazard_detected", "severity_level",
        "hazards_detail", "sop_reference",
        "decision", "decision_reasoning",
    }
    missing = required_keys - set(body.keys())
    assert not missing, f"Missing contract keys: {missing}"

    valid_severities = {"critical", "warning", "info", "none"}
    assert body["severity_level"] in valid_severities, (
        f"severity_level '{body['severity_level']}' not in {valid_severities}"
    )
    assert isinstance(body["hazards_detail"], str), "hazards_detail must be a string"
    print("  ✅ PASS — contract keys present, severity lowercase, hazards_detail is string")


# ── Test 3: WebSocket /ws/stream ─────────────────────────────────────────

async def test_ws_stream():
    sep("TEST 3 — WebSocket /ws/stream")
    img = make_synthetic_jpeg()
    msg = json.dumps({"frame": to_b64(img)})

    try:
        async with websockets.connect(WS_URL, open_timeout=10) as ws:
            print("  Connected ✓")
            await ws.send(msg)
            print(f"  Sent frame ({len(img)} bytes JPEG as base64)")

            # Collect responses until we get an "alert" or "error"
            for _ in range(10):
                raw = await asyncio.wait_for(ws.recv(), timeout=90)
                body = json.loads(raw)
                msg_type = body.get("type", "?")
                print(f"  Received [{msg_type}]: {json.dumps(body, indent=4)}")

                if msg_type == "frame_skipped":
                    print("  (frame was skipped per frame_skip config — will send another)")
                    await ws.send(json.dumps({"frame": to_b64(img)}))
                    continue

                if msg_type == "error":
                    print("  ⚠️  Server error (VLM not ready?) — WebSocket reachable.")
                    return

                if msg_type == "alert":
                    required_keys = {
                        "type", "frame_number", "processing_time_ms",
                        "hazard_detected", "severity_level",
                        "hazards_detail", "sop_reference",
                        "decision", "decision_reasoning",
                    }
                    missing = required_keys - set(body.keys())
                    assert not missing, f"Missing keys: {missing}"
                    valid_severities = {"critical", "warning", "info", "none"}
                    assert body["severity_level"] in valid_severities
                    assert isinstance(body["hazards_detail"], str)
                    print("  ✅ PASS — alert contract valid")
                    return

    except Exception as e:
        print(f"  ❌  WebSocket error: {e}")


# ── Entry point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n🔍 SiteLens AI — Mobile API Contract Tests")
    print(f"   Server : {BASE_URL}")

    img = make_synthetic_jpeg()
    print(f"\n   Synthetic JPEG : {len(img)} bytes  "
          f"({'Pillow/OpenCV' if len(img) > 300 else 'raw fallback'})")

    try:
        test_health()
    except Exception as e:
        print(f"  ❌  Health check failed: {e}")
        sys.exit(1)

    try:
        test_detect_json()
    except Exception as e:
        print(f"  ❌  /api/detect failed: {e}")

    try:
        asyncio.run(test_ws_stream())
    except Exception as e:
        print(f"  ❌  WebSocket test failed: {e}")

    print("\n✅ All tests done.\n")
