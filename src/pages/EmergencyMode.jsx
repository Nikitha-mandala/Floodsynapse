import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvacuationPlan } from '../services/floodAI';
import { useAppContext } from '../context/AppContext';

export default function EmergencyMode() {
  const { setEmergencyMode, showToast, t, user } = useAppContext();
  const [plan, setPlan] = useState([]);
  const [sosStage, setSosStage] = useState(0); // 0: Idle, 1: Received, 2: Assigned, 3: En Route, 4: Rescued
  const [countdown, setCountdown] = useState(12); // minutes

  useEffect(() => {
    // Lock app into emergency mode context
    setEmergencyMode(true);
    
    // Fetch personalized plan
    getEvacuationPlan('Kukatpally').then(setPlan);

    return () => setEmergencyMode(false);
  }, [setEmergencyMode]);

  useEffect(() => {
    let timer;
    if (sosStage === 3 && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 60000); // 1 min interval (mocked to actual minute)
    } else if (sosStage === 3 && countdown === 0) {
      setSosStage(4); // Trigger rescue
    }
    return () => clearInterval(timer);
  }, [sosStage, countdown]);

  const handleSOS = () => {
    if(sosStage > 0) return;
    setSosStage(1);
    showToast("SOS Broadcasted to NDRF Command Center.");
    
    // Simulate progression
    setTimeout(() => {
      setSosStage(2);
      showToast("NDRF Alpha-Team Assigned to your beacon.");
    }, 4000);
    
    setTimeout(() => {
      setSosStage(3);
      showToast("Rescue Boat is en route.");
    }, 9000);
  };

  const getSmsLink = () => {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    const phones = contacts.map(c => c.phone).filter(Boolean).join(',');
    const body = `SOS FLOOD EMERGENCY: I need help. Evacuating to Kukatpally Stadium. Mobile running out of charge. - ${user.name || 'User'}`;
    return `sms:${phones}?body=${encodeURIComponent(body)}`;
  };

  // Checklist state
  const checklistItems = [
    "National ID / Aadhar card",
    "Passport / Important documents",
    "Cash (ATMs may be down)",
    "Phone charger + power bank",
    "Drinking water (3 liters per person)",
    "3-day food supply",
    "Medicines / first aid kit",
    "Flashlight + extra batteries",
    "Warm clothes / blanket",
    "Notify family and neighbors"
  ];
  const [checked, setChecked] = useState(new Array(10).fill(false));
  const toggleCheck = (idx) => {
    const newArr = [...checked];
    newArr[idx] = !newArr[idx];
    setChecked(newArr);
  };
  const packedScore = checked.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#1F0A0A] w-full text-white relative z-50">
      
      {/* Red Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B3B]/20 via-[#1F0A0A] to-[#1F0A0A] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8 w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* BIG SOS SECTION */}
        <div className="flex flex-col items-center justify-center text-center pt-8 pb-12 border-b border-[#FF3B3B]/20">
          
          {sosStage === 0 ? (
            <button onClick={handleSOS} className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-[#FF3B3B] to-[#AA0000] shadow-[0_0_50px_rgba(255,59,59,0.8)] border-4 border-[#FF3B3B] flex items-center justify-center mb-8 animate-pulse-ring hover-lift group relative overflow-hidden">
              <span className="text-4xl md:text-6xl font-black tracking-widest text-white group-hover:scale-110 transition-transform">SOS</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100" />
              <div className="absolute bottom-4 w-full text-center text-xs font-mono font-normal opacity-80 uppercase tracking-widest">TAP TO CALL SERVICES</div>
            </button>
          ) : (
            <div className="w-full max-w-3xl glass-card rounded-2xl p-6 md:p-10 border border-[#00D4FF]/50 shadow-[0_0_30px_rgba(0,212,255,0.2)] mb-8">
              <h2 className="text-2xl font-orbitron font-bold text-[#00D4FF] mb-6 animate-pulse">📡 ACTIVE RESCUE BEACON</h2>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />
                 
                 {/* Timeline items */}
                 <div className={`relative z-10 flex flex-col items-center gap-2 ${sosStage >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-black ${sosStage >= 1 ? 'bg-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.6)]' : 'bg-[#8892A4]'}`}>1</div>
                   <span className={`text-xs font-bold ${sosStage >= 1 ? 'text-[#00FF88]' : 'text-[#8892A4]'}`}>SOS Received</span>
                 </div>
                 
                 <div className={`relative z-10 flex flex-col items-center gap-2 ${sosStage >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-black ${sosStage >= 2 ? 'bg-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.6)]' : 'bg-[#8892A4]'}`}>2</div>
                   <span className={`text-xs font-bold ${sosStage >= 2 ? 'text-[#00D4FF]' : 'text-[#8892A4]'}`}>NDRF Assigned</span>
                   {sosStage >= 2 && <span className="absolute top-[120%] text-[10px] text-[#00D4FF] whitespace-nowrap bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/30">Team Alpha-6</span>}
                 </div>

                 <div className={`relative z-10 flex flex-col items-center gap-2 ${sosStage >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-black ${sosStage >= 3 ? 'bg-[#FFB347] animate-pulse shadow-[0_0_15px_rgba(255,179,71,0.6)]' : 'bg-[#8892A4]'}`}>3</div>
                   <span className={`text-xs font-bold ${sosStage >= 3 ? 'text-[#FFB347]' : 'text-[#8892A4]'}`}>En Route</span>
                   {sosStage === 3 && <span className="absolute top-[120%] text-[10px] text-[#FFB347] whitespace-nowrap bg-[#FFB347]/10 px-2 py-0.5 rounded border border-[#FFB347]/30">ETA: {countdown} mins</span>}
                 </div>

                 <div className={`relative z-10 flex flex-col items-center gap-2 ${sosStage >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-black ${sosStage >= 4 ? 'bg-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.6)]' : 'bg-[#8892A4]'}`}>4</div>
                   <span className={`text-xs font-bold ${sosStage >= 4 ? 'text-[#00FF88]' : 'text-[#8892A4]'}`}>Rescued</span>
                 </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-inter font-bold text-[#FF3B3B] mb-4">{t('title.emergency')}</h1>
          <p className="text-lg text-[#FFB347] max-w-2xl mx-auto mb-6">Flood emergency in Kukatpally. Rescue teams have been notified. Stay calm and follow the instructions.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-mono tracking-widest">
             <div className="glass-card bg-[#FF3B3B]/10 px-6 py-3 rounded-xl border border-[#FF3B3B]/50 hover:bg-[#FF3B3B]/30 cursor-pointer">🚨 NDRF: 011-24363260</div>
             <div className="glass-card bg-red-400/10 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 cursor-pointer">🚑 AMB: 108</div>
             <div className="glass-card bg-red-400/10 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 cursor-pointer">🚒 FIRE: 101</div>
             <div className="glass-card bg-red-400/10 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 cursor-pointer">👮 POL: 100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI GUIDANCE & RELIEF RESOURCES */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-2xl bg-black/60 border border-[#FF3B3B]/30 shadow-[0_0_20px_rgba(255,59,59,0.1)]">
               <h3 className="font-space font-bold text-2xl mb-4 text-[#FFB347] flex items-center gap-3">
                 🧠 Personalized Evacuation Plan
               </h3>
               {plan.length === 0 ? (
                 <div className="animate-pulse font-mono text-[#FF3B3B]">Generating critical instructions...</div>
               ) : (
                 <ol className="space-y-3 font-dm text-sm text-white/90 translate-y-0 opacity-100 transition-all">
                   {plan.map((p, i) => (
                     <li key={i} className="flex gap-4 items-start p-3 bg-[#FF3B3B]/5 border border-[#FF3B3B]/20 rounded-lg">
                       <span className="w-6 h-6 shrink-0 bg-[#FF3B3B] text-black font-bold flex items-center justify-center rounded-full text-xs mt-0.5">{i+1}</span>
                       <span className="leading-relaxed">{p}</span>
                     </li>
                   ))}
                 </ol>
               )}
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 bg-black/40">
              <h3 className="font-space font-bold text-lg mb-4 flex items-center gap-2">🏥 Nearest Resources</h3>
              
              <div className="space-y-4 font-dm text-sm">
                <div>
                  <div className="text-[#8892A4] font-mono text-[10px] uppercase mb-1">Shelters (Capacity)</div>
                  <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 p-3 rounded flex justify-between items-center group cursor-pointer hover:bg-[#00D4FF]/20">
                     <div>
                       <div className="font-bold text-[#00D4FF] group-hover:underline">Kukatpally Stadium (0.8km)</div>
                       <div className="text-xs text-[#8892A4]">892 / 2000 available</div>
                     </div>
                     <div className="text-[10px] bg-[#00D4FF]/20 px-2 py-1 rounded border border-[#00D4FF] text-[#00D4FF]">✅ RECOMMENDED</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-[#8892A4] font-mono text-[10px] uppercase mb-1">Hospitals (Beds)</div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center hover:bg-white/10 cursor-pointer">
                     <div>
                       <div className="font-bold">Osmania Hospital (2.1km)</div>
                       <div className="text-xs text-[#00FF88]">45 beds free</div>
                     </div>
                     <button onClick={() => showToast('Navigation started in live version!')} className="text-[#00D4FF] underline text-xs">Navigate</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => showToast('Navigation started in live version!')} className="flex-1 py-3 border border-white/10 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2">🚔 NEARBY POLICE (1.8km)</button>
                  <button onClick={() => showToast('Navigation started in live version!')} className="flex-1 py-3 border border-white/10 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2">⛽ NEARBY FUEL PUMPS (2)</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-1 glass-card p-4 rounded-xl border-l-4 border-l-[#00FF88] bg-[#00FF88]/5">
                 <h4 className="font-bold mb-2 text-[#00FF88]">✅ DO's</h4>
                 <ul className="text-xs space-y-1 text-[#8892A4] list-disc ml-4">
                   <li>Evacuate to higher ground immediately</li>
                   <li>Follow official NDRF instructions</li>
                   <li>Help elderly and children first</li>
                 </ul>
              </div>
              <div className="flex-1 glass-card p-4 rounded-xl border-l-4 border-l-[#FF3B3B] bg-[#FF3B3B]/5">
                 <h4 className="font-bold mb-2 text-[#FF3B3B]">❌ DON'TS</h4>
                 <ul className="text-xs space-y-1 text-[#8892A4] list-disc ml-4">
                   <li>Do NOT walk through moving water</li>
                   <li>Do NOT drive through flooded roads</li>
                   <li>Do NOT touch electrical equipment</li>
                 </ul>
              </div>
            </div>

            {/* SCHOOL SAFETY */}
            <div className="glass-card p-6 rounded-2xl bg-black/40 border border-[#FFB347]/30 border-l-[3px] border-l-[#FFB347] mt-8">
               <h3 className="font-space font-bold text-lg mb-4 flex items-center gap-2 text-[#FFB347]">
                 🏫 School Safety Status
               </h3>
               <p className="text-xs text-[#8892A4] mb-4">Live risk assessment for 3 nearest schools in Kukatpally.</p>
               
               <div className="space-y-3">
                 {[
                   { name: 'Meridian High School', dist: '1.2km', risk: 'CRITICAL', color: 'text-[#FF3B3B]' },
                   { name: 'Kukatpally Public', dist: '2.5km', risk: 'HIGH', color: 'text-[#FFB347]' },
                   { name: 'DAV Primary', dist: '3.1km', risk: 'LOW', color: 'text-[#00FF88]' }
                 ].map((s, i) => (
                   <div key={i} className="flex justify-between items-center bg-[#0A0E1A] p-3 rounded-lg border border-white/5">
                      <div>
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-[10px] text-[#8892A4]">{s.dist} • Zone Risk: <span className={`${s.color} font-bold`}>{s.risk}</span></div>
                      </div>
                      <a href="tel:04023158941" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs font-mono transition-colors">Call</a>
                   </div>
                 ))}
               </div>
               <div className="mt-4 p-3 bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 rounded text-xs text-[#FF3B3B] font-bold">
                 ⚠️ WARNING: DO NOT send children to Red Zone schools. Keep them home.
               </div>
            </div>

          </div>

          {/* CHECKLIST & COMMS */}
          <div className="space-y-8 flex flex-col">
            
            <div className="flex-1 glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
               <h3 className="font-space font-bold text-xl mb-4 flex items-center justify-between">
                 <span>📋 Evacuation Kit</span>
                 <span className="font-mono text-sm">{packedScore}/10 Packed</span>
               </h3>
               
               <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                 <div className="h-full bg-[#00FF88] transition-all" style={{ width: `${(packedScore/10)*100}%` }} />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
                 {checklistItems.map((item, idx) => (
                   <label key={idx} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${checked[idx] ? 'bg-[#00FF88]/10 border-[#00FF88]/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                     <input type="checkbox" checked={checked[idx]} onChange={() => toggleCheck(idx)} className="mt-1 flex-shrink-0 w-4 h-4 accent-[#00FF88]" />
                     <span className={`text-sm ${checked[idx] ? 'text-white line-through opacity-70' : 'text-[#8892A4]'}`}>{item}</span>
                   </label>
                 ))}
               </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl border border-[#00D4FF]/30 bg-black/40">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-space font-bold text-xl text-[#00D4FF]">📲 Alert Your Family</h3>
                 <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full text-xs bg-black">
                   <input type="checkbox" className="accent-red-500" />
                   <span className="text-white/70">Low Connectivity SMS Mode</span>
                 </div>
               </div>
               
               <div className="bg-[#040812] border border-white/10 rounded-xl p-4 text-sm font-dm text-white/90 italic mb-6 shadow-inner tracking-wide leading-relaxed">
                 "🆘 FLOOD ALERT: I am evacuating from Kukatpally due to flood emergency. Moving to Kukatpally Stadium shelter. GPS: [location link]. Estimated arrival: 25 mins. I am SAFE. Please do not worry. — Ravi [via FloodSynapse Emergency]"
               </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 <button className="py-3 bg-[#25D366] text-black font-bold text-sm rounded-lg hover:bg-green-400 transition-colors uppercase font-mono">WhatsApp</button>
                 <a href={getSmsLink()} className="py-3 bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF] font-bold text-sm rounded-lg hover:bg-[#00D4FF] hover:text-black transition-colors uppercase font-mono text-center flex items-center justify-center gap-2">SMS ALL</a>
                 <button onClick={()=>navigator.clipboard.writeText("SOS FLOOD EMERGENCY. Safe at Stadium.")} className="py-3 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors uppercase font-mono col-span-2 md:col-span-1">Copy Text</button>
               </div>
               
               {/* OFFLINE SMS FALLBACK INSTRUCTIONS */}
               <div className="mt-8 pt-6 border-t border-white/10 text-left">
                  <h4 className="font-space font-bold text-[#FFB347] flex items-center gap-2 mb-4">
                    <span className="text-xl">📡</span> No Internet? Use SMS
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-[#0A0E1A] p-4 rounded-lg border border-white/5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF3B3B]" />
                      <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1 uppercase">For Emergency Rescue</div>
                      <div className="font-bold text-white mb-1">Send SMS to <span className="text-[#FF3B3B] text-lg mx-1">112</span></div>
                      <code className="text-[#00D4FF] text-xs">Text: HELP KUKATPALLY MAIN ROAD</code>
                      <p className="text-[10px] text-[#8892A4] mt-2">Works even without a balance on any active network.</p>
                    </div>
                    
                    <div className="bg-[#0A0E1A] p-4 rounded-lg border border-white/5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D4FF]" />
                      <div className="text-[10px] text-[#8892A4] font-mono tracking-widest mb-1 uppercase">For Live Flood Alerts</div>
                      <div className="font-bold text-white mb-1">Send SMS to <span className="text-[#00D4FF] text-lg mx-1">7188</span></div>
                      <code className="text-[#00FF88] text-xs">Text: FLOOD 500072</code>
                      <p className="text-[10px] text-[#8892A4] mt-2">Get status updates directly to your inbox natively via SMS.</p>
                    </div>
                  </div>
               </div>
               
               <div className="text-[10px] text-[#8892A4] mt-4 font-mono text-center">
                 To register for offline alerts: SMS "FLOOD 500072 RAVI" to 56070
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
