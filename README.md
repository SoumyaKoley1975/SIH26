# Landslide Intelligence Engine (SIH 2026)

## Overview
This is the foundational **Landslide Detection, Susceptibility and Early-Warning module** for the SIH 2026 Problem Statement 26191. 
The system evaluates terrain susceptibility, dynamic environmental triggers, and satellite ground displacement to produce an explainable landslide hazard score, visualized on an interactive GIS platform.

---

## 🚀 How to Start the Application

You will need to open **two separate terminal windows/tabs**, one for the Backend and one for the Frontend.

### 1. Start the Backend (FastAPI)
Open your first terminal and run the following commands:
```powershell
cd "d:\web dev\SIH26\SIH26\backend"
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
> The API will be available at `http://localhost:8000`. You can view the automated API documentation at `http://localhost:8000/docs`.

### 2. Start the Frontend (React + Vite)
Open your second terminal and run the following commands:
```powershell
cd "d:\web dev\SIH26\SIH26\frontend"
npm run dev
```
> The Interactive GIS Dashboard will be available at `http://localhost:5173`. 

---

## Phase 1 MVP Details
- **Architecture**: Modular Python FastAPI backend with a React+TypeScript frontend.
- **GIS Map**: MapLibre GL JS integration.
- **Data Layers**: Currently running in DEMO mode to rapidly iterate on the UI. Real data pipelines (GSI, Sentinel, GPM) will replace these endpoints in subsequent phases.
