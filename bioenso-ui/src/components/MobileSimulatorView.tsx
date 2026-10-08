import { useState } from 'react';
import { Camera, Home, List, Bell, Settings, Wifi, WifiOff, Smartphone, Cpu } from 'lucide-react';
import clsx from 'clsx';

import HomeScreen from './HomeScreen';
import LiveScreen from './LiveScreen';
import AnimalsScreen from './AnimalsScreen';
import AlertsScreen from './AlertsScreen';
import FarmScreen from './FarmScreen';

import type { AppState, ScenarioType } from '../AppState';
import type { HardwareData } from '../App';

type TabType = "home" | "live" | "animals" | "alerts" | "farm";

interface MobileSimulatorViewProps {
  appState: AppState;
  setScenario: (s: ScenarioType) => void;
  activeAction: boolean;
  setActiveAction: (v: boolean) => void;
  hardwareData: HardwareData | null;
  visionData: any;
  visionOnline: boolean | null;
}

export default function MobileSimulatorView({
  appState,
  setScenario,
  activeAction,
  setActiveAction,
  hardwareData,
  visionData,
  visionOnline
}: MobileSimulatorViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const { scenario } = appState;
  const showAlertBadge = ["HEAT_RISK", "CRITICAL_HEAT", "FLOOD_RISK"].includes(scenario);

  const getThemeClasses = () => {
    if (appState.riskState.level === "ACT NOW" && scenario === "CRITICAL_HEAT") return "from-rose-500 to-red-900";
    if (appState.riskState.level === "ACT NOW" && scenario === "FLOOD_RISK") return "from-blue-600 to-slate-900";
    if (appState.riskState.level === "WATCH") return "from-amber-400 to-orange-700";
    if (scenario === "RECOVERY") {
      if (appState.riskState.score < 40) return "from-emerald-400 to-teal-900";
      return "from-emerald-600 to-blue-900";
    }
    if (scenario === "OFFLINE") return "from-slate-400 to-slate-800";
    return "from-emerald-400 to-teal-900";
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      
      {/* Device Label */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-black uppercase text-lime-brand mb-2">
          <Smartphone size={14} />
          <span>FARMER MOBILE HANDHELD PREVIEW</span>
        </div>
        <p className="text-xs text-white/50 max-w-sm">
          Simulating the exact touch-optimized mobile client used by dairy farm workers in the field.
        </p>
      </div>

      {/* Realistic Smartphone Shell (3D Shadow & Border) */}
      <div className="w-[380px] sm:w-[410px] h-[820px] bg-black rounded-[52px] p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_12px_#1c1c1e,0_0_0_14px_#38383a] relative border-4 border-neutral-900 overflow-hidden flex flex-col">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3 border border-white/10 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/20" />
          <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col bg-black">
          
          {/* Background Gradient */}
          <div className={clsx("absolute inset-0 bg-gradient-to-br transition-colors duration-1000 ease-in-out", getThemeClasses())} />
          
          {/* Subtle noise */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
          />

          {/* Top Status Indicators inside Phone */}
          <div className="absolute top-4 right-4 z-40 flex items-center space-x-1.5">
            {hardwareData?.connected && (
              <div className="flex items-center space-x-1 bg-black/60 px-2 py-0.5 rounded-full border border-emerald-400/40 text-[8px] font-black uppercase text-emerald-300">
                <Cpu size={8} />
                <span>ESP32</span>
              </div>
            )}
            {visionOnline !== null && (
              <div className="flex items-center space-x-1 bg-black/50 px-2 py-0.5 rounded-full border border-white/10 text-[8px] font-black uppercase text-white/60">
                {visionOnline ? <Wifi size={8} className="text-emerald-400" /> : <WifiOff size={8} />}
                <span>{visionOnline ? "LIVE" : "OFFLINE"}</span>
              </div>
            )}
          </div>

          {/* Main Mobile Screen Content */}
          <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
            {activeTab === "home" && (
              <HomeScreen
                appState={appState}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
                visionData={visionData}
                hardwareData={hardwareData}
              />
            )}
            {activeTab === "live" && <LiveScreen appState={appState} visionData={visionData} />}
            {activeTab === "animals" && <AnimalsScreen appState={appState} />}
            {activeTab === "alerts" && <AlertsScreen appState={appState} />}
            {activeTab === "farm" && (
              <FarmScreen
                appState={appState}
                setScenario={setScenario}
                setActiveAction={setActiveAction}
                visionOnline={visionOnline}
              />
            )}
          </div>

          {/* Bottom Navigation Dock */}
          <div className="absolute bottom-4 left-0 w-full px-5 z-40">
            <nav className="w-full bg-black/50 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full px-1.5 py-1.5">
              <div className="flex justify-between items-center h-12">
                {[
                  { id: "home", icon: Home },
                  { id: "live", icon: Camera },
                  { id: "animals", icon: List },
                  { id: "alerts", icon: Bell, badge: showAlertBadge },
                  { id: "farm", icon: Settings }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={clsx(
                        "flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300 cursor-pointer",
                        isActive ? "bg-white/25 text-white shadow-inner" : "text-white/50 hover:text-white/90"
                      )}
                    >
                      <div className="relative">
                        <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-2"} />
                        {item.badge && (
                          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

        </div>

      </div>

    </div>
  );
}
