import { Zap, Monitor, Smartphone, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import type { HardwareData } from '../App';

interface FloatingNavProps {
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  activeSection: string;
  hardwareData: HardwareData | null;
  visionOnline: boolean | null;
  onLaunchApp: () => void;
}

export default function FloatingNav({
  deviceMode,
  setDeviceMode,
  activeSection,
  hardwareData,
  visionOnline,
  onLaunchApp
}: FloatingNavProps) {
  const navLinks = [
    { id: 'hero', label: 'OVERVIEW' },
    { id: 'steps', label: 'HOW IT WORKS' },
    { id: 'compare', label: 'ADVANTAGE' },
    { id: 'dashboard', label: 'FARM APP' },
    { id: 'hardware-lab', label: 'HARDWARE LAB' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-6xl w-full transition-all duration-300">
        
        {/* Brand Logo */}
        <div 
          onClick={() => scrollTo('hero')}
          className="flex items-center space-x-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-lime-brand flex items-center justify-center text-black font-black text-xs shadow-glow-lime group-hover:scale-105 transition-transform">
            <Zap size={16} className="fill-black stroke-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-widest text-sm uppercase flex items-center space-x-1.5">
              <span>BIOENSO</span>
              <span className="text-[9px] bg-white/10 text-lime-brand px-1.5 py-0.5 rounded-full border border-lime-brand/30">
                AI GRID
              </span>
            </span>
            <span className="text-[8px] text-white/40 tracking-[0.2em] uppercase font-bold hidden sm:inline">
              CLIMATE DEFENSE
            </span>
          </div>
        </div>

        {/* Center Nav Links (Hidden on small mobile) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  isActive
                    ? "text-lime-brand border-b-2 border-lime-brand pb-1"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Island */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Status Badges */}
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider">
            {hardwareData?.connected ? (
              <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ESP32 ONLINE</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-white/40 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>ESP32 READY</span>
              </span>
            )}
            {visionOnline !== null && (
              <span className="flex items-center space-x-1 text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
                {visionOnline ? <Wifi size={10} className="text-emerald-400" /> : <WifiOff size={10} />}
                <span>{visionOnline ? "AI VISION" : "VISION OFFLINE"}</span>
              </span>
            )}
          </div>

          {/* View Mode Switcher (Desktop vs Mobile View) */}
          <div className="bg-black/60 border border-white/20 rounded-full p-1 flex items-center space-x-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={clsx(
                "flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                deviceMode === 'desktop'
                  ? "bg-white text-black shadow-sm"
                  : "text-white/50 hover:text-white"
              )}
              title="Switch to Widescreen Desktop View"
            >
              <Monitor size={12} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={clsx(
                "flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                deviceMode === 'mobile'
                  ? "bg-lime-brand text-black font-black shadow-glow-lime"
                  : "text-white/50 hover:text-white"
              )}
              title="Switch to Smartphone Simulator View"
            >
              <Smartphone size={12} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Big Glow CTA: Launch App */}
          <button
            onClick={onLaunchApp}
            className="flex items-center space-x-2 bg-lime-brand text-black font-black text-xs uppercase tracking-widest px-4 sm:px-5 py-2.5 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-glow-lime"
          >
            <span>LIVE APP</span>
            <div className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center">
              <ArrowRight size={12} className="stroke-[3]" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
