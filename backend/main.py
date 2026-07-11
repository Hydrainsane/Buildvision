from fastapi import FastAPI
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from backend import monitoring
from fastapi import UploadFile, File

app = FastAPI(title="BuildVision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.181.94:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "BuildVision Backend Running"
    }


@app.get("/incidents")
def get_incidents():

    conn = sqlite3.connect("database/buildvision.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM incidents
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]

@app.post("/monitoring/start")
def start_monitoring():

    return monitoring.start_camera()



@app.post("/monitoring/stop")
def stop_monitoring():

    return monitoring.stop_camera()



@app.get("/monitoring/status")
def monitoring_status():

    return monitoring.get_status()



@app.get("/monitoring/feed")
def monitoring_feed():

    return StreamingResponse(
        monitoring.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.post("/monitoring/frame")
async def upload_frame(file: UploadFile = File(...)):
    return await monitoring.receive_phone_frame(file)