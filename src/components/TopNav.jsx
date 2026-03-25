import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaBars, FaBell } from 'react-icons/fa';

export default function TopNav() {
  const { user, logout, realtimeData } = useAppContext();
  const navigate = useNavigate();
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' | ' + now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 w-full glass-card border-b border-[#00D4FF]/20 flex items-center justify-between px-6 z-40 bg-[#040812]/90 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#00D4FF] text-xl"><FaBars /></button>
        <Link to="/" className="font-orbitron font-bold tracking-wider text-[#00D4FF] flex items-center gap-2 text-lg">
           <svg viewBox="0 0 100 100" className="w-5 h-5">
            <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="#00D4FF" />
          </svg>
          FloodSynapse
        </Link>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <div className="font-mono text-[#8892A4] text-xs px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
          {time}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="flex items-center gap-2 text-xs font-dm">
            <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse glow-cyan" />
            <span className="text-[#F0F4FF]">Hyderabad, TS</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-dm bg-white/5 px-3 py-1 rounded border border-white/10 relative group">
            <span className={`absolute -top-2 -right-2 text-[8px] font-bold px-1 rounded ${realtimeData.isLive ? 'bg-[#00FF88] text-black' : 'bg-[#8892A4] text-white'}`}>
              {realtimeData.isLive ? 'LIVE DATA' : 'SIMULATED'}
            </span>
            <span>🌧 {realtimeData.rainfall.toFixed(1)}mm</span>
            <span className="text-white/20">|</span>
            <span>{realtimeData.temperature}°C</span>
            <span className="text-white/20">|</span>
            <span className="text-[#FFB347]">⚡ Storm</span>
          </div>
        </div>

        <div className="relative cursor-pointer hover:text-white text-[#8892A4] transition-colors" onClick={() => {
            document.documentElement.classList.toggle('grayscale');
            document.documentElement.classList.toggle('contrast-125');
        }} title="Toggle High Contrast Accessibility Mode">
          <span className="text-xl">♿</span>
        </div>

        <div className="relative cursor-pointer hover:text-white text-[#8892A4] transition-colors" onClick={() => navigate('/alerts')}>
          <FaBell className="text-xl" />
          {realtimeData.activeAlerts > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B3B] text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-pulse-ring">
              {realtimeData.activeAlerts}
            </div>
          )}
        </div>

        {user.isLoggedIn ? (
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-3" onClick={() => navigate('/profile')}>
              <div className="text-right hidden sm:block">
                <div className="font-bold text-sm text-white group-hover:text-[#00D4FF] transition-colors">{user.name}</div>
                {!user.isGuest && <div className="text-[10px] text-[#00FFB3] font-mono">⭐ {user.trustScore} TRUST</div>}
                {user.isGuest && <div className="text-[10px] text-[#FFB347] font-mono border border-[#FFB347]/50 rounded px-1 inline-block">GUEST MODE</div>}
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.isGuest ? 'bg-[#FFB347]/20 text-[#FFB347]' : 'bg-[#00D4FF]/20 text-[#00D4FF]'} border border-current`}>
                {user.avatar}
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-[#0A0E1A] border border-[#00D4FF]/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto p-2">
              <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-2 hover:bg-[#00D4FF]/10 text-sm font-space rounded mb-1 text-[#F0F4FF]">⚙️ Settings</button>
              <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-[#FF3B3B]/10 text-sm font-space rounded text-[#FF3B3B]">🚪 Logout</button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/auth')} className="text-xs font-bold font-space bg-[#00D4FF]/20 text-[#00D4FF] px-4 py-2 rounded border border-[#00D4FF]/50 hover:bg-[#00D4FF] hover:text-[#040812] transition-colors">LOGIN</button>
        )}
      </div>
    </header>
  );
}
