import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FaGlobe, FaMoon, FaBell, FaUniversalAccess, FaPowerOff, FaWifi, FaFont } from 'react-icons/fa';

export default function Settings() {
  const { language, setLanguage, theme, setTheme, offlineMode, setOfflineMode, textSize, setTextSize, logout } = useAppContext();
  const [pushInfo, setPushInfo] = useState(true);
  const [pushWarn, setPushWarn] = useState(true);
  const [smsCrit, setSmsCrit] = useState(true);

  return (
    <div className="p-4 md:p-8 w-full max-w-[1000px] mx-auto space-y-8 text-white">
      
      <div className="mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-white mb-2 pb-4 border-b border-white/10">
          ⚙️ Settings & Preferences
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-6">
           <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-space font-bold text-lg mb-6 flex items-center gap-2"><FaGlobe className="text-[#00D4FF]" /> Platform Language</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               {['English', 'हिंदी (Hindi)', 'తెలుగు (Telugu)'].map(l => (
                  <button key={l} onClick={()=>setLanguage(l)} className={`py-3 rounded transition-colors font-bold tracking-widest ${language === l ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/50' : 'bg-white/5 border border-white/10 text-[#8892A4] hover:text-white'}`}>
                    {l}
                  </button>
               ))}
             </div>
           </div>

           <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-space font-bold text-lg mb-6 flex items-center gap-2"><FaMoon className="text-[#FFB347]" /> UI Theme</h3>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={()=>setTheme('dark')} className={`py-3 rounded transition-colors font-bold ${theme === 'dark' ? 'bg-[#FFB347]/20 text-[#FFB347] border border-[#FFB347]/50' : 'bg-white/5 border border-white/10 text-[#8892A4]'}`}>Dark Space</button>
               <button onClick={()=>setTheme('light')} className={`py-3 rounded transition-colors font-bold ${theme === 'light' ? 'bg-[#FFB347]/20 text-[#FFB347] border border-[#FFB347]/50' : 'bg-white/5 border border-white/10 text-[#8892A4]'}`}>High Con. Light</button>
             </div>
             <p className="text-[10px] text-[#8892A4] font-mono mt-3">High Contrast mode recommended for outdoor glare conditions during daytime rescue.</p>
           </div>

           <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-space font-bold text-lg mb-6 flex items-center gap-2"><FaFont className="text-pink-400" /> Text Size</h3>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={()=>setTextSize('Normal')} className={`py-3 rounded transition-colors font-bold ${textSize === 'Normal' ? 'bg-pink-400/20 text-pink-400 border border-pink-400/50' : 'bg-white/5 border border-white/10 text-[#8892A4]'}`}>Normal</button>
               <button onClick={()=>setTextSize('Large')} className={`py-3 rounded transition-colors font-bold ${textSize === 'Large' ? 'bg-pink-400/20 text-pink-400 border border-pink-400/50' : 'bg-white/5 border border-white/10 text-[#8892A4]'}`}>Large</button>
             </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-space font-bold text-lg mb-6 flex items-center gap-2"><FaBell className="text-[#00FF88]" /> Notifications</h3>
             <div className="space-y-4 font-dm text-sm">
               <label className="flex flex-row-reverse justify-end items-center gap-4 cursor-pointer">
                 <span>Info & Weather Updates</span>
                 <input type="checkbox" checked={pushInfo} onChange={()=>setPushInfo(!pushInfo)} className="w-5 h-5 accent-[#00FF88]" />
               </label>
               <label className="flex flex-row-reverse justify-end items-center gap-4 cursor-pointer">
                 <span>AI Risk Warnings</span>
                 <input type="checkbox" checked={pushWarn} onChange={()=>setPushWarn(!pushWarn)} className="w-5 h-5 accent-[#FFB347]" />
               </label>
               <label className="flex flex-row-reverse justify-end items-center gap-4 cursor-pointer bg-[#FF3B3B]/10 p-3 rounded">
                 <span className="font-bold text-[#FF3B3B]">SMS for Critical Evacuations</span>
                 <input type="checkbox" checked={smsCrit} onChange={()=>setSmsCrit(!smsCrit)} className="w-5 h-5 accent-[#FF3B3B]" />
               </label>
             </div>
           </div>

           <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-space font-bold text-lg mb-6 flex items-center gap-2"><FaUniversalAccess className="text-indigo-400" /> Accessibility</h3>
             <div className="space-y-4 font-dm text-sm">
                <label className="flex items-center justify-between cursor-pointer border-b border-white/10 pb-4">
                  <span>Colorblind Friendly Map Mode</span>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative">
                    <div className="w-4 h-4 bg-[#8892A4] absolute top-1 left-1 rounded-full transition-all" />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer border-b border-white/10 pb-4">
                  <span>Screen Reader Optimization</span>
                  <div className="w-12 h-6 bg-[#00D4FF]/30 rounded-full relative border border-[#00D4FF]">
                    <div className="w-4 h-4 bg-[#00D4FF] absolute top-1 right-1 rounded-full transition-all shadow-glow-cyan" />
                  </div>
                </label>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
