from fastapi import APIRouter

router = APIRouter()

@router.get("/data-status")
def get_data_status():
    """
    Returns the status of various data sources required by the system.
    """
    return {
        "status": "success",
        "data_sources": [
            {
                "name": "GSI Landslide Inventory",
                "status": "Available",
                "source": "GSI Bhusanket",
                "last_update": "2026-08-01",
                "resolution": "Point/Polygon"
            },
            {
                "name": "DEM (Digital Elevation Model)",
                "status": "Available",
                "source": "SRTM/Copernicus",
                "last_update": "2026-01-01",
                "resolution": "30m"
            },
            {
                "name": "Rainfall (GPM IMERG)",
                "status": "Available",
                "source": "NASA",
                "last_update": "2026-09-06",
                "resolution": "10km"
            },
            {
                "name": "Soil Moisture",
                "status": "Available",
                "source": "SMAP",
                "last_update": "2026-09-06",
                "resolution": "10km"
            },
            {
                "name": "Sentinel-1 (InSAR)",
                "status": "DEMO MODE",
                "source": "Copernicus",
                "last_update": "2026-09-06",
                "resolution": "10m"
            },
            {
                "name": "Sentinel-2 (Optical)",
                "status": "DEMO MODE",
                "source": "Copernicus",
                "last_update": "2026-09-06",
                "resolution": "10m"
            }
        ]
    }
