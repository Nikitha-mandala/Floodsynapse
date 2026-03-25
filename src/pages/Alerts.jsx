import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

export default function Alerts() {
  const { realtimeData } = useAppContext();
  const [tab, setTab] = useState('ALL');

  const alerts = [
    { id: 1, type: 'CRITICAL', title: 'IMMINENT FLOOD: Kukatpally Main Road', desc: 'Water rising rapidly at 0.4m/hr. Evacuation protocol initiated for low-lying areas.', time: 'Just now', icon: <FaExclamationTriangle /> },
    { id: 2, type: 'WARNING', title: 'Route Blocked: NH65 section 4', desc: 'AI has rerouted all traffic away from NH65 due to 2ft standing water.', time: '14 mins ago', icon: <FaShieldAlt /> },
    { id: 3, type: 'INFO', title: 'Sensors Calibrated: Zone B', desc: '14 IoT sensors in Zone B have been recalibrated. Data reliability 99.8%.', time: '1 hr ago', icon: <FaInfoCircle /> },
    { id: 4, type: 'CRITICAL', title: 'Musi River Alert Level Red', desc: 'River level breached 7.5m danger mark. Sirens activated in downstream zones.', time: '2 hrs ago', icon: <FaExclamationTriangle /> },
    { id: 5, type: 'WARNING', title: 'Community Trust Score Deductions', desc: 'Automated AI has banned 4 users for submitting false flood reports today.', time: '5 hrs ago', icon: <FaShieldAlt /> },
    { id: 6, type: 'INFO', title: 'NDRF Base Relocated', desc: 'Command center moved to Kukatpally elevated stadium.', time: '1 day ago', icon: <FaInfoCircle /> },
  ];

  const filtered = tab === 'ALL' ? alerts : alerts.filter(a => a.type === tab);

  return (
    <div className="p-4 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-[#F0F4FF] mb-2 flex items-center gap-3">
            🔔 Notification Center
          </h1>
          <p className="text-[#8892A4] font-space text-sm">Real-time alerts, AI interventions, and system-wide notifications.</p>
        </div>
        <div className="flex bg-[#0A0E1A] p-1 rounded-lg border border-white/10 font-mono text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(t => (
             <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded transition-colors ${tab === t ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-[#8892A4] hover:text-white'}`}>
               {t}
             </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(a => {
          const isCrit = a.type === 'CRITICAL';
          const isWarn = a.type === 'WARNING';
          
          let color = 'text-[#00D4FF] border-[#00D4FF]/30 bg-[#00D4FF]/5';
          let iconColor = 'text-[#00D4FF]';
          
          if (isCrit) {
            color = 'border-[#FF3B3B] bg-[#FF3B3B]/10';
            iconColor = 'text-[#FF3B3B] animate-pulse';
          } else if (isWarn) {
            color = 'border-[#FFB347]/50 bg-[#FFB347]/5';
            iconColor = 'text-[#FFB347]';
          }

          return (
            <div key={a.id} className={`glass-card p-4 md:p-6 rounded-xl border-l-4 ${color} flex gap-4 md:gap-6 items-start hover:bg-white/5 transition-colors cursor-pointer group`}>
              <div className={`text-2xl pt-1 ${iconColor}`}>
                {a.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                   <h3 className={`font-space font-bold text-lg ${isCrit ? 'text-[#FF3B3B]' : isWarn ? 'text-[#FFB347]' : 'text-[#00D4FF]'}`}>{a.title}</h3>
                   <span className="text-[10px] text-[#8892A4] font-mono bg-white/5 px-2 py-1 rounded w-fit">{a.time}</span>
                </div>
                <p className="text-sm font-dm text-[#F0F4FF] mb-3 opacity-90">{a.desc}</p>
                {isCrit && (
                  <div className="flex gap-3">
                    <button className="text-xs bg-[#FF3B3B] text-white px-4 py-1.5 rounded font-bold hover:bg-red-600 transition-colors">View on Map</button>
                    <button className="text-xs border border-[#FF3B3B] text-[#FF3B3B] px-4 py-1.5 rounded hover:bg-[#FF3B3B]/10 transition-colors">Acknowledge</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-[#8892A4] py-12 font-space">
             No alerts in this category.
          </div>
        )}
      </div>

    </div>
  );
}
