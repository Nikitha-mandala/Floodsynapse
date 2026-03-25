import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FaServer, FaBullhorn, FaMapMarkedAlt, FaBrain, FaFileAlt, FaUsers } from 'react-icons/fa';

export default function AdminPanel() {
  const { realtimeData, emergencyMode, setEmergencyMode } = useAppContext();
  const [broadcast, setBroadcast] = useState('');
  const [activeTab, setActiveTab] = useState('system'); // 'system', 'collector', 'volunteers'

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8 text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-[#FFB347] mb-2 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,179,71,0.5)]">
            ⚙️ NDRF Command Center
          </h1>
          <p className="text-[#8892A4] font-space text-sm">System override, manual broadcast, and AI model tuning controls.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B] font-bold font-mono tracking-widest rounded transition-colors hover:bg-[#FF3B3B]/30" onClick={() => setEmergencyMode(!emergencyMode)}>
             {emergencyMode ? 'DEACTIVATE EMERGENCY MODE' : 'FORCE EMERGENCY MODE'}
           </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto scrollbar-none pb-2">
        <button onClick={()=>setActiveTab('system')} className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded-t-xl ${activeTab === 'system' ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-b-2 border-[#00D4FF]' : 'text-[#8892A4] hover:text-white'}`}><FaServer/> Core Systems</button>
        <button onClick={()=>setActiveTab('collector')} className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded-t-xl ${activeTab === 'collector' ? 'bg-[#FFB347]/20 text-[#FFB347] border-b-2 border-[#FFB347]' : 'text-[#8892A4] hover:text-white'}`}><FaFileAlt/> Collector Briefing</button>
        <button onClick={()=>setActiveTab('volunteers')} className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded-t-xl ${activeTab === 'volunteers' ? 'bg-[#00FF88]/20 text-[#00FF88] border-b-2 border-[#00FF88]' : 'text-[#8892A4] hover:text-white'}`}><FaUsers/> Volunteer Dispatch</button>
      </div>

      {activeTab === 'system' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* System Health */}
        <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col h-full border-l-4 border-l-[#00FF88]">
          <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2"><FaServer /> Network Health</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
               <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1">CONNECTED USERS</div>
               <div className="text-3xl font-bold text-[#00D4FF]">47,219</div>
               <div className="text-xs text-[#00FF88] mt-1">+1,204 vs yesterday</div>
             </div>
             <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
               <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1">API LATENCY (FLOODSYNAPSE AI)</div>
               <div className="text-3xl font-bold text-[#00FF88]">142ms</div>
               <div className="text-xs text-[#8892A4] mt-1">SLA: 99.9% uptime</div>
             </div>
             <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
               <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1">IoT SENSORS ONLINE</div>
               <div className="text-3xl font-bold text-[#FFB347]">284 / 300</div>
               <div className="text-xs text-[#FF3B3B] mt-1">16 Offline in Kukatpally</div>
             </div>
             <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5">
               <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1">DATA PROCESSED (24h)</div>
               <div className="text-3xl font-bold text-white">4.2 TB</div>
               <div className="text-xs text-[#00D4FF] mt-1">Cloud synchronized</div>
             </div>
          </div>
        </div>

        {/* Emergency Broadcast */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-t-[3px] border-t-[#FF3B3B] flex flex-col">
          <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2"><FaBullhorn /> Global Push Broadcast</h3>
           <textarea 
             placeholder="Enter emergency message to override all screens..." 
             value={broadcast} onChange={e=>setBroadcast(e.target.value)}
             className="w-full h-32 bg-[#040812] border border-[#FF3B3B]/50 rounded-xl p-4 text-[#FF3B3B] font-mono focus:outline-none focus:border-[#FF3B3B]"
           />
           <div className="flex justify-between items-center mt-4">
             <div className="flex gap-4 text-sm text-[#8892A4]">
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#FF3B3B]" defaultChecked /> SMS</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#FF3B3B]" defaultChecked /> Push</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#FF3B3B]" defaultChecked /> IVR Call</label>
             </div>
             <button className="px-6 py-2 bg-[#FF3B3B] text-white font-bold rounded shadow-[0_0_15px_rgba(255,59,59,0.5)] uppercase tracking-widest">Send Now</button>
           </div>
        </div>

        {/* Manual Map Overrides */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10">
          <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2"><FaMapMarkedAlt /> Manual Polygon Overrides</h3>
          <div className="space-y-4">
            <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 flex justify-between items-center">
               <div>
                  <div className="font-bold text-white">Zone 4 (Miyapur Highway)</div>
                  <div className="text-xs text-[#8892A4]">Current AI Status: Medium Risk</div>
               </div>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-[#FF3B3B]/20 text-[#FF3B3B] text-xs font-mono rounded">Set Red</button>
                 <button className="px-3 py-1 bg-[#00FF88]/20 text-[#00FF88] text-xs font-mono rounded">Set Green</button>
               </div>
            </div>
            <div className="bg-[#0A0E1A] p-4 rounded-xl border border-white/5 flex justify-between items-center">
               <div>
                  <div className="font-bold text-white">Road Segment: ORR Gateway 2</div>
                  <div className="text-xs text-[#8892A4]">Current AI Status: Blocked (Confidence 88%)</div>
               </div>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white/10 text-white text-xs font-mono rounded">Clear Blockage</button>
               </div>
            </div>
          </div>
        </div>

        {/* AI Model Controls */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-[#00D4FF]/30 glow-cyan">
          <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2 text-[#00D4FF]"><FaBrain /> FloodSynapse AI Model Tuning</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono text-[#8892A4] mb-2">
                <span>False Positive Penalty (<span className="text-[#00D4FF]">1.4x</span>)</span>
                <span>Optimized</span>
              </div>
              <input type="range" className="w-full accent-[#00D4FF]" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-[#8892A4] mb-2">
                <span>Confidence Threshold (<span className="text-[#00FF88]">75%</span>)</span>
                <span>Balanced</span>
              </div>
              <input type="range" className="w-full accent-[#00FF88]" />
            </div>
            <div className="bg-[#0A0E1A] p-4 space-y-2 mt-4 text-xs font-mono">
               <div className="flex justify-between"><span className="text-[#8892A4]">Active Model:</span><span className="text-white">fs-intelligence-v4-core</span></div>
               <div className="flex justify-between"><span className="text-[#8892A4]">Parameters:</span><span className="text-white">84B Fine-Tuned (Hyd Context)</span></div>
               <div className="flex justify-between"><span className="text-[#8892A4]">Token Usage:</span><span className="text-white">2.4M / 5M quota</span></div>
            </div>
          </div>
        </div>

      </div>
      )}

      {activeTab === 'collector' && (
        <div className="glass-card p-8 rounded-2xl border-2 border-white/10 bg-[#f8f9fa] text-black max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <svg viewBox="0 0 100 100" className="w-48 h-48 fill-current"><path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z"/></svg>
           </div>
           
           <div className="border-b-4 border-black pb-6 mb-8 text-center mt-4 relative z-10">
             <h2 className="text-3xl font-black uppercase tracking-widest font-serif">Official Situation Briefing</h2>
             <div className="text-sm font-mono mt-2 text-gray-600 font-bold">DISTRICT MAGISTRATE / COLLECTOR VIEW - HYDERABAD</div>
             <div className="text-xs font-mono mt-1 text-red-600 font-bold">Generated by FloodSynapse AI Core • CONFIDENTIAL</div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 font-dm relative z-10">
             <div className="border hover:border-black p-5 bg-white shadow-sm transition-colors cursor-default">
               <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1 uppercase">Affected Population Est.</div>
               <div className="text-4xl font-bold text-red-600 mb-2">142,500</div>
               <div className="text-xs text-gray-600">Primarily in Kukatpally & Miyapur zones. Moving toward Begumpet.</div>
             </div>
             <div className="border hover:border-black p-5 bg-white shadow-sm transition-colors cursor-default">
               <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1 uppercase">Active Rescue Ops</div>
               <div className="text-4xl font-bold text-blue-600 mb-2">12 Teams</div>
               <div className="text-xs text-gray-600">NDRF Alpha & Bravo battalions deployed with 4 inflatable boats.</div>
             </div>
             <div className="border hover:border-black p-5 bg-white shadow-sm transition-colors cursor-default">
               <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1 uppercase">Shelter Capacity</div>
               <div className="text-4xl font-bold text-green-600 mb-2">4,200 <span className="text-lg text-gray-400">/ 12,000</span></div>
               <div className="text-xs text-gray-600">8 shelters currently operational. Stadium reaching capacity.</div>
             </div>
             <div className="border hover:border-black p-5 bg-white shadow-sm transition-colors cursor-default">
               <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1 uppercase">Network & Roads</div>
               <div className="text-4xl font-bold text-orange-600 mb-2">32% <span className="text-lg text-gray-400">Blocked</span></div>
               <div className="text-xs text-gray-600">NH65 and ORR Exit 2 severely impacted. JNTU road cut off.</div>
             </div>
           </div>

           <div className="space-y-4 relative z-10">
             <h3 className="font-bold border-b-2 border-black pb-2 text-lg uppercase font-serif">Priority Action Items</h3>
             <ul className="list-disc ml-5 space-y-3 text-sm text-gray-800">
               <li><strong>Authorize Air Drop:</strong> 42 isolated families in Balanagar require immediate food packets.</li>
               <li><strong>Power Grid Shutoff:</strong> Substation #4 in Miyapur risks short-circuit. Recommend immediate selective shutdown.</li>
               <li><strong>Evacuation Order:</strong> Kukatpally zone 4 water levels rising 2ft/hr. Mandatory evacuation required in next 45 mins.</li>
             </ul>
           </div>
           
           <div className="mt-12 pt-6 border-t border-gray-300 flex justify-between items-center text-xs text-gray-500 font-mono relative z-10">
             <span>REF: FS-GOV-9942</span>
             <span>Report updated LIVE via satellite and crowd</span>
             <button onClick={() => window.print()} className="px-4 py-2 bg-black text-white rounded shadow-md hover:bg-gray-800 transition font-bold font-space uppercase">Print Briefing</button>
           </div>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border-t-[3px] border-t-[#00FF88] border border-white/10">
          <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2"><FaUsers /> Volunteer Dispatch Matrix</h3>
          <p className="text-[#8892A4] text-sm mb-6">Assign registered community volunteers to dynamic flood zones based on proximity and skill level.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#040812] rounded-xl border border-white/5 overflow-hidden p-4 min-h-[400px]">
              <div className="w-full h-full bg-[url('https://maps.wikimedia.org/osm-intl/12/2923/1825.png')] bg-cover bg-center relative filter opacity-80 rounded-lg">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#00FF88] border-2 border-black shadow-[0_0_10px_rgba(0,255,136,1)] z-10 flex items-center justify-center animate-pulse"><span className="absolute top-5 text-[10px] font-bold text-white bg-black px-1.5 py-0.5 rounded border border-[#00FF88] whitespace-nowrap">Ravi K. (Boat)</span></div>
                <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-[#00FF88] border-2 border-black shadow-[0_0_10px_rgba(0,255,136,1)] z-10 flex items-center justify-center animate-pulse"><span className="absolute top-5 text-[10px] font-bold text-white bg-black px-1.5 py-0.5 rounded border border-[#00FF88] whitespace-nowrap">Suresh (Medic)</span></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#00FF88] border-2 border-black shadow-[0_0_10px_rgba(0,255,136,1)] z-10 flex items-center justify-center animate-pulse"><span className="absolute top-5 text-[10px] font-bold text-white bg-black px-1.5 py-0.5 rounded border border-[#00FF88] whitespace-nowrap">Priya (Food)</span></div>
                
                {/* Zones */}
                <div className="absolute top-1/4 left-1/4 w-40 h-40 border border-[#FF3B3B] bg-[#FF3B3B]/20 rounded-full blur-[2px] -translate-x-10 -translate-y-10" />
                <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-[#FFB347] bg-[#FFB347]/20 rounded-full blur-[2px]" />
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              <h4 className="font-bold text-[#8892A4] uppercase text-xs tracking-widest mb-4">Pending Assignments</h4>
              {[
                { name: 'Ravi Kumar', skill: 'Boat Owner', dist: '1.2km to Kukatpally', status: 'Idle' },
                { name: 'Dr. Suresh', skill: 'First Aid', dist: '3.4km to Miyapur', status: 'Idle' },
                { name: 'Anita Reddy', skill: 'Food Dist.', dist: '0.8km to Shelter', status: 'Idle' },
                { name: 'Vijay V.', skill: 'Heavy Driver', dist: '5.1km to NH65', status: 'Idle' },
              ].map((v, i) => (
                <div key={i} className="bg-[#0A0E1A] p-3 rounded-lg border border-white/5 hover:border-[#00FF88]/30 transition-colors cursor-default group">
                  <div className="flex justify-between items-start mb-1">
                     <div className="font-bold text-white text-sm line-clamp-1">{v.name}</div>
                     <span className="text-[#00FF88] font-mono text-[10px] border border-[#00FF88]/30 px-1.5 py-0.5 rounded bg-[#00FF88]/10 whitespace-nowrap">{v.skill}</span>
                  </div>
                  <div className="text-[10px] text-[#8892A4] mb-3">{v.dist}</div>
                  <button className="w-full py-2 text-[10px] font-bold bg-[#00D4FF]/10 text-[#00D4FF] rounded border border-[#00D4FF]/30 hover:bg-[#00D4FF] hover:text-black transition uppercase tracking-widest">Dispatch to Zone</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
