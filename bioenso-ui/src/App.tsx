import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';

import FloatingNav from './components/FloatingNav';
import LandingHero from './components/LandingHero';
import FourStepsSection from './components/FourStepsSection';
import ComparisonSection from './components/ComparisonSection';
import DesktopDashboardView from './components/DesktopDashboardView';
import MobileSimulatorView from './components/MobileSimulatorView';
import HardwareLabSection from './components/HardwareLabSection';

import { getScenarioState } from './AppState';
import type { ScenarioType } from './AppState';

export interface HardwareData {
  temperature: number;
  humidity: number;
  water_level: number;
  fan_active: boolean;
  water_alert: boolean;
  heat_alert: boolean;
  connected: boolean;
}

export interface VisionData {
  status: string;
  biology: {
    animals_observed: number;
    movement_index: number;
    shade_occupancy_pct: number;
    water_zone_occupancy_pct: number;
    grazing_pct: number;
    resting_pct: number;
  };
  vision: {
    confidence: number;
    source: string;
  };
  hardware?: HardwareData;
}

export default function App() {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scenario, setScenario] = useState<ScenarioType>("NORMAL");
  const [activeAction, setActiveAction] = useState(false);
  const [recoveryRisk, setRecoveryRisk] = useState<number | null>(null);
  
  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [hardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [visionOnline, setVisionOnline] = useState<boolean | null>(null);

  // Poll the vision & hardware API for live data every 1.5s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/observations/biology', {
          signal: AbortSignal.timeout(1500)
        });
        if (res.ok) {
          const data: VisionData = await res.json();
          setVisionData(data);
          setVisionOnline(data.status === "ONLINE");

          if (data.hardware) {
            setHardwareData(data.hardware);

            // Hardware-driven automated alert transitions if connected
            if (data.hardware.connected) {
              if (data.hardware.water_alert && scenario !== "FLOOD_RISK") {
                setScenario("FLOOD_RISK");
              } else if (data.hardware.heat_alert && scenario !== "CRITICAL_HEAT") {
                setScenario("CRITICAL_HEAT");
              }
            }
          }
        } else {
          setVisionOnline(false);
        }
      } catch {
        setVisionOnline(false);
      }
    };

    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [scenario]);

  // When farmer taps "START COOLING" or Action in UI -> Send actuation signal to ESP32 Fan!
  useEffect(() => {
    if (activeAction) {
      fetch('http://localhost:8000/api/v1/hardware/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fan: true })
      }).catch(() => {});
    }
  }, [activeAction]);

  // Recovery transition logic
  useEffect(() => {
    if (activeAction && (scenario === "CRITICAL_HEAT" || scenario === "FLOOD_RISK")) {
      const timer = setTimeout(() => {
        setScenario("RECOVERY");
        setRecoveryRisk(86);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeAction, scenario]);

  useEffect(() => {
    if (scenario === "RECOVERY" && recoveryRisk !== null) {
      if (recoveryRisk > 32) {
        const timer = setTimeout(() => {
          let nextRisk = recoveryRisk;
          if (recoveryRisk === 86) nextRisk = 78;
          else if (recoveryRisk === 78) nextRisk = 69;
          else if (recoveryRisk === 69) nextRisk = 57;
          else if (recoveryRisk === 57) nextRisk = 44;
          else if (recoveryRisk === 44) nextRisk = 32;

          setRecoveryRisk(nextRisk);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [scenario, recoveryRisk]);

  const handleSetScenario = useCallback((s: ScenarioType) => {
    setScenario(s);
    setRecoveryRisk(null);
    if (s === "NORMAL") {
      // Turn off fan override when reset to normal
      fetch('http://localhost:8000/api/v1/hardware/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fan: null })
      }).catch(() => {});
    }
  }, []);

  const handleTriggerHardwareFan = useCallback((fanState: boolean | null) => {
    fetch('http://localhost:8000/api/v1/hardware/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fan: fanState })
    }).catch(() => {});

    // Optimistically update local hardware state
    setHardwareData(prev => prev ? ({ ...prev, fan_active: fanState ?? false }) : null);
  }, []);

  const handleSendTelemetry = useCallback((temp: number, hum: number, water: number) => {
    fetch('http://localhost:8000/api/v1/hardware/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature: temp, humidity: hum, water_level: water })
    })
      .then(r => r.json())
      .then(resp => {
        if (resp && resp.fan !== undefined) {
          setHardwareData(prev => prev ? ({ ...prev, fan_active: resp.fan }) : null);
        }
      })
      .catch(() => {});
  }, []);

  const appState = getScenarioState(scenario, recoveryRisk ?? undefined);

  // If live hardware is connected, reflect live temperature
  if (hardwareData && hardwareData.connected) {
    appState.environment.temperature = hardwareData.temperature;
    appState.environment.humidity = hardwareData.humidity;
    appState.environment.tempDiff = Number((hardwareData.temperature - 32.1).toFixed(1));
  }

  // Scroll spy for dot navigation
  useEffect(() => {
    const sections = ['hero', 'steps', 'compare', 'dashboard', 'hardware-lab'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8fafc] font-sans relative selection:bg-lime-brand selection:text-black">
      
      {/* 1. Floating Pill Navigation Header (Aarunya Style) */}
      <FloatingNav
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        activeSection={activeSection}
        hardwareData={hardwareData}
        visionOnline={visionOnline}
        onLaunchApp={() => scrollTo('dashboard')}
      />

      {/* 2. Vertical Dot Navigation Indicator (Aarunya Style on right margin) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col space-y-3 pointer-events-auto bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
        {[
          { id: 'hero', title: 'Overview' },
          { id: 'steps', title: '4 Steps' },
          { id: 'compare', title: 'Comparison' },
          { id: 'dashboard', title: 'Farmers App' },
          { id: 'hardware-lab', title: 'Hardware Lab' }
        ].map(dot => (
          <button
            key={dot.id}
            onClick={() => scrollTo(dot.id)}
            title={dot.title}
            className={clsx(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              activeSection === dot.id 
                ? "bg-lime-brand scale-125 shadow-glow-lime" 
                : "bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* 3. Hero Landing Section (Aarunya Net Zero Theme) */}
      <LandingHero
        hardwareData={hardwareData}
        onLaunchApp={() => scrollTo('dashboard')}
        onTestHardware={() => scrollTo('hardware-lab')}
      />

      {/* 4. Four Steps Pipeline Section (Aarunya Roof to Power Theme) */}
      <FourStepsSection />

      {/* 5. Comparison Section (Eduvia Brutalist Theme) */}
      <ComparisonSection />

      {/* 6. The Body of the Farmers App (Next Slide / Main Interactive Dashboard) */}
      <section id="dashboard" className="py-24 bg-[#080808] border-t border-white/10 relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lime-brand/5 blur-[220px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          
          {/* Section Header & Interactive Device Viewport Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-white/10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-lime-brand mb-3">
                <span>SLIDE 04 • LIVE SYSTEM APPLICATION</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
                THE FARMERS APP <br />
                <span className="text-lime-brand">COMMAND CENTER</span>
              </h2>
            </div>

            {/* Mode Selector Pill */}
            <div className="flex items-center space-x-3 bg-black/80 border-2 border-white/20 p-1.5 rounded-full shadow-2xl">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={clsx(
                  "px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  deviceMode === 'desktop' 
                    ? "bg-white text-black shadow-md" 
                    : "text-white/60 hover:text-white"
                )}
              >
                🖥️ Widescreen Desktop View
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={clsx(
                  "px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  deviceMode === 'mobile' 
                    ? "bg-lime-brand text-black font-black shadow-glow-lime" 
                    : "text-white/60 hover:text-white"
                )}
              >
                📱 Mobile Handheld View
              </button>
            </div>
          </div>

          {/* Conditional Rendering: Desktop View vs Mobile Smartphone View */}
          {deviceMode === 'desktop' ? (
            <DesktopDashboardView
              appState={appState}
              setScenario={handleSetScenario}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              hardwareData={hardwareData}
              visionData={visionData}
              onTriggerHardwareFan={handleTriggerHardwareFan}
            />
          ) : (
            <MobileSimulatorView
              appState={appState}
              setScenario={handleSetScenario}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              hardwareData={hardwareData}
              visionData={visionData}
              visionOnline={visionOnline}
            />
          )}

        </div>
      </section>

      {/* 7. Hardware & Actuator Interactive Bench */}
      <HardwareLabSection
        hardwareData={hardwareData}
        onSendTelemetry={handleSendTelemetry}
        onTriggerFan={handleTriggerHardwareFan}
      />

      {/* 8. Footer */}
      <footer className="py-12 bg-black border-t border-white/10 text-white/50 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-brand shadow-glow-lime" />
            <span className="font-black text-white text-sm tracking-widest uppercase">BIOENSO</span>
            <span>&mdash; Autonomous Livestock Biometeorological Defense</span>
          </div>
          <div className="text-[11px] font-mono text-white/40">
            ESP32 (DHT22 + Water + Fan) • YOLOv8 • Flask :8000 • Vite :5173
          </div>
        </div>
      </footer>

    </div>
  );
}
