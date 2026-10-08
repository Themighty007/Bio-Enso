import { useState, useEffect, useCallback } from 'react';

import SylvaHeroLanding from './components/SylvaHeroLanding';
import FarmerDashboard from './components/FarmerDashboard';

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

  // When farmer taps "START COOLING" in UI -> Send actuation signal to ESP32 Fan!
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

    setHardwareData(prev => prev ? ({ ...prev, fan_active: fanState ?? false }) : null);
  }, []);

  const appState = getScenarioState(scenario, recoveryRisk ?? undefined);

  // If live hardware is connected, reflect live temperature
  if (hardwareData && hardwareData.connected) {
    appState.environment.temperature = hardwareData.temperature;
    appState.environment.humidity = hardwareData.humidity;
    appState.environment.tempDiff = Number((hardwareData.temperature - 32.1).toFixed(1));
  }

  const scrollToFarmerDashboard = () => {
    const el = document.getElementById('farmer-dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8fafc] font-sans relative selection:bg-[#d4ff00] selection:text-black">
      
      {/* ── Slide 1: Exact SylvaHero 3D Living World Landing Page ───────────────── */}
      <SylvaHeroLanding onScrollToDashboard={scrollToFarmerDashboard} />

      {/* ── Slide 2: Professional Clean Neo-Brutalist Farmer's Dashboard ────────── */}
      <FarmerDashboard
        appState={appState}
        setScenario={handleSetScenario}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        hardwareData={hardwareData}
        visionData={visionData}
        visionOnline={visionOnline}
        onTriggerHardwareFan={handleTriggerHardwareFan}
      />

      {/* ── Minimalist Clean Footer ────────────────────────────────────────────── */}
      <footer className="py-8 bg-black text-white/50 border-t-2 border-black text-center text-xs font-mono">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />
          <span className="text-white font-black tracking-wider uppercase">BioENSO</span>
          <span>• Farmers Climate Defense Grid • ESP32 + YOLOv8 + BTI</span>
        </div>
      </footer>

    </div>
  );
}
