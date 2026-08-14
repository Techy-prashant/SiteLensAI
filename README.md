# 🔍 SiteLens AI — Multimodal Spatial & Visual Intelligence System (mobile_app branch)

[![Kotlin](https://img.shields.io/badge/kotlin-2.0-7F52FF?logo=kotlin)](https://kotlinlang.org/)
[![Android](https://img.shields.io/badge/android-24+-3DDC84?logo=android)](https://developer.android.com/)
[![Compose](https://img.shields.io/badge/jetpack-compose-4285F4)](https://developer.android.com/jetpack/compose)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**High-performance Android app streaming live camera frames to SiteLens AI backend for real-time construction hazard detection.** 
Workers receive **instant audio + vibration alerts** (<3s latency) for fall risks, PPE violations, electrical hazards, and machinery threats.

---

## 🎯 Features

- ✅ Continuous video capture (5–10 FPS, battery-optimized)  
- ✅ WebSocket streaming to backend  
- ✅ Real-time CRITICAL / WARNING / INFO alerts  
- ✅ Audio + vibration hazard notifications  
- ✅ Incident history dashboard  
- ✅ Offline fallback (REST API)  
- ✅ Efficient networking & minimal battery drain  

**Use Case:**  
A worker’s phone camera monitors the site. If hazards are detected, alerts are triggered within 2–3 seconds and logged for supervisors.

---

## 🏗️ Architecture

### Data Flow

CameraX → FrameAnalyzer → WebSocket → SiteLens Backend → Alert Handler → UI (Camera + History)


### Project Structure
```text
app/
├── src/main/java/com/example/kaya/
│   ├── MainActivity.kt
│   ├── camera/FrameAnalyzer.kt, ImageUtils.kt
│   ├── network/SiteLensApiService.kt, SiteLensWebSocketClient.kt
│   ├── data/repo/SettingsRepository.kt
│   ├── data/models/HazardAlert.kt, DetectionResponse.kt
│   ├── data/db/IncidentDatabase.kt
│   ├── ui/MainViewModel.kt, SiteLensNavHost.kt, TtsHelper.kt
│   ├── ui/screens/CameraScreen.kt, HistoryScreen.kt, SettingsScreen.kt, DashboardScreen.kt
│   └── util/Constants.kt, Logger.kt
│
├── res/ (icons, styles, XML configs)
├── AndroidManifest.xml
├── build.gradle.kts
└── src/androidTest/
```

---

## 🚀 Setup & Build

### Prerequisites
- Android Studio Jellyfish (2024.1.1+)  
- JDK 11+  
- Android SDK (Min API 24, Target API 37)  
- Running SiteLens AI backend  

### Installation
```bash
git clone https://github.com/Techy-prashant/SiteLensAI.git
cd SiteLensAI
git checkout mobile_app
```
Open in Android Studio → Sync Gradle → Configure backend URL in SettingsRepository.kt or in-app Settings.

Run
```bash
./gradlew installDebug
```


# 📱 User Guide
Main Screen
* Live camera feed
* Connection status + frame stats
* Alerts overlay with audio + vibration

History Screen
* Timeline of incidents (CRITICAL / WARNING / INFO)
* Export to PDF

Settings Screen
* Server URL configuration
* FPS control (Low/Medium/High)
* Toggle audio/vibration alerts
* Clear history

## 🔧 Core Components
* FrameAnalyzer.kt → CameraX frame capture + JPEG encoding
* SiteLensWebSocketClient.kt → WebSocket streaming, auto-reconnect
* MainViewModel.kt → State management, alert handling, incident logging
* SiteLensApiService.kt → REST fallback for detection
* TtsHelper.kt → Text-to-speech hazard alerts

## 📡 Networking
Client → Server (Frame):
```json
{ "frame": "base64-encoded-jpeg-data..." }
```


Server → Client (Alert):
```json
{
  "type": "alert",
  "severity_level": "critical",
  "hazards_detail": "Unharnessed worker at height",
  "sop_reference": "SOP-005: Fall Prevention"
}
```


## 🎨 Tech Stack
* Jetpack Compose (UI)
* Material Design 3
* CameraX (camera API)
* OkHttp (networking)
* Kotlinx Serialization (JSON)
* DataStore (persistent storage)

Battery drain: ~10–15% per hour continuous use.

🔐 Security
* SSL/TLS for all connections
* No frame storage (transient only)
* Local-only incident history (SQLite)
* Optional certificate pinning


## 🧪 Testing
```bash
./gradlew test                # Unit tests
./gradlew connectedAndroidTest # Instrumented tests
```
Manual checklist: 
camera feed, WebSocket connection, alerts, audio/vibration, history persistence, graceful reconnect.


## 📱 Device Requirements
* Android 7.0+ (API 24)
* 2GB RAM minimum (4GB+ recommended)
* Rear-facing camera
* WiFi or mobile data
* Tested on: Pixel 6a, Samsung Galaxy S21, OnePlus 9, Emulator (API 30–33)



## 📄 License
MIT License 

## 🙌 Acknowledgments
* Jetpack Compose
* CameraX
* OkHttp
* Kotlin
* Google Material Design


Build APK:
```bash
./gradlew assembleRelease
adb install app/build/outputs/apk/r
```


