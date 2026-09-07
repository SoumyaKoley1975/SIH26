import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './GISMap.css';

interface LocationInfo {
    lat: number;
    lon: number;
}

interface GISMapProps {
    onLocationClick: (loc: LocationInfo) => void;
}

const GISMap: React.FC<GISMapProps> = ({ onLocationClick }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [center] = useState<[number, number]>([85.3240, 23.3441]); // Ranchi default
    const [zoom] = useState(7);

    useEffect(() => {
        if (map.current || !mapContainer.current) return; // initialize map only once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'esri-satellite': {
                        type: 'raster',
                        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                        tileSize: 256
                    }
                },
                layers: [{
                    id: 'satellite',
                    type: 'raster',
                    source: 'esri-satellite',
                    minzoom: 0,
                    maxzoom: 22
                }]
            },
            center: center,
            zoom: zoom
        });

        const currentMap = map.current;

        currentMap.on('load', () => {
            // Future: Add DEM, Slope, and Risk vector layers here
            // Dummy source for events
            currentMap.addSource('historical-events', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
        });

        currentMap.on('click', (e) => {
            onLocationClick({ lat: e.lngLat.lat, lon: e.lngLat.lng });

            // Add or update marker
            const markerId = 'selected-location-marker';
            const markerSource = currentMap.getSource(markerId);

            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [e.lngLat.lng, e.lngLat.lat]
                },
                properties: {}
            };

            if (markerSource) {
                (markerSource as any).setData({
                    type: 'FeatureCollection',
                    features: [feature]
                });
            } else {
                currentMap.addSource(markerId, {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [feature]
                    }
                });

                currentMap.addLayer({
                    id: markerId,
                    type: 'circle',
                    source: markerId,
                    paint: {
                        'circle-radius': 8,
                        'circle-color': '#e74c3c',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });
            }
        });

    }, [center, zoom, onLocationClick]);

    return (
        <div className="map-wrapper">
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default GISMap;
