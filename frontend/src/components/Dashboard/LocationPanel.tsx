import './Dashboard.css';

interface LocationPanelProps {
    data: any;
    location: { lat: number; lon: number } | null;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ data, location }) => {
    if (!location) {
        return (
            <div className="location-panel empty">
                <h3>Location Analysis</h3>
                <p>Click on the map to analyze a location.</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="location-panel loading">
                <h3>Loading Analysis...</h3>
                <p>Fetching satellite and ml inferences...</p>
            </div>
        );
    }

    return (
        <div className="location-panel">
            <div className="panel-header">
                <h2>Location Analysis</h2>
                <span className="demo-badge">DEMO MODE</span>
            </div>

            <div className="coord-box">
                Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
            </div>

            <div className={`status-pill status-${data.level.toLowerCase()}`}>
                Hazard Status: {data.level}
            </div>

            <div className="score-section">
                <h3>Hazard Score: {data.hazard_score}/100</h3>
                <div className="score-bar-bg">
                    <div className="score-bar-fill" style={{ width: `${data.hazard_score}%`, backgroundColor: getScoreColor(data.hazard_score) }}></div>
                </div>
            </div>

            <div className="components-grid">
                <div className="component-card">
                    <span className="comp-label">Susceptibility</span>
                    <span className="comp-val" style={{ color: getScoreColor(data.components.susceptibility) }}>{data.components.susceptibility}</span>
                </div>
                <div className="component-card">
                    <span className="comp-label">Rainfall Trigger</span>
                    <span className="comp-val" style={{ color: getScoreColor(data.components.trigger) }}>{data.components.trigger}</span>
                </div>
                <div className="component-card">
                    <span className="comp-label">Soil Moisture</span>
                    <span className="comp-val" style={{ color: getScoreColor(data.components.soil_moisture) }}>{data.components.soil_moisture}</span>
                </div>
                <div className="component-card">
                    <span className="comp-label">Ground Movement</span>
                    <span className="comp-val" style={{ color: getScoreColor(data.components.ground_movement) }}>{data.components.ground_movement}</span>
                </div>
            </div>

            <div className="explainer-box">
                <h4>Why {data.level}?</h4>
                <ul>
                    {data.explanation.map((exp: string, i: number) => (
                        <li key={i}>{exp}</li>
                    ))}
                </ul>
                <div className="recommendation">
                    <strong>Recommendation:</strong> {data.recommendation}
                </div>
            </div>
        </div>
    );
};

const getScoreColor = (score: number) => {
    if (score < 40) return '#2ecc71';
    if (score < 60) return '#f1c40f';
    if (score < 80) return '#e67e22';
    return '#e74c3c';
};

export default LocationPanel;
