from ultralytics import YOLO
import os
import json


# -----------------------------
# Load Models
# -----------------------------
print("Loading models...")

person_model = YOLO("yolov8n.pt")
ppe_model = YOLO("models/best.pt")

# -----------------------------
# Image Path
# -----------------------------
IMAGE_PATH = "test_images/site.jpg"

# -----------------------------
# Run Detection
# -----------------------------
print("Running Person Detection...")

person_results = person_model(
    IMAGE_PATH,
    classes=[0],      # COCO class 0 = Person
    conf=0.5
)

print("Running PPE Detection...")

ppe_results = ppe_model(
    IMAGE_PATH,
    conf=0.5
)

# -----------------------------
# Save Images
# -----------------------------
os.makedirs("output", exist_ok=True)

person_results[0].save(filename="output/person_detection.jpg")
ppe_results[0].save(filename="output/ppe_detection.jpg")

# -----------------------------
# Count Persons
# -----------------------------
worker_count = len(person_results[0].boxes)

# -----------------------------
# Count PPE Objects
# -----------------------------
ppe_counts = {}

for box in ppe_results[0].boxes:
    cls = int(box.cls[0])
    name = ppe_model.names[cls]

    ppe_counts[name] = ppe_counts.get(name, 0) + 1

# -----------------------------
# Print Results
# -----------------------------
print("\n==============================")
print("BUILDVISION DETECTION REPORT")
print("==============================")

print(f"\nWorkers Detected : {worker_count}\n")

print("PPE Detection:")

for key, value in ppe_counts.items():
    print(f"{key}: {value}")

print("\nImages Saved:")

print("output/person_detection.jpg")
print("output/ppe_detection.jpg")

report = {
    "workers": worker_count,
    "ppe": ppe_counts
}

with open("output/detections.json", "w") as f:
    json.dump(report, f, indent=4)

print("\nDetection JSON saved to output/detections.json")

