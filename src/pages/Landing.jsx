import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaMapMarkedAlt, FaBrain, FaUsers, FaRoute, FaAmbulance } from 'react-icons/fa';

export default function Landing() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  // HTML5 Canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lightningTimer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Rain particles
    const drops = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      l: Math.random() * 20 + 10,
      v: Math.random() * 10 + 15
    }));

    // Wave points
    let waveOffset = 0;

    const draw = () => {
      // Dark background with slight transparency for motion trail
      ctx.fillStyle = 'rgba(4, 8, 18, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rain
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      drops.forEach(d => {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.l * 0.1, d.y + d.l);
        d.y += d.v;
        d.x -= d.v * 0.1;
        if(d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      });
      ctx.stroke();

      // Water Surface Waves at bottom
      ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.lineTo(i, canvas.height - 100 + Math.sin(i * 0.01 + waveOffset) * 20 + Math.sin(i * 0.02 - waveOffset) * 10);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();
      waveOffset += 0.02;

      // Lightning Effect
      lightningTimer++;
      if (lightningTimer > 480 && Math.random() > 0.9) { // ~8 seconds at 60fps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lightningTimer = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const [taglineIdx, setTaglineIdx] = useState(0);
  const taglines = ["Predict.", "Protect.", "Survive."];

  useEffect(() => {
    const t = setInterval(() => {
      setTaglineIdx(prev => (prev + 1) % taglines.length);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#040812] text-white overflow-x-hidden selection:bg-[#00D4FF] selection:text-black">
      
      {/* Navbar Stub */}
      <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 flex justify-between items-center bg-[#040812]/80">
        <div className="font-orbitron font-bold text-xl tracking-wider text-[#00D4FF] flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="#00D4FF" />
          </svg>
          FloodSynapse
        </div>
        <div className="hidden md:flex gap-6 font-space text-sm text-[#8892A4]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#partners" className="hover:text-white transition-colors">Partners</a>
        </div>
        <div>
          <button onClick={() => navigate('/auth')} className="px-5 py-2 rounded-full border border-[#00D4FF] text-[#00D4FF] text-sm font-bold tracking-wide hover:bg-[#00D4FF]/10 transition-colors animate-pulse-ring">
            LOGIN
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center pt-20">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        
        {/* Depth Fog Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-transparent to-transparent z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full border border-[#FF3B3B]/30 bg-[#FF3B3B]/10 text-[#FF3B3B] text-xs font-mono font-bold tracking-widest mb-8 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF3B3B] animate-ping"></span>
            LIVE — 847 Active Alerts Across India
          </motion.div>

          {/* Drip Title Effect Simulated via staggered span loads */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-6 tracking-tight text-glow-cyan text-transparent bg-clip-text bg-gradient-to-b from-white to-[#00D4FF]">
            FloodSynapse
          </h1>

          <h2 className="text-2xl md:text-4xl font-space font-light mb-8 h-10 text-[#00FFB3]">
            {taglines[taglineIdx]}
          </h2>

          <p className="text-[#8892A4] text-lg md:text-xl max-w-2xl mb-12 font-dm leading-relaxed">
            India's most advanced AI-powered flood intelligence platform — protecting 2.3 million lives with predictive analytics and real-time crowd intel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => navigate('/auth')} className="hover-lift flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-black font-bold font-space tracking-wide glow-cyan">
              <span>🔐</span> Login / Sign Up
            </button>
            <button onClick={() => navigate('/dashboard')} className="hover-lift flex items-center justify-center gap-2 px-8 py-4 rounded-lg glass-card text-white font-bold font-space tracking-wide">
              <span>👁️</span> Continue as Guest
            </button>
            <button onClick={() => navigate('/map')} className="hover-lift flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-[#8892A4]/30 bg-transparent text-[#8892A4] hover:text-white font-bold font-space tracking-wide transition-colors">
              <span>🗺️</span> View Live Map
            </button>
          </div>
        </div>
      </div>

      {/* Live Stats Ticker */}
      <div className="w-full bg-[#00D4FF] text-[#040812] py-3 overflow-hidden font-mono font-bold text-sm tracking-wider whitespace-nowrap flex z-20 relative">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex gap-16 px-8"
        >
          <span>🛡️ 12,400 Lives Protected This Season</span>
          <span>📍 847 Active Flood Alerts</span>
          <span>🎯 99.2% AI Prediction Accuracy</span>
          <span>👥 84,230 Community Reports</span>
          <span>🌊 23 States Covered</span>
          <span>⚡ Real-time updates every 30 seconds</span>
          <span>🏆 #1 Flood Platform in India</span>
          {/* Duplicate for seamless loop */}
          <span>🛡️ 12,400 Lives Protected This Season</span>
          <span>📍 847 Active Flood Alerts</span>
          <span>🎯 99.2% AI Prediction Accuracy</span>
          <span>👥 84,230 Community Reports</span>
          <span>🌊 23 States Covered</span>
          <span>⚡ Real-time updates every 30 seconds</span>
          <span>🏆 #1 Flood Platform in India</span>
        </motion.div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="font-orbitron tracking-widest text-[#00D4FF] text-sm font-bold uppercase mb-4">Core Technology</h3>
          <h2 className="text-4xl md:text-5xl font-space font-bold">Unprecedented Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <FaBrain />, title: "AI Prediction Engine", desc: "Machine learning models trained on 50 years of flood data." },
            { icon: <FaUsers />, title: "Real-Time Crowd Intel", desc: "Verified reports from 2.3 million users across India." },
            { icon: <FaMapMarkedAlt />, title: "Dynamic Flood Mapping", desc: "Live color-coded maps updated every 60 seconds." },
            { icon: <FaRoute />, title: "Smart Route Planning", desc: "AI reroutes you around floods before they happen." },
            { icon: <FaAmbulance />, title: "Emergency Response", desc: "One-tap SOS with nearest rescue team dispatch." },
            { icon: <FaShieldAlt />, title: "Predictive Analytics", desc: "See floods 6 hours before they occur." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl hover-lift group"
            >
              <div className="w-14 h-14 bg-[#00D4FF]/10 rounded-xl flex items-center justify-center text-[#00D4FF] text-2xl mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-xl font-space font-bold mb-3">{f.title}</h4>
              <p className="text-[#8892A4] font-dm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="py-24 bg-[#0A0E1A] px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-space font-bold mb-16">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 glass-card p-8 rounded-2xl border-[#00FFB3]/30">
              <div className="text-4xl mb-4">👥 + 🛰️</div>
              <h4 className="font-bold text-[#00FFB3] mb-2">Step 1</h4>
              <p className="text-sm text-[#8892A4]">Community reports & Satellite data ingested</p>
            </div>
            <div className="hidden md:block text-[#00D4FF] text-3xl">→</div>
            <div className="flex-1 glass-card p-8 rounded-2xl border-[#00D4FF]/30 glow-cyan">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="font-bold text-[#00D4FF] mb-2">Step 2</h4>
              <p className="text-sm text-[#8892A4]">FloodSynapse AI analyzes and predicts risk patterns</p>
            </div>
            <div className="hidden md:block text-[#00D4FF] text-3xl">→</div>
            <div className="flex-1 glass-card p-8 rounded-2xl border-white/10">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="font-bold text-white mb-2">Step 3</h4>
              <p className="text-sm text-[#8892A4]">You receive alerts and guaranteed safe routes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-20 border-t border-b border-white/5 opacity-80">
        <div className="max-w-5xl mx-auto text-center px-6">
          <p className="font-space text-sm tracking-widest text-[#8892A4] mb-8 uppercase">Trusted by Government & Emergency Services</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale">
            {["NDRF", "IMD", "ISRO", "Telangana Govt", "SDRF", "Red Cross"].map((logo) => (
              <h3 key={logo} className="font-orbitron font-bold text-xl md:text-2xl text-white/50">{logo}</h3>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { q: "FloodSynapse warned us 4 hours before the flood hit.", a: "Ramesh K., Warangal" },
            { q: "The route planner saved my family's life.", a: "Priya S., Hyderabad" },
            { q: "Best flood monitoring tool we've ever used.", a: "IPS Officer, NDRF" }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-xl opacity-80 hover:opacity-100 transition-opacity">
              <div className="text-[#00D4FF] text-4xl font-space mb-4">"</div>
              <p className="font-dm text-lg mb-6 leading-relaxed">"{item.q}"</p>
              <p className="font-mono text-xs text-[#8892A4] uppercase">— {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="bg-[#0A0E1A] py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="#00D4FF" />
            </svg>
            <span className="font-orbitron font-bold text-xl tracking-wide">FloodSynapse</span>
          </div>
          <div className="flex gap-6 text-[#8892A4] font-space text-sm">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Features</a>
            <a href="#" className="hover:text-white">Emergency</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <div className="text-[#8892A4] text-xs font-mono">
            Available on: 📱 Android | 🍎 iOS | 💻 Web
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-[#8892A4]/50 text-xs mt-12 font-mono">
          © 2025 FloodSynapse. Built for Hackathon 2025.
        </div>
      </footer>

    </div>
  );
}
