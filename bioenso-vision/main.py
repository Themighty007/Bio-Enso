import cv2
import os
import time
from dotenv import load_dotenv

from processing.motion import MotionDetector
from processing.zones import ZoneManager
from processing.detector import AnimalDetector
from processing.tracking import CentroidTracker
from processing.camera import ThreadedCamera
from api.vision_api import run_in_background, update_observation

# Load environment variables
load_dotenv()

MAX_RECONNECT_ATTEMPTS = 5

def main():
    print("[BIOENSO] Starting BioENSO Vision Service...")

    rtsp_url = os.getenv("CAMERA_RTSP_URL", "").strip()
    if rtsp_url:
        camera_source = rtsp_url
        print(f"[CAMERA] Connecting to RTSP stream: {rtsp_url}")
    else:
        camera_source = 0
        print("[CAMERA] No CAMERA_RTSP_URL set — falling back to local webcam (source=0).")

    # Start the local API server (background thread)
    run_in_background()

    # Try connecting to the camera source
    cap = ThreadedCamera(camera_source)

    if not cap.isOpened():
        print("[ERROR] Failed to open camera source.")
        if rtsp_url:
            print("  Possible causes:")
            print("  - Wrong RTSP URL in .env")
            print("  - Camera not on the same Wi-Fi network")
            print("  - Firewall blocking the stream port")
        else:
            print("  - No webcam detected or webcam is in use by another application.")
        return

    print("[CAMERA] Camera opened successfully.")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps_prop = cap.get(cv2.CAP_PROP_FPS)

    print(f"[CAMERA] Resolution : {width}x{height}")
    print(f"[CAMERA] Source FPS : {fps_prop}")
    print("[CAMERA] Press 'Q' in the display window to exit.")

    # Initialize processing pipeline
    frame_count = 0
    start_time = time.time()
    motion_detector = MotionDetector()
    zone_manager = ZoneManager("zones.json")
    animal_detector = AnimalDetector(model_name="yolov8n.pt", conf_threshold=0.3)
    tracker = CentroidTracker(max_disappeared=30, max_distance=100)

    # Cache last detections so non-YOLO frames still have valid data
    detections = []
    reconnect_attempts = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            reconnect_attempts += 1
            print(f"[CAMERA] Frame read failed. Reconnect attempt {reconnect_attempts}/{MAX_RECONNECT_ATTEMPTS}...")
            cap.release()
            time.sleep(5)

            cap = ThreadedCamera(camera_source)
            if cap.isOpened():
                print("[CAMERA] Reconnected successfully.")
                reconnect_attempts = 0  # reset counter on success
            else:
                print(f"[CAMERA] Reconnect attempt {reconnect_attempts} failed.")
                if reconnect_attempts >= MAX_RECONNECT_ATTEMPTS:
                    print("[CAMERA] Max reconnect attempts reached. Exiting.")
                    break
            continue

        # Successful frame — reset reconnect counter
        reconnect_attempts = 0
        frame_count += 1
        elapsed = time.time() - start_time
        fps = frame_count / elapsed if elapsed > 0 else 0.0

        # Calculate motion
        movement_index, activity_level = motion_detector.process_frame(frame)

        # Run YOLO detection only every 3rd frame to conserve CPU.
        # Between frames, reuse the cached detections list.
        if frame_count % 3 == 0:
            detections = animal_detector.detect(frame)

        # Update tracker every frame (uses cached or fresh detections)
        tracked_objects = tracker.update(detections)

        # Calculate Zone Occupancy
        zone_counts = {"SHADE": 0, "WATER": 0, "GRAZING": 0, "GENERAL": 0}
        active_animals = 0

        # Build display frame
        display_frame = frame.copy()
        zone_manager.draw_zones(display_frame)

        for obj_id, obj_data in tracked_objects.items():
            if obj_data["disappeared"] == 0:
                active_animals += 1
                cx, cy = obj_data["center"]
                x1, y1, x2, y2 = obj_data["box"]

                zone = zone_manager.get_zone_for_point(cx, cy, width, height)
                zone_counts[zone] = zone_counts.get(zone, 0) + 1

                cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.circle(display_frame, (cx, cy), 4, (0, 0, 255), -1)
                cv2.putText(display_frame, f"ID {obj_id} ({zone})", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Calculate zone percentages
        shade_pct  = int(zone_counts["SHADE"]   / active_animals * 100) if active_animals > 0 else 0
        water_pct  = int(zone_counts["WATER"]   / active_animals * 100) if active_animals > 0 else 0
        grazing_pct = int(zone_counts["GRAZING"] / active_animals * 100) if active_animals > 0 else 0

        # Confidence proxy: tracked vs raw YOLO detections
        yolo_detected = len(detections)
        conf_proxy = min(1.0, active_animals / yolo_detected) if yolo_detected > 0 else 0.0

        # Push latest observation to the API
        update_observation(
            active_animals=active_animals,
            movement_index=movement_index,
            shade_pct=shade_pct,
            water_pct=water_pct,
            grazing_pct=grazing_pct,
            confidence=conf_proxy
        )

        # HUD overlay
        source_label = "WEBCAM" if camera_source == 0 else "RTSP"
        cv2.putText(display_frame, f"BIOENSO VISION [{source_label}]", (20, 40),  cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(display_frame, f"FPS: {fps:.1f}",                  (20, 75),  cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(display_frame, f"SIZE: {width}x{height}",          (20, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(display_frame, f"ANIMALS: {active_animals}",        (20, 165), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(display_frame, f"SHADE: {shade_pct}% | WATER: {water_pct}% | GRAZE: {grazing_pct}%",
                    (20, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(display_frame, f"MOVEMENT: {movement_index:.2f}  ACTIVITY: {activity_level}",
                    (20, 235), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)

        cv2.imshow("BioENSO Vision Pipeline - LIVE", display_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[CAMERA] Exit requested by user.")
            break

    cap.release()
    cv2.destroyAllWindows()
    update_observation(0, 0, 0, 0, 0, 0, status="OFFLINE")
    print("[BIOENSO] Vision service terminated.")

if __name__ == "__main__":
    main()
