import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { analyzePhoto, analyzeVoiceReport } from '../services/floodAI';
import { FaCamera, FaMicrophone, FaMapPin, FaFileAlt } from 'react-icons/fa';

export default function ReportIncident() {
  const { user, addTrustPoints, realtimeData, t } = useAppContext();
  const [type, setType] = useState('photo'); // photo, voice, pin, text
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);
    const result = await analyzePhoto();
    setAnalysis(result);
    setLoading(false);
    setStep(2);
  };

  const handleVoiceRecord = async () => {
    setLoading(true);
    const result = await analyzeVoiceReport();
    setAnalysis(result);
    setLoading(false);
    setStep(4);
  };

  const submitReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      addTrustPoints(15);
      setTimeout(() => { window.scrollTo(0, 0); setSuccess(false); setStep(1); setAnalysis(null); }, 4000);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto text-white">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Reporting Area */}
        <div className="flex-1 space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-inter font-bold text-[#FF3B3B] mb-2 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,59,59,0.5)]">
                {t('title.report')}
              </h1>
              <p className="text-[#8892A4] text-sm max-w-xl">Help keep your community safe by reporting floods and blocked roads.</p>
            </div>
            {user.isLoggedIn && (
              <div className="hidden md:block text-right bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-[10px] text-[#8892A4] font-mono tracking-widest uppercase mb-1">Your Trust Score</div>
                <div className="text-[#00FFB3] font-bold font-mono">⭐ {user.trustScore}/100 | Trusted Reporter</div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Type Selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'photo', icon: <FaCamera />, label: 'PHOTO' },
                    { id: 'voice', icon: <FaMicrophone />, label: 'VOICE' },
                    { id: 'pin', icon: <FaMapPin />, label: 'QUICK PIN' },
                    { id: 'text', icon: <FaFileAlt />, label: 'TEXT' }
                  ].map(t => (
                    <button 
                      key={t.id} onClick={() => { setType(t.id); setStep(1); setAnalysis(null); }}
                      className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-3 font-space font-bold transition-all ${type === t.id ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF] glow-cyan' : 'glass-card text-[#8892A4] hover:text-white'}`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs tracking-widest">{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* PHOTO FLOW */}
                {type === 'photo' && (
                  <div className="glass-card p-6 md:p-8 rounded-2xl mt-8 relative overflow-hidden">
                    <div className="flex justify-between mb-8 font-mono text-xs tracking-widest text-[#8892A4]">
                      <span className={step >= 1 ? 'text-[#00D4FF]' : ''}>1. UPLOAD</span>
                      <span className={step >= 2 ? 'text-[#00D4FF]' : ''}>2. LOCATION</span>
                      <span className={step >= 3 ? 'text-[#00D4FF]' : ''}>3. DETAILS</span>
                      <span className={step >= 4 ? 'text-[#00D4FF]' : ''}>4. SUBMIT</span>
                    </div>

                    {step === 1 && (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#00D4FF]/40 bg-[#0A0E1A]/50 rounded-2xl h-64 hover:border-[#00D4FF] hover:bg-[#00D4FF]/5 transition-colors cursor-pointer group" onClick={handlePhotoUpload}>
                        {loading ? (
                          <div className="flex flex-col items-center gap-4 text-[#00D4FF] animate-pulse">
                            <div className="w-10 h-10 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
                            <p className="font-mono">🧠 FloodSynapse AI analyzing image context...</p>
                          </div>
                        ) : (
                          <>
                            <FaCamera className="text-4xl text-[#00D4FF]/50 group-hover:text-[#00D4FF] mb-4 transition-colors" />
                            <p className="text-lg font-space font-bold text-white mb-2">Drag photos here or click to upload</p>
                            <p className="text-xs text-[#8892A4]">Accepted: JPG, PNG, MP4 (max 10MB)</p>
                          </>
                        )}
                      </div>
                    )}

                    {step >= 2 && analysis && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="rounded-xl overflow-hidden relative border border-white/10 h-48 bg-[#040812] flex items-center justify-center opacity-80 group">
                            <span className="text-[#8892A4] font-mono">[Image Uploaded Verification]</span>
                            <div className="absolute inset-0 bg-[#00D4FF]/10 z-10" />
                          </div>
                          
                          <div className="bg-[#0A0E1A] p-5 rounded-xl border border-white/5 border-l-4 border-l-[#00FFB3]">
                            <h4 className="flex items-center gap-2 font-bold mb-3 text-[#00FFB3]">🧠 FloodSynapse AI Analysis Result:</h4>
                            <ul className="text-sm font-dm space-y-2 text-white">
                              <li><span className="text-[#8892A4]">Water Level:</span> {analysis.waterLevel}</li>
                              <li><span className="text-[#8892A4]">Passability:</span> <span className="text-[#FF3B3B]">{analysis.passability}</span></li>
                              <li><span className="text-[#8892A4]">Threat Level:</span> <span className="text-[#FFB347] font-bold">{analysis.threatLevel}</span></li>
                              <li><span className="text-[#8892A4]">Confidence:</span> <span className="text-[#00FF88]">{analysis.confidence}</span></li>
                            </ul>
                          </div>
                        </div>
                        
                        {step === 2 && (
                          <div className="flex justify-between items-center bg-[#040812] p-4 rounded-xl border border-white/10">
                             <div>
                               <div className="text-[10px] text-[#8892A4] uppercase font-mono">Location Data</div>
                               <div className="font-bold flex items-center gap-2 text-[#00D4FF]">📍 Kukatpally Main Road <span className="text-xs font-normal text-white">Elev: 498m | River: 0.8km</span></div>
                             </div>
                             <button onClick={()=>setStep(3)} className="bg-[#00D4FF] text-black px-6 py-2 rounded font-bold transition-all glow-cyan hover:bg-[#00FFB3]">Confirm Location</button>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-6 border-t border-white/10 pt-6">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               <button className="py-3 rounded bg-[#FF3B3B]/10 border border-[#FF3B3B] text-[#FF3B3B] font-bold">🔴 CRITICAL</button>
                               <button className="py-3 rounded bg-[#FFB347]/10 border border-[#FFB347] text-[#FFB347]">🟠 HIGH</button>
                               <button className="py-3 rounded bg-white/5 border border-white/10 text-[#8892A4]">🟡 MEDIUM</button>
                               <button className="py-3 rounded bg-white/5 border border-white/10 text-[#8892A4]">🟢 LOW</button>
                             </div>
                             
                             <textarea placeholder="Add any additional details (optional) — Auto translated to 3 languages" className="w-full bg-[#040812] border border-[#8892A4]/30 rounded-lg p-4 text-white focus:border-[#00D4FF] outline-none h-24" />
                             
                             <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#FF3B3B]/30 bg-[#FF3B3B]/5 rounded-lg">
                               <input type="checkbox" className="w-5 h-5 accent-[#FF3B3B]" />
                               <span className="font-bold text-[#FF3B3B]">Request Rescue Immediately — I am in danger</span>
                             </label>

                             <button onClick={() => setStep(4)} className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.4)]">Proceed to Final Review</button>
                          </div>
                        )}

                        {step === 4 && (
                          <div className="space-y-6 pt-6 border-t border-white/10">
                            <div className="bg-[#040812] p-5 rounded-xl border border-white/10 text-center font-space">
                              <h3 className="text-xl font-bold mb-4">Your report will instantly...</h3>
                              <div className="text-sm space-y-3 text-left max-w-sm mx-auto">
                                <p>✅ Be shared with NDRF & Rescue Teams</p>
                                <p>✅ Appear on the live map for 47,000 area users</p>
                                <p>✅ Update AI predictive models</p>
                              </div>
                              <div className="mt-8 bg-[#FFB347]/10 border border-[#FFB347]/30 p-4 rounded-xl text-left max-w-sm mx-auto shadow-inner">
                                <h4 className="font-bold text-[#FFB347] mb-2 flex items-center gap-2">🛡️ Crowd Verification System</h4>
                                <p className="text-[#8892A4] text-xs font-dm leading-relaxed">
                                  When submitted, nearby users will receive an in-app prompt to confirm or deny this report. Reports require <strong>3 confirmations</strong> to be marked as <span className="text-[#00FF88]">Verified</span> globally. 3 denials will flag it as <span className="text-[#FF3B3B]">Unverified</span>. This systematically prevents fake reports and false alarms.
                                </p>
                              </div>
                            </div>
                            <button onClick={submitReport} disabled={loading} className="w-full py-5 bg-[#FF3B3B] text-white font-bold text-xl rounded-xl shadow-[0_0_20px_rgba(255,59,59,0.5)] uppercase tracking-wider disabled:opacity-50">
                              {loading ? 'Submitting & Broadcasting...' : 'Submit Final Report'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* VOICE FLOW STUB */}
                {type === 'voice' && (
                  <div className="glass-card p-12 rounded-2xl mt-8 text-center min-h-[400px] flex flex-col justify-center items-center">
                    <button onClick={handleVoiceRecord} disabled={loading} className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl mb-8 transition-all ${loading ? 'bg-[#FF3B3B] text-white animate-pulse-ring' : 'bg-transparent border-4 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10 glow-cyan'}`}>
                      <FaMicrophone />
                    </button>
                    <h2 className="text-2xl font-space font-bold mb-2">Tap and speak in any language</h2>
                    <p className="text-[#8892A4]">"Paani bahut zyada hai, road band ho gayi"</p>
                    {loading && <p className="mt-8 text-sm font-mono text-[#00D4FF] animate-pulse">Transcribing & AI Analyzing...</p>}
                    
                    {analysis && !loading && (
                      <div className="mt-8 bg-[#040812] p-6 rounded-xl border border-white/10 text-left w-full max-w-lg">
                        <div className="text-[10px] text-[#00FF88] uppercase font-mono tracking-widest mb-1">Transcription & Translation</div>
                        <p className="font-dm italic text-lg mb-4 text-[#F0F4FF]">"Water levels in Kukatpally are very high, waist-deep water on main road, please send help"</p>
                        <ul className="text-sm font-mono space-y-1 text-[#8892A4]">
                          <li>Urgency: <span className="text-[#FF3B3B]">{analysis.urgency}</span></li>
                          <li>Water: {analysis.waterLevel}</li>
                          <li>Location: {analysis.location}</li>
                        </ul>
                        <button onClick={submitReport} className="w-full mt-6 py-3 bg-[#FF3B3B] text-white font-bold rounded">Submit Voice Emergency</button>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 flex flex-col items-center justify-center text-center rounded-2xl min-h-[500px] border-[#00FF88] glow-cyan">
                <div className="w-24 h-24 bg-[#00FF88] rounded-full flex items-center justify-center text-black font-bold text-4xl mb-6 shadow-[0_0_30px_rgba(0,255,136,0.6)] animate-bounce">✓</div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-2">Report Broadcasted!</h2>
                <div className="bg-[#040812] p-4 rounded-xl border border-white/10 text-left mb-8 max-w-md w-full">
                  <p className="font-bold text-[#00FFB3] flex justify-between items-center">
                    <span>Trust Score Increased</span>
                    <span className="text-xl">+15 pts</span>
                  </p>
                  <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] w-[87%]" />
                  </div>
                  <p className="text-[#8892A4] text-xs font-mono mt-2">New Score: {user.trustScore} / 100</p>
                </div>
                <p className="text-[#8892A4] font-dm text-sm">Report #FL-{Date.now().toString().slice(-6)} is now live on the map. 47 nearby users have been notified.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Trust Panel */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          <div className="glass-card p-6 rounded-2xl border-t-4 border-t-[#00D4FF] bg-gradient-to-b from-[#00D4FF]/10 to-transparent">
             <h3 className="font-space font-bold mb-4 flex items-center gap-2">⭐ Trust Score</h3>
             <div className="text-5xl font-mono font-bold text-white tracking-tighter mb-1">{user.trustScore}<span className="text-2xl text-[#8892A4]">/100</span></div>
             <p className="text-[#00FFB3] text-sm font-bold mb-4">Level: TRUSTED REPORTER</p>
             <div className="space-y-2 text-xs text-[#8892A4]">
                <div className="flex justify-between items-center"><span className="flex items-center gap-1">📸 Photo verif.</span> <span className="text-[#00FFB3]">+15p</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1">🎤 Voice report</span> <span className="text-[#00FFB3]">+10p</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1">✅ Confirmations</span> <span className="text-[#00FFB3]">+20p</span></div>
             </div>
             <div className="mt-6 pt-4 border-t border-white/10 text-center">
               <div className="text-[#F0F4FF] font-mono text-[10px] mb-2">PROGRESS TO EXPERT</div>
               <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                 <div className="h-full bg-white w-[87%]" />
               </div>
               <div className="text-xs text-[#8892A4] mt-2">13 pts Remaining</div>
             </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5">
             <h3 className="font-space font-bold mb-4 text-[#FFB347]">🏆 Top Reporters Weekly</h3>
             <div className="space-y-4">
               {[
                 { rank: 1, name: 'Suresh M.', pts: 342, r: 28 },
                 { rank: 2, name: 'Kavitha R.', pts: 298, r: 24 },
                 { rank: 3, name: 'Arjun K.', pts: 267, r: 19 },
                 { rank: 4, name: 'Priya S.', pts: 234, r: 18 },
                 { rank: 5, name: 'You (Ravi)', pts: user.trustScore, r: 14 }
               ].map(u => (
                 <div key={u.rank} className={`flex items-center justify-between p-2 rounded ${u.name.includes('You') ? 'bg-white/10 border border-white/20' : ''}`}>
                   <div className="flex items-center gap-3">
                     <span className={`w-6 text-center font-bold ${u.rank===1 ? 'text-[#FFB347]' : u.rank===2 ? 'text-gray-400' : u.rank===3 ? 'text-yellow-700' : 'text-[#8892A4]'}`}>{u.rank}</span>
                     <div>
                       <div className="text-xs font-bold text-white">{u.name}</div>
                       <div className="text-[10px] text-[#8892A4]">{u.r} reports</div>
                     </div>
                   </div>
                   <div className="font-mono text-xs text-[#00FFB3]">⭐{u.pts}</div>
                 </div>
               ))}
             </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/5 bg-[#000]">
            <h4 className="text-[10px] font-mono text-[#8892A4] tracking-widest mb-3 uppercase">Live Verification Stream</h4>
            <div className="space-y-3 text-[10px] sm:text-xs">
               <div className="text-white">✅ AI verified Photo #FL-8469 [94%]</div>
               <div className="text-white">✅ Report #FL-8471 confirmed by 5</div>
               <div className="text-[#FF3B3B]">❌ Report #FL-8445 rejected / spam</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
