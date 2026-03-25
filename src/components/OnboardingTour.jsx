import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function OnboardingTour() {
  const { tourCompleted, completeTour } = useAppContext();
  const [step, setStep] = useState(0);

  if (tourCompleted) return null;

  const steps = [
    { title: "Dashboard Command Center", desc: "Welcome! This is your intelligence hub. Monitor active tracking here." },
    { title: "Live Reporting", desc: "Earn Trust points by uploading verified photos of flooded zones." },
    { title: "Risk Indicators", desc: "Pay attention to the threat gauges. They analyze factors every 15s." },
    { title: "Emergency Trigger", desc: "If you detect HIGH risk, this will automatically highlight." },
    { title: "Ask FloodSynapse AI", desc: "The chatbot can generate tailored safe routes. Have a safe journey!" }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else completeTour();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040812]/80 backdrop-blur-sm">
      <div className="glass-card w-[400px] p-8 rounded-2xl border-[#00D4FF]/40 glow-cyan relative overflow-hidden">
        {/* Progress header */}
        <div className="flex gap-1 mb-6">
           {steps.map((_, i) => (
             <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#00D4FF]' : 'bg-white/20'}`} />
           ))}
        </div>
        
        <h2 className="text-2xl font-orbitron font-bold text-[#00D4FF] mb-3">
          {steps[step].title}
        </h2>
        <p className="text-[#8892A4] font-dm mb-8 leading-relaxed">
          {steps[step].desc}
        </p>

        <div className="flex justify-between items-center">
          <button onClick={completeTour} className="text-[#8892A4] text-sm hover:text-white transition-colors">
            Skip Tour
          </button>
          <button onClick={handleNext} className="bg-[#00D4FF] text-black px-6 py-2 rounded font-bold hover:bg-[#00FFB3] transition-colors shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            {step === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
