"""
BioENSO - Live Hardware & Software Synchronization Tester
Tests the bi-directional communication between ESP32/Hardware and the BioENSO Dashboard.
"""

import time
import requests
import sys

BASE_URL = "http://localhost:8000"

def check_server():
    try:
        res = requests.get(f"{BASE_URL}/api/v1/health", timeout=2)
        return res.status_code == 200
    except Exception:
        return False

def send_telemetry(temp, hum, water):
    try:
        res = requests.post(
            f"{BASE_URL}/api/v1/hardware/telemetry",
            json={"temperature": temp, "humidity": hum, "water_level": water},
            timeout=2
        )
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        print(f"[ERROR] Failed to send telemetry: {e}")
    return None

def trigger_ui_fan(fan_state):
    try:
        res = requests.post(
            f"{BASE_URL}/api/v1/hardware/control",
            json={"fan": fan_state},
            timeout=2
        )
        return res.json()
    except Exception as e:
        print(f"[ERROR] Failed to trigger fan: {e}")
        return None

def main():
    print("=" * 60)
    print("  BioENSO - Hardware <-> Dashboard Sync Interactive Test")
    print("=" * 60)

    if not check_server():
        print("[!] Warning: BioENSO API is not running on http://localhost:8000")
        print("    Start it in another terminal: cd bioenso-vision && python main.py")
        print("    Running simulation mode...\n")

    print("Preset Options:")
    print(" [1] Normal State (Temp 32.1 C, Water 15%, Fan OFF)")
    print(" [2] Heatwave Spike (Temp 37.4 C, Fan AUTO-TURNS ON)")
    print(" [3] Flash Flood Surge (Water 85%, Flood Alert ON)")
    print(" [4] Software Override: Force Fan ON from Dashboard")
    print(" [5] Software Override: Force Fan OFF")
    print(" [6] Live Continuous Loop (simulates gradual temperature cycle)")
    print(" [Q] Quit\n")

    while True:
        choice = input("Enter option [1-6, Q]: ").strip().upper()

        if choice == "1":
            data = send_telemetry(32.1, 55.0, 15)
            trigger_ui_fan(None) # reset override
            print(f" -> Sent Normal: Temp=32.1C, Water=15% | Response: Fan={'ON' if data and data.get('fan') else 'OFF'}")

        elif choice == "2":
            data = send_telemetry(37.4, 72.0, 20)
            print(f" -> Sent Heatwave: Temp=37.4C | Hardware Fan Result: {'ON (Cooling Activated!)' if data and data.get('fan') else 'OFF'}")
            print(" -> Check Mobile Dashboard (5173): Status should alert high temperature!")

        elif choice == "3":
            data = send_telemetry(28.0, 92.0, 88)
            print(f" -> Sent Flood Surge: Water Level=88% | Water Alert: {data.get('water_alert') if data else True}")
            print(" -> Check Mobile Dashboard (5173): Flood alert triggered!")

        elif choice == "4":
            data = trigger_ui_fan(True)
            print(f" -> Dashboard triggered FAN ON | Actuator State: {data}")

        elif choice == "5":
            data = trigger_ui_fan(False)
            print(f" -> Dashboard triggered FAN OFF | Actuator State: {data}")

        elif choice == "6":
            print("\nStarting continuous loop... (Press Ctrl+C to stop)")
            try:
                for temp in [31.0, 32.5, 34.0, 36.5, 38.0, 35.0, 32.0]:
                    water = 15 if temp > 33 else 45
                    data = send_telemetry(temp, 60.0, water)
                    fan_status = "ON [ACTIVE]" if data and data.get("fan") else "OFF"
                    print(f"  [Sensors] Temp: {temp}C | Water: {water}%  ==>  [Fan Actuator]: {fan_status}")
                    time.sleep(2)
            except KeyboardInterrupt:
                print("\nStopped.")

        elif choice == "Q":
            print("Exiting.")
            break

if __name__ == "__main__":
    main()
