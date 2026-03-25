import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useAppContext } from '../context/AppContext';
import { FaSearch, FaLayerGroup, FaLocationArrow, FaCamera } from 'react-icons/fa';

// Poly data for Hyderabad Zones
const zones = [
  { name: 'Kukatpally', risk: 'CRITICAL', color: '#FF3B3B', coords: [[17.4947, 78.3996], [17.5020, 78.4050], [17.4890, 78.4110], [17.4850, 78.3950]] },
  { name: 'Miyapur', risk: 'HIGH', color: '#FF3B3B', coords: [[17.4980, 78.3500], [17.5100, 78.3600], [17.4900, 78.3750], [17.4850, 78.3550]] },
  { name: 'Gachibowli', risk: 'LOW', color: '#00FF88', coords: [[17.4400, 78.3489], [17.4500, 78.3600], [17.4350, 78.3650], [17.4300, 78.3500]] },
  { name: 'Predicted Threat', risk: 'AI PREDICTED', color: '#00D4FF', coords: [[17.4800, 78.4200], [17.4850, 78.4350], [17.4700, 78.4300]], dashArray: '10, 10' }
];

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points || !L.heatLayer) return;
    const layer = L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 14, gradient: { 0.4: 'cyan', 0.6: 'yellow', 1.0: 'red' } }).addTo(map);
    return () => map.removeLayer(layer);
  }, [map, points]);
  return null;
};

export default function LiveMap() {
  const { realtimeData, t, gps } = useAppContext();
  const [layers, setLayers] = useState({ flood: true, risk: true, ai: true, reports: true, safe: false, heat: false });
  const [search, setSearch] = useState('');
  const [routeDrawer, setRouteDrawer] = useState(false);
  const [mapType, setMapType] = useState('dark'); // 'dark', 'satellite', 'street'
  const [safeBuildings, setSafeBuildings] = useState([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  useEffect(() => {
    if (gps?.valid && layers.safe && safeBuildings.length === 0) {
      const fetchBuildings = async () => {
        setLoadingBuildings(true);
        try {
          const query = `
            [out:json];
            (
              node["amenity"="hospital"](around:2000,${gps.lat},${gps.lng});
              node["amenity"="school"](around:2000,${gps.lat},${gps.lng});
              node["amenity"="community_centre"](around:2000,${gps.lat},${gps.lng});
            );
            out body;
          `;
          const res = await fetch(`https://overpass-api.de/api/interpreter`, {
            method: 'POST',
            body: query
          });
          const data = await res.json();
          if (data && data.elements) {
             const items = data.elements.filter(e => e.tags && e.tags.name).map(e => ({
                id: e.id, lat: e.lat, lon: e.lon, name: e.tags.name, type: e.tags.amenity,
                dist: Math.round(L.latLng(gps.lat, gps.lng).distanceTo(L.latLng(e.lat, e.lon)))
             }));
             setSafeBuildings(items);
          }
        } catch (e) {
          console.error("Overpass API failed", e);
        }
        setLoadingBuildings(false);
      };
      fetchBuildings();
    }
  }, [gps?.valid, gps?.lat, gps?.lng, layers.safe, safeBuildings.length]);

  // Generate fake heat points around Kukatpally based on report count
  const heatPoints = Array.from({ length: 50 }, () => [
    17.4947 + (Math.random() - 0.5) * 0.05,
    78.3996 + (Math.random() - 0.5) * 0.05,
    Math.random()
  ]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#040812] flex overflow-hidden">
      
      
      {/* Disclaimer */}
      <div className="absolute top-0 left-0 w-full z-40 bg-black/80 text-[#8892A4] text-xs text-center py-1">
        Data shown is simulated for demonstration. Live version connects to IMD weather API, ISRO satellite feeds, and IoT flood sensors.
      </div>

      {/* Location Denied Banner */}
      {gps?.denied && (
        <div className="absolute top-10 w-full z-[100] flex justify-center pointer-events-none mt-4">
           <div className="bg-[#FFB347] text-black px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,179,71,0.5)] border border-white/50 text-sm animate-pulse pointer-events-auto">
             Please enable Location Services for accurate emergency alerts.
           </div>
        </div>
      )}

      {/* Map Container */}
      <div className="absolute inset-x-0 top-6 bottom-0 z-0">
        <MapContainer center={gps?.valid ? [gps.lat, gps.lng] : [17.3850, 78.4867]} zoom={12} className="w-full h-full" zoomControl={false} attributionControl={false}>
          {mapType === 'dark' && <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />}
          {mapType === 'satellite' && (
            <>
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
            </>
          )}
          {mapType === 'street' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />}
          
          <ZoomControl position="bottomright" />

          {layers.flood && <Polygon positions={zones[0].coords} pathOptions={{ color: zones[0].color, fillColor: zones[0].color, fillOpacity: 0.4, className: 'animate-pulse' }} />}
          {layers.flood && <Polygon positions={zones[1].coords} pathOptions={{ color: zones[1].color, fillColor: zones[1].color, fillOpacity: 0.4 }} />}
          {layers.risk && <Polygon positions={zones[2].coords} pathOptions={{ color: zones[2].color, fillColor: zones[2].color, fillOpacity: 0.2 }} />}
          {layers.ai && <Polygon positions={zones[3].coords} pathOptions={{ color: zones[3].color, dashArray: zones[3].dashArray, fillOpacity: 0.1, weight: 3 }} />}
          
          {layers.reports && realtimeData.feed.map((_, i) => (
             <CircleMarker key={i} center={[17.45 + (Math.random()-0.5)*0.1, 78.4 + (Math.random()-0.5)*0.1]} radius={5} pathOptions={{ color: '#00D4FF', fillColor: '#00D4FF', fillOpacity: 1 }}>
               <Popup className="custom-popup">Community Report</Popup>
             </CircleMarker>
          ))}

          {/* User Live GPS Dot */}
          {gps?.valid && (
            <CircleMarker center={[gps.lat, gps.lng]} radius={6} pathOptions={{ color: '#4285F4', fillColor: '#4285F4', fillOpacity: 1, weight: 2 }} className="animate-pulse">
               <Popup className="custom-popup font-bold text-[#4285F4]">Your Location</Popup>
               <CircleMarker center={[gps.lat, gps.lng]} radius={15} pathOptions={{ color: 'transparent', fillColor: '#4285F4', fillOpacity: 0.3 }} className="animate-ping" />
            </CircleMarker>
          )}

          {/* Safe Buildings from Overpass API */}
          {layers.safe && safeBuildings.map(b => (
            <CircleMarker key={b.id} center={[b.lat, b.lon]} radius={7} pathOptions={{ color: '#00FF88', fillColor: '#00FF88', fillOpacity: 0.8, weight: 1 }}>
               <Popup className="custom-popup">
                  <div className="font-bold text-[#00FF88] mb-1">{b.name}</div>
                  <div className="text-[10px] text-white">Type: <span className="uppercase">{b.type.replace('_',' ')}</span></div>
                  <div className="text-[10px] text-white">Distance: {b.dist}m away</div>
                  <div className="text-[10px] text-[#00D4FF] mt-1 font-bold">Est. Capacity: {Math.floor(Math.random()*500)+100} people</div>
               </Popup>
            </CircleMarker>
          ))}

          {layers.heat && <HeatmapLayer points={heatPoints} />}
        </MapContainer>
        
        {/* CSS Rain Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI4IiBmaWxsPSIjMDBENDNGIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] animate-[rain_0.3s_linear_infinite]" />
      </div>

      {/* Top Map Toggle Controls */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex bg-[#0A0E1A] rounded-full border border-white/20 shadow-2xl overflow-hidden p-1">
        <button onClick={() => setMapType('dark')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${mapType === 'dark' ? 'bg-[#00D4FF] text-black' : 'text-white hover:bg-white/10'}`}>Dark View</button>
        <button onClick={() => setMapType('satellite')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${mapType === 'satellite' ? 'bg-[#00FF88] text-black' : 'text-white hover:bg-white/10'}`}>Satellite View</button>
        <button onClick={() => setMapType('street')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${mapType === 'street' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Street View</button>
      </div>

      {/* Left Control Panel */}
      <div className="absolute left-4 top-4 bottom-24 w-80 glass-card rounded-2xl z-20 flex flex-col overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 bg-[#040812]/50">
          <h2 className="font-orbitron font-bold text-[#00D4FF] mb-1">🗺️ FloodSynapse Map</h2>
          <div className="font-mono text-[10px] text-[#00FF88]">● Connection Stable (47ms)</div>
        </div>
        
        <div className="p-4 border-b border-white/10">
          <div className="relative mb-4">
            <input type="text" placeholder="Search location..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full bg-black/40 border border-[#8892A4]/30 rounded p-2 pl-8 text-sm text-white focus:border-[#00D4FF] outline-none" />
            <FaSearch className="absolute left-2.5 top-3 text-[#8892A4]" />
          </div>
          <div className="flex gap-2 text-[10px] font-mono">
             <button className="px-2 py-1 bg-[#00D4FF]/20 text-[#00D4FF] rounded hover:bg-[#00D4FF]/40 border border-[#00D4FF]/30">Kukatpally</button>
             <button className="px-2 py-1 bg-white/5 text-[#8892A4] rounded hover:bg-white/10 border border-white/10">Miyapur</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#8892A4] mb-3 flex items-center gap-2"><FaLayerGroup /> Map Layers</h3>
          <div className="space-y-3 font-dm text-sm text-white">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.flood} onChange={e => setLayers({...layers, flood: e.target.checked})} className="accent-[#FF3B3B] w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-[#FF3B3B] transition-colors">🔴 Flood Zones</span>
              <span className="text-[10px] bg-white/10 px-1 rounded">3</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.risk} onChange={e => setLayers({...layers, risk: e.target.checked})} className="accent-[#FFB347] w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-[#FFB347] transition-colors">🟡 Risk Areas</span>
              <span className="text-[10px] bg-white/10 px-1 rounded">7</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.ai} onChange={e => setLayers({...layers, ai: e.target.checked})} className="accent-[#00D4FF] w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-[#00D4FF] transition-colors">🔵 AI Predictions</span>
              <span className="text-[10px] bg-white/10 px-1 rounded">5</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.reports} onChange={e => setLayers({...layers, reports: e.target.checked})} className="accent-indigo-500 w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-indigo-400 transition-colors">📸 Community Reports</span>
              <span className="text-[10px] bg-white/10 px-1 rounded">{realtimeData.communityReports}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.safe} onChange={e => setLayers({...layers, safe: e.target.checked})} className="accent-[#00FF88] w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-[#00FF88] transition-colors flex items-center gap-2">🏥 Safe Buildings {loadingBuildings && <span className="animate-spin h-3 w-3 border-2 border-[#00FF88] border-t-transparent rounded-full" />}</span>
              {safeBuildings.length > 0 && <span className="text-[10px] bg-[#00FF88]/20 text-[#00FF88] px-1 rounded">{safeBuildings.length}</span>}
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={layers.heat} onChange={e => setLayers({...layers, heat: e.target.checked})} className="accent-[#FF3B3B] w-4 h-4 cursor-pointer" />
              <span className="flex-1 group-hover:text-[#FF3B3B] transition-colors">🔥 Density Heatmap</span>
            </label>
          </div>

          <h3 className="text-xs uppercase font-bold tracking-widest text-[#8892A4] mt-8 mb-3">Time Machine Slider</h3>
          <div className="mb-2 text-[#00D4FF] text-xs font-mono">NOW ●──────── +6hr</div>
          <input type="range" min="0" max="6" className="w-full accent-[#00D4FF]" />
        </div>
        
        <div className="p-4 bg-gradient-to-t from-[#040812] border-t border-white/10">
          <button onClick={() => setRouteDrawer(!routeDrawer)} className="w-full py-2 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 rounded font-bold font-space hover:bg-[#00D4FF] hover:text-black transition-colors">
            {routeDrawer ? 'Close Route Status' : 'View Safe Routes'}
          </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-4">
        <button className="w-12 h-12 bg-black/50 glass-card rounded-full flex items-center justify-center text-white text-xl hover:text-[#00D4FF] border border-white/20 transition-colors">
          <FaLocationArrow />
        </button>
        <button onClick={() => navigate('/report')} className="group flex items-center gap-3 w-14 h-14 bg-[#FF3B3B] text-white rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,59,59,0.5)] hover:bg-red-500 animate-pulse-ring hover-lift">
          <FaCamera />
          <span className="absolute right-16 whitespace-nowrap bg-[#FF3B3B] px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Report Flood Here
          </span>
        </button>
      </div>

      {/* Bottom Route Drawer */}
      <div className={`absolute bottom-0 left-[340px] right-24 glass-card bg-[#0A0E1A]/95 border-t border-[#00FF88]/30 rounded-t-2xl z-20 transition-transform duration-300 ${routeDrawer ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-4 flex gap-6 overflow-x-auto scrollbar-thin">
          <div className="min-w-[250px] bg-red-500/10 border-l-4 border-red-500 p-3 rounded text-white">
             <div className="text-xs text-[#8892A4] mb-1">Route A: Direct</div>
             <div className="font-bold text-red-500 flex items-center gap-2">⚠️ BLOCKED - 12m</div>
             <div className="text-[10px] text-white/50 mt-1">NH65 Flooded. Avoid.</div>
          </div>
          <div className="min-w-[250px] bg-[#00FF88]/10 border-l-4 border-[#00FF88] p-3 rounded text-white">
             <div className="text-xs text-[#00FF88] font-bold mb-1">Route B: Gachibowli ✓ AI RECOMMENDED</div>
             <div className="font-bold text-white flex items-center gap-2">🟢 SAFE - 20m</div>
             <div className="mt-2"><button className="px-3 py-1 bg-[#00FF88] text-black text-xs font-bold rounded">Navigate</button></div>
          </div>
        </div>
      </div>

    </div>
  );
}
