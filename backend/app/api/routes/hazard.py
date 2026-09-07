from fastapi import APIRouter
from .susceptibility import get_susceptibility
from .trigger import get_trigger
import random

router = APIRouter()

@router.get("/hazard/{lat}/{lon}")
def get_hazard(lat: float, lon: float):
    # Fetch base components
    susc_data = get_susceptibility(lat, lon)
    trig_data = get_trigger(lat, lon)
    
    susc_score = susc_data["susceptibility_score"]
    trig_score = trig_data["trigger_score"]
    soil_score = trig_data["soil_moisture_score"]
    
    # Ground movement (mock)
    ground_movement = random.randint(30, 95)
    
    # Detection (mock)
    detection_conf = random.randint(10, 80)
    
    # Weightings configurable in the future
    hazard_score = int((susc_score * 0.3) + (trig_score * 0.25) + (soil_score * 0.15) + (ground_movement * 0.2) + (detection_conf * 0.1))
    
    if hazard_score < 20: level = "LOW"
    elif hazard_score < 40: level = "MODERATE"
    elif hazard_score < 60: level = "ELEVATED"
    elif hazard_score < 80: level = "HIGH"
    else: level = "CRITICAL"
    
    return {
        "location": {"lat": lat, "lon": lon},
        "hazard_score": hazard_score,
        "level": level,
        "components": {
            "susceptibility": susc_score,
            "trigger": trig_score,
            "soil_moisture": soil_score,
            "ground_movement": ground_movement,
            "detection_confidence": detection_conf
        },
        "explanation": [
            f"{'High' if susc_score > 60 else 'Low'} terrain susceptibility.",
            f"{'Elevated' if trig_score > 60 else 'Normal'} rainfall conditions.",
            f"{'High' if soil_score > 60 else 'Low'} soil moisture.",
            f"{'Increasing' if ground_movement > 60 else 'Stable'} ground deformation.",
        ],
        "recommendation": "Field verification recommended." if hazard_score > 60 else "Normal monitoring."
    }
