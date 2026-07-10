import json
import os
import time
from dotenv import load_dotenv
from google import genai
from database import save_incident   

# ============================================
# PUT YOUR API KEY HERE
# ============================================
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)

# ============================================
# Load Analysis
# ============================================

with open("output/analysis.json", "r") as f:
    analysis = json.load(f)

    workers = analysis["workers"]
    helmet = analysis["helmet_compliance"]
    vest = analysis["vest_compliance"]
    mask = analysis["mask_compliance"]
    score = analysis["safety_score"]
    risk = analysis["risk"]

prompt = f"""
You are an experienced Construction Site Safety Inspector.

Analyze the following site data and generate a professional inspection report.

Site Data:

{json.dumps(analysis, indent=4)}

The report must contain exactly these sections:

1. Executive Summary

2. Compliance Status

3. Safety Violations

4. Risk Assessment

5. Immediate Recommendations

6. Overall Safety Score Explanation

Keep it professional.
Do not invent information.
Base every statement only on the supplied data.
"""


print("Generating AI Report...")

response = None

for attempt in range(3):
    try:
        response = client.models.generate_content(
            model="models/gemini-3.1-flash-lite",
            contents=prompt
        )
        break

    except Exception as e:
     print(f"\nAttempt {attempt+1}/3 failed.")
     print(f"Error: {e}")

    if attempt < 2:
        print("Retrying in 5 seconds...\n")
        time.sleep(5)
    else:
        print("\nFailed after 3 attempts.")
        exit()

report = response.text

os.makedirs("output", exist_ok=True)

with open("output/report.txt", "w", encoding="utf-8") as f:
    f.write(report)

save_incident(
    workers,
    helmet,
    vest,
    mask,
    score,
    risk,
    report
)


print("\n========== AI REPORT ==========\n")
print(report)

print("\nSaved to output/report.txt")