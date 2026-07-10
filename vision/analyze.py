import json

# Load detections
with open("output/detections.json", "r") as f:
    data = json.load(f)

workers = data["workers"]
ppe = data["ppe"]

hardhats = ppe.get("Hardhat", 0)
vests = ppe.get("Safety Vest", 0)
no_vests = ppe.get("NO-Safety Vest", 0)
no_masks = ppe.get("NO-Mask", 0)

print("===== DEBUG =====")
print(f"Workers: {workers}")
print(f"Hardhats: {hardhats}")
print(f"Vests: {vests}")
print(f"NO Vests: {no_vests}")
print(f"NO Masks: {no_masks}")
print("=================")

# Compliance
helmet_compliance = (hardhats / workers) * 100 if workers else 0
vest_compliance = ((workers - no_vests) / workers) * 100 if workers else 0
mask_compliance = ((workers - no_masks) / workers) * 100 if workers else 0

# Safety Score
safety_score = (
    helmet_compliance * 0.4 +
    vest_compliance * 0.3 +
    mask_compliance * 0.3
)

# Risk Level
if safety_score >= 85:
    risk = "LOW"
if safety_score >= 50:
    risk = "MEDIUM"
else:
    risk = "HIGH"

analysis = {
    "workers": workers,
    "helmet_compliance": round(helmet_compliance, 1),
    "vest_compliance": round(vest_compliance, 1),
    "mask_compliance": round(mask_compliance, 1),
    "safety_score": safety_score,
    "risk": risk
}

print("\n========== BUILDVISION ANALYSIS ==========\n")

for k, v in analysis.items():
    print(f"{k}: {v}")

with open("output/analysis.json", "w") as f:
    json.dump(analysis, f, indent=4)

print("\nAnalysis saved to output/analysis.json")