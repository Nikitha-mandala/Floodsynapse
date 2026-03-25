import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { generateDashboardInsight } from '../services/floodAI';
import { FaDownload, FaMapMarkedAlt, FaCamera, FaRoute } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function Dashboard() {
  const navigate = useNavigate();
  const { realtimeData, showToast, t } = useAppContext();
  const [insight, setInsight] = useState('Loading AI Analysis...');

  useEffect(() => {
    const fetchInsight = async () => {
      const res = await generateDashboardInsight({
        rainfall: realtimeData.rainfall,
        river: realtimeData.riverLevel,
        reports: realtimeData.communityReports
      });
      setInsight(res);
    };
    fetchInsight();
  }, [realtimeData.rainfall, realtimeData.riverLevel, realtimeData.communityReports]);

  // Risk calculation
  const isDanger = realtimeData.riverLevel > 7.3;
  const riskClass = isDanger ? 'border-[#FF3B3B] from-[#FF3B3B]/20 to-[#FF3B3B]/5 glow-red' : 'border-[#FFB347]/50 from-[#FFB347]/20 to-[#FFB347]/5 shadow-[0_0_20px_rgba(255,179,71,0.2)]';
  const riskLabel = isDanger ? '🔴 CRITICAL RISK' : '⚠️ MODERATE RISK';

  const handleListen = () => {
    const text = `Current rainfall is ${realtimeData.rainfall.toFixed(1)} millimeters. Musi river level is at ${realtimeData.riverLevel.toFixed(1)} meters. You have ${realtimeData.activeAlerts} active alerts. Please stay indoors.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    showToast("Reading dashboard info via Text-to-Speech...");
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6">
      <div className="bg-black/80 border border-white/10 rounded-lg p-3 text-center text-xs text-[#8892A4]">
        Data shown is simulated for demonstration. Live version connects to IMD weather API, ISRO satellite feeds, and IoT flood sensors.
      </div>

      {/* Hero Risk Card */}
      <div className={`w-full glass-card rounded-2xl p-6 md:p-10 bg-gradient-to-r flex flex-col lg:flex-row gap-8 justify-between items-center ${riskClass}`}>
        <div className="flex-1">
          <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 border-current border mb-4 font-mono font-bold text-sm">
            {riskLabel}
          </div>
          <button onClick={handleListen} className="ml-4 px-4 py-1.5 bg-[#00D4FF]/20 hover:bg-[#00D4FF] hover:text-black text-[#00D4FF] rounded-full text-xs font-bold border border-[#00D4FF]/50 inline-flex items-center gap-2 transition-colors">
            🔊 Listen to Report
          </button>
          <h2 className="text-3xl md:text-5xl font-inter font-bold text-white mb-2 tracking-wide">{t('title.dashboard')}</h2>
          <p className="text-[#8892A4] font-space text-lg">Kukatpally, Miyapur, KPHB — HIGH RISK ZONES</p>
        </div>

        <div className="flex-1 flex flex-col lg:items-center justify-center border-y lg:border-none border-white/10 py-6 lg:py-0">
          <div className="text-center">
            <h3 className="text-[#F0F4FF] font-mono text-sm mb-4 tracking-widest uppercase">AI Confidence Target</h3>
            <div className="relative w-32 h-32 mx-auto mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={isDanger ? "#FF3B3B" : "#FFB347"} strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.78)} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-orbitron font-bold">78%</span>
              </div>
            </div>
            <p className="text-xs text-[#8892A4] font-dm">Expected in {isDanger ? '1.2' : '3.5'} - 5 hours</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 w-full lg:w-auto self-end">
          <button onClick={() => navigate('/map')} className="w-full lg:w-48 py-3 rounded border border-[#00D4FF] text-[#00D4FF] font-space font-bold hover:bg-[#00D4FF] hover:text-[#040812] transition-colors flex items-center justify-center gap-2 glow-cyan"><FaMapMarkedAlt /> View Map</button>
          <button onClick={() => navigate('/report')} className="w-full lg:w-48 py-3 rounded border border-[#FF3B3B] text-[#FF3B3B] font-space font-bold hover:bg-[#FF3B3B] hover:text-white transition-colors flex items-center justify-center gap-2 glow-red"><FaCamera /> Report Now</button>
          <button onClick={() => navigate('/routes')} className="w-full lg:w-48 py-3 rounded border border-[#00FF88] text-[#00FF88] font-space font-bold hover:bg-[#00FF88] hover:text-[#040812] transition-colors flex items-center justify-center gap-2"><FaRoute /> Safe Routes</button>
          <button onClick={() => {
            const msg = `✅ I am SAFE in Kukatpally. Current area risk is ${isDanger ? 'HIGH' : 'LOW'}. Verified via FloodSynapse.`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
          }} className="w-full lg:w-48 py-3 rounded border border-[#25D366] text-[#25D366] font-space font-bold hover:bg-[#25D366] hover:text-[#040812] transition-colors flex items-center justify-center gap-2 glow-cyan mt-2">
            💬 WhatsApp Status
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-[#00D4FF] relative">
          <span className={`absolute top-2 right-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${realtimeData.isLive ? 'bg-[#00FF88] text-[#040812]' : 'bg-[#1a2236] text-[#8892A4] border border-[#8892A4]/30'}`}>
            {realtimeData.isLive ? 'LIVE DATA VIA OPEN-METEO' : 'SIMULATED DEMO DATA'}
          </span>
          <h4 className="text-[#8892A4] font-mono text-xs uppercase mb-2">Rainfall Today</h4>
          <div className="text-4xl font-mono text-[#F0F4FF] mb-2">{realtimeData.rainfall.toFixed(1)}<span className="text-xl">mm</span></div>
          <div className="text-[#FF3B3B] text-xs font-bold mb-4 flex items-center gap-1">↑ +8mm vs yesterday</div>
          <p className="text-[10px] text-[#8892A4]">IMD Forecast: 12mm more by 6PM</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-[#FF3B3B]">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[#8892A4] font-mono text-xs uppercase mb-2">Active Alerts</h4>
              <div className="text-4xl font-mono text-[#F0F4FF] mb-2">{realtimeData.activeAlerts}</div>
            </div>
            <div className="bg-[#FF3B3B]/20 border border-[#FF3B3B] text-[#FF3B3B] text-[10px] px-2 py-1 rounded animate-pulse">3 CRITICAL</div>
          </div>
          <p className="text-xs text-[#8892A4] truncate mb-2">Kukatpally ● Miyapur ● LB Nagar</p>
          <p className="text-[10px] text-[#8892A4]">Last alert: 12 mins ago</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-[#00FFB3]">
          <h4 className="text-[#8892A4] font-mono text-xs uppercase mb-2">Community Reports</h4>
          <div className="text-4xl font-mono text-[#F0F4FF] mb-2">{realtimeData.communityReports}</div>
          <div className="text-[#00FF88] text-xs font-bold mb-4 flex items-center gap-1">↑ 34 in last hour</div>
          <div className="flex -space-x-2">
             {[1,2,3,4,5].map(i => <div key={i} className={`w-6 h-6 rounded-full border border-[#040812] bg-[#00D4FF]/20 flex items-center justify-center text-[10px]`}>U{i}</div>)}
             <span className="text-[10px] text-[#8892A4] ml-4 self-center">87% AI Verified</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-[#FFB347]">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[#8892A4] font-mono text-xs uppercase mb-2">Blocked Roads</h4>
              <div className="text-4xl font-mono text-[#F0F4FF] mb-2">{realtimeData.blockedRoads}</div>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#FF3B3B] animate-ping" />
          </div>
          <p className="text-xs text-[#8892A4] mb-4">NH65 ● Ring Road ● Tolichowki</p>
          <button className="text-[#00D4FF] text-xs hover:underline" onClick={() => navigate('/routes')}>View All Routes →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column 60% */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Prediction Timeline WIdget */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-space font-bold mb-6 flex items-center gap-2">⏱️ Flood Risk Timeline — Next 12 Hours</h3>
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex justify-between min-w-[700px] gap-2 px-2">
                {[
                  {t:'NOW', r: 12, mm:2}, {t:'+1hr', r:28, mm:5}, {t:'+2hr', r:45, mm:8},
                  {t:'+3hr', r:67, mm:12}, {t:'+4hr', r:84, mm:14, peak:true}, {t:'+5hr', r:89, mm:10},
                  {t:'+6hr', r:82, mm:5}, {t:'+8hr', r:71, mm:2}, {t:'+12hr', r:34, mm:0}
                ].map((pt, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative group cursor-pointer hover-lift">
                     <div className="text-xs text-[#8892A4] font-mono mb-2">{pt.t}</div>
                     <div className="relative flex flex-col justify-end h-24 w-8 bg-white/5 rounded-t overflow-hidden mb-2">
                       <div 
                         className={`w-full transition-all duration-1000 ${pt.r > 80 ? 'bg-[#FF3B3B]' : pt.r > 50 ? 'bg-[#FFB347]' : 'bg-[#00FF88]'}`} 
                         style={{ height: `${pt.r}%` }}
                       />
                     </div>
                     {pt.peak && <div className="absolute -top-4 w-2 h-2 rounded-full bg-[#FF3B3B] animate-ping" />}
                     <div className="text-xs font-bold text-white">{pt.r}%</div>
                     <div className="text-[10px] text-[#00D4FF]">{pt.mm}mm</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass-card p-6 border-l-4 border-l-[#00D4FF] rounded-r-2xl glow-cyan bg-gradient-to-r from-[#00D4FF]/5 to-transparent">
             <div className="flex items-center gap-2 mb-3">
               <span className="text-[#00D4FF] animate-pulse">🧠</span>
               <h4 className="font-space font-bold text-[#00D4FF]">FloodSynapse AI Insight</h4>
             </div>
             <p className="font-dm text-sm leading-relaxed text-[#F0F4FF]">{insight}</p>
          </div>

          {/* Live Community Feed */}
          <div className="glass-card p-6 rounded-2xl h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-space font-bold flex items-center gap-2 text-[#00FFB3]">📡 Live Community Reports</h3>
              <div className="flex gap-2 text-xs font-mono">
                <button className="px-3 py-1 bg-[#00FFB3]/20 text-[#00FFB3] rounded">All</button>
                <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 text-[#8892A4]">Photos</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
              {realtimeData.feed.map(rep => (
                <div key={rep.id} className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          {rep.name}
                          {rep.trust > 0 && <span className="text-[10px] text-[#FFB347] bg-[#FFB347]/10 px-1 rounded border border-[#FFB347]/30">⭐ {rep.trust}</span>}
                        </div>
                        <div className="text-xs text-[#8892A4]">
                          {rep.type === 'photo' ? '📸 Photo' : rep.type === 'voice' ? '🎤 Voice' : '📍 Pin'} | {rep.loc} | {rep.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  {rep.type === 'photo' && (
                    <div className="w-full h-32 bg-[#040812] rounded-lg mb-3 flex items-center justify-center border border-white/5 text-[#8892A4] text-3xl overflow-hidden relative group cursor-pointer">
                      <FaCamera className="opacity-20" />
                      <div className="absolute inset-0 bg-[#00D4FF]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-[#00D4FF] text-sm">View</div>
                    </div>
                  )}
                  {rep.type === 'voice' && (
                    <div className="w-full bg-[#040812] p-3 rounded-lg mb-3 flex items-center gap-3 border border-white/5 text-sm text-[#8892A4]">
                       <button className="w-8 h-8 rounded-full bg-[#00D4FF] text-black flex items-center justify-center text-xs">▶</button>
                       <span className="italic">" {rep.text} "</span>
                    </div>
                  )}
                  <div className="text-xs p-2 rounded bg-white/5 border-l-2 border-[#00FFB3] mb-3">
                    <span className="text-[#00FFB3] font-bold">AI Analysis:</span> {rep.ai}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-[#00FF88] flex items-center gap-1">✓ AI Confirmed</span>
                    <span className="text-white/20">|</span>
                    <span className="text-xs text-[#8892A4]">5 verifications</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => showToast()} className="w-full mt-4 py-2 border border-white/10 rounded text-xs text-[#8892A4] hover:bg-white/5 font-mono">Load More ↓</button>
          </div>

        </div>

        {/* Right Column 40% */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mini Map */}
          <div className="glass-card rounded-2xl overflow-hidden relative h-[400px] border border-white/10">
            <div className="absolute top-0 w-full z-10 bg-gradient-to-b from-[#0A0E1A]/90 p-4 pb-8 flex justify-between items-center pointer-events-none">
              <h3 className="font-space font-bold text-white flex items-center gap-2">🗺️ Live Flood Map — Hub</h3>
              <span className="text-xs font-mono text-[#00FF88] bg-[#00FF88]/10 px-2 py-1 rounded">LIVE</span>
            </div>
            <MapContainer center={[17.4947, 78.3996]} zoom={11} className="w-full h-full z-0" zoomControl={false} attributionControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <CircleMarker center={[17.4947, 78.3996]} radius={15} color="#FF3B3B" fillColor="#FF3B3B" fillOpacity={0.4} className="animate-pulse" />
              <CircleMarker center={[17.4399, 78.4983]} radius={10} color="#FFB347" fillColor="#FFB347" fillOpacity={0.4} />
              <CircleMarker center={[17.3850, 78.4867]} radius={12} color="#00D4FF" fillColor="#00D4FF" fillOpacity={0.2} pathOptions={{ dashArray: '5, 5' }} />
            </MapContainer>
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
              <button className="pointer-events-auto w-full py-3 glass-card bg-black/50 text-[#00D4FF] hover:text-white rounded-xl border border-[#00D4FF]/30 hover:bg-[#00D4FF]/20 transition-colors font-bold text-sm tracking-wide glow-cyan">
                🗺️ Open Full Map →
              </button>
            </div>
          </div>

          {/* Environmental Sensors */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="font-space font-bold mb-6 flex items-center gap-2 text-white">🌡️ Environmental Sensors</h3>
            
            <div className="grid grid-cols-1 gap-6 mb-4">
              {/* Thermometer Visual River Gauge */}
              <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-[#1a2236] text-[#8892A4] border border-[#8892A4]/30 px-1 rounded uppercase">Simulated Demo Data</span>
                <div className="text-[#8892A4] text-[10px] font-mono mb-4 text-center tracking-widest uppercase">Musi River Depth Gauge</div>
                
                <div className="flex items-end justify-center gap-8 h-48 relative">
                   {/* Thermometer Container */}
                   <div className="w-16 h-48 bg-black/50 border border-white/20 rounded-full relative overflow-hidden flex flex-col justify-end p-1">
                      {/* Scale Marks */}
                      <div className="absolute inset-y-0 left-full ml-2 flex flex-col justify-between text-[10px] text-[#8892A4] py-2 font-mono">
                        <span>10m</span>
                        <span>7.5m (Danger)</span>
                        <span>5m (Warn)</span>
                        <span>2.5m (Safe)</span>
                        <span>0m</span>
                      </div>
                      
                      {/* Water Fill */}
                      <div 
                        className={`w-full rounded-full transition-all duration-1000 origin-bottom ${realtimeData.riverLevel > 7.5 ? 'bg-[#FF3B3B]' : realtimeData.riverLevel > 5 ? 'bg-[#FFB347]' : 'bg-[#00D4FF]'}`} 
                        style={{ height: `${Math.min(realtimeData.riverLevel / 10 * 100, 100)}%` }}
                      >
                         <div className="w-full h-2 bg-white/30 absolute top-0 animate-[rise_2s_infinite]"></div>
                      </div>
                   </div>
                   <div className="flex flex-col text-center">
                     <span className={`text-5xl font-bold font-mono ${realtimeData.riverLevel > 7.5 ? 'text-[#FF3B3B]' : realtimeData.riverLevel > 5 ? 'text-[#FFB347]' : 'text-[#00D4FF]'}`}>
                       {realtimeData.riverLevel.toFixed(1)}m
                     </span>
                     <span className="text-[#8892A4] text-xs">Current Level</span>
                   </div>
                </div>
                <div className="text-center mt-3 text-[9px] text-[#8892A4]">Live version connects to Central Water Commission IoT Sensors.</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
                <div className="text-[#8892A4] text-[10px] font-mono mb-1">💧 HUMIDITY</div>
                <div className="text-2xl font-bold flex items-end gap-1 text-[#00D4FF]">
                  89<span className="text-xs text-[#8892A4] mb-1">%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded mt-2">
                  <div className="h-full bg-[#00D4FF] rounded w-[89%]" />
                </div>
              </div>
              
              <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
                <div className="text-[#8892A4] text-[10px] font-mono mb-1">🌡️ TEMPERATURE</div>
                <div className="text-xl font-bold text-white mb-1">28°C</div>
                <div className="text-xs text-[#FFB347]">Feels like 33°C</div>
              </div>

              <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
                <div className="text-[#8892A4] text-[10px] font-mono mb-1">📡 SENSORS</div>
                <div className="text-xl font-bold text-[#00FF88] mb-1">12/15 Online</div>
                <div className="text-xs text-[#FF3B3B]">3 Offline (Power loss)</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center text-[10px] text-[#8892A4] font-mono border-t border-white/5 pt-4">
              <span>Sat Pass: 47m ago</span>
              <span>⚡ High Lightning (12/hr)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Zone Breakdown */}
      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-space font-bold flex items-center gap-2">📊 Zone-wise Risk Assessment</h3>
          <button onClick={() => showToast('Simulating CSV Download... Check your downloads folder.')} className="text-[#00D4FF] text-xs font-mono border border-[#00D4FF]/30 px-3 py-1.5 rounded hover:bg-[#00D4FF]/10 flex items-center gap-2">
            <FaDownload /> CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-dm">
            <thead className="bg-[#0A0E1A] text-[#8892A4] font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Reports</th>
                <th className="px-6 py-4">River Proxm</th>
                <th className="px-6 py-4">Elev.</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {[
                {z:'Kukatpally', r:'CRITICAL', c:'text-[#FF3B3B]', loc:34, pr:'0.8km', e:'498m', st:'Evacuate'},
                {z:'Miyapur', r:'HIGH', c:'text-[#FF3B3B]', loc:28, pr:'1.2km', e:'502m', st:'Evacuate'},
                {z:'LB Nagar', r:'MEDIUM', c:'text-[#FFB347]', loc:19, pr:'2.1km', e:'489m', st:'Monitor'},
                {z:'Gachibowli', r:'LOW', c:'text-[#00FF88]', loc:3, pr:'5.2km', e:'512m', st:'Safe'},
                {z:'Amberpet', r:'CRITICAL', c:'text-[#FF3B3B]', loc:41, pr:'0.6km', e:'486m', st:'EVACUATE NOW'}
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold">{row.z}</td>
                  <td className={`px-6 py-4 font-bold font-mono tracking-widest flex items-center gap-2 ${row.c}`}>
                    <span className={`w-2 h-2 rounded-full ${row.c.replace('text-', 'bg-')} ${row.r==='CRITICAL'?'animate-ping':''}`}></span>
                    {row.r}
                  </td>
                  <td className="px-6 py-4 font-mono">{row.loc}</td>
                  <td className="px-6 py-4 text-[#8892A4]">{row.pr}</td>
                  <td className="px-6 py-4 text-[#8892A4]">{row.e}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${row.r==='CRITICAL'||row.r==='HIGH'?'bg-[#FF3B3B]/20 text-[#FF3B3B]':'bg-[#00D4FF]/20 text-[#00D4FF]'}`}>
                      {row.st}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dashboard product roadmap (Moved to side/removed here per new requirements for dedicated Roadmap page) */}


    </div>
  );
}
