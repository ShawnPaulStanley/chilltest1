import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, BatteryCharging, Settings, Check } from 'lucide-react';
import { Button } from './Button';
import { TimerMode } from '../types';

interface TimerProps {
  onSessionComplete: (minutes: number) => void;
}

interface TimerDurations {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export const Timer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [durations, setDurations] = useState<TimerDurations>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [initialDuration, setInitialDuration] = useState(durations.focus * 60);
  const [showSettings, setShowSettings] = useState(false);
  
  // Timestamp state to handle drift/tab throttling
  const [endTime, setEndTime] = useState<number | null>(null);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setEndTime(null);
    setMode(newMode);
    const newTime = durations[newMode] * 60;
    setInitialDuration(newTime);
    setTimeLeft(newTime);
  };

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setEndTime(null);
    const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple bell
    sound.volume = 0.5;
    sound.play().catch(() => {});
    
    if (mode === 'focus') {
      onSessionComplete(initialDuration / 60);
    }
  }, [mode, initialDuration, onSessionComplete]);

  const toggleTimer = () => {
    if (isActive) {
      // Pause
      setIsActive(false);
      setEndTime(null);
    } else {
      // Start/Resume
      setIsActive(true);
      // Calculate target end time: Now + Remaining Seconds
      setEndTime(Date.now() + timeLeft * 1000);
    }
  };

  // Timer Tick Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((endTime - now) / 1000);

        if (diff <= 0) {
          setTimeLeft(0);
          handleComplete();
          clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }
      }, 200); // Check frequently (5Hz) to keep UI responsive, math ensures accuracy
    }

    return () => clearInterval(interval);
  }, [isActive, endTime, handleComplete]);

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
    // Reset timer to new setting for current mode
    setIsActive(false);
    setEndTime(null);
    const newTime = durations[mode] * 60;
    setInitialDuration(newTime);
    setTimeLeft(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for smooth animation
  const progressPercent = (timeLeft / initialDuration) * 100;
  
  // Live update the browser tab title with timer state
  useEffect(() => {
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    if (isActive) {
      document.title = `${formatTime(timeLeft)} • ${modeLabel}`;
    } else {
      document.title = `Timer • ${modeLabel}`;
    }
    return () => {
      // no-op cleanup; title will be updated by subsequent renders
    };
  }, [timeLeft, isActive, mode]);

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-dashed border-pastel-lavender/50 flex flex-col items-center relative overflow-hidden transition-all duration-300 w-full">
      
      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pastel-peach transition-colors z-20"
      >
        <Settings size={20} />
      </button>

      {showSettings ? (
        <form onSubmit={handleSettingsSave} className="w-full h-full flex flex-col items-center justify-center gap-4 py-8 animate-breathe">
          <h3 className="font-hand text-2xl mb-2 text-pastel-text dark:text-pastel-darkText">Timer Settings (min)</h3>
          
          <div className="grid grid-cols-3 gap-4 w-full px-4">
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Focus</label>
                <input 
                  type="number" 
                  min="1" 
                  max="90"
                  value={durations.focus} 
                  onChange={(e) => setDurations({...durations, focus: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-pastel-lavender/20 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-peach"
                />
             </div>
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Short</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={durations.shortBreak} 
                  onChange={(e) => setDurations({...durations, shortBreak: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-pastel-mint/20 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-mint"
                />
             </div>
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Long</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60"
                  value={durations.longBreak} 
                  onChange={(e) => setDurations({...durations, longBreak: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-pastel-blue/20 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-blue"
                />
             </div>
          </div>

          <Button type="submit" className="mt-4" size="sm">
            <Check size={18} /> Save Changes
          </Button>
        </form>
      ) : (
        <>
          <div className="flex justify-center gap-2 mb-8 w-full z-10">
            <Button 
              variant={mode === 'focus' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('focus')}
              size="sm"
              active={mode === 'focus'}
            >
              <Brain size={18} /> Focus
            </Button>
            <Button 
              variant={mode === 'shortBreak' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('shortBreak')}
              size="sm"
              active={mode === 'shortBreak'}
            >
              <Coffee size={18} /> Short
            </Button>
            <Button 
              variant={mode === 'longBreak' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('longBreak')}
              size="sm"
              active={mode === 'longBreak'}
            >
              <BatteryCharging size={18} /> Long
            </Button>
          </div>

          <div className="my-8 flex items-center justify-center relative z-10">
             {/* Background decoration */}
             <div className="absolute inset-0 bg-pastel-peach/10 blur-3xl rounded-full transform scale-150 animate-pulse"></div>
             
             <span className="relative text-[6rem] md:text-[8rem] leading-none font-hand text-pastel-text dark:text-pastel-darkText tracking-widest drop-shadow-sm select-none transition-all duration-300">
                {formatTime(timeLeft)}
             </span>
          </div>

          <div className="flex justify-center gap-4 w-full z-10">
            <Button onClick={toggleTimer} size="lg" className="w-32">
              {isActive ? <Pause /> : <Play />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" onClick={() => {
                setIsActive(false);
                setEndTime(null);
                setInitialDuration(durations[mode] * 60);
                setTimeLeft(durations[mode] * 60);
            }}>
              <RotateCcw />
            </Button>
          </div>
        </>
      )}

      {/* Smooth Progress Bar at bottom */}
      {!showSettings && (
        <div className="absolute bottom-0 left-0 h-2 bg-pastel-lavender/30 w-full">
            <div 
              className="h-full bg-pastel-peach transition-all ease-linear duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
      )}
    </div>
  );
};