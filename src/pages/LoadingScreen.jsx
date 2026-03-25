import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const messages = [
  "Initializing AI Engine...",
  "Loading satellite data...",
  "Connecting sensor network...",
  "Fetching crowd reports...",
  "Calibrating flood models...",
  "System ready."
];

export default function LoadingScreen() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    // Particle background
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      vy: -0.5 - Math.random(),
      opacity: Math.random()
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
      
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.vy;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    // Progress Simulation (3 seconds total)
    const totalTime = 3000;
    const interval = 50;
    let currentProgress = 0;

    const loader = setInterval(() => {
      currentProgress += (100 / (totalTime / interval));
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      
      setMsgIdx(Math.min(Math.floor((currentProgress / 100) * messages.length), messages.length - 1));

      if (currentProgress >= 100) {
        clearInterval(loader);
        setTimeout(() => navigate('/'), 300);
      }
    }, interval);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(loader);
    };
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-[#040812] overflow-hidden flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Water Droplet Logo */}
        <div className="relative w-24 h-24 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]">
            <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="none" stroke="#00D4FF" strokeWidth="3" />
            <clipPath id="waterFill">
              <rect x="0" y={100 - progress} width="100" height="100" />
            </clipPath>
            <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="rgba(0,212,255,0.8)" clipPath="url(#waterFill)" />
          </svg>
        </div>

        {/* Text Appears Letter by Letter */}
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] mb-2 tracking-wider">
          {"FloodSynapse".split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.2 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 30 ? 1 : 0 }}
          className="text-[#8892A4] font-space tracking-widest uppercase text-sm mb-12"
        >
          Smart Flood Intelligence System
        </motion.p>
      </div>

      <div className="absolute bottom-16 w-full max-w-md px-6 z-10 flex flex-col items-center">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] glow-cyan rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono text-[#00D4FF] text-xs h-4">{messages[msgIdx]}</p>
        
        <div className="mt-8 text-[10px] text-[#8892A4]/60 uppercase tracking-widest flex items-center gap-2">
          <span>FloodSynapse Intelligence Engine</span>
          <span className="w-1 h-1 rounded-full bg-[#8892A4]/60"></span>
          <span>NDRF Partnership</span>
        </div>
      </div>
    </div>
  );
}
