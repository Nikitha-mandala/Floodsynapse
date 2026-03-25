import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Preparedness() {
  const { t } = useAppContext();
  const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('prepChecklist')) || new Array(15).fill(false));

  useEffect(() => {
    localStorage.setItem('prepChecklist', JSON.stringify(checked));
  }, [checked]);

  const items = [
    { cat: 'Before', task: 'Know your alert levels and safe routes' },
    { cat: 'Before', task: 'Prepare a Go-Bag with essentials' },
    { cat: 'Before', task: 'Elevate critical documents and appliances' },
    { cat: 'Before', task: 'Clear drains and gutters around home' },
    { cat: 'Before', task: 'Save emergency contacts in SMS format' },
    { cat: 'During', task: 'Disconnect main power switch' },
    { cat: 'During', task: 'Move to higher ground immediately' },
    { cat: 'During', task: 'Do not walk through moving water' },
    { cat: 'During', task: 'Do not drive into flooded areas' },
    { cat: 'During', task: 'Follow NDRF and local authority updates' },
    { cat: 'After', task: 'Return home only when declared safe' },
    { cat: 'After', task: 'Photograph damage before cleanup' },
    { cat: 'After', task: 'Boil drinking water for 7 days' },
    { cat: 'After', task: 'Throw away flood-contacted food' },
    { cat: 'After', task: 'Watch for snakes and displaced animals' }
  ];

  const toggle = (i) => {
    const arr = [...checked];
    arr[i] = !arr[i];
    setChecked(arr);
  };

  const score = checked.filter(Boolean).length;

  return (
    <div className="p-4 md:p-8 w-full max-w-[1200px] mx-auto text-white mt-12 md:mt-0">
      <h1 className="text-3xl font-inter font-bold text-[#00D4FF] mb-2">Are You Prepared?</h1>
      <p className="text-[#8892A4] text-sm mb-8">Follow this 15-point checklist to secure your family.</p>
      
      <div className="glass-card p-6 rounded-2xl mb-8 border-l-4 border-l-[#00FF88]">
        <h2 className="text-xl font-bold mb-2 text-[#00FF88]">Preparedness Score: {score}/15</h2>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] transition-all duration-500" style={{ width: `${(score/15)*100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Before', 'During', 'After'].map(category => (
          <div key={category} className="glass-card p-6 rounded-xl border border-white/5 bg-[#0A0E1A]">
            <h3 className="text-[#FFB347] font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">{category} a Flood</h3>
            <div className="space-y-4">
               {items.map((item, i) => item.cat === category && (
                 <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${checked[i] ? 'bg-[#00FF88]/10 border-[#00FF88]/30' : 'bg-white/5 border-white/10 hover:bg-white/10'} cursor-pointer transition-colors`}>
                   <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} className="mt-1 accent-[#00FF88] w-4 h-4 cursor-pointer flex-shrink-0" />
                   <span className={`text-sm ${checked[i] ? 'text-white/50 line-through' : 'text-white'}`}>{item.task}</span>
                 </label>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
