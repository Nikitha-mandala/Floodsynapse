import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function EmergencyTrigger() {
  const navigate = useNavigate();
  const { realtimeData, emergencyMode } = useAppContext();
  
  // Auto trigger if river level > 7.3
  const isCritical = realtimeData.riverLevel > 7.3;

  if (!isCritical || emergencyMode) return null;

  return (
    <div className="w-full bg-[#FF3B3B]/20 border-b-2 border-[#FF3B3B] px-4 py-3 z-[90] relative flex items-center justify-between text-[#F0F4FF] animate-pulse">
      <div className="flex items-center gap-3 font-orbitron font-bold">
        <span className="text-2xl drop-shadow-[0_0_10px_red]">🚨</span>
        <span className="tracking-wide text-[#FF3B3B] drop-shadow-[0_0_10px_red]">FLOOD EMERGENCY: CRITICAL RISK IN YOUR AREA</span>
      </div>
      <button 
        onClick={() => navigate('/emergency')}
        className="px-6 py-2 bg-[#FF3B3B] text-white font-bold font-space rounded hover:bg-red-600 transition-colors animate-pulse-ring"
      >
        ACTIVATE EMERGENCY MODE
      </button>
    </div>
  );
}
