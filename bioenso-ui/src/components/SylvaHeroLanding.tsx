import { useState, useEffect, useRef } from "react";
import { SylvaHero } from "@designcodeio/threeui";
import {
  Sliders,
  Download,
  Code,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Copy,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  X,
  ArrowDown
} from "lucide-react";

interface PresetTheme {
  name: string;
  primaryColor: string;
  headingSize: number;
  bodySize: number;
  headingWeight: string;
  bodyWeight: string;
  headingFont: string;
  bodyFont: string;
  bgDesc: string;
}

const PRESETS: PresetTheme[] = [
  {
    name: "Living Green (Default)",
    primaryColor: "#FFFFFF",
    headingSize: 63,
    bodySize: 16.5,
    headingWeight: "300",
    bodyWeight: "300",
    headingFont: "lexend",
    bodyFont: "lexend",
    bgDesc: "Original ThreeUI Sylva palette with crisp white ink",
  },
  {
    name: "Sakura Sunset",
    primaryColor: "#FF8DA1",
    headingSize: 68,
    bodySize: 17,
    headingWeight: "300",
    bodyWeight: "300",
    headingFont: "lexend",
    bodyFont: "lexend",
    bgDesc: "Warm blossom rose with glowing pink dusk tones",
  },
  {
    name: "Maple Autumn",
    primaryColor: "#F59E0B",
    headingSize: 64,
    bodySize: 16,
    headingWeight: "400",
    bodyWeight: "300",
    headingFont: "instrument-serif",
    bodyFont: "lexend",
    bgDesc: "Golden amber resin and fallen birch leaf highlights",
  },
  {
    name: "Sequoia Mist",
    primaryColor: "#34D399",
    headingSize: 60,
    bodySize: 16.5,
    headingWeight: "300",
    bodyWeight: "300",
    headingFont: "newsreader",
    bodyFont: "geist",
    bgDesc: "Deep temperate rainforest emerald and sea fog accents",
  },
  {
    name: "Moonlit Frost",
    primaryColor: "#93C5FD",
    headingSize: 65,
    bodySize: 16.5,
    headingWeight: "200",
    bodyWeight: "300",
    headingFont: "geist",
    bodyFont: "geist",
    bgDesc: "Nocturnal dew and ethereal moonlit silver-blue accents",
  },
];

interface SylvaHeroLandingProps {
  onScrollToDashboard: () => void;
}

export default function SylvaHeroLanding({ onScrollToDashboard }: SylvaHeroLandingProps) {
  // State matching the prompt's exact defaults
  const [primaryColor, setPrimaryColor] = useState<string>("#FFFFFF");
  const [headingSize, setHeadingSize] = useState<number>(63);
  const [bodySize, setBodySize] = useState<number>(16.5);
  const [headingWeight, setHeadingWeight] = useState<string>("300");
  const [bodyWeight, setBodyWeight] = useState<string>("300");
  const [headingFont, setHeadingFont] = useState<string>("lexend");
  const [bodyFont, setBodyFont] = useState<string>("lexend");

  // UI State
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"app" | "package" | "vite" | "readme">("app");
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  // Audio Context Ref for procedural ambient nature audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ masterGain?: GainNode; intervalId?: number }>({});

  // Reset to original exact specifications
  const handleReset = () => {
    setPrimaryColor("#FFFFFF");
    setHeadingSize(63);
    setBodySize(16.5);
    setHeadingWeight("300");
    setBodyWeight("300");
    setHeadingFont("lexend");
    setBodyFont("lexend");
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Procedural Forest Soundscape using Web Audio API
  useEffect(() => {
    if (!isSoundOn) {
      if (audioCtxRef.current) {
        if (audioNodesRef.current.masterGain) {
          audioNodesRef.current.masterGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        }
        if (audioNodesRef.current.intervalId) {
          clearInterval(audioNodesRef.current.intervalId);
        }
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      audioNodesRef.current.masterGain = masterGain;

      // Gentle Wind / Rustling leaves noise generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.05;
        b2 = 0.86 * b2 + white * 0.1;
        output[i] = (b0 + b1 + b2) * 0.2;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const filterLfo = ctx.createOscillator();
      filterLfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      const filterLfoGain = ctx.createGain();
      filterLfoGain.gain.setValueAtTime(180, ctx.currentTime);
      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);
      filterLfo.start();

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // Periodic soft wood chimes in pentatonic harmony
      const pentatonicNotes = [523.25, 587.33, 698.46, 783.99, 880.0, 1046.5];
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.04, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.00001, now + 2.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 3);
      };

      const chimeInterval = window.setInterval(() => {
        if (Math.random() > 0.35) {
          playChime();
        }
      }, 3500);

      audioNodesRef.current.intervalId = chimeInterval;
    } catch {
      // Audio autoplay fallback
    }

    return () => {
      if (audioNodesRef.current.intervalId) {
        clearInterval(audioNodesRef.current.intervalId);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [isSoundOn]);

  // Download ZIP handler
  const handleDownloadZip = () => {
    setIsDownloadingZip(true);
    const link = document.createElement("a");
    link.href = "/sylva-threeui-project.zip";
    link.download = "sylva-threeui-project.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setIsDownloadingZip(false);
    }, 1500);
  };

  // Keyboard shortcut: 'h' to toggle controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "h" || e.key === "H") {
        setShowControls((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    app: `import React from "react";
import { SylvaHero } from "@designcodeio/threeui";

export default function App() {
  return (
    <SylvaHero
      primaryColor="${primaryColor}"
      headingSize={${headingSize}}
      bodySize={${bodySize}}
      headingWeight="${headingWeight}"
      bodyWeight="${bodyWeight}"
      headingFont="${headingFont}"
      bodyFont="${bodyFont}"
    />
  );
}`,
    package: `{
  "name": "sylva-threeui-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@designcodeio/threeui": "^1.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
    vite: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});`,
    readme: `# Sylva Hero — ThreeUI Copy
Exact replica of threeui.com/hero/sylva using @designcodeio/threeui.`,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#383b34] select-none">
      
      {/* ── Main 3D Sylva Hero Component ───────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SylvaHero
          primaryColor={primaryColor}
          headingSize={headingSize}
          bodySize={bodySize}
          headingWeight={headingWeight}
          bodyWeight={bodyWeight}
          headingFont={headingFont}
          bodyFont={bodyFont}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Direct Farmer's Gateway Pill Button (Neo-Brutalist Call-to-Action) ────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={onScrollToDashboard}
          className="flex items-center space-x-3 bg-[#d4ff00] hover:bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full border-3 border-black shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
        >
          <span>OPEN FARMER'S DASHBOARD</span>
          <div className="w-6 h-6 rounded-full bg-black text-[#d4ff00] flex items-center justify-center">
            <ArrowDown size={14} className="stroke-[3]" />
          </div>
        </button>
      </div>

      {/* ── Floating Controls HUD ──────────────────────────────────────── */}
      {showControls && (
        <aside aria-label="Controls and Scaffold" className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-3 max-w-[92vw] pointer-events-auto">
          {/* Expanded Settings Panel */}
          {isControlsExpanded && (
            <div className="w-[340px] sm:w-[380px] bg-[#1a1c18]/95 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-5 shadow-2xl text-white/90 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-medium tracking-wide text-white">ThreeUI Customizer</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReset}
                    title="Reset to default prompt parameters"
                    className="p-1.5 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setIsControlsExpanded(false)}
                    className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="mt-4">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider block mb-2">
                  Presets
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESETS.map((p) => {
                    const isActive = primaryColor.toUpperCase() === p.primaryColor.toUpperCase() && headingFont === p.headingFont;
                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          setPrimaryColor(p.primaryColor);
                          setHeadingSize(p.headingSize);
                          setBodySize(p.bodySize);
                          setHeadingWeight(p.headingWeight);
                          setBodyWeight(p.bodyWeight);
                          setHeadingFont(p.headingFont);
                          setBodyFont(p.bodyFont);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 border cursor-pointer ${
                          isActive
                            ? "bg-white/15 border-white/30 text-white font-medium shadow-sm"
                            : "bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                          style={{ backgroundColor: p.primaryColor }}
                        />
                        <span className="truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Color */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Primary Color
                  </label>
                  <span className="font-mono text-xs text-white/80 uppercase">{primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-[-8px] w-12 h-12 cursor-pointer bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white flex-1 focus:outline-none focus:border-white/30"
                  />
                  <button
                    onClick={() => setPrimaryColor("#FFFFFF")}
                    className="text-[11px] px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 cursor-pointer"
                  >
                    White
                  </button>
                </div>
              </div>

              {/* Heading Size Slider */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Heading Size
                  </label>
                  <span className="font-mono text-xs text-emerald-400">{headingSize}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="92"
                  step="1"
                  value={headingSize}
                  onChange={(e) => setHeadingSize(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Body Size Slider */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Body Size
                  </label>
                  <span className="font-mono text-xs text-emerald-400">{bodySize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="0.5"
                  value={bodySize}
                  onChange={(e) => setBodySize(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Font Weights */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider block mb-1.5">
                    Heading Weight
                  </label>
                  <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 gap-0.5">
                    {["200", "300", "400", "500", "600"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setHeadingWeight(w)}
                        className={`flex-1 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                          headingWeight === w ? "bg-white/20 text-white font-bold" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider block mb-1.5">
                    Body Weight
                  </label>
                  <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 gap-0.5">
                    {["200", "300", "400", "500"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setBodyWeight(w)}
                        className={`flex-1 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                          bodyWeight === w ? "bg-white/20 text-white font-bold" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Dock Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#1a1c18]/90 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl text-white">
            {/* Customizer Toggle */}
            <button
              onClick={() => setIsControlsExpanded((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isControlsExpanded
                  ? "bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>

            {/* Ambient Nature Sound */}
            <button
              onClick={() => setIsSoundOn((prev) => !prev)}
              title={isSoundOn ? "Mute forest ambiance" : "Play forest ambiance"}
              className={`p-2 rounded-full transition-all text-xs flex items-center justify-center cursor-pointer ${
                isSoundOn ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 hover:bg-white/15 text-white/70"
              }`}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Scaffold Code Inspector */}
            <button
              onClick={() => setShowCodeModal(true)}
              title="View full project code"
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all text-xs flex items-center justify-center cursor-pointer"
            >
              <Code className="w-4 h-4" />
            </button>

            {/* Download ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-medium shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? "Downloading..." : "ZIP"}</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all text-xs cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </aside>
      )}

      {/* ── Floating Header Brand Pill ─────────────────────────────────── */}
      <div className="absolute top-5 left-6 z-20 pointer-events-none flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#181a15]/90 backdrop-blur-md border-2 border-black rounded-full shadow-[4px_4px_0px_#000000] pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-white">
            BIOENSO
          </span>
          <span className="text-[10px] text-white/50 border-l border-white/20 pl-2 uppercase font-bold">
            3D LIVING WORLD
          </span>
        </div>

        <button
          onClick={() => setShowControls((prev) => !prev)}
          title="Toggle UI overlay (Hot-key: H)"
          className="p-2.5 rounded-full bg-[#181a15]/90 backdrop-blur-md border-2 border-black text-white/80 hover:text-white transition-all pointer-events-auto shadow-[4px_4px_0px_#000000] cursor-pointer"
        >
          {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Project Code Modal ──────────────────────────────── */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#191b16] border-2 border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Project Scaffold</h3>
                  <p className="text-xs text-white/50">SylvaHero @designcodeio/threeui</p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10">
              {(["app", "package", "vite", "readme"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-all border-b-2 cursor-pointer ${
                    activeCodeTab === tab
                      ? "text-emerald-400 border-emerald-400 bg-white/5"
                      : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}.{tab === 'readme' ? 'md' : tab === 'package' ? 'json' : 'jsx'}
                </button>
              ))}
            </div>

            <div className="relative p-6 overflow-y-auto flex-1 font-mono text-xs text-emerald-300/90 bg-[#121410] leading-relaxed">
              <button
                onClick={() => copyToClipboard(codeSnippets[activeCodeTab])}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors backdrop-blur-md border border-white/10 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
              <pre className="overflow-x-auto whitespace-pre">
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
