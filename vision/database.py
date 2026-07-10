import sqlite3
import os

DB_PATH = "database/buildvision.db"

def create_database():

    os.makedirs("database", exist_ok=True)

    conn = sqlite3.connect(DB_PATH)

    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        timestamp TEXT,

        workers INTEGER,

        helmet REAL,

        vest REAL,

        mask REAL,

        score INTEGER,

        risk TEXT,

        report TEXT

    )
    """)

    conn.commit()
    conn.close()

    print("✅ Database Ready.")



from datetime import datetime

def save_incident(workers, helmet, vest, mask, score, risk, report):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO incidents (
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
    """, (

        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        workers,
        helmet,
        vest,
        mask,
        score,
        risk,
        report

    ))

    conn.commit()
    conn.close()

    print("✅ Incident Saved.")

if __name__ == "__main__":

    create_database()

    save_incident(
        workers=3,
        helmet=100,
        vest=66.7,
        mask=0,
        score=50,
        risk="HIGH",
        report="Worker missing mask."
    )