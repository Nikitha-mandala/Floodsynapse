import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MobileNav() {
  const { user, t } = useAppContext();
  
  const links = [
    { to: '/dashboard', label: 'nav.dashboard', icon: '🏠' },
    { to: '/map', label: 'nav.map', icon: '🗺️' },
    { to: '/report', label: 'nav.report', icon: '📸' },
    { to: '/routes', label: 'nav.routes', icon: '🚦' },
    { to: '/emergency', label: 'nav.emergency', icon: '🆘' },
    { to: '/profile', label: 'nav.profile', icon: '👤' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0A0E1A] border-t border-[#00D4FF]/20 flex justify-between px-2 py-2 z-[90] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {links.map(l => (
        <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex flex-col items-center justify-center w-full py-1 text-xs transition-colors ${isActive ? 'text-[#00D4FF]' : 'text-[#8892A4] hover:text-white'}`}>
          <span className="text-xl mb-1">{l.icon}</span>
          <span className="text-[9px] text-center font-mono truncate w-full px-1">{t(l.label)}</span>
        </NavLink>
      ))}
    </div>
  );
}
