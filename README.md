# BuildVision AI 🏗️

## AI Powered Construction Site Safety Monitoring System

BuildVision is a computer vision based safety monitoring platform that detects PPE compliance violations in real-time construction environments using YOLO object detection and provides AI-generated safety recommendations.

---

# Problem Statement

Construction sites face major safety risks due to:

- Workers not wearing helmets
- Missing safety vests
- Lack of real-time monitoring
- Delayed incident reporting
- Manual CCTV supervision limitations

Traditional monitoring depends heavily on human observation, which is slow and error-prone.

---

# Solution

BuildVision uses AI-powered computer vision to continuously analyze camera streams and automatically detect:

- Workers
- Helmets
- Missing helmets
- Safety vests
- Missing vests
- Masks
- Missing masks

The system generates:

- Safety compliance percentage
- Risk level
- Safety score
- AI safety recommendations

---

# System Architecture

```
Camera / Video Stream
          |
          |
     OpenCV Processing
          |
          |
    YOLOv8 Object Detection
          |
          |
  PPE Classification + Analysis
          |
          |
 FastAPI Backend
          |
          |
 React Dashboard
          |
          |
 Safety Manager / Site Supervisor
```

---

# Computer Vision Pipeline

BuildVision satisfies computer vision requirements through:

## Input Stream

Supports:

- Webcam feed
- Video streams
- Mobile camera frames

## Vision Model

YOLO (You Only Look Once) object detection model is used.

The CNN based model performs:

- Feature extraction
- Object localization
- Classification

## Automated Understanding

The model performs:

- Object detection
- PPE classification
- Safety violation detection

## Measurable Output

The system produces:

- Bounding boxes around detected objects
- Object labels
- Detection counts
- Compliance percentages

Example outputs:

```
Worker detected: 3

Helmet compliance: 85%

Vest compliance: 70%

Risk Level: MEDIUM
```

---

# Technology Stack

## Frontend

### React + Vite

React is used for building the interactive dashboard interface.

Vite provides:

- Fast development server
- Optimized frontend bundling

CSS/Tailwind is used for:

- Responsive UI
- Dashboard styling
- Components

---

## Backend

### FastAPI

FastAPI handles:

- API communication
- Camera control
- AI pipeline execution
- Live monitoring endpoints

---

## AI / Computer Vision

### YOLOv8

Used for:

- Real-time object detection
- PPE recognition
- Safety violation identification


### OpenCV

Used for:

- Video capture
- Frame processing
- Image manipulation


---

# Features

## Live Monitoring

- Real-time camera feed
- YOLO detection overlay
- Safety statistics

## Dashboard

Displays:

- Total incidents
- Risk distribution
- Average safety score

## AI Safety Report

Generates recommendations such as:

"High risk detected. Improve helmet compliance immediately."

Future integration:

- Email alerts
- WhatsApp notifications
- SMS alerts

---

# Why AI?

AI enables:

- 24/7 automated monitoring
- Faster incident detection
- Reduced dependency on manual supervision
- Scalable monitoring across multiple cameras

---

# Multi Camera Deployment

The system can be extended by:

- Connecting multiple CCTV/IP cameras
- Processing streams through backend servers
- Assigning cameras to different construction zones

Architecture:

```
Multiple Cameras
        |
        |
Backend AI Server
        |
        |
Detection Engine
        |
        |
Dashboard
```

---

# Deployment

Current development setup:

Frontend:

```
React + Vite localhost
```

Backend:

```
FastAPI localhost server
```

Production deployment:

Frontend:

- Vercel

Backend:

- Cloud VM / AWS / Azure / Railway

AI inference:

- GPU enabled server

---

# Business Model

## B2B SaaS Model

Target customers:

- Construction companies
- Infrastructure companies
- Industrial sites

Revenue model:

### Subscription

Monthly pricing based on:

- Number of cameras
- Number of sites
- AI processing requirements


Example:

Basic:
- 5 cameras
- Safety dashboard

Enterprise:
- Multiple sites
- Real-time alerts
- Advanced analytics

---

# Future Improvements

- Gemini powered detailed reports
- Automatic email/WhatsApp alerts
- Mobile application
- Multiple camera management
- Worker identification
- Accident prediction analytics

---

# Team Project

BuildVision was developed as an AI based construction safety monitoring solution using computer vision and modern web technologies.