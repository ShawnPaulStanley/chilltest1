import React, { useState, useEffect } from 'react';
import { Wind, Play } from 'lucide-react';

export const Wellness: React.FC = () => {
  const [breatheState, setBreatheState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [isActive, setIsActive] = useState(false);

  // Breathing Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let isMounted = true;

    const cycle = async () => {
      if (!isMounted || !isActive) return;

      // Inhale 4s
      setBreatheState('Inhale');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;
      
      // Hold 4s
      setBreatheState('Hold');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;
      
      // Exhale 4s
      setBreatheState('Exhale');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;

      // Removed the post-exhale Hold phase as requested
      // Loop immediately back to Inhale (handled by the interval)
    };

    if (isActive) {
      // Run immediately
      cycle();
      // Then loop every 12 seconds (4+4+4)
      interval = setInterval(() => {
         cycle();
      }, 12000); 
    } else {
      setBreatheState('Ready');
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border-2 border-dashed border-pastel-lavender/50 flex flex-col items-center justify-center h-full min-h-[250px]">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2 text-pastel-text dark:text-pastel-darkText opacity-70">
          <Wind size={18} />
          <h3 className="font-hand text-xl">Breathing Exercise</h3>
        </div>
      </div>

      <div 
        onClick={() => setIsActive(!isActive)}
        className="relative w-32 h-32 flex items-center justify-center my-2 cursor-pointer group"
      >
        {/* Breathing Circles */}
        <div className={`
          absolute inset-0 bg-pastel-mint/30 rounded-full blur-xl transition-all duration-[4000ms] ease-in-out
          ${isActive && breatheState === 'Inhale' ? 'scale-110 opacity-100' : isActive && breatheState === 'Exhale' ? 'scale-50 opacity-50' : 'scale-100 opacity-50'}
          group-hover:bg-pastel-mint/50
        `}></div>
        
        <div className={`
          w-24 h-24 rounded-full border-4 border-pastel-mint flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-md transition-all duration-[4000ms] ease-in-out relative z-10
          ${isActive ? (breatheState === 'Inhale' ? 'scale-125' : breatheState === 'Exhale' ? 'scale-75' : 'scale-125') : 'scale-100'}
          group-hover:border-pastel-peach group-hover:scale-105
        `}>
           {isActive ? (
               <span className="font-hand text-xl text-teal-700 dark:text-teal-300 font-bold animate-pulse">
                 {breatheState}
               </span>
           ) : (
               <Play className="text-pastel-mint group-hover:text-pastel-peach ml-1 transition-colors" size={32} fill="currentColor" />
           )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 font-sans uppercase tracking-widest mt-4">
        {isActive ? 'Tap to stop' : 'Tap circle to start'}
      </p>
    </div>
  );
};