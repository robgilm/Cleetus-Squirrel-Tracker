import { useState, useEffect } from 'react'
import './App.css'

interface Driver {
  vehicle_number: string;
  driver_name: string;
  running_position: number;
  delta: string;
  laps_completed: number;
  status: string;
}

interface RaceData {
  flag_state: number | string;
  lap_number: number;
  vehicles: Driver[];
}

function App() {
  const [data, setData] = useState<RaceData | null>(null);
  const [error, setError] = useState<string | null>(null);
const fetchData = async () => {
  try {
    // In dev, use the Vite proxy; in production (EXE), fetch directly.
    const url = import.meta.env.DEV 
      ? '/live-api/live/feeds/live-feed.json' 
      : 'https://cf.nascar.com/live/feeds/live-feed.json';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch race data');
    const json = await response.json();
    console.log('Race Data:', json);
    setData(json);
    setError(null);
  } catch (err) {
    console.error('Fetch error:', err);
    setError('Race data unavailable');
  }
};

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const vehicles = data?.vehicles || [];
  const mitchell: any = vehicles.find(v => v.vehicle_number === '30' || v.driver_name?.toUpperCase().includes('MITCHELL'));
  const siciliano: any = vehicles.find(v => v.vehicle_number === '0' || v.driver_name?.toUpperCase().includes('SICILIANO'));

  const getPos = (driver: any) => {
    if (!driver) return '---';
    return driver.running_position || driver.position || '---';
  };

  const getFlagColor = (flag: any) => {
    const s = String(flag || '').toLowerCase();
    if (s.includes('green') || flag === 1) return '#2ecc71';
    if (s.includes('yellow') || flag === 2) return '#f1c40f';
    if (s.includes('red') || flag === 3) return '#e74c3c';
    if (s.includes('white') || flag === 4) return '#ffffff';
    if (s.includes('checkered') || flag === 5 || flag === 6) return '#000000';
    return '#34495e';
  };

  const getFlagName = (flag: any) => {
    if (flag === 1) return 'GREEN';
    if (flag === 2) return 'YELLOW';
    if (flag === 3) return 'RED';
    if (flag === 4) return 'WHITE';
    if (flag === 5 || flag === 6) return 'CHECKERED';
    return String(flag || 'LOADING...');
  };

  return (
    <div className="widget-container">
      <div className="header" style={{ borderLeft: `8px solid ${getFlagColor(data?.flag_state)}` }}>
        <span className="race-status">{getFlagName(data?.flag_state)}</span>
        <span className="lap-count">LAP {data?.lap_number || 0}</span>
      </div>

      <div className="driver-row">
        <div className="car-number">#30</div>
        <div className="driver-info">
          <div className="name">MITCHELL</div>
          <div className="pos">{mitchell ? `P${getPos(mitchell)}` : '---'}</div>
        </div>
      </div>

      <div className="driver-row">
        <div className="car-number">#0</div>
        <div className="driver-info">
          <div className="name">SICILIANO</div>
          <div className="pos">{siciliano ? `P${getPos(siciliano)}` : '---'}</div>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => fetchData()} style={{fontSize: '8px', display: 'block', margin: '5px auto'}}>Retry</button>
        </div>
      )}
    </div>
  )
}

export default App
