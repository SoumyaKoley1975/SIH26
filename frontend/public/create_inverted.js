const fs = require('fs');

try {
    const raw = fs.readFileSync('india.geojson', 'utf8');
    const indiaData = JSON.parse(raw);

    const worldCoords = [
        [
            [-180, 90],
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90]
        ]
    ];

    const features = indiaData.features || [indiaData]; // fallback if it's just a Feature

    features.forEach(feature => {
        if (!feature.geometry) return;
        if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
                worldCoords.push(polygon[0]);
            });
        } else if (feature.geometry.type === 'Polygon') {
            worldCoords.push(feature.geometry.coordinates[0]);
        }
    });

    const invertedGeojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: worldCoords
                },
                properties: {}
            }
        ]
    };

    fs.writeFileSync('world_mask.geojson', JSON.stringify(invertedGeojson), 'utf8');
    console.log("Success");
} catch (e) {
    fs.writeFileSync('err.txt', e.stack, 'utf8');
}
