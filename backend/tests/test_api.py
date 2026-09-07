from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Landslide Intelligence Engine API"}

def test_data_status():
    response = client.get("/api/landslide/data-status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data_sources"]) > 0

def test_susceptibility():
    lat = 23.3441
    lon = 85.3240
    response = client.get(f"/api/landslide/susceptibility/{lat}/{lon}")
    assert response.status_code == 200
    data = response.json()
    assert "susceptibility_score" in data
    assert 0 <= data["susceptibility_score"] <= 100
    assert data["mode"] == "DEMO"

def test_trigger():
    lat = 23.3441
    lon = 85.3240
    response = client.get(f"/api/landslide/trigger/{lat}/{lon}")
    assert response.status_code == 200
    data = response.json()
    assert "trigger_score" in data
    assert 0 <= data["trigger_score"] <= 100

def test_hazard():
    lat = 23.3441
    lon = 85.3240
    response = client.get(f"/api/landslide/hazard/{lat}/{lon}")
    assert response.status_code == 200
    data = response.json()
    assert "hazard_score" in data
    assert 0 <= data["hazard_score"] <= 100
    assert data["level"] in ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"]
    assert "components" in data
    assert "explanation" in data
