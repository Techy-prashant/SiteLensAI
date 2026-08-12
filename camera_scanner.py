"""
SiteLens AI — Live Device Camera VLM Scanner

Captures video directly from your PC/device webcam using OpenCV, 
sends real-time frames to the SiteLens AI VLM server, and displays live hazard detections on screen.

Usage:
  python camera_scanner.py
"""

import base64
import json
import time
import cv2
import httpx

API_URL = "http://localhost:8000/api/detect"

def main():
    print("=" * 60)
    print("  SiteLens AI — Live Device Camera Scanner")
    print(f"  Server URL: {API_URL}")
    print("  Press 's' to manually trigger a scan")
    print("  Press 'a' to toggle Auto-Scan (every 3 seconds)")
    print("  Press 'q' to quit")
    print("=" * 60)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Error: Could not open device camera (index 0).")
        return

    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    auto_scan = True
    last_scan_time = 0
    scan_interval = 3.0  # seconds between auto-scans
    
    current_status = "Initializing..."
    severity = "NONE"
    decision = "NO_ACTION"
    hazards = "No scans performed yet."

    client = httpx.Client(timeout=30.0)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to grab camera frame.")
            break

        now = time.time()

        # Auto-scan check
        if auto_scan and (now - last_scan_time >= scan_interval):
            last_scan_time = now
            current_status = "Scanning with VLM..."
            
            # Encode frame to JPEG base64
            ok, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if ok:
                b64_str = base64.b64encode(buffer.tobytes()).decode('utf-8')
                try:
                    res = client.post(API_URL, json={"frame": b64_str})
                    if res.status_code == 200:
                        data = res.json()
                        severity = data.get("severity_level", "NONE").upper()
                        decision = data.get("decision", "NO_ACTION")
                        hazards = data.get("hazards_detail", "No hazards detected.")
                        current_status = f"VLM Scan Complete ({data.get('processing_time_ms', 0)}ms)"
                    else:
                        current_status = f"Error {res.status_code}: {res.text[:50]}"
                except Exception as e:
                    current_status = f"API Error: {str(e)[:40]}"

        # Determine Emergency status & display colors
        if severity == "CRITICAL":
            emergency_text = "URGENT EMERGENCY ALERT! (Immediate Danger)"
            status_color = (0, 0, 255)       # Bright Red
            bg_color = (15, 15, 120)
        elif severity == "WARNING":
            emergency_text = "WARNING (Safety Barrier / PPE Violation)"
            status_color = (0, 165, 255)     # Orange
            bg_color = (15, 40, 60)
        elif severity == "INFO":
            emergency_text = "INFO (Minor Observation)"
            status_color = (255, 255, 0)     # Yellow
            bg_color = (40, 40, 20)
        else:
            emergency_text = "SAFE SCENE (No Hazards / Good Image)"
            status_color = (0, 255, 0)       # Green
            bg_color = (20, 50, 20)

        # Top banner
        cv2.rectangle(frame, (0, 0), (frame.shape[1], 90), bg_color, -1)
        cv2.putText(frame, f"SiteLens AI | Status: {current_status}", (15, 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
        cv2.putText(frame, f"Classification: {severity}  |  Emergency Status: {emergency_text}", (15, 55),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, status_color, 2)
        cv2.putText(frame, f"Decision Action: {decision}", (15, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1)

        # Bottom banner for hazards
        cv2.rectangle(frame, (0, frame.shape[0] - 65), (frame.shape[1], frame.shape[0]), (20, 20, 20), -1)
        hazard_summary = hazards if len(hazards) < 85 else hazards[:82] + "..."
        cv2.putText(frame, f"Hazards & Safety Analysis: {hazard_summary}", (15, frame.shape[0] - 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (230, 230, 230), 1)

        cv2.imshow("SiteLens AI — Live Device Camera VLM Scanner", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('a'):
            auto_scan = not auto_scan
            print(f"Auto-scan toggled: {'ON' if auto_scan else 'OFF'}")
        elif key == ord('s'):
            last_scan_time = 0  # Trigger scan on next loop

    cap.release()
    cv2.destroyAllWindows()
    client.close()

if __name__ == "__main__":
    main()
