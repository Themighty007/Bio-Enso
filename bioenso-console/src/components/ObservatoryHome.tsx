import type { Farm } from '../AppState';
import clsx from 'clsx';
import { 
  Activity, ThermometerSun, Droplets, Wind, AlertTriangle, 
  BrainCircuit, Search, Bell, Settings, ChevronRight, Zap, RefreshCw, BarChart2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  farms: Farm[];
  onSelectFarm: (id: string) => void;
  liveTelemetry: any;
}

export default function ObservatoryHome({ farms, onSelectFarm, liveTelemetry }: Props) {
  const hw = liveTelemetry?.hardware || {};
  const bio = liveTelemetry?.biology || {};

  const currentTemp = hw.temperature || 32.1;
  const currentHum = hw.humidity || 55;
  const currentWater = hw.water_level || 15;
  const fanActive = hw.fan_active || false;
  const heatAlert = hw.heat_alert || false;
  const waterAlert = hw.water_alert || false;

  const activeAlerts = (heatAlert ? 1 : 0) + (waterAlert ? 1 : 0);
  const aiStatusText = heatAlert ? "Critical heat detected! Fan relay triggered automatically." : "Conditions stable. Biomodels indicate 92% comfort.";

  // Mock trend data mimicking an analytics dashboard (temperature & BTI)
  const mockTrendData = Array.from({length: 12}).map((_, i) => {
    const baseT = 28 + (i * 0.5) + (Math.sin(i)*1.5);
    return {
      time: `${i * 2}:00`,
      Temperature: i === 11 ? currentTemp : parseFloat(baseT.toFixed(1)),
      BTI: parseFloat((baseT * 1.5).toFixed(1))
    };
  });

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col font-sans bg-[#0F172A] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search analytics, farms..." 
              className="w-full bg-slate-800 border border-slate-700 text-sm rounded-full py-1.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            {activeAlerts > 0 && <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />}
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings size={18} /></button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-slate-700 flex items-center justify-center text-xs font-bold shadow-lg">OP</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        
        {/* Header & AI Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI-Powered Analytics Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time B2B insights connected to remote field hardware.</p>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <RefreshCw size={14} className="animate-spin-slow" />
            <span>Generate Report</span>
          </button>
        </div>

        {/* AI Insight Bar */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center space-x-4 shadow-lg backdrop-blur-sm">
          <div className="p-2.5 bg-indigo-500/20 rounded-xl">
            <BrainCircuit size={20} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-0.5">BioENSO AI Assistant</h3>
            <p className="text-sm text-slate-200">{aiStatusText}</p>
          </div>
          <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center">
            View Details <ChevronRight size={16} />
          </button>
        </div>

        {/* KPI Grid (Top Level Metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><ThermometerSun size={16}/> Live Temp</div>
              <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold", heatAlert ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                {heatAlert ? "+12% Surge" : "Stable"}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{currentTemp.toFixed(1)}°C</div>
            <div className="text-xs text-slate-500 mt-1">Hardware Sensor 01</div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><Droplets size={16}/> Humidity & Water</div>
              <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold", waterAlert ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400")}>
                {waterAlert ? "High Water" : "Optimal"}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold text-white">{currentHum.toFixed(0)}%</div>
              <div className="text-sm font-medium text-slate-400">/ {currentWater}% W.L.</div>
            </div>
            <div className="text-xs text-slate-500 mt-1">Hardware Sensor 02</div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative">
              <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><Wind size={16}/> Cooling Actuator</div>
              <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse", fanActive ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" : "bg-slate-700 text-slate-400")}>
                {fanActive ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{fanActive ? "Running" : "Idle"}</div>
            <div className="text-xs text-slate-500 mt-1">ESP32 Fan Relay</div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><AlertTriangle size={16}/> Critical Alerts</div>
              <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold", activeAlerts > 0 ? "bg-rose-500/20 text-rose-400" : "bg-slate-700 text-slate-400")}>
                Today
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{activeAlerts}</div>
            <div className="text-xs text-slate-500 mt-1">Total active escalations</div>
          </div>
        </div>

        {/* Charts & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">Environmental Trend (Live)</h3>
                <p className="text-xs text-slate-400 mt-1">Temperature & BTI index correlated over time.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button className="px-3 py-1 text-xs font-semibold rounded bg-slate-700 text-white shadow">24H</button>
                <button className="px-3 py-1 text-xs font-semibold rounded text-slate-400 hover:text-white">7D</button>
                <button className="px-3 py-1 text-xs font-semibold rounded text-slate-400 hover:text-white">30D</button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBTI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="Temperature" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                  <Area type="monotone" dataKey="BTI" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorBTI)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Connected Hardware Feed */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center"><Zap size={16} className="text-amber-400 mr-2"/> Hardware Activity Feed</h3>
            
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                  <Activity size={14} className="text-slate-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Telemetry Sync</div>
                  <div className="text-xs text-slate-400 mt-0.5">ESP32 reported {currentTemp.toFixed(1)}°C, {currentHum.toFixed(0)}% Hum.</div>
                  <div className="text-[10px] text-slate-500 mt-1">Just now</div>
                </div>
              </div>

              {fanActive && (
                <div className="flex gap-3 relative">
                  <div className="absolute left-4 top-[-16px] bottom-[-16px] w-px bg-slate-700 -z-10" />
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/50">
                    <Wind size={14} className="text-indigo-400 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Cooling Actuator Engaged</div>
                    <div className="text-xs text-slate-400 mt-0.5">Fan relay turned ON to mitigate heat.</div>
                    <div className="text-[10px] text-slate-500 mt-1">Live</div>
                  </div>
                </div>
              )}

              {heatAlert && (
                <div className="flex gap-3 relative">
                  <div className="absolute left-4 top-[-16px] bottom-[-16px] w-px bg-slate-700 -z-10" />
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/50">
                    <AlertTriangle size={14} className="text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Heat Alert Triggered</div>
                    <div className="text-xs text-slate-400 mt-0.5">Temperature exceeded threshold.</div>
                    <div className="text-[10px] text-slate-500 mt-1">Recent</div>
                  </div>
                </div>
              )}

               <div className="flex gap-3 relative">
                 {!heatAlert && !fanActive && <div className="absolute left-4 top-[-16px] bottom-[-16px] w-px bg-slate-700 -z-10" />}
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                  <BarChart2 size={14} className="text-slate-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Vision AI Check</div>
                  <div className="text-xs text-slate-400 mt-0.5">Processed {bio.animals_observed || 0} subjects. Source: {bio.species || 'cattle'}.</div>
                  <div className="text-[10px] text-slate-500 mt-1">2 mins ago</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onSelectFarm(farms[0]?.id)}
              className="mt-4 w-full py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              View Full Farm Profile
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
