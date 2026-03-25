import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function UserProfile() {
  const { user, showToast } = useAppContext();

  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem('emergencyContacts')) ||
    [{ name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }]
  );

  const saveContacts = () => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    showToast('Emergency contacts saved securely.');
  };

  const data = {
    labels: ['Reporting Vol.', 'AI Accuracy Match', 'Community Confirms', 'Response Speed', 'Area Coverage'],
    datasets: [
      {
        label: 'Your Stats',
        data: [80, 95, 70, 85, 60],
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderColor: '#00D4FF',
        borderWidth: 2,
      },
      {
        label: 'Avg User',
        data: [40, 60, 45, 50, 30],
        backgroundColor: 'rgba(136, 146, 164, 0.1)',
        borderColor: '#8892A4',
        borderDash: [5, 5],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#8892A4', font: { size: 10 } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { labels: { color: 'white' } }
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="p-4 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 text-white">

      <div className="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 border-[#00D4FF]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF] opacity-[0.05] rounded-full blur-3xl" />

        <div className="w-32 h-32 rounded-full border-4 border-[#00D4FF] flex items-center justify-center text-5xl font-bold bg-[#040812] text-[#00D4FF] shrink-0 relative">
          {initials}
          <div className="absolute -bottom-2 -right-2 bg-[#00FF88] text-black text-[10px] uppercase font-bold px-2 py-1 rounded border-2 border-black">Verified</div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
          <p className="text-[#8892A4] font-mono text-xs mb-4">Member since {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} | FloodSynapse Community</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">🎖️ Community Member</span>
          </div>
        </div>

        <div className="w-full md:w-64 bg-[#040812] p-4 rounded-xl border border-white/10 text-center relative z-10 shrink-0">
          <div className="text-[10px] text-[#8892A4] uppercase font-mono mb-2 tracking-widest">Trust Score</div>
          <div className="text-4xl font-mono text-[#00FFB3] mb-2">{user?.trustScore || 0}<span className="text-sm text-[#8892A4]">/100</span></div>
          <p className="text-xs text-[#8892A4]">{user?.reports || 0} reports submitted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
              <span>⭐ Trust Level Progress</span>
              <span className="text-[#00D4FF] text-2xl font-mono">{user?.trustScore || 0}<span className="text-xs text-[#8892A4]">/100</span></span>
            </h3>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] transition-all duration-1000" style={{ width: `${user?.trustScore || 0}%` }} />
            </div>

            <p className="text-xs text-[#8892A4] mt-4 text-center">
              {user?.trustScore === 0
                ? 'Submit your first flood report to start building your trust score.'
                : `You have earned ${user?.trustScore} trust points. Keep reporting to level up.`}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-l-[3px] border-l-[#FFB347]">
            <h3 className="font-bold text-lg mb-4 text-[#FFB347]">🥇 Badges</h3>
            <div className="flex flex-wrap gap-4">
              {(user?.reports || 0) >= 1 ? (
                <div className="w-16 h-16 rounded-full border-2 border-[#00D4FF] bg-[#00D4FF]/10 flex items-center justify-center text-2xl cursor-help" title="First Report">📸</div>
              ) : (
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-2xl opacity-20 grayscale cursor-help" title="Submit your first report to unlock">🔒</div>
              )}
              {(user?.reports || 0) >= 5 ? (
                <div className="w-16 h-16 rounded-full border-2 border-[#FFB347] bg-[#FFB347]/10 flex items-center justify-center text-2xl cursor-help" title="5 Reports">🤝</div>
              ) : (
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-2xl opacity-20 grayscale cursor-help" title="Submit 5 reports to unlock">🔒</div>
              )}
              {(user?.reports || 0) >= 10 ? (
                <div className="w-16 h-16 rounded-full border-2 border-[#00FF88] bg-[#00FF88]/10 flex items-center justify-center text-2xl cursor-help animate-pulse" title="10 Reports">🌙</div>
              ) : (
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-2xl opacity-20 grayscale cursor-help" title="Submit 10 reports to unlock">🔒</div>
              )}
            </div>
            <p className="text-xs text-[#8892A4] mt-4">Badges are earned by submitting real flood reports.</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <h3 className="font-bold text-lg mb-4 w-full text-left">🧠 Activity Analysis</h3>
          <div className="w-full max-w-[300px] flex-1">
            <Radar data={data} options={options} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col max-h-[500px]">
          <h3 className="font-bold text-lg mb-6 pb-4 border-b border-white/10">📜 Recent Contributions</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {(user?.reports || 0) === 0 ? (
              <div className="text-center text-[#8892A4] text-sm mt-8">
                <div className="text-4xl mb-4">📭</div>
                <p>No contributions yet.</p>
                <p className="text-xs mt-2">Submit your first flood report to see your activity here.</p>
              </div>
            ) : (
              <div className="text-sm text-[#8892A4] text-center mt-4">Your recent reports will appear here.</div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-[3px] border-l-[#FF3B3B] max-h-[500px] flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-[#FF3B3B] flex items-center justify-between">
            <span>🚨 Emergency Contacts</span>
            <span className="text-[10px] text-[#8892A4] bg-white/5 px-2 py-1 rounded">Saved on device</span>
          </h3>
          <p className="text-xs text-[#8892A4] mb-4">Used for one-tap SMS SOS during emergencies. Stored only on your device.</p>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {contacts.map((c, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-[10px] uppercase text-[#8892A4] font-mono tracking-widest">Contact {i + 1}</div>
                <input type="text" placeholder="Name (e.g. Father)" value={c.name} onChange={e => { let n = [...contacts]; n[i].name = e.target.value; setContacts(n); }} className="bg-[#040812] border border-white/10 rounded px-3 py-2 text-white w-full outline-none focus:border-[#00D4FF]" />
                <input type="tel" placeholder="Phone Number" value={c.phone} onChange={e => { let n = [...contacts]; n[i].phone = e.target.value; setContacts(n); }} className="bg-[#040812] border border-white/10 rounded px-3 py-2 text-white w-full outline-none focus:border-[#00D4FF]" />
              </div>
            ))}
            <button onClick={saveContacts} className="w-full py-3 bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/30 border border-[#FF3B3B]/50 text-[#FF3B3B] transition rounded-lg font-bold">
              Save Emergency Contacts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}