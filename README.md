# BioENSO

**BioENSO** is an intelligent climate resilience and livestock monitoring platform that pairs edge computer vision with behavioral and environmental telemetry to detect early heat and flood stress in herds.

---

## Architecture

- **`bioenso-vision/`**: Python edge vision service powered by YOLOv8, centroid tracking, and zone activity monitoring. Provides real-time behavioral telemetry (activity index, shade/water occupancy) over a thread-safe Flask REST API (`http://localhost:8000`).
- **`bioenso-ui/`**: Mobile-optimized field interface for farm managers. Displays live risk levels, thermal/camera views, active intervention workflows, and real-time alerts.
- **`bioenso-console/`**: Desktop regional observatory dashboard for multi-farm climate impact tracking, Biological-Thermal Index (BTI) calculation, and risk visualization.

---

## Quickstart

### 1. Vision Edge Service (`bioenso-vision`)
```bash
cd bioenso-vision
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*Note: Automatically falls back to local webcam (index 0) if no `CAMERA_RTSP_URL` is configured.*

### 2. Mobile Field UI (`bioenso-ui`)
```bash
cd bioenso-ui
npm install
npm run dev
```
Accessible at: `http://localhost:5173/`

### 3. Observatory Console (`bioenso-console`)
```bash
cd bioenso-console
npm install
npm run dev
```
Accessible at: `http://localhost:5174/`
