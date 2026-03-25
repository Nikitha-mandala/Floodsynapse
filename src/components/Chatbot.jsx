import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatResponse } from '../services/floodAI';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am the FloodSynapse AI. Ask me about flood risks, safe routes, or emergency procedures in your area.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const reply = await chatResponse(userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#00D4FF] text-[#040812] rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,212,255,0.6)] hover:scale-110 transition-transform z-50 animate-ripple"
      >
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <path d="M50 5 C50 5, 20 40, 20 65 A30 30 0 0 0 80 65 C80 40, 50 5, 50 5 Z" fill="#040812" />
        </svg>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 max-h-[500px] h-[70vh] glass-card border-[#00D4FF]/30 rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#00D4FF]/10 border-b border-[#00D4FF]/20 px-4 py-3 flex justify-between items-center">
              <div>
                <h3 className="font-orbitron font-bold text-[#00D4FF] flex items-center gap-2">
                  🧠 FloodSynapse AI
                </h3>
                <p className="text-[10px] font-mono text-[#00FFB3]">● Online | FloodSynapse Intelligence Engine</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#8892A4] hover:text-white">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-dm text-sm scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-[#00D4FF] text-[#040812] rounded-br-sm' 
                      : 'bg-[#0A0E1A] border border-white/10 text-[#F0F4FF] rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#0A0E1A] border border-white/10 text-[10px] p-3 rounded-2xl rounded-bl-sm font-mono text-[#00D4FF] animate-pulse">
                    FloodSynapse AI is analyzing...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#0A0E1A] border-t border-white/10">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about safe routes..."
                  className="flex-1 bg-[#040812] border border-white/10 rounded-full py-2 px-4 pr-10 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                />
                <button type="button" className="absolute right-12 top-2.5 text-[#8892A4] hover:text-[#00D4FF]">🎤</button>
                <button type="submit" disabled={!input.trim() || isTyping} className="w-9 h-9 bg-[#00D4FF] text-black rounded-full flex items-center justify-center disabled:opacity-50">
                  ↑
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
