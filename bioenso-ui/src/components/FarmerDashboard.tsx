import { useState } from 'react';
import { 
  Wind, Droplets, Thermometer, 
  Activity, Eye, Zap, Monitor, Smartphone, Play
} from 'lucide-react';
import clsx from 'clsx';
import type { AppState, ScenarioType } from '../AppState';
import type { HardwareData } from '../App';
import MobileSimulatorView from './MobileSimulatorView';

interface FarmerDashboardProps {
  appState: AppState;
  setScenario: (s: ScenarioType) => void;
  activeAction: boolean;
  setActiveAction: (v: boolean) => void;
  hardwareData: HardwareData | null;
  visionData: any;
  visionOnline: boolean | null;
  onTriggerHardwareFan: (fanState: boolean | null) => void;
}

export default function FarmerDashboard({
  appState,
  setScenario,
  activeAction,
  setActiveAction,
  hardwareData,
  visionData,
  visionOnline,
  onTriggerHardwareFan
}: FarmerDashboardProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [cameraMode, setCameraMode] = useState<'yolo' | 'thermal'>('yolo');

  const { scenario, environment, animalState, riskState } = appState;
  const isFlood = scenario === "FLOOD_RISK";
  const isCriticalHeat = scenario === "CRITICAL_HEAT";
  const isRecovery = scenario === "RECOVERY";

  const fanIsSpinning = hardwareData?.fan_active || activeAction;

  const scenarios: { id: ScenarioType; label: string; badge: string; color: string }[] = [
    { id: "NORMAL", label: "Normal Baseline", badge: "SAFE", color: "bg-white" },
    { id: "HEAT_RISK", label: "Heat Risk", badge: "WATCH", color: "bg-amber-300" },
    { id: "CRITICAL_HEAT", label: "Critical Heat Dome", badge: "ACT NOW", color: "bg-rose-400" },
    { id: "FLOOD_RISK", label: "Flash Flood Surge", badge: "EVACUATE", color: "bg-blue-300" },
    { id: "RECOVERY", label: "Recovery Mode", badge: "IMPROVING", color: "bg-emerald-300" },
  ];

  return (
    <section id="farmer-dashboard" className="py-16 bg-[#f4f4f0] text-black border-t-4 border-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Neo-Brutalist Command Header */}
        <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000000] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-black/60 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] border-2 border-black animate-pulse" />
              <span>LIVE TELEMETRY • FARM STATION #01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <span>BioENSO Farmer's Station</span>
              <span className="text-xs font-black bg-[#d4ff00] text-black px-3 py-1 rounded-full border-2 border-black">
                128 CATTLE
              </span>
            </h2>
          </div>

          {/* View Mode Switcher Pill (Desktop vs Mobile) */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
            <button
              onClick={() => setDeviceView('desktop')}
              className={clsx(
                "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                deviceView === 'desktop'
                  ? "bg-black text-[#d4ff00] shadow-sm"
                  : "text-black/60 hover:text-black"
              )}
            >
              <Monitor size={14} />
              <span>Desktop Station</span>
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={clsx(
                "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                deviceView === 'mobile'
                  ? "bg-[#d4ff00] text-black font-black border border-black shadow-sm"
                  : "text-black/60 hover:text-black"
              )}
            >
              <Smartphone size={14} />
              <span>Mobile Phone</span>
            </button>
          </div>
        </div>

        {/* ── CONDITIONAL VIEWPORT: Desktop Grid vs Mobile Simulator ── */}
        {deviceView === 'mobile' ? (
          <div className="flex justify-center">
            <MobileSimulatorView
              appState={appState}
              setScenario={setScenario}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              hardwareData={hardwareData}
              visionData={visionData}
              visionOnline={visionOnline}
            />
          </div>
        ) : (
          /* ── DESKTOP NEO-BRUTALIST WORKSTATION ── */
          <div className="space-y-8">
            
            {/* Row 1: Key Metric Cards (Brutalist Blocks) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Microclimate (DHT22) */}
              <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                      <Thermometer size={16} className="text-rose-500" />
                      <span>DHT22 SENSOR</span>
                    </span>
                    <span className={clsx(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black",
                      (hardwareData?.temperature ?? environment.temperature) >= 35 ? "bg-rose-400 text-black" : "bg-[#d4ff00] text-black"
                    )}>
                      {(hardwareData?.temperature ?? environment.temperature) >= 35 ? "HEAT DANGER" : "NORMAL"}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                    {hardwareData ? `${hardwareData.temperature.toFixed(1)}°C` : `${environment.temperature}°C`}
                  </div>
                  <div className="text-xs font-bold text-black/60 mt-2">
                    Relative Humidity: <strong>{hardwareData ? `${hardwareData.humidity.toFixed(0)}%` : `${environment.humidity}%`}</strong>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-mono text-black/50">
                  ESP32 PIN D4 • Microclimate inside shed
                </div>
              </div>

              {/* Card 2: Water Level Sensor */}
              <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                      <Droplets size={16} className="text-blue-500" />
                      <span>WATER LEVEL</span>
                    </span>
                    <span className={clsx(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black",
                      (hardwareData?.water_level ?? (isFlood ? 88 : 15)) >= 60 ? "bg-blue-400 text-black animate-pulse" : "bg-neutral-200 text-black"
                    )}>
                      {(hardwareData?.water_level ?? (isFlood ? 88 : 15)) >= 60 ? "FLOOD ALERT" : "OK"}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                    {hardwareData ? `${hardwareData.water_level}%` : isFlood ? '88%' : '15%'}
                  </div>
                  <div className="text-xs font-bold text-black/60 mt-2">
                    {isFlood ? "Flash flood surface surge detected!" : "Drinking trough supply normal."}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-mono text-black/50">
                  ESP32 PIN D34 • Analog capacitive probe
                </div>
              </div>

              {/* Card 3: Herd Biological-Thermal Index (BTI) */}
              <div className={clsx(
                "border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000000] flex flex-col justify-between transition-all",
                isCriticalHeat ? "bg-rose-100" :
                isFlood ? "bg-blue-100" :
                isRecovery ? "bg-emerald-100" :
                "bg-[#d4ff00]"
              )}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Activity size={16} />
                      <span>BTI STRESS SCORE</span>
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black text-white">
                      {riskState.level}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                    {riskState.score} <span className="text-xl font-bold text-black/60">/ 100</span>
                  </div>
                  <div className="text-xs font-black text-black mt-2 leading-tight">
                    {riskState.message}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black/20 text-[11px] font-black text-black/70">
                  St-Pierre & Gaughan early warning model
                </div>
              </div>

            </div>

            {/* Row 2: Big Action Button & Actuator Control */}
            <div className="bg-black text-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[7px_7px_0px_#000000]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#d4ff00] mb-2">
                    <Zap size={14} className="fill-[#d4ff00]" />
                    <span>EMERGENCY CLIMATE INTERVENTION</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    {isFlood ? "Flash Flood Evacuation Alert" : "5V Battery-Backed Misting Fan"}
                  </h3>
                  <p className="text-sm text-white/70 max-w-xl mt-1 font-medium">
                    {isFlood 
                      ? "Direct herd away from submerged paddocks towards elevated Zone B."
                      : "Directly fires the physical relay on breadboard Pin D5 to cool livestock and prevent heat stroke."}
                  </p>
                </div>

                {/* Massive Brutalist Actuation Button */}
                <div className="shrink-0">
                  {!fanIsSpinning ? (
                    <button
                      onClick={() => {
                        setActiveAction(true);
                        onTriggerHardwareFan(true);
                      }}
                      className="px-8 py-5 bg-[#d4ff00] hover:bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl border-3 border-black shadow-[5px_5px_0px_#ffffff] hover:shadow-[7px_7px_0px_#ffffff] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer flex items-center space-x-3"
                    >
                      <Wind size={22} className="stroke-[2.5]" />
                      <span>{isFlood ? "SOUND EVACUATION ALARM" : "START 5V COOLING FAN"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveAction(false);
                        onTriggerHardwareFan(false);
                      }}
                      className="px-8 py-5 bg-rose-500 hover:bg-rose-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl border-3 border-white shadow-[5px_5px_0px_#d4ff00] hover:shadow-[7px_7px_0px_#d4ff00] transition-all cursor-pointer flex items-center space-x-3"
                    >
                      <Wind size={22} className="animate-spin stroke-[2.5]" />
                      <span>FAN ACTIVE (CLICK TO STOP)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: Paddock Camera & Live Centroid Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Cattle Vision Stream (col-span-7) */}
              <div className="lg:col-span-7 bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000000]">
                <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-black">
                  <div className="flex items-center space-x-2">
                    <Eye size={18} className="text-black" />
                    <span className="text-sm font-black uppercase tracking-wider">
                      Herd Centroid Camera
                    </span>
                  </div>
                  <div className="flex space-x-1 bg-neutral-100 p-1 rounded-xl border-2 border-black">
                    <button
                      onClick={() => setCameraMode('yolo')}
                      className={clsx(
                        "px-3 py-1 rounded-lg text-xs font-black uppercase cursor-pointer",
                        cameraMode === 'yolo' ? "bg-black text-[#d4ff00]" : "text-black/60"
                      )}
                    >
                      AI Tracking
                    </button>
                    <button
                      onClick={() => setCameraMode('thermal')}
                      className={clsx(
                        "px-3 py-1 rounded-lg text-xs font-black uppercase cursor-pointer",
                        cameraMode === 'thermal' ? "bg-black text-[#d4ff00]" : "text-black/60"
                      )}
                    >
                      Thermal
                    </button>
                  </div>
                </div>

                {/* Video / AI Canvas View */}
                <div className="aspect-[16/10] bg-black rounded-2xl border-2 border-black overflow-hidden relative flex flex-col justify-between p-4 text-white">
                  {cameraMode === 'yolo' ? (
                    <>
                      <div className="flex justify-between text-[11px] font-black uppercase">
                        <span className="text-[#d4ff00] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
                          <span>YOLOv8 Animal Centroid Detector</span>
                        </span>
                        <span className="bg-black/60 border border-white/20 px-2 py-0.5 rounded font-mono">
                          14 FPS
                        </span>
                      </div>

                      {/* Bounding Boxes */}
                      <div className="absolute top-1/4 left-1/4 w-36 h-28 border-3 border-[#d4ff00] bg-[#d4ff00]/10 rounded-xl p-1.5 flex flex-col justify-between shadow-[0_0_15px_rgba(212,255,0,0.5)]">
                        <span className="text-[9px] font-black bg-[#d4ff00] text-black px-1.5 py-0.5 rounded w-fit">
                          COW #03 • RESTING
                        </span>
                        <span className="text-[9px] font-black text-[#d4ff00]">94% CONF</span>
                      </div>

                      <div className="absolute bottom-1/4 right-1/4 w-40 h-32 border-3 border-rose-500 bg-rose-500/10 rounded-xl p-1.5 flex flex-col justify-between shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse">
                        <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded w-fit">
                          COW #11 • SHADE CROWDING
                        </span>
                        <span className="text-[9px] font-black text-rose-300">THERMAL STRESS</span>
                      </div>

                      <div className="text-[10px] font-mono text-white/50 uppercase">
                        Cattle detected: <strong>{animalState.normal + animalState.elevated + animalState.critical}</strong>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="flex justify-between text-[11px] font-black uppercase text-rose-400">
                        <span>Simulated Radiance Map</span>
                        <span>Peak: 41.2°C</span>
                      </div>
                      <div className="my-auto flex justify-center">
                        <div className="w-40 h-40 rounded-full bg-rose-500/40 blur-xl animate-pulse flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-yellow-400/60 blur-md" />
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-white/50 text-center">
                        Red indicates elevated thermal emission
                      </div>
                    </div>
                  )}
                </div>

                {/* Herd Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="bg-neutral-100 border-2 border-black rounded-xl p-3">
                    <div className="text-[10px] font-black uppercase text-black/50">Movement Rate</div>
                    <div className="text-xl font-black text-black">{animalState.movementDiff}%</div>
                  </div>
                  <div className="bg-neutral-100 border-2 border-black rounded-xl p-3">
                    <div className="text-[10px] font-black uppercase text-black/50">Shade Seeking</div>
                    <div className="text-xl font-black text-rose-600">+{animalState.shadeOccupancyDiff}%</div>
                  </div>
                  <div className="bg-neutral-100 border-2 border-black rounded-xl p-3">
                    <div className="text-[10px] font-black uppercase text-black/50">Water Visits</div>
                    <div className="text-xl font-black text-blue-600">{animalState.waterDemandNow} L</div>
                  </div>
                </div>

              </div>

              {/* Judge Scenario Switcher (col-span-5) */}
              <div className="lg:col-span-5 bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-black/60 mb-2">
                    <Play size={14} />
                    <span>JUDGE SCENARIO SIMULATOR</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4">
                    Test Hardware & Software Reaction
                  </h3>
                  <p className="text-xs text-black/60 font-semibold mb-6">
                    Click any condition below to instantly simulate the climate shock, see the dashboard update, and trigger the physical fan relay.
                  </p>

                  <div className="space-y-3">
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
                          "w-full p-4 rounded-xl text-left border-2 border-black flex items-center justify-between transition-all cursor-pointer",
                          scenario === s.id
                            ? "bg-[#d4ff00] text-black font-black shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                            : "bg-white hover:bg-neutral-100 text-black font-bold shadow-[2px_2px_0px_#000000]"
                        )}
                      >
                        <span className="text-sm">{s.label}</span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-black text-white">
                          {s.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black/10 text-center text-[10px] font-mono text-black/50 uppercase">
                  Connected to ESP32 firmware & Python API (:8000)
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
