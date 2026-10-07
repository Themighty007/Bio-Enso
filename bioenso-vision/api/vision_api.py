from flask import Flask, jsonify
from flask_cors import CORS
import threading
import datetime
import time
import logging
from collections import deque

app = Flask(__name__)
CORS(app)

# Suppress Flask/Werkzeug request logs to keep terminal readable
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# Thread-safety lock for all reads/writes on shared state
_obs_lock = threading.Lock()

# Server start time for uptime calculation
_start_time = time.time()

# Ring buffer of last 60 observations for history endpoint
_history: deque = deque(maxlen=60)

# Global store for the latest observation
LATEST_OBSERVATION = {
    "farm_id": "FARM_01",
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "biology": {
        "species": "cattle",
        "animals_observed": 0,
        "shade_occupancy_pct": 0,
        "water_zone_occupancy_pct": 0,
        "movement_index": 0.0,
        "grazing_pct": 0,
        "resting_pct": 0
    },
    "vision": {
        "confidence": 0.0,
        "source": "INFERRED \u00b7 VISION"   # unicode middle dot
    },
    "status": "INITIALIZING"
}


@app.route("/api/v1/observations/biology", methods=["GET"])
def get_biology():
    """Return the latest biological observation snapshot."""
    with _obs_lock:
        # Return a shallow copy to avoid race on serialisation
        data = dict(LATEST_OBSERVATION)
    return jsonify(data)


@app.route("/api/v1/observations/history", methods=["GET"])
def get_history():
    """Return the last 60 biological observations."""
    with _obs_lock:
        history_list = list(_history)
    return jsonify(history_list)


@app.route("/api/v1/health", methods=["GET"])
def health():
    """Health-check endpoint so the UI can detect if the vision server is up."""
    uptime = round(time.time() - _start_time, 1)
    return jsonify({"status": "ok", "uptime_seconds": uptime})


def start_api_server():
    print("[API] Starting local BioENSO Vision API on http://localhost:8000")
    app.run(host="0.0.0.0", port=8000, debug=False, use_reloader=False)


def run_in_background():
    api_thread = threading.Thread(target=start_api_server, daemon=True)
    api_thread.start()


def update_observation(active_animals, movement_index, shade_pct, water_pct,
                       grazing_pct, confidence, status="ONLINE"):
    """
    Update the shared observation state from the camera processing thread.
    Thread-safe: protected by _obs_lock.
    Timestamp is set HERE (when data changes), not on GET.
    """
    resting_pct = max(0, 100 - (grazing_pct + water_pct))
    now = datetime.datetime.utcnow().isoformat() + "Z"

    with _obs_lock:
        LATEST_OBSERVATION["timestamp"] = now
        LATEST_OBSERVATION["status"] = status

        bio = LATEST_OBSERVATION["biology"]
        bio["animals_observed"]        = active_animals
        bio["movement_index"]          = float(movement_index)
        bio["shade_occupancy_pct"]     = shade_pct
        bio["water_zone_occupancy_pct"] = water_pct
        bio["grazing_pct"]             = grazing_pct
        bio["resting_pct"]             = resting_pct

        LATEST_OBSERVATION["vision"]["confidence"] = float(confidence)

        # Append a snapshot to the history ring buffer
        _history.append({
            "timestamp": now,
            "animals_observed": active_animals,
            "movement_index": float(movement_index),
            "shade_occupancy_pct": shade_pct,
            "water_zone_occupancy_pct": water_pct,
            "grazing_pct": grazing_pct,
            "resting_pct": resting_pct,
            "confidence": float(confidence),
            "status": status,
        })
