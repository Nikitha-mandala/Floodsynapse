import React, { useState } from 'react';
import { getRouteRecommendation } from '../services/floodAI';
import { useAppContext } from '../context/AppContext';
import { FaMapMarkerAlt, FaFlagCheckered, FaCar, FaMotorcycle, FaWalking, FaAmbulance, FaSearch, FaVolumeUp } from 'react-icons/fa';

export default function RoutePlanner() {
  const { realtimeData, showToast, t } = useAppContext();
  const [from, setFrom] = useState('Kukatpally');
  const [to, setTo] = useState('');
  const [mode, setMode] = useState('car');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if(!from || !to) return;
    setLoading(true);
    const rec = await getRouteRecommendation(from, to);
    setResult(rec);
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6 text-white overflow-hidden">
      
      <div className="mb-8">
        <h1 className="text-3xl font-inter font-bold text-[#00FF88] mb-2 flex items-center gap-3">
          {t('title.routes')}
        </h1>
        <p className="text-[#8892A4] text-sm">Get real-time safe routing avoiding all flooded zones and blocked paths.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Route Input */}
        <div className="w-full xl:w-1/3 glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-6 self-start">
          <div className="relative border-l-2 border-white/20 ml-2 pl-6 py-2">
            <div className="absolute top-4 -left-3.5 w-6 h-6 rounded-full bg-[#040812] border-2 border-[#00D4FF] flex items-center justify-center text-[10px] text-[#00D4FF]">⚬</div>
            <div className="absolute bottom-4 -left-3.5 w-6 h-6 rounded-full bg-[#040812] border-2 border-[#FFB347] flex items-center justify-center text-[10px] text-[#FFB347]">⚬</div>
            
            <div className="mb-6">
              <label className="text-xs font-mono text-[#8892A4] uppercase tracking-widest mb-2 block">Starting Point</label>
              <div className="flex bg-[#0A0E1A] border border-white/10 rounded overflow-hidden p-1">
                <input value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-transparent p-2 text-white outline-none" />
                <button className="bg-white/5 px-3 text-xs text-[#00D4FF] hover:bg-white/10 transition-colors whitespace-nowrap">GPS</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#8892A4] uppercase tracking-widest mb-2 block">Destination</label>
              <div className="flex bg-[#0A0E1A] border border-[#00D4FF]/30 glow-cyan rounded overflow-hidden p-1">
                <input placeholder="Search destination..." value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-transparent p-2 text-white outline-none" />
              </div>
              <div className="flex gap-2 mt-3 font-mono text-[10px]">
                {['Home', 'Work', 'Hospital', 'Shelter'].map(q => (
                  <button key={q} onClick={() => setTo(q)} className="px-2 py-1 border border-white/10 rounded text-[#8892A4] hover:bg-white/10 hover:text-white transition-colors">{q}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[#8892A4] uppercase tracking-widest mb-3 block">Travel Mode</label>
            <div className="grid grid-cols-4 gap-2">
               {[ {id:'car', icon:<FaCar/>}, {id:'bike', icon:<FaMotorcycle/>}, {id:'walk', icon:<FaWalking/>}, {id:'ems', icon:<FaAmbulance/>} ].map(m => (
                 <button key={m.id} onClick={() => setMode(m.id)} className={`py-3 flex justify-center text-xl rounded ${mode === m.id ? 'bg-[#00D4FF] text-[#040812]' : 'bg-white/5 border border-white/10 text-[#8892A4] hover:text-white'}`}>
                    {m.icon}
                 </button>
               ))}
            </div>
          </div>

          <button onClick={handleSearch} disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-black font-bold font-space rounded shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2">
            <FaSearch /> {loading ? 'CALCULATING...' : 'FIND SAFE ROUTES'}
          </button>
        </div>

        {/* Route Results */}
        <div className="w-full xl:w-2/3 flex flex-col gap-6">
          {!result && !loading && (
             <div className="flex-1 glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center opacity-50 border-dashed border-2 border-white/10">
               <div className="text-[#00D4FF] text-6xl mb-6">🗺️</div>
               <h3 className="font-space font-bold text-xl mb-2">Enter Destination</h3>
               <p className="font-dm text-sm max-w-sm">Enter your destination to instantly calculate paths avoiding {realtimeData.blockedRoads} blocked roads and active flood zones.</p>
             </div>
          )}

          {loading && (
            <div className="flex-1 glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center border-[#00D4FF]/30 glow-cyan">
              <div className="w-16 h-16 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin mb-6" />
              <div className="text-[#00FF88] font-orbitron font-bold text-xl animate-pulse tracking-widest">Routing through 145 checkpoints...</div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
              
              <div className="glass-card p-6 border-l-4 border-l-[#FF3B3B] bg-red-900/10 rounded-r-xl">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-space font-bold text-[#FF3B3B] text-lg">🔴 Route A: Direct Route (4.2 km)</h3>
                   <span className="font-mono text-[#FF3B3B]">~12 min</span>
                 </div>
                 <div className="bg-[#FF3B3B] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded inline-block mb-3 animate-pulse">⚠️ PARTIALLY FLOODED — AVOID</div>
                 <p className="text-sm font-dm mb-2">Blockage: NH65 between Miyapur X-road and KPHB flooded (2.3ft water)</p>
                 <div className="flex justify-between items-end">
                   <p className="text-xs text-[#8892A4] font-mono">14 users reported | AI Warning: Worsening in 20 min</p>
                   <button onClick={() => showToast()} className="px-4 py-1.5 border border-[#FF3B3B]/50 hover:bg-[#FF3B3B]/20 text-[#FF3B3B] rounded text-sm transition-colors">Avoid Route</button>
                 </div>
              </div>

              <div className="glass-card p-8 border-l-8 border-l-[#00FF88] bg-[#00FF88]/5 glow-cyan rounded-r-xl shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-[#00FF88] text-black font-bold font-mono text-[10px] px-3 py-1 rounded-bl-lg tracking-widest">🏆 AI RECOMMENDED</div>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-space font-bold text-[#00FFB3] text-xl">🟢 Route B: Via Gachibowli (6.1 km)</h3>
                   <span className="font-mono text-[#00FFB3] text-lg">~20 min</span>
                 </div>
                 <div className="flex gap-2 mb-4">
                   <span className="bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded inline-block">✅ 100% SAFE</span>
                   <span className="bg-white/10 border border-white/20 text-[#8892A4] text-[10px] uppercase font-bold px-2 py-0.5 rounded inline-block">+8 minutes longer</span>
                 </div>
                 <p className="text-sm font-dm mb-6 text-[#F0F4FF] opacity-90">Recommended by AI based on 0 flood reports and high elevation path on this route.</p>
                 <button onClick={() => showToast('Navigation started in live version!')} className="w-full py-4 bg-[#00FF88] text-black font-bold font-space text-lg rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:bg-[#00FFB3] transition-colors leading-none tracking-wide">
                   🧭 START SAFE NAVIGATION
                 </button>
              </div>

              <div className="glass-card p-6 border-l-4 border-l-[#00D4FF] rounded-r-xl">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-space font-bold text-[#00D4FF] text-lg">🔵 Route C: Via ORR (8.4 km)</h3>
                   <span className="font-mono text-[#00D4FF]">~27 min</span>
                 </div>
                 <div className="bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded inline-block mb-3">✅ EXPRESSWAY SAFE</div>
                 <p className="text-sm font-dm mb-2">+15 min detour but highest safety guarantee for emergency vehicles.</p>
                 <div className="flex justify-end">
                   <button className="px-4 py-1.5 border border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10 hover:text-white rounded text-sm transition-colors">Select Route</button>
                 </div>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border-l-4 border-[#00D4FF]">
                <h4 className="flex items-center gap-2 font-bold mb-3 text-[#00D4FF]">🧠 AI Route Narrative</h4>
                <p className="text-sm font-dm leading-relaxed text-[#F0F4FF] italic">"{result}"</p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Live Road Status Table */}
      <div className="glass-card rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0E1A]">
          <h3 className="font-space font-bold flex items-center gap-2 text-white">🛣️ Live Road Status — All Hyderabad</h3>
          <button className="text-[#00D4FF] text-xs font-mono hover:underline">Refresh Data</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-dm text-sm">
            <thead className="bg-[#0A0E1A] text-[#8892A4] font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Road / Segment</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Water Level</th>
                <th className="px-6 py-4">Reports</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {[
                {road: 'NH65 Miyapur', z: 'Kukatpally', s: '🔴 FLOODED', sc:'text-[#FF3B3B]', w: '2.3ft', r: 14, u: '8min ago'},
                {road: 'Tolichowki Rd', z: 'Tolichowki', s: '🔴 BLOCKED', sc:'text-[#FF3B3B]', w: '1.8ft', r: 8, u: '15min ago'},
                {road: 'Ring Road', z: 'Mehdipatnam', s: '🟡 CAUTION', sc:'text-[#FFB347]', w: '0.3ft', r: 3, u: '22min ago'},
                {road: 'ORR Section 6', z: 'Outer Ring', s: '🟢 CLEAR', sc:'text-[#00FF88]', w: 'None', r: 0, u: '41min ago'},
                {road: 'Hitech City Rd', z: 'Madhapur', s: '🟢 CLEAR', sc:'text-[#00FF88]', w: 'None', r: 0, u: '35min ago'}
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold tracking-wide">{row.road}</td>
                  <td className="px-6 py-4 text-[#8892A4]">{row.z}</td>
                  <td className={`px-6 py-4 font-bold font-mono tracking-wider ${row.sc}`}>{row.s}</td>
                  <td className="px-6 py-4 font-mono">{row.w}</td>
                  <td className="px-6 py-4">{row.r}</td>
                  <td className="px-6 py-4 text-[#8892A4] text-xs">{row.u}</td>
                  <td className="px-6 py-4 text-right">
                    <button className={`px-4 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest border transition-colors ${row.s.includes('CLEAR') ? 'text-white/50 border-white/10 hover:bg-black/40 hover:text-white' : row.s.includes('CAUTION') ? 'text-[#FFB347] border-[#FFB347]/50 hover:bg-[#FFB347]/20' : 'text-[#FF3B3B] border-[#FF3B3B]/50 hover:bg-[#FF3B3B]/20'}`}>
                      {row.s.includes('CLEAR') ? 'Safe' : row.s.includes('CAUTION') ? 'Caution' : 'Avoid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictive Alerts */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border-l-4 border-l-[#FFB347] relative overflow-hidden mt-6">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB347] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h3 className="font-space font-bold flex items-center gap-2 text-[#FFB347] mb-2 text-lg">⚡ AI Predictive Road Warnings</h3>
         <p className="text-sm font-dm text-[#8892A4] mb-6">The following roads have NO current reports but AI predicts flooding within 30-60 minutes based on rainfall trajectory and river levels.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-[#0A0E1A] border border-white/10 p-4 rounded-xl border-t-[3px] border-t-[#FFB347]">
             <div className="font-bold text-white mb-1">Nagole Main Road</div>
             <div className="text-xs text-[#FFB347] font-mono animate-pulse">⚠️ Flood in ~35 mins</div>
           </div>
           <div className="bg-[#0A0E1A] border border-white/10 p-4 rounded-xl border-t-[3px] border-t-[#FFB347]">
             <div className="font-bold text-white mb-1">Uppal Crossroads</div>
             <div className="text-xs text-[#FFB347] font-mono animate-pulse">⚠️ Flood in ~48 mins</div>
           </div>
           <div className="bg-[#0A0E1A] border border-white/10 p-4 rounded-xl border-t-[3px] border-t-[#FFB347]">
             <div className="font-bold text-white mb-1">LB Nagar to Dilsukhnagar</div>
             <div className="text-xs text-[#FFB347] font-mono animate-pulse">⚠️ Flood in ~62 mins</div>
           </div>
         </div>
      </div>

    </div>
  );
}
