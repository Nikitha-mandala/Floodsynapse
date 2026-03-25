import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Volunteers() {
  const { showToast } = useAppContext();
  const [form, setForm] = useState({ name: '', phone: '', focus: 'Rescue', blood: 'O+' });
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
    showToast(`Thank you ${form.name}! You are now a registered volunteer.`);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1200px] mx-auto text-white mt-12 md:mt-0">
      <h1 className="text-3xl font-inter font-bold text-[#FFB347] mb-2">Volunteer Force</h1>
      <p className="text-[#8892A4] text-sm mb-8">Join the community response team. Save lives.</p>
      
      {!registered ? (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl max-w-xl mx-auto space-y-6">
           <h2 className="text-xl font-space font-bold border-b border-white/10 pb-4">Register as a Volunteer</h2>
           <input required type="text" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-[#040812] border border-white/10 rounded p-3 text-white focus:border-[#00D4FF] outline-none" />
           <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-[#040812] border border-white/10 rounded p-3 text-white focus:border-[#00D4FF] outline-none" />
           
           <div className="space-y-2">
             <label className="text-xs text-[#8892A4] uppercase tracking-widest font-mono">Primary Skill / Equipment</label>
             <select value={form.focus} onChange={e=>setForm({...form, focus: e.target.value})} className="w-full bg-[#040812] border border-white/10 rounded p-3 text-white focus:border-[#00D4FF] outline-none">
                <option>First Aid / Medical</option>
                <option>Boat / Raft Owner</option>
                <option>Food Distribution</option>
                <option>Heavy Vehicle Driver</option>
                <option>General Rescue</option>
             </select>
           </div>
           
           <button type="submit" className="w-full py-4 bg-[#FFB347] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-orange-500 transition shadow-[0_0_15px_rgba(255,179,71,0.4)]">Complete Registration</button>
        </form>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl border border-[#00FF88] glow-cyan max-w-xl mx-auto mt-16">
          <div className="w-24 h-24 bg-[#00FF88] rounded-full mx-auto flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(0,255,136,0.6)] animate-pulse">🤝</div>
          <h2 className="text-2xl font-bold text-[#00FF88] mb-4">Registered Successfully!</h2>
          <p className="text-[#8892A4] leading-relaxed">You will receive SMS alerts natively from the District Collector if your skills are needed in your pincode.</p>
        </div>
      )}
    </div>
  );
}
