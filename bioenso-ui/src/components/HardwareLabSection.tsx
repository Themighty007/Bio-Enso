import { useState } from 'react';
import { Cpu, Wind, Thermometer, Droplets, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import type { HardwareData } from '../App';

interface HardwareLabSectionProps {
  hardwareData: HardwareData | null;
  onSendTelemetry: (temp: number, hum: number, water: number) => void;
  onTriggerFan: (fanState: boolean | null) => void;
}

export default function HardwareLabSection({
  hardwareData,
  onSendTelemetry,
  onTriggerFan
}: HardwareLabSectionProps) {
  const [tempSlider, setTempSlider] = useState<number>(hardwareData?.temperature ?? 32.1);
  const [waterSlider, setWaterSlider] = useState<number>(hardwareData?.water_level ?? 15);
  const [lastActionMsg, setLastActionMsg] = useState<string>("Ready. Select an interactive trigger below.");

  const handleSimulateHeat = () => {
    setTempSlider(37.4);
    onSendTelemetry(37.4, 72.0, waterSlider);
    setLastActionMsg("Simulated finger heat on DHT22 (+5.3°C). Fan triggered automatically!");
  };

  const handleSimulateFlood = () => {
    setWaterSlider(88);
    onSendTelemetry(tempSlider, 95.0, 88);
    setLastActionMsg("Simulated water cup immersion (88% level). Flood evacuation alert fired!");
  };

  const handleResetNormal = () => {
    setTempSlider(32.1);
    setWaterSlider(15);
    onSendTelemetry(32.1, 55.0, 15);
    onTriggerFan(null);
    setLastActionMsg("Reset to normal farm baseline (Temp: 32.1°C, Water: 15%, Fan: Auto).");
  };

  return (
    <section id="hardware-lab" className="py-24 bg-[#050505] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-lime-brand/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-lime-brand mb-4">
              <Cpu size={14} />
              <span>LIVE IOT & ACTUATION BENCH</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
              HARDWARE $\leftrightarrow$ SOFTWARE <br />
              <span className="text-lime-brand">SYNCHRONIZATION LAB</span>
            </h2>
          </div>
          <p className="text-sm text-white/60 font-medium max-w-md">
            Test how physical sensor changes on your breadboard propagate to the software dashboard in real time, and trigger the physical 5V fan relay with zero latency.
          </p>
        </div>

        {/* Interactive Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Breadboard Virtual Schematic (col-span-7) */}
          <div className="lg:col-span-7 bg-[#0c0c0c] border-2 border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-white/50">
                  ESP32 NODE BREADBOARD TOPOLOGY
                </span>
                <span className={clsx(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                  hardwareData?.connected ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white/60"
                )}>
                  {hardwareData?.connected ? "● HARDWARE BRIDGE CONNECTED" : "● LOCAL SIMULATOR RUNNING"}
                </span>
              </div>

              {/* Breadboard Visual Canvas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                
                {/* Module 1: DHT22 */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-rose-400 mb-2">
                      <Thermometer size={18} />
                      <span className="text-[10px] font-black uppercase">DHT22 SENSOR</span>
                    </div>
                    <div className="text-2xl font-black text-white">{tempSlider.toFixed(1)}°C</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Pin D4 (GPIO 4)</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-white/50">
                    Reads ambient microclimate
                  </div>
                </div>

                {/* Module 2: Water Sensor */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-400 mb-2">
                      <Droplets size={18} />
                      <span className="text-[10px] font-black uppercase">WATER SENSOR</span>
                    </div>
                    <div className="text-2xl font-black text-white">{waterSlider}%</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Pin D34 (ADC1)</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-white/50">
                    Reads trough / flood depth
                  </div>
                </div>

                {/* Module 3: 5V Cooling Fan */}
                <div className={clsx(
                  "border rounded-2xl p-4 flex flex-col justify-between transition-all",
                  hardwareData?.fan_active 
                    ? "bg-lime-brand/10 border-lime-brand shadow-glow-lime" 
                    : "bg-black/50 border-white/10"
                )}>
                  <div>
                    <div className="flex items-center space-x-2 text-lime-brand mb-2">
                      <Wind size={18} className={hardwareData?.fan_active ? "animate-spin" : ""} />
                      <span className="text-[10px] font-black uppercase">5V FAN RELAY</span>
                    </div>
                    <div className={clsx("text-2xl font-black", hardwareData?.fan_active ? "text-lime-brand" : "text-white/40")}>
                      {hardwareData?.fan_active ? "SPINNING" : "STOPPED"}
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Pin D5 (GPIO 5)</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-white/50">
                    Relay coil driven by ESP32
                  </div>
                </div>

              </div>

              {/* Status Message Display */}
              <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-lime-brand flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-lime-brand animate-pulse" />
                <span>LOG: {lastActionMsg}</span>
              </div>
            </div>

            {/* Firmware Code Snippet Preview */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
              <span>Firmware: bioenso-vision/esp32_firmware.ino</span>
              <span className="text-lime-brand font-bold">115200 BAUD • HTTP POLLING (1.5s)</span>
            </div>
          </div>

          {/* Right: Interactive Trigger Controls (col-span-5) */}
          <div className="lg:col-span-5 bg-[#101010] border-2 border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-lime-brand mb-1">
                DEMO TRIGGER PANEL
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-6">
                Direct Hardware Stimulus
              </h3>

              {/* Sliders */}
              <div className="space-y-6 mb-8">
                {/* Temperature Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/70">Simulate DHT22 Temperature:</span>
                    <span className={clsx("font-black", tempSlider >= 35 ? "text-rose-400" : "text-lime-brand")}>
                      {tempSlider.toFixed(1)}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="45"
                    step="0.5"
                    value={tempSlider}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTempSlider(val);
                      onSendTelemetry(val, 60.0, waterSlider);
                    }}
                    className="w-full accent-lime-brand bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1">
                    <span>25°C (Cool)</span>
                    <span className="text-rose-400 font-bold">35°C (Auto Fan Trigger)</span>
                    <span>45°C (Extreme)</span>
                  </div>
                </div>

                {/* Water Level Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/70">Simulate Water Level Depth:</span>
                    <span className={clsx("font-black", waterSlider >= 60 ? "text-blue-400" : "text-white")}>
                      {waterSlider}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={waterSlider}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setWaterSlider(val);
                      onSendTelemetry(tempSlider, 60.0, val);
                    }}
                    className="w-full accent-blue-500 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1">
                    <span>0% (Empty)</span>
                    <span className="text-blue-400 font-bold">60% (Flood Alert)</span>
                    <span>100% (Submerged)</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSimulateHeat}
                  className="w-full py-3.5 px-4 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Thermometer size={16} />
                  <span>TRIGGER HEAT DOME (+5°C) &rarr; FAN ON</span>
                </button>

                <button
                  onClick={handleSimulateFlood}
                  className="w-full py-3.5 px-4 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Droplets size={16} />
                  <span>SIMULATE WATER CUP DIP (88%) &rarr; FLOOD ALARM</span>
                </button>

                <button
                  onClick={handleResetNormal}
                  className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>RESET TO BASELINE (32.1°C / FAN OFF)</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
              Syncs with Python API (Port 8000) & Mobile UI (Port 5173)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
