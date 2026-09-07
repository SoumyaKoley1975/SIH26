from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import susceptibility, trigger, hazard, data_status

app = FastAPI(title="Landslide Intelligence Engine", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Landslide Intelligence Engine API"}

# Include routers
app.include_router(susceptibility.router, prefix="/api/landslide", tags=["Susceptibility"])
app.include_router(trigger.router, prefix="/api/landslide", tags=["Trigger"])
app.include_router(hazard.router, prefix="/api/landslide", tags=["Hazard"])
app.include_router(data_status.router, prefix="/api/landslide", tags=["Data Status"])

