import React, { useState } from 'react';

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;

  return (
    <div className="bg-[#FFB347]/10 border-b border-[#FFB347]/30 text-[#FFB347] px-4 py-2 text-xs font-mono tracking-widest flex justify-between items-center z-[100] relative w-full">
      <div className="flex items-center gap-2">
        <span className="animate-pulse">📡</span> 
        DEMO MODE — All flood data is simulated for demonstration purposes
      </div>
      <button onClick={() => setVisible(false)} className="hover:text-white px-2 cursor-pointer">✕</button>
    </div>
  );
}
