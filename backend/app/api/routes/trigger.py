from fastapi import APIRouter
import httpx
import random

router = APIRouter()

@router.get("/trigger/{lat}/{lon}")
def get_trigger(lat: float, lon: float):
    """
    Returns the real rainfall trigger and soil moisture scores using Open-Meteo API.
    """
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=precipitation,soil_moisture_0_to_7cm&daily=precipitation_sum&past_days=7&forecast_days=1&timezone=auto"
        response = httpx.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        
        # Extract live current data
        rainfall_1h = data["current"].get("precipitation", 0.0)
        soil_moisture_raw = data["current"].get("soil_moisture_0_to_7cm", 0.0)
        
        # Extract historical daily data
        daily_precip = data["daily"].get("precipitation_sum", [])
        
        # Calculate aggregations (safeguarded against missing data)
        rainfall_7d = sum(daily_precip[:7]) if len(daily_precip) >= 7 else 0.0
        rainfall_24h = daily_precip[-2] if len(daily_precip) >= 2 else rainfall_1h
        
        # Convert scientific raw soil moisture (e.g. 0.35 m3/m3) into a 0-100 percentage score (saturated is ~0.45)
        soil_moisture_score = min(int((soil_moisture_raw / 0.45) * 100), 100)
        
        # Calculate an overall trigger risk score (0-100) based on rainfall intensity and saturation
        trigger_score = min(int((rainfall_7d * 0.4) + (rainfall_24h * 0.4) + (soil_moisture_score * 0.2)), 100)

        return {
            "location": {"lat": lat, "lon": lon},
            "trigger_score": trigger_score,
            "soil_moisture_score": soil_moisture_score,
            "rainfall_data": {
                "1h": round(rainfall_1h, 2),
                "24h": round(rainfall_24h, 2),
                "7d": round(rainfall_7d, 2)
            },
            "mode": "LIVE"
        }
    except Exception as e:
        print(f"Error fetching Open-Meteo Data: {e}")
        # Graceful fallback to DEMO mode if API fails
        return {
            "location": {"lat": lat, "lon": lon},
            "trigger_score": random.randint(40, 95),
            "soil_moisture_score": random.randint(40, 100),
            "rainfall_data": {
                "1h": round(random.uniform(0, 50), 2),
                "24h": round(random.uniform(20, 200), 2),
                "7d": round(random.uniform(100, 500), 2)
            },
            "mode": "FALLBACK-DEMO"
        }

@router.get("/soil-moisture/{lat}/{lon}")
def get_soil_moisture(lat: float, lon: float):
    score = random.randint(50, 100)
    return {
        "location": {"lat": lat, "lon": lon},
        "soil_moisture_score": score,
        "mode": "DEMO"
    }
