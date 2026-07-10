import cv2
from ultralytics import YOLO


print("Loading models...")

# Person detection model
person_model = YOLO("yolov8n.pt")

# PPE detection model
ppe_model = YOLO("models/best.pt")


# Open webcam
cap = cv2.VideoCapture(0)

# Set camera resolution
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)


if not cap.isOpened():
    print("Cannot open webcam")
    exit()


print("Starting live detection...")


window_name = "BuildVision Live Safety Monitor"


# Create normal application window
cv2.namedWindow(
    window_name,
    cv2.WINDOW_NORMAL
)

# Initial size
cv2.resizeWindow(
    window_name,
    1280,
    720
)


while True:

    ret, frame = cap.read()

    if not ret:
        break


    # Person detection
    person_results = person_model(
        frame,
        verbose=False
    )


    # PPE detection
    ppe_results = ppe_model(
        frame,
        verbose=False
    )


    # Draw detections
    final_frame = ppe_results[0].plot()


    # Show output
    cv2.imshow(
        window_name,
        final_frame
    )


    # Quit with Q
    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()