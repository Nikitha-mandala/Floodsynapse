import React from 'react';

export default function Roadmap() {
  const phases = [
    { phase: 'Phase 1: Foundation (Current)', desc: 'Live weather integration, AI risk mapping, SMS fallback, and crowd reports.', protected: '47,000' },
    { phase: 'Phase 2: Sensor Integration (Q3 2026)', desc: 'Connect to 500+ physical IoT water sensors across Hyderabad lakes and streams.', protected: '2.5 Million' },
    { phase: 'Phase 3: Drone Fleet (Q1 2027)', desc: 'Automated drone dispatch for visual verification of high-risk SOS beacons.', protected: '5 Million' },
    { phase: 'Phase 4: National Scale (2028)', desc: 'Rollout to Mumbai, Chennai, and Assam with localized language AI.', protected: '45 Million' },
    { phase: 'Phase 5: Global Standard (2030)', desc: 'Open API for global governments. Satellite hydrology integration.', protected: '100+ Million' }
  ];

  return (
    <div className="p-4 md:p-8 w-full max-w-[1200px] mx-auto text-white mt-12 md:mt-0">
      <h1 className="text-3xl font-inter font-bold text-[#00D4FF] mb-2">Product Roadmap</h1>
      <p className="text-[#8892A4] text-sm mb-12">The 5-year vision for scaling FloodSynapse globally.</p>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#00D4FF] before:to-[#FF3B3B]">
        {phases.map((p, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#040812] bg-[#00D4FF] text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,212,255,0.6)] z-10 transition-transform hover:scale-125 cursor-default">
              {i + 1}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border hover:border-[#00D4FF]/50 transition-colors bg-[#0A0E1A]">
              <h3 className="font-bold text-lg text-[#00D4FF] mb-2 tracking-wide font-space">{p.phase}</h3>
              <p className="text-[#8892A4] text-sm mb-4 leading-relaxed font-dm">{p.desc}</p>
              <div className="text-xs font-mono bg-[#00FF88]/10 text-[#00FF88] px-3 py-1.5 rounded inline-block border border-[#00FF88]/30">Est. Protected: {p.protected}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}