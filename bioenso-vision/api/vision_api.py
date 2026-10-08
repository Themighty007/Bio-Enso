from flask import Flask, jsonify, request
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
        "source": "INFERRED · VISION"
    },
    "status": "INITIALIZING"
}

# Real Hardware State (ESP32: DHT22 + Water Sensor + Fan Relay)
HARDWARE_STATE = {
    "temperature": 32.1,
    "humidity": 55.0,
    "water_level": 15,       # 0 - 100%
    "fan_active": False,
    "fan_override": None,    # None: auto threshold, True/False: manual UI command
    "water_alert": False,
    "heat_alert": False,
    "last_seen": None,
    "connected": False
}


@app.route("/api/v1/observations/biology", methods=["GET"])
def get_biology():
    """Return the latest biological observation snapshot with hardware merged."""
    with _obs_lock:
        data = dict(LATEST_OBSERVATION)
        data["hardware"] = dict(HARDWARE_STATE)
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


# ==========================================
# HARDWARE BIDIRECTIONAL INTEGRATION ROUTES
# ==========================================

@app.route("/api/v1/hardware/telemetry", methods=["POST", "GET"])
def hardware_telemetry():
    """
    POST: Called by ESP32 to upload DHT22 & water sensor data.
          Returns fan state directly in response for instant actuation.
    GET:  Called by UI to view current hardware state.
    """
    global HARDWARE_STATE
    now = datetime.datetime.utcnow().isoformat() + "Z"

    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        with _obs_lock:
            temp = float(payload.get("temperature", HARDWARE_STATE["temperature"]))
            hum = float(payload.get("humidity", HARDWARE_STATE["humidity"]))
            water = int(payload.get("water_level", HARDWARE_STATE["water_level"]))

            HARDWARE_STATE["temperature"] = temp
            HARDWARE_STATE["humidity"] = hum
            HARDWARE_STATE["water_level"] = water
            HARDWARE_STATE["last_seen"] = now
            HARDWARE_STATE["connected"] = True

            # Threshold logic
            # Heat alert if temp > 34.5°C
            HARDWARE_STATE["heat_alert"] = temp >= 34.5
            # Flood alert if water level > 60%
            HARDWARE_STATE["water_alert"] = water >= 60

            # Actuator logic: fan turns ON if heat alert OR if UI commanded cooling
            if HARDWARE_STATE["fan_override"] is not None:
                HARDWARE_STATE["fan_active"] = HARDWARE_STATE["fan_override"]
            else:
                HARDWARE_STATE["fan_active"] = HARDWARE_STATE["heat_alert"]

            fan_command = HARDWARE_STATE["fan_active"]

        return jsonify({
            "status": "success",
            "fan": fan_command,
            "heat_alert": HARDWARE_STATE["heat_alert"],
            "water_alert": HARDWARE_STATE["water_alert"]
        })

    with _obs_lock:
        return jsonify(HARDWARE_STATE)


@app.route("/api/v1/hardware/control", methods=["POST"])
def hardware_control():
    """
    Called by the dashboard to remotely trigger or stop hardware cooling.
    Payload: {"fan": true/false/null} (null resets to auto)
    """
    global HARDWARE_STATE
    payload = request.get_json(silent=True) or {}
    with _obs_lock:
        if "fan" in payload:
            HARDWARE_STATE["fan_override"] = payload["fan"]
            if payload["fan"] is not None:
                HARDWARE_STATE["fan_active"] = bool(payload["fan"])
            else:
                HARDWARE_STATE["fan_active"] = HARDWARE_STATE["heat_alert"]

        current_fan = HARDWARE_STATE["fan_active"]

    return jsonify({"status": "updated", "fan": current_fan})


def start_api_server():
    print("[API] Starting BioENSO Vision & Hardware API on http://0.0.0.0:8000")
    app.run(host="0.0.0.0", port=8000, debug=False, use_reloader=False)


def run_in_background():
    api_thread = threading.Thread(target=start_api_server, daemon=True)
    api_thread.start()


def update_observation(active_animals, movement_index, shade_pct, water_pct,
                       grazing_pct, confidence, status="ONLINE"):
    """Update shared observation state from camera processing thread."""
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


if __name__ == "__main__":
    start_api_server()
