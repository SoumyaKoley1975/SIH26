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
            zoom: zoom,
            minZoom: 4, // Prevent zooming out too far
            maxBounds: [
                [68.0, 6.5],   // Southwest coordinates of India (approx)
                [97.5, 36.0]   // Northeast coordinates of India (approx)
            ]
        });

        const currentMap = map.current;

        currentMap.on('load', () => {
            // Dummy source for risk zones
            currentMap.addSource('risk-zones', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [84.0, 22.5], [86.5, 22.5], [86.5, 24.5], [84.0, 24.5], [84.0, 22.5]
                                ]]
                            },
                            properties: { level: 'High', description: 'Chota Nagpur Plateau region: High susceptibility due to mining activities and terrain.' }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [73.0, 18.0], [74.5, 18.0], [77.0, 9.0], [75.5, 9.0], [73.0, 18.0]
                                ]]
                            },
                            properties: { level: 'Medium', description: 'Western Ghats: Moderate to High risk during monsoon season.' }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [74.0, 34.0], [78.0, 30.0], [88.0, 27.0], [97.0, 28.0], [97.0, 29.5], [88.0, 28.5], [78.0, 32.0], [74.0, 35.5], [74.0, 34.0]
                                ]]
                            },
                            properties: { level: 'High', description: 'Himalayan Region: Very high landslide risk due to steep slopes and tectonic activity.' }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [78.0, 20.0], [82.0, 20.0], [82.0, 26.0], [78.0, 26.0], [78.0, 20.0]
                                ]]
                            },
                            properties: { level: 'Low', description: 'Central Plains: Stable terrain with minimal landslide historical occurrences.' }
                        }
                    ]
                }
            });

            // Add fill layer for the risk zones
            currentMap.addLayer({
                id: 'risk-zones-fill',
                type: 'fill',
                source: 'risk-zones',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'level'],
                        'High', '#e74c3c', // Red
                        'Medium', '#f1c40f', // Yellow
                        'Low', '#2ecc71', // Green
                        '#ffffff'
                    ],
                    'fill-opacity': 0.4
                }
            });

            // Add an outline for the risk zones to make them pop out more
            currentMap.addLayer({
                id: 'risk-zones-outline',
                type: 'line',
                source: 'risk-zones',
                paint: {
                    'line-color': [
                        'match',
                        ['get', 'level'],
                        'High', '#c0392b',
                        'Medium', '#f39c12',
                        'Low', '#27ae60',
                        '#ffffff'
                    ],
                    'line-width': 2
                }
            });

            // Add popups on click for risk zones
            currentMap.on('click', 'risk-zones-fill', (e) => {
                if (!e.features || e.features.length === 0) return;

                const feature = e.features[0];
                const { level, description } = feature.properties as any;

                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <div style="color: #333; font-family: sans-serif; max-width: 200px;">
                            <h4 style="margin: 0 0 5px; color: ${level === 'High' ? '#e74c3c' : level === 'Medium' ? '#e67e22' : '#2ecc71'}">
                                ${level} Risk Zone
                            </h4>
                            <p style="margin: 0; font-size: 0.9em;">${description}</p>
                        </div>
                    `)
                    .addTo(currentMap);
            });

            // Change cursor to pointer on hover
            currentMap.on('mouseenter', 'risk-zones-fill', () => {
                currentMap.getCanvas().style.cursor = 'pointer';
            });
            currentMap.on('mouseleave', 'risk-zones-fill', () => {
                currentMap.getCanvas().style.cursor = '';
            });

            // Fetch India GeoJSON and create an inverted mask for the rest of the world
            fetch('/india.geojson')
                .then(res => res.json())
                .then(indiaData => {
                    const worldCoords = [
                        [
                            [-180, 90],
                            [-180, -90],
                            [180, -90],
                            [180, 90],
                            [-180, 90]
                        ]
                    ];

                    const features = indiaData.features || [indiaData];
                    features.forEach((feature: any) => {
                        if (!feature.geometry) return;
                        if (feature.geometry.type === 'MultiPolygon') {
                            feature.geometry.coordinates.forEach((polygon: any) => {
                                worldCoords.push(polygon[0]);
                            });
                        } else if (feature.geometry.type === 'Polygon') {
                            worldCoords.push(feature.geometry.coordinates[0]);
                        }
                    });

                    currentMap.addSource('world-mask', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                geometry: {
                                    type: 'Polygon',
                                    coordinates: worldCoords
                                },
                                properties: {}
                            }]
                        }
                    });

                    currentMap.addLayer({
                        id: 'world-mask-layer',
                        type: 'fill',
                        source: 'world-mask',
                        paint: {
                            'fill-color': '#ffffff',
                            'fill-opacity': 1.0
                        }
                    });

                    // Add world country borders on top of the mask
                    currentMap.addSource('world-countries', {
                        type: 'geojson',
                        data: '/countries.geojson'
                    });

                    currentMap.addLayer({
                        id: 'world-countries-line',
                        type: 'line',
                        source: 'world-countries',
                        paint: {
                            'line-color': '#dddddd', // Faint grey lines
                            'line-width': 1.5
                        }
                    });

                })
                .catch(err => console.error("Error creating India mask:", err));

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
