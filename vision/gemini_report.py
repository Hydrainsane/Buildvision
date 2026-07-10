import json
import os
from google import genai
import time

# ============================================
# PUT YOUR API KEY HERE
# ============================================
API_KEY = "AIzaSyCyfgy8AgrK1u4e5T3p6DH27jMQFKM8ff0"

client = genai.Client(api_key=API_KEY)

# ============================================
# Load Analysis
# ============================================

with open("output/analysis.json", "r") as f:
    analysis = json.load(f)

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
        print(f"\n⚠️ Gemini is currently busy.")
        print(f"Attempt {attempt+1}/3")

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

print("\n========== AI REPORT ==========\n")
print(report)

print("\nSaved to output/report.txt")