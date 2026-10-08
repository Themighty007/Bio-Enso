import { useState } from 'react';
import { 
  Wind, Droplets, Thermometer, CheckCircle2, 
  Activity, Eye, Cpu, Zap, Radio, ChevronRight, Play
} from 'lucide-react';
import clsx from 'clsx';
import type { AppState, ScenarioType } from '../AppState';
import type { HardwareData } from '../App';

interface DesktopDashboardViewProps {
  appState: AppState;
  setScenario: (s: ScenarioType) => void;
  activeAction: boolean;
  setActiveAction: (v: boolean) => void;
  hardwareData: HardwareData | null;
  visionData?: any;
  onTriggerHardwareFan: (fanState: boolean | null) => void;
}

export default function DesktopDashboardView({
  appState,
  setScenario,
  activeAction,
  setActiveAction,
  hardwareData,
  visionData: _visionData,
  onTriggerHardwareFan
}: DesktopDashboardViewProps) {
  const [activeVisualTab, setActiveVisualTab] = useState<'3d' | 'camera' | 'thermal'>('3d');
  const [showWhyModal, setShowWhyModal] = useState(false);

  const { scenario, environment, animalState, riskState } = appState;
  const isFlood = scenario === "FLOOD_RISK";
  const isRecovery = scenario === "RECOVERY";

  const scenarios: { id: ScenarioType; label: string; badge: string; color: string }[] = [
    { id: "NORMAL", label: "Normal Baseline", badge: "SAFE", color: "bg-emerald-500" },
    { id: "HEAT_RISK", label: "Heat Risk (Watch)", badge: "WATCH", color: "bg-amber-500" },
    { id: "CRITICAL_HEAT", label: "Critical Heat Dome", badge: "ACT NOW", color: "bg-rose-500" },
    { id: "FLOOD_RISK", label: "Flash Flood Surge", badge: "EVACUATE", color: "bg-blue-600" },
    { id: "RECOVERY", label: "Recovery Mode", badge: "IMPROVING", color: "bg-teal-500" },
    { id: "OFFLINE", label: "Offline Fail-Safe", badge: "LOCAL", color: "bg-slate-500" },
  ];

  const fanIsSpinning = hardwareData?.fan_active || activeAction;

  return (
    <div className="w-full bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden transition-all duration-700">
      
      {/* Top Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-lime-brand mb-1">
            <Radio size={12} className="animate-pulse" />
            <span>BIOENSO LIVESTOCK COMMAND CENTER • TAMIL NADU CLUSTER #01</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
            <span>Green Valley Cattle Sanctuary</span>
            <span className="text-xs font-bold text-white/50 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              128 Head of Cattle
            </span>
          </h2>
        </div>

        {/* Live System Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* ESP32 Hardware Badge */}
          <div className={clsx(
            "flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border",
            hardwareData?.connected 
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
              : "bg-white/5 border-white/15 text-white/50"
          )}>
            <Cpu size={14} className={hardwareData?.connected ? "text-emerald-400" : "text-white/40"} />
            <span>ESP32: {hardwareData?.connected ? "LINKED" : "AUTO-POLL"}</span>
          </div>

          {/* Fan Actuator Badge */}
          <div className={clsx(
            "flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all",
            fanIsSpinning 
              ? "bg-lime-brand text-black border-lime-brand shadow-glow-lime font-black" 
              : "bg-white/5 border-white/15 text-white/50"
          )}>
            <Wind size={14} className={fanIsSpinning ? "animate-spin" : ""} />
            <span>FAN RELAY: {fanIsSpinning ? "SPINNING (5V)" : "IDLE"}</span>
          </div>

          {/* Regional ENSO Badge */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-black/60 border border-white/15 text-white/70">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>ENSO: EL NIÑO ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 3-Column Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Herd Risk Score & Action Card (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Livestock Risk Score Card */}
          <div className={clsx(
            "rounded-3xl p-6 border relative overflow-hidden backdrop-blur-xl transition-all duration-700",
            scenario === "CRITICAL_HEAT" ? "bg-rose-950/30 border-rose-500/40 shadow-glow-red" :
            scenario === "FLOOD_RISK" ? "bg-blue-950/30 border-blue-500/40 shadow-glow-blue" :
            scenario === "HEAT_RISK" ? "bg-amber-950/30 border-amber-500/40" :
            isRecovery ? "bg-emerald-950/30 border-emerald-500/40 shadow-glow-lime" :
            "bg-white/5 border-white/10"
          )}>
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                BIOLOGICAL-THERMAL INDEX (BTI)
              </span>
              <span className={clsx(
                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                riskState.level === "ACT NOW" ? "bg-rose-500 text-white animate-pulse" :
                riskState.level === "WATCH" ? "bg-amber-500 text-black font-black" :
                isRecovery ? "bg-lime-brand text-black font-black" :
                "bg-emerald-500/20 text-emerald-400"
              )}>
                {riskState.level}
              </span>
            </div>

            {/* Huge Number */}
            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                {riskState.score}
              </span>
              <span className="text-xl font-bold text-white/40">/100</span>
            </div>

            <p className="text-sm font-bold text-white/80 leading-snug mt-2">
              {riskState.message}
            </p>

            {/* Recovery bar or severity bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">
                <span>Safe (0-30)</span>
                <span>Watch (31-69)</span>
                <span>Critical (70+)</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                <div style={{ width: `${Math.min(100, riskState.score)}%` }} className={clsx(
                  "h-full transition-all duration-1000",
                  riskState.score >= 70 ? "bg-rose-500" :
                  riskState.score >= 35 ? "bg-amber-400" :
                  "bg-lime-brand"
                )} />
              </div>
            </div>

            {/* Why Alerting Button */}
            <button
              onClick={() => setShowWhyModal(!showWhyModal)}
              className="mt-4 w-full py-2.5 px-4 bg-black/40 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-white/70 hover:text-white flex items-center justify-between transition-all"
            >
              <span>Scientific Cause & Breakdown</span>
              <ChevronRight size={14} className={clsx("transition-transform", showWhyModal && "rotate-90")} />
            </button>

            {showWhyModal && (
              <div className="mt-3 bg-black/70 rounded-2xl p-4 border border-white/10 text-xs space-y-2.5 animate-in fade-in duration-300">
                <div className="text-[10px] font-black text-lime-brand uppercase tracking-wider">Research Grounding (St-Pierre et al.)</div>
                <div className="text-white/80 font-medium">Ambient heat + humidity creates radiant thermal trapping. Cattle shade occupancy increased by <strong>{animalState.shadeOccupancyDiff}%</strong>, indicating active physiological compensation.</div>
                <div className="text-white/60 text-[11px]">Duration: 19 continuous minutes past baseline.</div>
              </div>
            )}

          </div>

          {/* Autonomous Physical Action Card */}
          <div className="bg-[#101010] border border-white/15 rounded-3xl p-6 shadow-xl flex flex-col justify-between flex-1">
            <div>
              <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
                <span>AUTONOMOUS INTERVENTION</span>
                <Zap size={12} className="text-lime-brand" />
              </div>

              <h3 className="text-lg font-black text-white tracking-tight mb-4">
                {isFlood ? "Flash Flood Evacuation Protocol" : "Hardware Cooling & Relief Relay"}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">5V Shed Misting Fan:</span>
                  <span className={clsx("font-black uppercase", fanIsSpinning ? "text-lime-brand" : "text-white/40")}>
                    {fanIsSpinning ? "RUNNING (ACTIVE)" : "OFF"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">Water Trough Supply:</span>
                  <span className="text-emerald-400 font-black">AUTO-REFILL READY</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">Zone Relocation:</span>
                  <span className={clsx("font-black", isFlood ? "text-rose-400" : "text-white")}>
                    {isFlood ? "ZONE B (ELEVATED)" : "ZONE A (NORMAL)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Trigger Buttons */}
            <div className="space-y-2">
              {!activeAction ? (
                <button
                  onClick={() => {
                    setActiveAction(true);
                    onTriggerHardwareFan(true);
                  }}
                  className={clsx(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer",
                    isFlood 
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue" 
                      : "bg-lime-brand hover:bg-white text-black shadow-glow-lime"
                  )}
                >
                  <Wind size={16} />
                  <span>{isFlood ? "TRIGGER EVACUATION ALARM" : "START PHYSICAL COOLING"}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveAction(false);
                    onTriggerHardwareFan(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={16} className="text-lime-brand" />
                  <span>DEACTIVATE / RETURN TO AUTO</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Column 2: Interactive 3D Paddock / Camera Feed (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          <div className="bg-[#101010] border border-white/15 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
            
            {/* Visualizer Mode Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                PADDOCK TELEMETRY
              </span>

              {/* View Switcher Tabs */}
              <div className="bg-black/60 p-1 rounded-full border border-white/10 flex space-x-1 text-[10px] font-black uppercase">
                <button
                  onClick={() => setActiveVisualTab('3d')}
                  className={clsx("px-3 py-1 rounded-full transition-all", activeVisualTab === '3d' ? "bg-lime-brand text-black" : "text-white/50 hover:text-white")}
                >
                  3D Farm
                </button>
                <button
                  onClick={() => setActiveVisualTab('camera')}
                  className={clsx("px-3 py-1 rounded-full transition-all", activeVisualTab === 'camera' ? "bg-lime-brand text-black" : "text-white/50 hover:text-white")}
                >
                  AI Vision
                </button>
                <button
                  onClick={() => setActiveVisualTab('thermal')}
                  className={clsx("px-3 py-1 rounded-full transition-all", activeVisualTab === 'thermal' ? "bg-lime-brand text-black" : "text-white/50 hover:text-white")}
                >
                  Thermal
                </button>
              </div>
            </div>

            {/* Display Canvas Box */}
            <div className="aspect-[16/11] rounded-2xl bg-black border border-white/10 relative overflow-hidden flex items-center justify-center">
              
              {activeVisualTab === '3d' && (
                <div className="w-full h-full relative perspective-[900px] flex items-center justify-center bg-gradient-to-b from-slate-950 to-black overflow-hidden">
                  
                  {/* Subtle Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:20px_20px]" />

                  {/* 3D Paddock Platform */}
                  <div className="w-72 h-72 relative preserve-3d rotate-x-[55deg] rotate-z-[-35deg] transition-transform duration-700">
                    
                    {/* Platform Base */}
                    <div className={clsx(
                      "absolute inset-0 border-2 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] transition-colors duration-700",
                      isFlood ? "bg-blue-950/70 border-blue-400/80" : "bg-emerald-950/50 border-emerald-500/50"
                    )} />

                    {/* Zone A: Barn & Fan Misting */}
                    <div className="absolute top-2 left-2 w-32 h-32 bg-white/5 border border-white/20 rounded-xl p-2 transform-gpu translate-z-8 shadow-xl flex flex-col justify-between">
                      <span className="text-[8px] font-black text-lime-brand tracking-widest uppercase">ZONE A • SHED</span>
                      <div className="flex items-center justify-center my-auto">
                        <div className={clsx(
                          "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                          fanIsSpinning 
                            ? "bg-lime-brand text-black border-lime-brand shadow-glow-lime animate-spin" 
                            : "bg-white/10 text-white/40 border-white/20"
                        )}>
                          <Wind size={20} />
                        </div>
                      </div>
                      <span className="text-[7px] text-white/50 text-center font-bold">
                        {fanIsSpinning ? "FAN SPINNING" : "FAN STANDBY"}
                      </span>
                    </div>

                    {/* Zone B: Water Trough / Flood Refuge */}
                    <div className={clsx(
                      "absolute bottom-2 right-2 w-32 h-32 rounded-xl p-2 transform-gpu translate-z-6 shadow-xl flex flex-col justify-between border",
                      isFlood 
                        ? "bg-emerald-600/60 border-emerald-400 translate-z-14" 
                        : "bg-blue-500/20 border-blue-400/40"
                    )}>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">
                        {isFlood ? "SAFE ZONE B (ELEVATED)" : "WATER TROUGH"}
                      </span>
                      <div className="flex justify-center items-center my-auto">
                        <Droplets size={22} className={isFlood ? "text-emerald-200" : "text-blue-400"} />
                      </div>
                      <span className="text-[7px] text-white/60 text-center font-bold">
                        {isFlood ? "DRY PASTURE" : "1,180 L CAPACITY"}
                      </span>
                    </div>

                    {/* Flood Water Layer (appears during flood) */}
                    {isFlood && (
                      <div className="absolute inset-0 bg-blue-500/50 backdrop-blur-sm border-t-2 border-blue-300 rounded-2xl transform-gpu translate-z-10 animate-pulse" />
                    )}

                    {/* Simulated Cattle Positions */}
                    <div className="absolute top-12 left-16 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_white] transform-gpu translate-z-12 animate-bounce" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-20 left-20 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_white] transform-gpu translate-z-12 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                    <div className="absolute bottom-16 right-16 w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_orange] transform-gpu translate-z-12" />
                    <div className="absolute bottom-12 right-24 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_white] transform-gpu translate-z-12" />
                  </div>

                  {/* Corner Label */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-white flex items-center space-x-2">
                    <Activity size={12} className="text-lime-brand" />
                    <span>3D Isometric State Tracker</span>
                  </div>

                </div>
              )}

              {activeVisualTab === 'camera' && (
                <div className="w-full h-full relative bg-black flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/80">
                    <span className="flex items-center space-x-1 text-lime-brand">
                      <Eye size={12} />
                      <span>YOLOv8 Herd CV Active</span>
                    </span>
                    <span className="bg-lime-brand text-black px-2 py-0.5 rounded font-black">14.2 FPS</span>
                  </div>

                  {/* Simulated bounding boxes */}
                  <div className="absolute top-16 left-12 w-32 h-24 border-2 border-lime-brand bg-lime-brand/10 rounded-lg p-1.5 flex flex-col justify-between shadow-glow-lime">
                    <span className="text-[8px] font-black bg-lime-brand text-black px-1 rounded w-fit">COW_ID#01</span>
                    <span className="text-[8px] font-bold text-lime-brand">CONF: 94% • RESTING</span>
                  </div>

                  <div className="absolute bottom-12 right-16 w-36 h-28 border-2 border-rose-500 bg-rose-500/10 rounded-lg p-1.5 flex flex-col justify-between shadow-glow-red animate-pulse">
                    <span className="text-[8px] font-black bg-rose-500 text-white px-1 rounded w-fit">COW_ID#08</span>
                    <span className="text-[8px] font-bold text-rose-300">CONF: 91% • SHADE CROWDING</span>
                  </div>

                  <div className="text-[9px] font-mono text-white/40 uppercase">
                    Detection classes: [CATTLE, SHADE_CLUSTER, TROUGH_QUEUE]
                  </div>
                </div>
              )}

              {activeVisualTab === 'thermal' && (
                <div className="w-full h-full relative bg-gradient-to-br from-indigo-950 via-purple-950 to-rose-950 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/80">
                    <span>Simulated Thermal Radiance (FLIR)</span>
                    <span className="text-rose-400 font-bold">PEAK: 41.2°C</span>
                  </div>

                  <div className="my-auto flex justify-center items-center">
                    <div className="w-36 h-36 rounded-full bg-rose-500/40 blur-xl animate-pulse flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-yellow-400/60 blur-md" />
                    </div>
                  </div>

                  <div className="bg-black/60 rounded-xl p-2 flex justify-between text-[8px] font-black uppercase tracking-widest text-white/70">
                    <span className="text-blue-400">Cool (32°C)</span>
                    <span className="text-emerald-400">Normal (38°C)</span>
                    <span className="text-amber-400">Warm (39.5°C)</span>
                    <span className="text-rose-500">Critical (41°C+)</span>
                  </div>
                </div>
              )}

            </div>

            {/* Herd Behavior Metrics Bar below visualizer */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
              <div className="bg-black/30 rounded-xl p-2.5">
                <div className="text-xs font-bold text-white/50 uppercase text-[9px]">Movement</div>
                <div className="text-sm font-black text-white">{animalState.movementDiff}%</div>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5">
                <div className="text-xs font-bold text-white/50 uppercase text-[9px]">Shade Seeking</div>
                <div className="text-sm font-black text-lime-brand">+{animalState.shadeOccupancyDiff}%</div>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5">
                <div className="text-xs font-bold text-white/50 uppercase text-[9px]">Water Need</div>
                <div className="text-sm font-black text-blue-400">{animalState.waterDemandNow} L</div>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5">
                <div className="text-xs font-bold text-white/50 uppercase text-[9px]">Elevated</div>
                <div className="text-sm font-black text-rose-400">{animalState.critical + animalState.elevated}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Column 3: Live ESP32 Hardware Card & Hackathon Controller (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* Live Hardware Node Card */}
          <div className="bg-[#121212] border-2 border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu size={16} className="text-lime-brand" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">ESP32 Hardware Node</span>
              </div>
              <span className={clsx(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                hardwareData?.connected ? "bg-emerald-500 text-black" : "bg-white/10 text-white/50"
              )}>
                {hardwareData?.connected ? "Live Breadboard" : "Standby"}
              </span>
            </div>

            {/* Sensor Rows */}
            <div className="space-y-3">
              {/* Temperature */}
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Thermometer size={18} className="text-rose-400" />
                  <div>
                    <div className="text-[9px] font-black uppercase text-white/40">DHT22 Temp</div>
                    <div className="text-base font-black text-white">
                      {hardwareData ? `${hardwareData.temperature.toFixed(1)}°C` : `${environment.temperature}°C`}
                    </div>
                  </div>
                </div>
                <span className={clsx(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                  (hardwareData?.temperature ?? environment.temperature) >= 35 ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                )}>
                  {(hardwareData?.temperature ?? environment.temperature) >= 35 ? "HEAT THRESHOLD" : "NORMAL"}
                </span>
              </div>

              {/* Humidity */}
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Wind size={18} className="text-lime-brand" />
                  <div>
                    <div className="text-[9px] font-black uppercase text-white/40">Relative Humidity</div>
                    <div className="text-base font-black text-white">
                      {hardwareData ? `${hardwareData.humidity.toFixed(0)}%` : `${environment.humidity}%`}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-white/50">STABLE</span>
              </div>

              {/* Water Sensor */}
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Droplets size={18} className="text-blue-400" />
                  <div>
                    <div className="text-[9px] font-black uppercase text-white/40">Water Level Sensor</div>
                    <div className="text-base font-black text-white">
                      {hardwareData ? `${hardwareData.water_level}%` : isFlood ? '88%' : '18%'}
                    </div>
                  </div>
                </div>
                <span className={clsx(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                  (hardwareData?.water_level ?? (isFlood ? 88 : 18)) > 60 ? "bg-blue-500 text-white animate-pulse" : "bg-white/10 text-white/50"
                )}>
                  {(hardwareData?.water_level ?? (isFlood ? 88 : 18)) > 60 ? "FLOOD ALERT" : "OK"}
                </span>
              </div>
            </div>

            {/* Direct Fan Trigger Switch */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-white">Manual 5V Fan Relay</div>
                <div className="text-[9px] font-bold text-white/40">Hardware breadboard pin D5</div>
              </div>
              <button
                onClick={() => onTriggerHardwareFan(!fanIsSpinning)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  fanIsSpinning ? "bg-rose-500 text-white shadow-glow-red" : "bg-lime-brand text-black shadow-glow-lime"
                )}
              >
                {fanIsSpinning ? "STOP" : "START"}
              </button>
            </div>
          </div>

          {/* Hackathon Judge Scenario Playground */}
          <div className="bg-black/60 border border-lime-brand/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-lime-brand uppercase tracking-widest mb-3">
                <Play size={12} className="fill-lime-brand" />
                <span>JUDGE DEMO SCENARIO MATRIX</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setScenario(s.id);
                      setActiveAction(false);
                      if (s.id === "CRITICAL_HEAT") {
                        onTriggerHardwareFan(true);
                      } else if (s.id === "NORMAL") {
                        onTriggerHardwareFan(false);
                      }
                    }}
                    className={clsx(
                      "p-2.5 rounded-xl text-left border transition-all text-xs font-bold cursor-pointer",
                      scenario === s.id
                        ? "bg-lime-brand text-black border-lime-brand font-black shadow-glow-lime scale-102"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{s.label.split(' ')[0]}</span>
                      <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-black/30">
                        {s.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-white/40 font-bold uppercase tracking-wider text-center">
              Click any scenario to test hardware & software reaction
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
