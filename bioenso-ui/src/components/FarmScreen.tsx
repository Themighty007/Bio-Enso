import { Info, Cpu, HardHat, Wifi, ShieldCheck, WifiOff, Thermometer, Droplets, Camera, Wind, Server, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import type { AppState, ScenarioType } from '../AppState';

export default function FarmScreen({
  appState,
  setScenario,
  setActiveAction,
  visionOnline
}: {
  appState: AppState;
  setScenario: (s: ScenarioType) => void;
  setActiveAction: (v: boolean) => void;
  visionOnline: boolean | null;
}) {
  const { scenario } = appState;
  const isOffline = scenario === "OFFLINE";

  const scenarios: { value: ScenarioType, label: string }[] = [
    { value: "NORMAL", label: "Normal" },
    { value: "HEAT_RISK", label: "Heat Risk" },
    { value: "CRITICAL_HEAT", label: "Critical Heat" },
    { value: "FLOOD_RISK", label: "Flood Risk" },
    { value: "RECOVERY", label: "Recovery Mode" },
    { value: "OFFLINE", label: "Offline Mode" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-32 pt-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-6 flex justify-between items-start">
        <h1 className="text-3xl font-black text-white tracking-tighter mix-blend-overlay">FARM</h1>
      </div>

      <div className="px-6 py-10 space-y-8">

        {/* Connectivity Status */}
        <div>
          <h2 className="text-[11px] font-black text-white/50 tracking-[0.2em] uppercase mb-4">Connection</h2>
          <div className={clsx(
            "backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.2)] border",
            isOffline ? "bg-orange-500/10 border-orange-500/30" : "bg-white/10 border-white/10"
          )}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={clsx(
                "p-4 rounded-2xl",
                isOffline ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400"
              )}>
                {isOffline ? <WifiOff size={28} /> : <Wifi size={28} />}
              </div>
              <div>
                <div className="font-black text-white text-2xl tracking-tight">
                  {isOffline ? "Offline" : "Online"}
                </div>
                {isOffline && <div className="text-sm font-bold text-orange-200 mt-1">Last cloud update: 8 minutes ago</div>}
              </div>
            </div>

            {isOffline && (
              <div className="mt-4 pt-4 border-t border-orange-500/20 flex flex-col space-y-2">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <ShieldCheck size={20} />
                  <span className="font-bold">LOCAL PROTECTION ACTIVE</span>
                </div>
                <p className="text-xs font-bold text-orange-200/70 ml-8">Emergency protection can continue locally.</p>
              </div>
            )}
          </div>
        </div>

        {/* Farm Baseline Setup */}
        <div>
          <h2 className="text-[11px] font-black text-white/50 tracking-[0.2em] uppercase mb-4">Your Farm Baseline</h2>
          <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-xl space-y-4">
            <p className="text-xs font-bold text-emerald-300 mb-6">BioENSO uses these normals to detect anomalies.</p>

            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/60 font-bold text-sm">Normal Temperature</span>
              <span className="text-white font-black">32.1°C</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/60 font-bold text-sm">Normal Herd Movement</span>
              <span className="text-white font-black">Active (74%)</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/60 font-bold text-sm">Normal Shade Occupancy</span>
              <span className="text-white font-black">11%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 font-bold text-sm">Normal Water Demand</span>
              <span className="text-white font-black">1,180 L/day</span>
            </div>
          </div>
        </div>

        {/* Device Health */}
        <div>
          <h2 className="text-[11px] font-black text-white/50 tracking-[0.2em] uppercase mb-4">Farm Protection System</h2>
          <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
              <div className={clsx("p-2 rounded-xl", isOffline ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400")}><Thermometer size={20} /></div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">Environmental Node</div>
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Temp 36.8°C • Battery 84%</div>
              </div>
              <div className={clsx("text-xs font-black uppercase", isOffline ? "text-orange-400" : "text-emerald-400")}>{isOffline ? "LOCAL" : "ONLINE"}</div>
            </div>

            <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
              <div className={clsx("p-2 rounded-xl", visionOnline === false ? "bg-red-500/20 text-red-400" : visionOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400")}><Camera size={20} /></div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">Animal Camera (CV)</div>
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">
                  {visionOnline === null ? "Status Unknown" : visionOnline ? "Active Tracking" : "Vision server offline"}
                </div>
              </div>
              <div className={clsx("text-xs font-black uppercase",
                visionOnline === null ? "text-white/30" :
                visionOnline ? "text-emerald-400" : "text-red-400"
              )}>
                {visionOnline === null ? "N/A" : visionOnline ? "ONLINE" : "OFFLINE"}
              </div>
            </div>

            <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
              <div className={clsx("p-2 rounded-xl", isOffline ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400")}><Server size={20} /></div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">Edge AI Compute</div>
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Processing 14fps</div>
              </div>
              <div className="text-xs font-black text-emerald-400 uppercase">ONLINE</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={clsx("p-2 rounded-xl", isOffline ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400")}><Wind size={20} /></div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">Cooling Controller</div>
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Fan 1, Fan 2 Linked</div>
              </div>
              <div className={clsx("text-xs font-black uppercase", isOffline ? "text-orange-400" : "text-emerald-400")}>{isOffline ? "LOCAL" : "ONLINE"}</div>
            </div>
          </div>
        </div>

        {/* Hackathon Demo Panel */}
        <div className="mt-16 bg-black/40 backdrop-blur-3xl rounded-[32px] p-6 border border-rose-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-3xl rounded-full mix-blend-screen" />

          <div className="flex items-center space-x-3 mb-6 text-white relative z-10">
            <HardHat size={20} className="text-rose-400" />
            <h2 className="text-[11px] font-black tracking-widest uppercase">Demo Control Panel</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {scenarios.map((s) => (
              <button
                key={s.value}
                onClick={() => { setScenario(s.value); setActiveAction(false); }}
                className={clsx(
                  "py-3 px-2 rounded-2xl font-bold text-sm transition-all border border-transparent flex items-center justify-center space-x-2",
                  scenario === s.value
                    ? "bg-rose-500 text-white shadow-lg scale-105 border-rose-400"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border-white/10"
                )}
              >
                {scenario === s.value && <CheckCircle size={14} />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-white/40 font-bold text-[10px] uppercase tracking-widest mt-6 relative z-10">
            Use to trigger scenarios for judges
          </p>
        </div>

        {/* Vision Server Start Hint */}
        {visionOnline === false && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-[24px] p-5 shadow-xl">
            <div className="flex items-start space-x-3 mb-3">
              <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm mb-1">Start Vision Server for Live Data</div>
                <div className="text-xs font-bold text-blue-200/70">To connect the real computer vision pipeline, run this in your terminal:</div>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 mt-3 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-nowrap">
              cd bioenso-vision && .\\venv\\Scripts\\activate && python main.py
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
