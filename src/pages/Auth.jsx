import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsFingerprint, BsMicFill } from 'react-icons/bs';
import { auth } from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';

export default function Auth() {
  const { login, loginGuest, setLanguage, language } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [tab, setTab] = useState('otp');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVals, setOtpVals] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showTrust, setShowTrust] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLangSelect = (lang) => {
    setLanguage(lang);
    setTimeout(() => setStep(1), 500);
  };

  useEffect(() => {
    if (showTrust) {
      setTimeout(() => {
        login({ name: name || 'User', phone: '+91' + phone, trustScore: 87, reports: 14 });
        navigate('/dashboard');
      }, 3000);
    }
  }, [showTrust, login, phone, navigate, name]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier && auth) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handleSendOtp = async () => {
    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!phone || phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit number");
      return;
    }
    
    setErrorMsg('');
    if (auth && import.meta.env.VITE_FIREBASE_API_KEY) {
      try {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formattedPhone = '+91' + phone;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
      } catch (error) {
        console.error("SMS Error:", error);
        setErrorMsg("Failed to send OTP. Please try again.");
      }
    } else {
      // Fallback Demo Mode
      setOtpSent(true);
      const timer = setTimeout(() => {
        setOtpVals(['1', '2', '3', '4', '5', '6']);
        setTimeout(() => setShowTrust(true), 500);
      }, 3000);
    }
  };

  const verifyOtp = async () => {
    const code = otpVals.join('');
    if (code.length < 6) return;
    
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(code);
        setShowTrust(true);
      } catch (error) {
        setErrorMsg("Invalid OTP Code.");
      }
    } else {
      setShowTrust(true);
    }
  };

  const handleGoogle = () => {
    setTimeout(() => {
      login({ name: name || 'User', phone: 'Google Verified', trustScore: 87 });
      navigate('/dashboard');
    }, 1500);
  };

  const handleGuest = () => {
    loginGuest();
    navigate('/dashboard');
  };

  const handleOtpChange = (i, val) => {
    const newOtp = [...otpVals];
    newOtp[i] = val.slice(-1);
    setOtpVals(newOtp);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`).focus();
    }
  };

  // Watch for auto-verify if 6 digits filled and manual mode
  useEffect(() => {
    if (otpVals.every(v => v !== '') && !showTrust && confirmationResult) {
       verifyOtp();
    }
  }, [otpVals]);

  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#040812] text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-orbitron font-bold mb-4">Choose your language</h1>
          <h2 className="text-xl md:text-2xl text-[#8892A4]">अपनी भाषा चुनें / మీ భాష ఎంచుకోండి</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
          {['English', 'हिंदी (Hindi)', 'తెలుగు (Telugu)'].map((lang, idx) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
              onClick={() => handleLangSelect(lang)}
              className={`glass-card p-10 flex flex-col items-center justify-center cursor-pointer rounded-2xl group ${language === lang ? 'border-[#00D4FF]' : 'border-white/10'}`}
            >
              <div className="text-5xl mb-6">🇮🇳</div>
              <div className={`font-bold text-2xl ${language === lang ? 'text-[#00D4FF]' : 'text-white'}`}>{lang}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#040812] overflow-hidden text-[#F0F4FF]">

      <div className="hidden md:flex md:w-2/5 relative flex-col justify-center items-start p-12 bg-gradient-to-br from-[#0A0E1A] to-[#040812] border-r border-[#00D4FF]/20 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#00D4FF] fill-current animate-pulse">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" />
          </svg>
        </div>
        <div className="relative z-10 w-full">
          <h1 className="text-5xl font-orbitron font-bold tracking-wide mb-8 text-[#00D4FF]">Welcome to FloodSynapse</h1>
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="bg-[#00FF88]/20 text-[#00FF88] p-3 rounded-full text-xl font-bold">✓</div>
              <div>
                <h3 className="font-bold text-lg">2.3M Users Protected</h3>
                <p className="text-[#8892A4] text-sm">Active real-time reporting network</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="bg-[#00D4FF]/20 text-[#00D4FF] p-3 rounded-full text-xl font-bold">✓</div>
              <div>
                <h3 className="font-bold text-lg">99.2% Uptime</h3>
                <p className="text-[#8892A4] text-sm">Resilient during extreme weather</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="bg-[#FFB347]/20 text-[#FFB347] p-3 rounded-full text-xl font-bold">✓</div>
              <div>
                <h3 className="font-bold text-lg">Govt Certified</h3>
                <p className="text-[#8892A4] text-sm">NDRF and IMD integrated protocols</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="flex bg-[#0A0E1A] p-2 rounded-xl border border-[#8892A4]/30 mb-10 text-sm">
            {['otp', 'google', 'guest'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 px-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${tab === t ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/50' : 'text-[#8892A4] hover:text-white'}`}
              >
                {t === 'otp' ? '📱 Mobile OTP' : t === 'google' ? '🔑 Google' : '👁️ Guest'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {tab === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {!otpSent ? (
                  <div className="glass-card p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Enter Mobile Number</h2>
                    {errorMsg && <div className="text-[#FF3B3B] text-sm mb-4">{errorMsg}</div>}
                    <div className="flex flex-col gap-4 mb-4">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your Name"
                        className="w-full bg-[#040812] border border-[#00D4FF]/30 rounded-lg px-4 py-4 text-[#F0F4FF] outline-none font-mono text-lg"
                      />
                      <div className="flex gap-4">
                        <select className="bg-[#040812] border border-[#00D4FF]/30 rounded-lg px-4 text-[#F0F4FF] outline-none">
                          <option>+91 🇮🇳</option>
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="flex-1 bg-[#040812] border border-[#00D4FF]/30 rounded-lg px-4 py-4 text-[#F0F4FF] outline-none font-mono text-lg"
                        />
                      </div>
                    </div>
                    <div id="recaptcha-container" className="mb-4"></div>
                    <button
                      onClick={handleSendOtp}
                      className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#040812] font-bold rounded-lg tracking-wide mb-6"
                    >
                      SEND OTP
                    </button>
                    <div className="flex justify-between mt-6">
                      <button className="flex flex-col items-center gap-2 text-xs text-[#8892A4] hover:text-[#00D4FF] transition-colors">
                        <BsMicFill className="text-lg" />
                        Voice Login (Beta)
                      </button>
                      <button className="flex flex-col items-center gap-2 text-xs text-[#8892A4] hover:text-[#00D4FF] transition-colors">
                        <BsFingerprint className="text-lg" />
                        Use Fingerprint
                      </button>
                    </div>
                  </div>
                ) : !showTrust ? (
                  <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                    {!confirmationResult && <span className="absolute top-2 right-4 text-[10px] text-[#00D4FF] animate-pulse font-mono border border-[#00D4FF]/30 px-2 py-1 rounded">Demo Auto-filling...</span>}
                    <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
                    <p className="text-[#8892A4] mb-4 text-sm">Code sent to +91 {phone || '98765 43210'}</p>
                    {errorMsg && <div className="text-[#FF3B3B] text-sm mb-4">{errorMsg}</div>}
                    <div className="flex gap-2 justify-between mb-8">
                      {otpVals.map((v, i) => (
                        <input
                          key={i} id={`otp-${i}`}
                          type="text" maxLength={1} value={v}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-12 h-14 bg-[#040812] border border-[#00D4FF]/30 rounded-lg text-center text-2xl font-mono text-[#00FFB3] outline-none"
                        />
                      ))}
                    </div>
                    <div className="text-center font-mono text-xs text-[#FFB347] mb-6 animate-pulse">
                      Resend in 00:57
                    </div>
                    <button onClick={verifyOtp} disabled={otpVals.some(v => v === '')} className="w-full py-4 border border-[#00D4FF]/30 text-[#00D4FF] font-bold rounded-lg disabled:opacity-50">
                      VERIFY
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 rounded-2xl text-center">
                    <div className="w-20 h-20 bg-[#00FF88]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="w-16 h-16 bg-gradient-to-tr from-[#00D4FF] to-[#00FFB3] rounded-full flex items-center justify-center text-2xl font-bold text-[#040812]">✓</div>
                    </div>
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Welcome back, {name || 'User'}!</h2>
                    <div className="bg-[#040812]/50 border border-[#00FFB3]/30 rounded-xl p-4 inline-block mt-4 text-left">
                      <p className="font-bold text-[#00FFB3]">Trust Score: 87/100 ⭐ TRUSTED</p>
                      <p className="text-[#8892A4] text-sm mt-1">14 past reports | 1,240 trust points</p>
                    </div>
                    <div className="mt-8 font-mono text-xs text-[#00D4FF] animate-pulse">Redirecting to Command Center...</div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {tab === 'google' && (
              <motion.div key="google" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-10 rounded-2xl text-center">
                <FcGoogle className="text-6xl mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-8">Sign in with Google</h2>
                <button onClick={handleGoogle} className="w-full bg-white text-gray-800 py-4 rounded-xl font-bold flex items-center justify-center gap-3">
                  <FcGoogle className="text-2xl" /> Continue with Google
                </button>
              </motion.div>
            )}

            {tab === 'guest' && (
              <motion.div key="guest" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-2xl border-[#FFB347]/50 relative overflow-hidden">
                <div className="absolute top-0 w-full left-0 bg-[#FFB347] text-black text-xs font-bold font-mono text-center py-1">WARNING: VIEW-ONLY MODE</div>
                <h2 className="text-2xl font-bold mb-6 mt-6">Continue as Guest</h2>
                <div className="space-y-4 mb-10 border-l-2 border-[#FFB347] pl-4">
                  <p className="flex justify-between"><span className="text-[#8892A4]">View Live Map</span><span className="text-[#00FFB3]">✅</span></p>
                  <p className="flex justify-between"><span className="text-[#8892A4]">See Active Alerts</span><span className="text-[#00FFB3]">✅</span></p>
                  <p className="flex justify-between"><span className="text-[#8892A4]">Submit Flood Reports</span><span className="text-[#FF3B3B]">❌</span></p>
                  <p className="flex justify-between"><span className="text-[#8892A4]">Earn Trust Score</span><span className="text-[#FF3B3B]">❌</span></p>
                </div>
                <button onClick={handleGuest} className="w-full py-4 bg-[#FFB347] text-black font-bold rounded-xl">
                  ENTER AS GUEST
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          <p className="text-center mt-12 text-[#8892A4] text-xs opacity-50 tracking-wide uppercase">
            By continuing, you agree to help save lives 🤝
          </p>
        </div>
      </div>
    </div>
  );
}