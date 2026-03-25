import React, { useState } from 'react';
import { getPrediction } from '../services/floodAI';
import { Line, Bar } from 'react-chartjs-2';
import { useAppContext } from '../context/AppContext';

export default function AIPrediction() {
  const { showToast, t, realtimeData } = useAppContext();
  const [params, setParams] = useState({
    zone: 'Kukatpally',
    rainfall: realtimeData.rainfall,
    soilSaturation: 94,
    riverLevel: realtimeData.riverLevel
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runPrediction = async () => {
    setLoading(true);
    const data = await getPrediction(params);
    setResult(data);
    setLoading(false);
  };

  const lineData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      { label: 'AI Predicted Risk %', data: [20, 30, 45, 60, 80, 84, 86, 70, 50, 30], borderColor: '#00D4FF', fill: false, tension: 0.4 },
      { label: 'Rainfall (mm)', data: [10, 15, 20, 25, 40, 50, 45, 20, 10, 5], borderColor: '#8892A4', fill: false, borderDash: [5, 5], tension: 0.4 }
    ]
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8 text-white">
      
      <div className="bg-black/80 border border-white/10 rounded-lg p-3 text-center text-xs text-[#8892A4] mb-4">
        Data shown is simulated for demonstration. Live version connects to IMD weather API, ISRO satellite feeds, and IoT flood sensors.
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-inter font-bold text-[#00D4FF] mb-2 flex items-center gap-3">
          {t('title.predict')}
        </h1>
        <p className="text-[#8892A4] text-sm">See exactly when and where the water will rise using our predictive models.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* INPUT PANEL 45% */}
        <div className="w-full xl:w-[45%] glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-6">
          <h2 className="font-space font-bold text-xl border-b border-white/10 pb-4">⚙️ Configure Parameters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs text-[#8892A4] font-mono tracking-widest uppercase mb-2 block">Zone Selection</label>
              <select 
                value={params.zone} onChange={e=>setParams({...params, zone: e.target.value})}
                className="w-full bg-[#040812] border border-[#00D4FF]/30 rounded p-3 text-white focus:border-[#00D4FF] outline-none transition-colors"
              >
                {['Kukatpally', 'Miyapur', 'LB Nagar', 'Gachibowli', 'Amberpet'].map(z => <option key={z}>{z}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs text-[#8892A4] font-mono tracking-widest uppercase block">🌧 Current Rainfall (mm/hr)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="100" value={params.rainfall} onChange={e=>setParams({...params, rainfall: e.target.value})} className="flex-1 accent-[#00D4FF]" />
                <span className="w-12 font-mono text-[#00D4FF]">{Number(params.rainfall).toFixed(0)}mm</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs text-[#8892A4] font-mono tracking-widest uppercase block">💧 Soil Saturation (%)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="100" value={params.soilSaturation} onChange={e=>setParams({...params, soilSaturation: e.target.value})} className="flex-1 accent-[#00D4FF]" />
                <span className="w-12 font-mono text-[#00D4FF]">{params.soilSaturation}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs text-[#8892A4] font-mono tracking-widest uppercase block">🌊 Musi River Level (m)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="10" step="0.1" value={params.riverLevel} onChange={e=>setParams({...params, riverLevel: e.target.value})} className="flex-1 accent-[#FF3B3B]" />
                <span className="w-12 font-mono text-[#FF3B3B]">{Number(params.riverLevel).toFixed(1)}m</span>
              </div>
              <p className="text-[10px] text-[#FF3B3B]">⚠️ Danger threshold: 7.5m</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded border border-white/5">
                <div className="text-[10px] text-[#8892A4] uppercase font-mono mb-1">Elevation</div>
                <div className="text-[#00FF88]">498m</div>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/5">
                <div className="text-[10px] text-[#8892A4] uppercase font-mono mb-1">Drainage Quality</div>
                <div className="text-[#FFB347]">Poor (30%)</div>
              </div>
            </div>
          </div>

          <button 
            onClick={runPrediction} 
            disabled={loading}
            className="w-full mt-8 py-4 bg-[#00D4FF] text-[#040812] font-bold font-space text-lg rounded-xl hover:bg-[#00D4FF]/80 transition-all glow-cyan disabled:opacity-50"
          >
            {loading ? '🧠 Analyzing 50+ parameters...' : 'RUN AI PREDICTION'}
          </button>
        </div>

        {/* OUTPUT PANEL 55% */}
        <div className="w-full xl:w-[55%] flex flex-col gap-6">
          {!result && !loading && (
            <div className="flex-1 glass-card rounded-2xl flex items-center justify-center flex-col text-[#8892A4] border-dashed border-2 border-white/10 min-h-[500px]">
              <div className="text-6xl mb-4 opacity-50">📊</div>
              <p className="font-space">Configure parameters and run prediction to see AI analysis.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 glass-card rounded-2xl flex items-center justify-center flex-col min-h-[500px] border-[#00D4FF]/30 glow-cyan relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/10 to-transparent animate-[shimmer_2s_infinite]" />
               <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin glow-cyan mb-6" />
               <h3 className="text-xl font-orbitron font-bold text-[#00D4FF] animate-pulse">Running full simulation matrix...</h3>
               <p className="text-[#8892A4] mt-2 font-mono text-sm">Calculating 84 million data points</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
              
              {/* Main Result */}
              <div className={`glass-card p-8 rounded-2xl ${result.probability > 75 ? 'border-[#FF3B3B] glow-red bg-red-900/10' : 'border-[#FFB347] glow-cyan bg-yellow-900/10'}`}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-orbitron font-bold text-[#FF3B3B] flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#FF3B3B] animate-ping" />
                    CRITICAL FLOOD RISK
                  </h2>
                  <div className="text-4xl text-[#FF3B3B] font-bold font-mono">{result.probability}%</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="bg-[#040812] flex-1 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-[#8892A4] text-xs font-mono mb-2">TIME TO ONSET</div>
                    <div className="text-2xl font-bold text-[#00D4FF]">{result.timeToOnset}</div>
                  </div>
                  <div className="bg-[#040812] flex-1 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-[#8892A4] text-xs font-mono mb-2">AI CONFIDENCE</div>
                    <div className="text-2xl font-bold text-[#00FF88]">{result.confidence}%</div>
                  </div>
                </div>

                <div className="bg-[#0A0E1A] p-5 rounded-xl border-l-4 border-l-[#00D4FF]">
                  <h4 className="flex items-center gap-2 font-bold mb-2 text-[#00D4FF]">🧠 FloodSynapse AI Analysis:</h4>
                  <p className="text-sm font-dm leading-relaxed opacity-90">{result.narrative}</p>
                </div>
              </div>

              {/* Factors */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-space font-bold mb-4">Contributing Factors</h3>
                <div className="space-y-4">
                  {result.factors.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded">
                      <div className="flex items-center gap-3 text-sm">
                        {f.type === 'critical' ? '🔴' : f.type === 'high' ? '🟠' : f.type === 'medium' ? '🟡' : '🟢'}
                        <span>{f.text}</span>
                      </div>
                      <div className="w-24 h-2 bg-black/40 rounded overflow-hidden">
                        <div className={`h-full ${f.type === 'critical' ? 'bg-[#FF3B3B]' : f.type === 'high' ? 'bg-[#FFB347]' : 'bg-[#00FF88]'}`} style={{ width: `${f.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeline */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-space font-bold mb-4">Predicted Flood Progression</h3>
                <div className="relative border-l border-[#8892A4]/30 ml-3 space-y-4">
                  {result.timeline.map((t, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute top-1 left-[-4.5px] w-2 h-2 rounded-full ${t.t.includes('PEAK') ? 'bg-[#FF3B3B] animate-ping' : 'bg-[#00D4FF]'}`} />
                      <span className={`font-mono text-xs ${t.t.includes('PEAK') ? 'text-[#FF3B3B] font-bold' : 'text-[#8892A4]'} w-14 inline-block`}>{t.t}</span>
                      <span className={`text-sm ${t.t.includes('PEAK') ? 'text-white' : 'text-[#8892A4]'}`}>{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prediction Confidence Graph */}
              <div className="glass-card p-6 rounded-2xl">
                 <h3 className="font-space font-bold mb-4 flex justify-between items-center">
                   <span>12-Hour Risk Trajectory</span>
                   <span className="text-xs font-mono text-[#00D4FF] font-bold border border-[#00D4FF]/30 px-2 py-1 rounded bg-[#00D4FF]/10">PEAK: 4:00 PM (86%)</span>
                 </h3>
                 <div className="h-48 w-full mt-6">
                    <Line 
                      data={{
                        labels: ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM (PEAK)', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
                        datasets: [
                          { label: 'Flood Risk %', data: [20, 35, 60, 80, 86, 75, 50, 40, 30, 20, 10, 5], borderColor: '#FF3B3B', backgroundColor: 'rgba(255, 59, 59, 0.2)', fill: true, tension: 0.4 }
                        ]
                      }} 
                      options={{ maintainAspectRatio: false, color: '#fff', plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892A4' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892A4', maxRotation: 45, minRotation: 45 } } } }} 
                    />
                 </div>
                 <div className="mt-8 p-4 bg-[#FFB347]/10 rounded border-l-4 border-l-[#FFB347] text-sm text-[#FFB347] shadow-inner font-dm leading-relaxed">
                   <strong>Action needed:</strong> Please pack your Go-Bag and move to higher floors before <span className="text-white font-bold">3:00 PM</span>. Risk probability exceeds safe thresholds (80%) afterward. Follow local NDRF instructions closely.
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-6 rounded-2xl h-80">
          <h3 className="font-space font-bold mb-4 text-[#8892A4] text-sm uppercase tracking-widest">Historical Accuracy (90 Days)</h3>
          <Line data={lineData} options={{ maintainAspectRatio: false, color: '#fff', scales: { y: { grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' } } } }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center text-center">
             <div className="text-[#00D4FF] text-4xl mb-4">14,200</div>
             <p className="text-[#8892A4] font-space text-sm">Flood Events Trained On</p>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center text-center border-[#00FF88]/30 glow-cyan">
             <div className="text-[#00FF88] text-4xl font-bold mb-4">87.3%</div>
             <p className="text-[#8892A4] font-space text-sm">Prediction Accuracy</p>
          </div>
          <div className="glass-card p-6 rounded-2xl col-span-2 flex flex-col justify-center text-center">
             <div className="text-white text-xl font-bold mb-2">FloodSynapse-ML v3.2</div>
             <p className="text-[#8892A4] font-mono text-xs">+16.3% accuracy improvement from crowd data this month</p>
          </div>
        </div>
      </div>

    </div>
  );
}
