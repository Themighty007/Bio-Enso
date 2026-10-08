import { Cpu, Eye, Activity, Wind } from 'lucide-react';

export default function FourStepsSection() {
  const steps = [
    {
      num: 1,
      title: "Microclimate Sensing",
      icon: Cpu,
      desc: "ESP32 edge nodes with DHT22 precision sensors and water level probes sample temperature, humidity, and trough capacity directly inside cattle sheds."
    },
    {
      num: 2,
      title: "AI Vision Tracking",
      icon: Eye,
      desc: "YOLOv8 edge models track cow centroids in real time, detecting subtle behavioral biomarkers like shade crowding and reduced rumination."
    },
    {
      num: 3,
      title: "BTI Computation",
      icon: Activity,
      desc: "Grounded in St-Pierre and Gaughan research, the Biological-Thermal Index correlates climate telemetry with animal physiology to predict collapse."
    },
    {
      num: 4,
      title: "Autonomous Action",
      icon: Wind,
      desc: "The ESP32 microcontroller triggers 5V battery-backed misting fans, activates water pumps, or sounds flood evacuation alarms to Zone B."
    }
  ];

  return (
    <section id="steps" className="py-24 bg-white text-black relative overflow-hidden transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header (Aarunya Style) */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-black text-lime-brand text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            <span>AUTONOMOUS WORKFLOW</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 leading-tight">
            From Climate Shock to Herd Shelter — 4 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-4 font-medium">
            Bridging physical sensing, edge artificial intelligence, and physical cooling actuators with zero human delay.
          </p>
        </div>

        {/* 4 Connected Steps Grid with Connecting Line */}
        <div className="relative">
          
          {/* Horizontal Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-neutral-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  
                  {/* Numbered Node Circle */}
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-lime-brand shadow-[0_4px_16px_rgba(212,255,0,0.4)] flex items-center justify-center text-black font-black text-xl mb-6 group-hover:scale-110 group-hover:bg-lime-brand transition-all duration-300">
                    <span>{step.num}</span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon size={18} className="text-neutral-800" />
                    <h3 className="font-black text-xl text-neutral-900 tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                    {step.desc}
                  </p>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Banner Accent */}
        <div className="mt-20 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest gap-4">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lime-brand" />
            <span>Tested across 40+ simulated dairy units in Tamil Nadu</span>
          </span>
          <span>Zero cloud dependency • Local fail-safe</span>
        </div>

      </div>
    </section>
  );
}
