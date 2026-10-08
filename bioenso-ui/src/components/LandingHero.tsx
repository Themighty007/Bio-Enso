import { useState } from 'react';
import { ArrowRight, Cpu, Wind, Droplets, Activity, Eye } from 'lucide-react';
import clsx from 'clsx';
import type { HardwareData } from '../App';

interface LandingHeroProps {
  hardwareData: HardwareData | null;
  onLaunchApp: () => void;
  onTestHardware: () => void;
}

export default function LandingHero({ hardwareData, onLaunchApp, onTestHardware }: LandingHeroProps) {
  const [activeTabVisual, setActiveTabVisual] = useState<'3d' | 'thermal'>('3d');

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[#050505]">
      
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-brand/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Ticker / Marquee Bar directly below nav (Image 1 & 2 style) */}
      <div className="w-full border-y border-white/10 bg-black/40 py-2.5 mb-10 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-white/50 flex items-center space-x-6">
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>ESP32 BREADBOARD NODE READY</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>DHT22 MICROCLIMATE SENSING</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>YOLOV8 HERD CENTROID VISION</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>AUTONOMOUS 5V COOLING RELAY</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>EL NIÑO HEAT DOMES & FLASH FLOOD DEFENSE</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>BIOLOGICAL-THERMAL INDEX (BTI) ENGINE</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>100% OFFLINE ZERO-INTERNET RESILIENT</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>ESP32 BREADBOARD NODE READY</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>DHT22 MICROCLIMATE SENSING</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>YOLOV8 HERD CENTROID VISION</span></span>
          <span className="flex items-center space-x-2"><span className="text-lime-brand">●</span><span>AUTONOMOUS 5V COOLING RELAY</span></span>
        </div>
      </div>

      {/* Main Split Grid (Aarunya Net Zero Layout) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1 my-auto">
        
        {/* Left Typography & CTAs (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-lime-brand animate-ping" />
            <span className="text-[11px] font-black text-lime-brand uppercase tracking-widest">
              NEXT-GEN LIVESTOCK DEFENSE
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.95]">
            ZERO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
              LOSS.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 font-medium max-w-xl leading-relaxed">
            Inaugurating India's modern edge-AI autonomous biometeorological defense grid with an active intervention target of
          </p>

          <div className="py-2">
            <div className="text-4xl sm:text-6xl font-black text-lime-brand tracking-tight drop-shadow-[0_0_20px_rgba(212,255,0,0.4)]">
              50,000 Herds
            </div>
            <div className="text-xs sm:text-sm font-bold text-white/50 tracking-wider uppercase mt-1">
              Protected against El Niño thermal shock and flash floods annually
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onLaunchApp}
              className="flex items-center space-x-3 bg-lime-brand text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-glow-lime cursor-pointer"
            >
              <span>LAUNCH FARM APP</span>
              <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
                <ArrowRight size={14} className="stroke-[3]" />
              </div>
            </button>

            <button
              onClick={onTestHardware}
              className="flex items-center space-x-2 bg-black/60 hover:bg-white/10 text-white font-black text-sm uppercase tracking-widest px-6 py-4 rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Cpu size={16} className="text-lime-brand" />
              <span>TEST HARDWARE RELAY</span>
            </button>
          </div>

          {/* Mini Live Hardware Telemetry Banner */}
          <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-white/60">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DHT22 Live: {hardwareData?.temperature ? `${hardwareData.temperature.toFixed(1)}°C` : '32.1°C'}</span>
            </span>
            <span className="text-white/20">|</span>
            <span>Fan State: <strong className={hardwareData?.fan_active ? "text-lime-brand" : "text-white"}>{hardwareData?.fan_active ? "ACTIVE (5V)" : "STANDBY"}</strong></span>
          </div>

        </div>

        {/* Right High-Tech Interactive Visual (col-span-5) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-2">
                  HERD_OBSERVATORY_V2
                </span>
              </div>

              {/* View Toggle */}
              <div className="bg-black/60 p-1 rounded-full border border-white/10 flex space-x-1 text-[9px] font-black uppercase">
                <button
                  onClick={() => setActiveTabVisual('3d')}
                  className={clsx("px-2.5 py-1 rounded-full transition-all", activeTabVisual === '3d' ? "bg-lime-brand text-black" : "text-white/50")}
                >
                  3D Paddock
                </button>
                <button
                  onClick={() => setActiveTabVisual('thermal')}
                  className={clsx("px-2.5 py-1 rounded-full transition-all", activeTabVisual === 'thermal' ? "bg-lime-brand text-black" : "text-white/50")}
                >
                  AI Vision
                </button>
              </div>
            </div>

            {/* Visual Screen Container */}
            <div className="aspect-[4/3] rounded-2xl bg-black border border-white/10 relative overflow-hidden flex items-center justify-center">
              
              {activeTabVisual === '3d' ? (
                /* 3D Isometric Cattle Paddock Visualizer */
                <div className="w-full h-full relative perspective-[800px] flex items-center justify-center bg-gradient-to-br from-slate-950 to-black">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Rotating 3D Platform */}
                  <div className="w-60 h-60 relative preserve-3d rotate-x-[55deg] rotate-z-[-35deg] transition-transform duration-700 group-hover:rotate-z-[-20deg]">
                    
                    {/* Platform Base */}
                    <div className="absolute inset-0 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]" />
                    
                    {/* Zone A: Shaded Barn */}
                    <div className="absolute top-2 left-2 w-28 h-28 bg-white/5 border border-white/20 rounded-xl flex flex-col items-center justify-center p-2 transform-gpu translate-z-6">
                      <span className="text-[8px] font-black text-lime-brand uppercase tracking-wider">ZONE A • SHADE</span>
                      <div className="w-4 h-4 rounded-full bg-lime-brand/20 border border-lime-brand flex items-center justify-center mt-1 animate-pulse">
                        <Wind size={10} className="text-lime-brand" />
                      </div>
                    </div>

                    {/* Zone B: Water Trough */}
                    <div className="absolute bottom-2 right-2 w-24 h-24 bg-blue-500/20 border border-blue-400/40 rounded-xl flex flex-col items-center justify-center transform-gpu translate-z-4">
                      <span className="text-[8px] font-black text-blue-300 uppercase tracking-wider">TROUGH</span>
                      <Droplets size={12} className="text-blue-300 mt-1" />
                    </div>

                    {/* Simulated Cattle Dots */}
                    <div className="absolute top-10 left-12 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white] animate-bounce" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-16 left-16 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                    <div className="absolute bottom-10 right-10 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_orange]" />
                    <div className="absolute bottom-16 right-6 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]" />
                  </div>

                  {/* Overlay Badges */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-white flex items-center space-x-2">
                    <Activity size={12} className="text-lime-brand" />
                    <span>Real-Time Paddock Telemetry</span>
                  </div>
                </div>
              ) : (
                /* Thermal AI Vision Mockup */
                <div className="w-full h-full relative bg-gradient-to-tr from-indigo-950 via-slate-900 to-rose-950 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/80">
                    <span className="flex items-center space-x-1.5">
                      <Eye size={12} className="text-lime-brand" />
                      <span>YOLOv8 Edge Inference</span>
                    </span>
                    <span className="text-lime-brand">14.2 FPS</span>
                  </div>

                  {/* Bounding Boxes */}
                  <div className="absolute top-1/4 left-1/4 w-28 h-20 border-2 border-lime-brand bg-lime-brand/10 rounded-lg flex flex-col justify-between p-1 shadow-glow-lime">
                    <span className="text-[8px] font-black bg-lime-brand text-black px-1 rounded w-fit">COW #04 [NORMAL]</span>
                    <span className="text-[8px] font-bold text-lime-brand text-right">38.2°C</span>
                  </div>

                  <div className="absolute bottom-1/4 right-1/4 w-32 h-24 border-2 border-rose-500 bg-rose-500/10 rounded-lg flex flex-col justify-between p-1 shadow-glow-red animate-pulse">
                    <span className="text-[8px] font-black bg-rose-500 text-white px-1 rounded w-fit">COW #12 [HEAT STRESS]</span>
                    <span className="text-[8px] font-bold text-rose-300 text-right">41.1°C</span>
                  </div>

                  <div className="text-[9px] font-black tracking-widest text-white/50 uppercase">
                    Cattle Centroid Tracking Active
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Hardware Actuator Status */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60 font-bold">5V Fan Actuator:</span>
              <span className={clsx(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1",
                hardwareData?.fan_active
                  ? "bg-lime-brand text-black shadow-glow-lime"
                  : "bg-white/10 text-white/70"
              )}>
                <Wind size={10} className={hardwareData?.fan_active ? "animate-spin" : ""} />
                <span>{hardwareData?.fan_active ? "Spinning (Auto Heat Trigger)" : "Idle / Standby"}</span>
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Metrics Bar (Aarunya Net Zero exact underline aesthetic) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full mt-16 pt-8 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Stat 1 */}
          <div className="flex flex-col group cursor-default">
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              1,500 <span className="text-lg text-white/50 font-normal">L</span>
            </div>
            {/* The signature horizontal underline with active lime hover bar */}
            <div className="h-0.5 w-full bg-white/20 mb-3 relative overflow-hidden">
              <div className="h-full bg-lime-brand w-2/3 transition-all duration-500 group-hover:w-full" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
              Daily Water Deficit Saved
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col group cursor-default">
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              35.0 <span className="text-lg text-white/50 font-normal">°C</span>
            </div>
            <div className="h-0.5 w-full bg-white/20 mb-3 relative overflow-hidden">
              <div className="h-full bg-lime-brand w-4/5 transition-all duration-500 group-hover:w-full" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
              Autonomous Actuation Trigger
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col group cursor-default">
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              98.7 <span className="text-lg text-white/50 font-normal">%</span>
            </div>
            <div className="h-0.5 w-full bg-white/20 mb-3 relative overflow-hidden">
              <div className="h-full bg-lime-brand w-11/12 transition-all duration-500 group-hover:w-full" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
              BTI Predictive Reliability
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col group cursor-default">
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              &lt; 1.8 <span className="text-lg text-white/50 font-normal">s</span>
            </div>
            <div className="h-0.5 w-full bg-white/20 mb-3 relative overflow-hidden">
              <div className="h-full bg-lime-brand w-full transition-all duration-500" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
              Edge Relay Response Latency
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
