export default function ComparisonSection() {
  return (
    <section id="compare" className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-brand/5 blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Headline (Eduvia style) */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-lime-brand mb-4">
            <span>PARADIGM SHIFT</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-none">
            LIVESTOCK ARE PROTECTED <br className="hidden sm:inline" />
            <span className="text-lime-brand underline decoration-lime-brand decoration-wavy decoration-2">BEFORE</span>, NOT AFTER THE COLLAPSE.
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-4 font-medium max-w-2xl mx-auto">
            Why traditional manual livestock management fails under severe El Niño weather shocks, and how autonomous edge telemetry prevents catastrophic mortality.
          </p>
        </div>

        {/* Comparison Cards (Eduvia Brutalist Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: THE OLD WAY (Black Card with Red Accents) */}
          <div className="bg-[#141414] border-2 border-white/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative transition-all duration-300 hover:border-white/40">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-1">
                THE OLD WAY
              </div>
              <div className="text-xs sm:text-sm font-bold text-white/50 tracking-wider uppercase mb-8">
                The Failure Pattern
              </div>

              <ul className="space-y-4 text-sm sm:text-base font-semibold">
                <li className="flex items-start space-x-3 text-white/80">
                  <span className="text-white/40 font-mono">→</span>
                  <span>Wait for visible cattle panting and respiratory distress</span>
                </li>
                <li className="flex items-start space-x-3 text-white/80">
                  <span className="text-white/40 font-mono">→</span>
                  <span>Notice a sudden 30% drop in daily milk production</span>
                </li>
                <li className="flex items-start space-x-3 text-white/80">
                  <span className="text-white/40 font-mono">→</span>
                  <span>Water troughs dry out unnoticed during midday heat domes</span>
                </li>
                <li className="flex items-start space-x-3 text-white/80">
                  <span className="text-white/40 font-mono">→</span>
                  <span>Manual fan switches flipped hours after peak heat stress</span>
                </li>
                <li className="flex items-start space-x-3 text-rose-400 font-bold">
                  <span className="text-rose-400 font-mono">→</span>
                  <span>Emergency veterinary visits after clinical collapse</span>
                </li>
                <li className="flex items-start space-x-3 text-rose-400 font-black">
                  <span className="text-rose-400 font-mono">→</span>
                  <span>Catastrophic livestock mortality & severe financial loss</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/40 font-black tracking-widest uppercase">
              STATUS: HIGH CASUALTY RISK
            </div>
          </div>

          {/* Card 2: THE BIOENSO WAY (Electric Lime with Solid Brutalist Shadow) */}
          <div className="bg-lime-brand text-black border-2 border-black rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-[10px_10px_0px_#000000] relative transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px]">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase mb-1">
                THE BIOENSO WAY
              </div>
              <div className="text-xs sm:text-sm font-black text-black/60 tracking-wider uppercase mb-8">
                The Autonomous Capability Loop
              </div>

              <ul className="space-y-4 text-sm sm:text-base font-black text-neutral-900">
                <li className="flex items-start space-x-3">
                  <span className="text-black font-mono">→</span>
                  <span>DHT22 detects microclimate spike before ambient station</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-black font-mono">→</span>
                  <span>YOLOv8 AI catches subtle shade clustering and lethargy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-black font-mono">→</span>
                  <span>BTI algorithm triggers ACT NOW before clinical symptoms</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-black font-mono">→</span>
                  <span>ESP32 spins 5V cooling fans and misting pumps autonomously</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-black font-mono">→</span>
                  <span>One-tap farmer mobile guidance & flood evacuation alerts</span>
                </li>
                <li className="flex items-start space-x-3 text-black underline decoration-black decoration-2">
                  <span className="text-black font-mono">→</span>
                  <span>Zero herd casualties, stable hydration, and 100% milk yield</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-black/20 text-xs text-black/80 font-black tracking-widest uppercase flex items-center justify-between">
              <span>STATUS: PROTECTED & RESILIENT</span>
              <span className="bg-black text-lime-brand px-2.5 py-0.5 rounded-full text-[10px]">
                LIVE SYSTEM
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
