import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { user, realtimeData, t, showToast } = useAppContext();

  const mainLinks = [
    { to: '/dashboard', label: 'nav.dashboard', icon: '🏠', badge: null },
    { to: '/map', label: 'nav.map', icon: '🗺️', badge: null },
    { to: '/report', label: 'nav.report', icon: '📸', badge: 'NEW' },
    { to: '/routes', label: 'nav.routes', icon: '🚦', badge: null },
    { to: '/emergency', label: 'nav.emergency', icon: '🆘', alert: true },
    { to: '/preparedness', label: 'Checklist', icon: '📝', badge: null },
    { to: '/volunteers', label: 'Volunteers', icon: '🤝', badge: null },
    { to: '/roadmap', label: 'Roadmap', icon: '🚀', badge: null },
    { to: '/profile', label: 'nav.profile', icon: '👤', badge: null },
    { to: '/settings', label: 'nav.settings', icon: '⚙️', badge: null }
  ];



  const Item = ({ to, label, icon, badge, alert }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-space transition-all mb-1 ` +
        (isActive 
          ? `bg-[#00D4FF]/10 text-[#00D4FF] border-l-4 border-[#00D4FF] shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]` 
          : `text-[#8892A4] border-l-4 border-transparent hover:bg-white/5 hover:text-white`) +
        (alert && isActive ? ` bg-[#FF3B3B]/10 text-[#FF3B3B] border-[#FF3B3B]` : alert ? ` hover:text-[#FF3B3B]` : ``)
      }
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span>{t(label)}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === 'NEW' ? 'bg-[#FF3B3B] text-white' : 'bg-[#FFB347] text-black'} `}>
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-[#0A0E1A] border-r border-[#00D4FF]/10 z-30 pt-4 overflow-y-auto">
      
      <div className="px-2 mb-6 flex-1 pt-6">
        {mainLinks.map(l => <Item key={l.to} {...l} />)}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#040812]">
         <div className="flex items-center gap-2 text-xs text-[#00FF88] font-mono mb-2">
           <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse glow-cyan" />
           All systems operational
         </div>
         <div className="text-[10px] text-[#8892A4] font-mono">FloodSynapse v2.1.0</div>
      </div>
    </div>
  );
}
