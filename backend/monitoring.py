import cv2
import threading
import time
import numpy as np
import sqlite3
from datetime import datetime
from ultralytics import YOLO


# =========================
# GLOBALS
# =========================

latest_phone_frame = None
latest_frame = None

camera_active = False
camera_thread = None
camera = None

video_source = 0

frame_lock = threading.Lock()

last_incident_time = 0



# =========================
# STATUS
# =========================

status = {

    "is_active": False,

    "workers": 0,

    "helmet_compliance": 0,
    "vest_compliance": 0,
    "mask_compliance": 0,

    "safety_score": 0,

    "risk_level": "LOW",

    "recommendation":
        "Monitoring not started",

    "last_update":
        None,

    "detections": {}

}



# =========================
# MODEL
# =========================

print("Loading YOLO model...")

ppe_model = YOLO("models/best.pt")

print("YOLO loaded successfully.")



# =========================
# INCIDENT STORAGE
# =========================

def save_incident(
        workers,
        helmet,
        vest,
        mask,
        score,
        risk,
        report
):

    try:

        conn = sqlite3.connect(
            "database/buildvision.db"
        )

        cursor = conn.cursor()


        cursor.execute(
            """
            INSERT INTO incidents
            (
                timestamp,
                workers,
                helmet,
                vest,
                mask,
                score,
                risk,
                report
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,

            (

                datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),

                workers,

                round(helmet,2),

                round(vest,2),

                round(mask,2),

                score,

                risk,

                report

            )

        )


        conn.commit()

        conn.close()


        print("✅ Incident stored")


    except Exception as e:

        print(
            "❌ Database error:",
            e
        )




# =========================
# AI RECOMMENDATION
# =========================

def generate_recommendation(
        workers,
        helmet,
        vest,
        mask,
        risk
):

    problems = []


    if helmet < 80:
        problems.append("helmet")


    if vest < 80:
        problems.append("vest")


    if mask < 80:
        problems.append("mask")



    if risk == "HIGH":

        return (
            f"🚨 HIGH RISK DETECTED. "
            f"{workers} workers monitored. "
            f"Improve {', '.join(problems)} compliance immediately."
        )


    elif risk == "MEDIUM":

        return (
            f"⚠️ MEDIUM RISK. "
            f"{workers} workers monitored. "
            "Safety compliance requires attention."
        )


    else:

        return (
            f"✅ SITE SAFE. "
            f"{workers} workers monitored. "
            "PPE compliance acceptable."
        )




# =========================
# CAMERA LOOP
# =========================

def camera_loop():

    global latest_frame
    global latest_phone_frame
    global camera
    global camera_active
    global last_incident_time


    print(
        ">>> CAMERA LOOP STARTED <<<"
    )


    camera = cv2.VideoCapture(
        video_source
    )


    camera.set(
        cv2.CAP_PROP_FRAME_WIDTH,
        640
    )

    camera.set(
        cv2.CAP_PROP_FRAME_HEIGHT,
        480
    )



    if not camera.isOpened():

        print(
            "❌ Camera failed"
        )

        camera_active = False

        status["is_active"] = False

        return



    print(
        "✅ Camera opened"
    )


    last_inference = 0

    inference_delay = 0.15



    while camera_active:


        with frame_lock:


            if latest_phone_frame is not None:

                frame = latest_phone_frame.copy()

                latest_phone_frame = None

                success = True


            else:

                success, frame = camera.read()



        if not success:

            time.sleep(0.02)

            continue




        now = time.time()



        if now - last_inference < inference_delay:

            continue



        last_inference = now



        frame = cv2.resize(
            frame,
            (640,480)
        )



        results = ppe_model(
            frame,
            verbose=False
        )



        boxes = results[0].boxes



        workers = 0

        helmets = 0
        no_helmets = 0

        masks = 0
        no_masks = 0

        vests = 0
        no_vests = 0



        for box in boxes:

            cls = int(
                box.cls[0]
            )


            if cls == 5:
                workers += 1


            elif cls == 0:
                helmets += 1


            elif cls == 2:
                no_helmets += 1


            elif cls == 1:
                masks += 1


            elif cls == 3:
                no_masks += 1


            elif cls == 7:
                vests += 1


            elif cls == 4:
                no_vests += 1




        helmet = (
            helmets /
            (helmets + no_helmets)
            * 100

            if helmets + no_helmets
            else 0
        )


        mask = (
            masks /
            (masks + no_masks)
            * 100

            if masks + no_masks
            else 0
        )


        vest = (
            vests /
            (vests + no_vests)
            * 100

            if vests + no_vests
            else 0
        )



        score = int(
            (helmet + mask + vest) / 3
        )



        if score < 50:

            risk = "HIGH"

        elif score < 80:

            risk = "MEDIUM"

        else:

            risk = "LOW"



        recommendation = generate_recommendation(
            workers,
            helmet,
            vest,
            mask,
            risk
        )



        status.update({

            "workers": workers,

            "helmet_compliance":
                round(helmet,2),

            "vest_compliance":
                round(vest,2),

            "mask_compliance":
                round(mask,2),

            "safety_score":
                score,

            "risk_level":
                risk,

            "recommendation":
                recommendation,

            "last_update":
                datetime.now().strftime(
                    "%H:%M:%S"
                ),

            "detections": {

                "helmets": helmets,

                "missing_helmets":
                    no_helmets,

                "vests": vests,

                "missing_vests":
                    no_vests,

                "masks": masks,

                "missing_masks":
                    no_masks

            }

        })




        # =====================
        # SAVE INCIDENT
        # =====================

        if (
            risk in ["HIGH","MEDIUM"]
            and time.time() - last_incident_time > 10
        ):

            save_incident(

                workers,

                helmet,

                vest,

                mask,

                score,

                risk,

                recommendation

            )

            last_incident_time = time.time()





        annotated = results[0].plot()



        with frame_lock:

            latest_frame = annotated.copy()



    camera.release()


    print(
        "📷 Camera released"
    )




# =========================
# CONTROLS
# =========================

def start_camera():

    global camera_active
    global camera_thread


    if camera_active:

        return {
            "message":
            "Already running"
        }



    camera_active = True

    status["is_active"] = True



    camera_thread = threading.Thread(

        target=camera_loop,

        daemon=True

    )


    camera_thread.start()



    return {
        "message":
        "Monitoring started"
    }





def stop_camera():

    global camera_active


    camera_active = False

    status["is_active"] = False


    return {
        "message":
        "Monitoring stopped"
    }





def get_status():

    return status




# =========================
# STREAM
# =========================

def generate_frames():

    global latest_frame


    while True:


        with frame_lock:

            frame = latest_frame



        if frame is None:

            time.sleep(0.05)

            continue



        success, buffer = cv2.imencode(

            ".jpg",

            frame,

            [
                cv2.IMWRITE_JPEG_QUALITY,
                70
            ]

        )



        if not success:

            continue



        yield (

            b"--frame\r\n"

            b"Content-Type: image/jpeg\r\n\r\n"

            +

            buffer.tobytes()

            +

            b"\r\n"

        )




# =========================
# PHONE CAMERA
# =========================

async def receive_phone_frame(file):

    global latest_phone_frame


    data = await file.read()


    img = np.frombuffer(
        data,
        np.uint8
    )


    frame = cv2.imdecode(
        img,
        cv2.IMREAD_COLOR
    )



    if frame is not None:

        with frame_lock:

            latest_phone_frame = frame



    return {
        "message":
        "received"
    }