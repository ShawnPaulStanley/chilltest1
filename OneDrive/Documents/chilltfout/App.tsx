import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Flame, Eye, EyeOff, Linkedin, Palette, Check, X } from 'lucide-react';
import { Timer } from './components/Timer';
import { ChatBot } from './components/ChatBot';
import { Tasks } from './components/Tasks';
import { Stats } from './components/Stats';
import { SpotifyPlayer } from './components/Spotify';
import { QuoteGen } from './components/QuoteGen';
import { Wellness } from './components/Wellness';
import { AppTheme } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.PAPER);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Startup animation timer
    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0); // Reset scroll to top when app reveals
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSessionComplete = (minutes: number) => {
    setCompletedSessions(prev => prev + 1);
    setFocusMinutes(prev => prev + minutes);
  };

  const getBackgroundClass = () => {
    switch (theme) {
      case AppTheme.PAPER: return 'paper-pattern';
      case AppTheme.GRID: return 'grid-pattern';
      case AppTheme.POLKA: return 'polka-pattern';
      case AppTheme.STRIPES: return 'stripe-pattern';
      case AppTheme.DOODLE: return 'doodle-pattern';
      case AppTheme.GRADIENT: return 'bg-gradient-to-br from-pastel-lavender via-pastel-cream to-pastel-blue dark:from-slate-900 dark:via-slate-800 dark:to-slate-900';
      case AppTheme.FOREST: return 'bg-[#E8F5E9] dark:bg-[#1a2f1c]';
      case AppTheme.SUNSET: return 'bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f] dark:from-[#432c3a] dark:to-[#2c1a23]';
      case AppTheme.CHERRY: return 'bg-[#fce4ec] dark:bg-[#3e2723]';
      case AppTheme.OCEAN: return 'bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb] dark:from-[#0d47a1] dark:to-[#1565c0]';
      case AppTheme.COFFEE: return 'bg-[#efebe9] dark:bg-[#3e2723]';
      case AppTheme.GALAXY: return 'bg-[#301934] dark:bg-[#120024]';
      case AppTheme.MATCHA: return 'bg-[#dcedc8] dark:bg-[#33691e]';
      case AppTheme.CLAY: return 'bg-[#d7ccc8] dark:bg-[#4e342e]';
      default: return 'bg-gray-50';
    }
  };

  const getThemePreviewStyle = (t: AppTheme) => {
    switch (t) {
      case AppTheme.PAPER: return 'paper-pattern';
      case AppTheme.GRID: return 'grid-pattern';
      case AppTheme.POLKA: return 'polka-pattern';
      case AppTheme.STRIPES: return 'stripe-pattern';
      case AppTheme.DOODLE: return 'doodle-pattern';
      case AppTheme.GRADIENT: return 'bg-gradient-to-br from-pastel-lavender via-pastel-cream to-pastel-blue';
      case AppTheme.FOREST: return 'bg-[#E8F5E9]';
      case AppTheme.SUNSET: return 'bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]';
      case AppTheme.CHERRY: return 'bg-[#fce4ec]';
      case AppTheme.OCEAN: return 'bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb]';
      case AppTheme.COFFEE: return 'bg-[#efebe9]';
      case AppTheme.GALAXY: return 'bg-[#301934]';
      case AppTheme.MATCHA: return 'bg-[#dcedc8]';
      case AppTheme.CLAY: return 'bg-[#d7ccc8]';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getBackgroundClass()} ${darkMode ? 'text-pastel-darkText' : 'text-pastel-text'} overflow-x-hidden`}>
      
      {/* Startup Overlay */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-pastel-cream dark:bg-[#0f0c29] transition-all duration-1000 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none scale-110'}`}>
         {/* Ambient Glows */}
         <div className="absolute w-96 h-96 bg-pastel-peach/30 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute w-64 h-64 bg-pastel-lavender/30 rounded-full blur-3xl animate-bounce top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 delay-100"></div>

         <div className="relative z-10 flex flex-col items-center">
            {/* Split text for staggered animation - reduced text size for wider font */}
            <h1 className="flex items-center gap-1 font-title text-7xl md:text-8xl font-bold tracking-widest transform -rotate-2 text-pastel-text dark:text-white drop-shadow-xl relative">
              <span className="animate-[slideInLeft_1s_ease-out_forwards] opacity-0" style={{animationDelay: '0.2s'}}>chill</span>
              <span className="text-pastel-peach inline-block transform rotate-6 animate-[bounceIn_1s_cubic-bezier(0.36,0,0.66,1)_forwards] opacity-0" style={{animationDelay: '0.8s'}}>TF</span>
              <span className="animate-[slideInRight_1s_ease-out_forwards] opacity-0" style={{animationDelay: '0.5s'}}>out</span>
              
              {/* Pop-in Doodles */}
              <div className="absolute -top-8 -right-8 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] opacity-0" style={{animationDelay: '1.2s'}}>
                <svg width="60" height="60" viewBox="0 0 100 100" className="text-pastel-blue">
                   <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-10 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] opacity-0" style={{animationDelay: '1.4s'}}>
                <svg width="40" height="40" viewBox="0 0 100 100" className="text-pastel-mint">
                   <path d="M10 50 Q25 25 50 10 T90 50 T50 90 T10 50" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
              </div>
              <div className="absolute top-0 left-1/3 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] opacity-0" style={{animationDelay: '1.6s'}}>
                 <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-lavender"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
            </h1>
            
            <div className="mt-8 flex items-center gap-3 animate-[slideUpFade_1s_ease-out_forwards] opacity-0" style={{animationDelay: '1.8s'}}>
              <div className="h-[2px] w-0 bg-gray-400 dark:bg-gray-600 animate-[fill_1s_ease-out_forwards]" style={{'--target-height': '2px', width: '3rem', animationDelay: '2s'} as React.CSSProperties}></div>
              <p className="font-sans text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-300">
                Calm AF, Smart AF.
              </p>
              <div className="h-[2px] w-0 bg-gray-400 dark:bg-gray-600 animate-[fill_1s_ease-out_forwards]" style={{'--target-height': '2px', width: '3rem', animationDelay: '2s'} as React.CSSProperties}></div>
            </div>
         </div>
      </div>

      {/* Header Section */}
      <header className={`relative pt-12 pb-6 px-6 flex flex-col items-center justify-center transition-all duration-500 ${focusMode ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Left Controls: Made By & Clocks */}
        <div className="absolute top-6 left-6 hidden md:flex flex-col gap-3 z-40 items-start">
          <a 
              href="https://www.linkedin.com/in/shawn-paul-stanley/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-black/40 hover:bg-pastel-peach hover:text-white dark:hover:text-black transition-all shadow-sm group border-2 border-transparent hover:border-pastel-peach/50"
          >
              <Linkedin size={16} />
              <span className="font-hand font-bold text-sm">Made by Shawn</span>
          </a>
          
          <div className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-black/30 p-3 rounded-2xl backdrop-blur-md min-w-[130px] shadow-sm border border-white/20">
               <div className="flex justify-between gap-4">
                  <span className="text-orange-500 dark:text-orange-400 font-extrabold">IST</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold">EST</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">UTC</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
          </div>
        </div>

        {/* Right Controls: Theme & Mode */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-40">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-all ${focusMode ? 'bg-pastel-peach text-white shadow-lg scale-105' : 'bg-white/40 dark:bg-black/20 opacity-70 hover:opacity-100'}`}
            title="Focus Mode"
          >
            {focusMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden md:inline">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 mr-2 text-sm font-bold opacity-70 bg-white/40 dark:bg-black/20 px-3 py-1 rounded-full">
            <span>{Math.floor(focusMinutes)}m</span>
            <Flame size={14} className="text-pastel-peach" />
          </div>
          
          {/* Visual Theme Selector */}
          <div className="relative" ref={themeMenuRef}>
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${showThemeMenu ? 'bg-pastel-peach text-white' : 'bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/10'}`}
              title="Change Theme"
            >
              <Palette size={16} />
              <span className="text-xs font-bold uppercase hidden md:inline">Theme</span>
            </button>

            {/* Theme Dropdown */}
            {showThemeMenu && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 z-50 animate-[slideUpFade_0.2s_ease-out]">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Select Theme</span>
                   <button onClick={() => setShowThemeMenu(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                     <X size={14} />
                   </button>
                </div>
                <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {Object.values(AppTheme).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === t ? 'bg-pastel-peach/10 ring-2 ring-pastel-peach' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full shadow-inner border border-black/5 dark:border-white/10 ${getThemePreviewStyle(t)} flex items-center justify-center`}>
                        {theme === t && <Check size={14} className="text-gray-700 dark:text-white drop-shadow-md" />}
                      </div>
                      <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 truncate w-full text-center">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Centered Title */}
        <div className={`transition-all duration-500 ${focusMode ? 'scale-75 opacity-50 blur-sm hover:blur-none' : 'scale-100'}`}>
          <h1 className="font-title text-6xl md:text-8xl font-bold tracking-widest transform -rotate-2 select-none drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all hover:scale-105 duration-500 text-center">
            chill<span className="text-pastel-peach inline-block transform rotate-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">TF</span>out
          </h1>
          <p className="font-sans text-sm md:text-base opacity-60 mt-2 tracking-widest uppercase font-bold text-center">
            Calm AF, Smart AF.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 transition-all duration-700 ${focusMode ? 'justify-center' : ''}`}>
        
        {/* Left Column (Desktop) / Bottom Column (Mobile) */}
        <div className={`lg:col-span-4 space-y-6 flex flex-col transition-all duration-500 order-2 lg:order-1 ${focusMode ? 'hidden opacity-0 translate-x-[-50px]' : 'opacity-100 translate-x-0'}`}>
          <SpotifyPlayer />
          <QuoteGen />
          <div className="flex-1">
             <ChatBot />
          </div>
        </div>

        {/* Right Column (Desktop) / Top Column (Mobile) - Contains Timer */}
        <div className={`space-y-6 transition-all duration-700 order-1 lg:order-2 ${focusMode ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-8'}`}>
          <Timer onSessionComplete={handleSessionComplete} />
          
          {/* Dashboard Grid */}
          <div className={`grid gap-6 transition-all duration-500 ${focusMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            
            {/* Tasks Section */}
            <div className="bg-pastel-peach/20 dark:bg-pastel-darkCard/60 backdrop-blur-md rounded-3xl p-6 shadow-sm min-h-[400px]">
              <Tasks />
            </div>
            
            {/* Side Stack: Wellness & Stats */}
            {/* Hide these in Focus Mode */}
            <div className={`flex flex-col gap-6 transition-all duration-300 ${focusMode ? 'hidden opacity-0' : 'opacity-100'}`}>
               <Wellness />
               
               <Stats data={[]} />
               
               {/* Daily Summary Card */}
               <div className="bg-purple-50/60 dark:bg-purple-900/20 p-6 rounded-3xl flex-1 flex flex-col justify-center items-center text-center border-2 border-dashed border-pastel-lavender/30">
                  <h3 className="font-hand text-xl mb-2">Today's Focus</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-hand font-bold text-purple-600 dark:text-purple-300">{Math.floor(focusMinutes)}</p>
                    <span className="text-sm font-sans text-gray-500 uppercase font-bold tracking-widest">minutes</span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans mt-2">{completedSessions} sessions crushed</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;