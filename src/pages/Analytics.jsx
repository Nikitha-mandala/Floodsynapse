import React, { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler);

import { useAppContext } from '../context/AppContext';

export default function Analytics() {
  const { showToast, t } = useAppContext();
  const [range, setRange] = useState('1Y');

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Flood Incidents', data: [12, 19, 15, 25, 42, 80, 140, 180, 120, 60, 30, 20], borderColor: '#00D4FF', backgroundColor: 'rgba(0, 212, 255, 0.2)', fill: true, tension: 0.4 },
      { label: 'Avg Rainfall (mm)', data: [5, 10, 20, 45, 80, 150, 300, 350, 250, 100, 40, 15], borderColor: '#8892A4', borderDash: [5, 5], tension: 0.4 }
    ]
  };

  const barData = {
    labels: ['Kukatpally', 'Miyapur', 'LB Nagar', 'Gachibowli', 'Amberpet', 'Madhapur'],
    datasets: [{ label: 'Vulnerability Index (1-100)', data: [94, 86, 75, 42, 91, 55], backgroundColor: ['#FF3B3B', '#FFB347', '#FFB347', '#00FF88', '#FF3B3B', '#00D4FF'] }]
  };

  const doughnutData = {
    labels: ['AI Sensors', 'Community App', 'Satellite', 'Gov Sensors'],
    datasets: [{ data: [45, 30, 15, 10], backgroundColor: ['#00D4FF', '#00FFB3', '#FFB347', '#8892A4'], borderWidth: 0 }]
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8 text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-inter font-bold text-[#00D4FF] mb-2 flex items-center gap-3">
            {t('title.analytics')}
          </h1>
          <p className="text-[#8892A4] text-sm">City-wide historical data and trends.</p>
        </div>
        <div className="flex gap-2 font-mono text-xs">
          {['1M', '3M', '6M', '1Y', 'ALL'].map(r => (
             <button key={r} onClick={() => setRange(r)} className={`px-4 py-2 ${range === r ? 'bg-[#00D4FF] text-black font-bold' : 'border border-[#8892A4] text-[#8892A4] hover:border-[#00D4FF] hover:text-[#00D4FF]'} transition-colors rounded`}>
               {r}
             </button>
          ))}
          <button onClick={() => showToast('Simulating PDF Export... Check your downloads folder')} className="px-4 py-2 bg-white/10 hover:bg-white/20 ml-4 rounded font-bold border border-white/20">📥 Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Total Incidents (YTD)', v: '842', s: '+14% vs last yr', c: 'text-[#FF3B3B]' },
          { l: 'Avg AI Accuracy', v: '94.2%', s: '+2.1% improvement', c: 'text-[#00FF88]' },
          { l: 'Community Reports', v: '14,028', s: '4,200 verified users', c: 'text-[#00D4FF]' },
          { l: 'Infrastructure Loss Prev.', v: '₹42Cr', s: 'Calculated via AI routing', c: 'text-[#FFB347]' }
        ].map((s, i) => (
           <div key={i} className={`glass-card p-6 rounded-2xl border-t-[3px] border-[${s.c.split('-')[1].slice(0,-1)}]`}>
             <div className="text-[10px] text-[#8892A4] font-mono tracking-widest uppercase mb-2">{s.l}</div>
             <div className={`text-3xl font-bold font-mono ${s.c} mb-1`}>{s.v}</div>
             <div className="text-xs text-[#8892A4]">{s.s}</div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Line Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl h-[400px]">
          <h3 className="font-space font-bold mb-6 text-xl">Rainfall vs Flood Incidents ({range})</h3>
          <div className="w-full h-[300px]">
            <Line data={lineData} options={{ maintainAspectRatio: false, color: '#fff', scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col items-center">
          <h3 className="font-space font-bold mb-6 text-xl w-full text-left">Data Verification Sources</h3>
          <div className="w-full h-[250px] relative">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#8892A4', font: { size: 10 } } } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
               <div className="text-3xl font-orbitron font-bold text-white">4.2M</div>
               <div className="text-[10px] text-[#8892A4] font-mono">Data Points/Hr</div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-3 glass-card p-6 rounded-2xl h-[400px]">
          <h3 className="font-space font-bold mb-6 text-xl">Top 6 Zone Vulnerability Index</h3>
          <div className="w-full h-[300px]">
            <Bar data={barData} options={{ maintainAspectRatio: false, color: '#fff', scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {/* Real Hyderabad Flood History */}
        <div className="lg:col-span-3 glass-card p-6 rounded-2xl">
          <h3 className="font-space font-bold mb-6 text-xl text-[#00D4FF] flex items-center gap-2">
            📚 Hyderabad Historical Flood Data
          </h3>
          <div className="space-y-4">
            {[
              { year: '2020', event: 'October Flash Floods', areas: 'Balangir, Tolichowki, LB Nagar', cause: 'Deep depression in Bay of Bengal (32cm rain in 24h)', impact: '50+ casualties, ₹5,000 Cr+ damage. Musi river overflowed heavily.' },
              { year: '2016', event: 'September Deluge', areas: 'Nizampet, Begumpet, Alwal', cause: 'Unprecedented monsoon downpour', impact: 'IT corridor severely affected. Cyberabad paralyzed for 3 days.' },
              { year: '2013', event: 'Phailin Cyclone Aftermath', areas: 'Old City, Dilsukhnagar', cause: 'Cyclone Phailin heavy rains', impact: 'Widespread waterlogging and power outages lasting 48 hours.' },
              { year: '2000', event: 'August 2000 Floods', areas: 'City-wide, especially Musi banks', cause: 'Sudden cyclonic cloud burst (24cm rain)', impact: 'Historical water levels in Hussain Sagar. Heavy destruction.' },
            ].map((h, i) => (
               <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-[#0A0E1A] border border-white/5 rounded-xl hover:border-[#00D4FF]/30 transition-colors">
                  <div className="shrink-0 w-24">
                     <span className="text-2xl font-black text-[#FFB347] font-orbitron">{h.year}</span>
                  </div>
                  <div className="flex-1 text-sm font-dm">
                     <div className="font-bold text-white text-base mb-1">{h.event}</div>
                     <div className="text-[#00D4FF] mb-2 text-xs font-mono">📍 {h.areas}</div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-[#FF3B3B]/10 p-2 rounded border border-[#FF3B3B]/20">
                           <div className="text-[10px] text-[#FF3B3B] uppercase font-bold mb-1">Primary Cause</div>
                           <div className="text-white/80 text-xs">{h.cause}</div>
                        </div>
                        <div className="bg-[#00FF88]/10 p-2 rounded border border-[#00FF88]/20">
                           <div className="text-[10px] text-[#00FF88] uppercase font-bold mb-1">Historical Impact</div>
                           <div className="text-white/80 text-xs">{h.impact}</div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
