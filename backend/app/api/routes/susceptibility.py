from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/susceptibility/{lat}/{lon}")
def get_susceptibility(lat: float, lon: float):
    """
    Returns the landslide susceptibility score for a given location.
    Phase 1: DEMO output simulating Random Forest model.
    """
    # Simulate a score based on location or just randomly for demo
    score = random.randint(30, 95)
    
    if score < 20: level = "Very Low"
    elif score < 40: level = "Low"
    elif score < 60: level = "Moderate"
    elif score < 80: level = "High"
    else: level = "Very High"
    
    return {
        "location": {"lat": lat, "lon": lon},
        "susceptibility_score": score,
        "class": level,
        "features": {
            "slope": {"value": round(random.uniform(10, 45), 2), "contribution": "High"},
            "elevation": {"value": round(random.uniform(500, 3000), 2), "contribution": "Moderate"},
            "geology": {"value": "Fractured Schist", "contribution": "High"}
        },
        "mode": "DEMO"
    }
