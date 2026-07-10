import cv2
import threading
from ultralytics import YOLO


camera_active = False
camera_thread = None
camera = None
latest_frame = None


status = {
    "is_active": False,
    "workers": 0,
    "helmet_compliance": 0,
    "vest_compliance": 0,
    "mask_compliance": 0,
    "safety_score": 0,
    "risk_level": "LOW",
    "recommendation": "Monitoring not started"
}


print("Loading YOLO models...")

ppe_model = YOLO("models/best.pt")

print("Models loaded")


def camera_loop():

    global latest_frame, camera, camera_active

    print(">>> CAMERA LOOP STARTED <<<")

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("❌ Failed to open camera")
        camera_active = False
        return

    print("✅ Camera opened")

    while camera_active:

        success, frame = camera.read()

        if not success:
            continue

        results = ppe_model(frame, verbose=False)

        boxes = results[0].boxes

        workers = 0
        hardhats = 0
        no_hardhats = 0
        masks = 0
        no_masks = 0
        vests = 0
        no_vests = 0

        for box in boxes:

            cls = int(box.cls[0])

            if cls == 5:
                workers += 1

            elif cls == 0:
                hardhats += 1

            elif cls == 2:
                no_hardhats += 1

            elif cls == 1:
                masks += 1

            elif cls == 3:
                no_masks += 1

            elif cls == 7:
                vests += 1

            elif cls == 4:
                no_vests += 1

        helmet_percent = (
            hardhats / (hardhats + no_hardhats) * 100
            if hardhats + no_hardhats > 0
            else 0
        )

        mask_percent = (
            masks / (masks + no_masks) * 100
            if masks + no_masks > 0
            else 0
        )

        vest_percent = (
            vests / (vests + no_vests) * 100
            if vests + no_vests > 0
            else 0
        )

        score = int((helmet_percent + mask_percent + vest_percent) / 3)

        if score < 50:
            risk = "HIGH"
        elif score < 80:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        status.update({
            "workers": workers,
            "helmet_compliance": round(helmet_percent, 2),
            "mask_compliance": round(mask_percent, 2),
            "vest_compliance": round(vest_percent, 2),
            "safety_score": score,
            "risk_level": risk,
            "recommendation": (
                "Improve PPE compliance immediately"
                if risk == "HIGH"
                else "Maintain safety standards"
            )
        })

        latest_frame = results[0].plot()

    camera.release()
    print("📷 Camera released")





def start_camera():

    global camera_active, camera_thread


    if camera_active:
        return {
            "message": "Already running"
        }


    camera_active = True

    status["is_active"] = True


    camera_thread = threading.Thread(
        target=camera_loop
    )

    camera_thread.start()


    return {
        "message": "Monitoring started"
    }





def stop_camera():

    global camera_active


    camera_active = False

    status["is_active"] = False


    return {
        "message": "Monitoring stopped"
    }





def get_status():

    return status





def generate_frames():

    global latest_frame


    while True:


        if latest_frame is None:
            continue



        ret, buffer = cv2.imencode(
            ".jpg",
            latest_frame
        )


        frame = buffer.tobytes()


        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame
            + b"\r\n"
        )