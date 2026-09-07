import { useState, useEffect } from 'react';
import './App.css';
import GISMap from './components/Map/GISMap';
import LocationPanel from './components/Dashboard/LocationPanel';
import { api } from './services/api';

function App() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch data status on load
    api.getDataStatus().then(res => setStatus(res)).catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (location) {
      setData(null); // set loading state
      // Fetch hazard analysis
      api.getHazard(location.lat, location.lon)
        .then(res => setData(res))
        .catch(e => console.error(e));
    }
  }, [location]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Landslide Intelligence Engine (SIH 2026)</h1>
        <div className="status-indicators">
          {status && status.data_sources.map((src: any, i: number) => (
            <span key={i} className={`indicator ${src.status === 'DEMO MODE' ? 'demo' : 'ok'}`} title={src.name}>
              {src.name}: {src.status}
            </span>
          ))}
        </div>
      </header>

      <main className="app-content">
        <div className="map-view">
          <GISMap onLocationClick={setLocation} />
        </div>
        <div className="panel-view">
          <LocationPanel location={location} data={data} />
        </div>
      </main>
    </div>
  );
}

export default App;
