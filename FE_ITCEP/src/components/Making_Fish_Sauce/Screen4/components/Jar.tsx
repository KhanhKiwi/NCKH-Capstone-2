import type { JarState, GameEvent } from '../types/gameTypes';

interface JarProps {
  jar: JarState;
  events: GameEvent[];
  isActive: boolean;
  onClick?: () => void;
}

export function Jar({ jar, events, isActive, onClick }: JarProps) {
  const healthColor = jar.health > 70 ? '#5f7c8a' : jar.health > 40 ? '#b87333' : '#8b4513';
  const jarEvents = events.filter(e => e.jarIndex === jar.index && e.active);

  const hasPressure = jarEvents.some(e => e.type === 'pressure');
  const hasWater = jarEvents.some(e => e.type === 'water');
  const hasFlies = jarEvents.some(e => e.type === 'flies');
  const hasTemperature = jarEvents.some(e => e.type === 'temperature');
  const isInfected = jar.infected && !jar.isTreating;

  // Determine container classes based on state
  let containerClasses = `
    relative rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer border-2
    ${isActive ? 'ring-2 ring-[#8b7355] scale-105 z-10' : 'opacity-90 scale-100'}
  `;

  if (isInfected) {
    containerClasses += ' bg-[#2e1065]/40 border-[#7e22ce]/60 shadow-[0_0_30px_rgba(147,51,234,0.3)]';
  } else if (hasTemperature) {
    containerClasses += ' bg-[#7f1d1d]/30 border-[#ef4444]/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]';
  } else if (hasWater) {
    containerClasses += ' bg-[#1e3a8a]/30 border-[#3b82f6]/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]';
  } else if (jar.health > 70) {
    containerClasses += ' bg-[#2a1f17]/90 border-[#8b7355]/30 shadow-xl';
  } else if (jar.health > 40) {
    containerClasses += ' bg-[#3d2b1f]/90 border-[#b87333]/40 shadow-xl';
  } else {
    containerClasses += ' bg-[#451a03]/80 border-[#b45309]/60 shadow-inner';
  }

  // Determine warning labels
  const labels = [];
  if (isInfected) labels.push({ text: 'NHIỄM KHUẨN', color: 'bg-purple-600 text-white' });
  if (hasTemperature) labels.push({ text: 'QUÁ NHIỆT', color: 'bg-red-600 text-white' });
  if (hasPressure) labels.push({ text: 'ÁP SUẤT CAO', color: 'bg-orange-600 text-white' });
  if (hasWater) labels.push({ text: 'RÒ RỈ NƯỚC', color: 'bg-blue-600 text-white' });
  if (hasFlies) labels.push({ text: 'CÔN TRÙNG', color: 'bg-amber-600 text-white' });

  return (
    <div onClick={onClick} className={containerClasses}>
      
      {/* Warning Labels */}
      {labels.length > 0 && (
        <div className="absolute -top-3 left-0 right-0 flex flex-col items-center gap-1 z-30 pointer-events-none">
          {labels.map((label, idx) => (
            <div key={idx} className={`${label.color} text-[10px] font-bold px-2.5 py-0.5 rounded shadow-[0_2px_10px_rgba(0,0,0,0.5)] uppercase tracking-wider animate-pulse`}>
              {label.text}
            </div>
          ))}
        </div>
      )}

      {/* Jar visualization area */}
      <div className="relative overflow-hidden rounded-t-xl pt-6">
        
        {/* Visual Effects Overlays */}
        {hasPressure && (
          <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none opacity-70 z-20">
            <div className="absolute left-1/4 bottom-8 w-2 h-12 bg-white/40 blur-sm rounded-full animate-[rise_1.5s_ease-in_infinite]" />
            <div className="absolute left-1/2 bottom-8 w-3 h-16 bg-white/40 blur-md rounded-full animate-[rise_1.2s_ease-in_infinite_0.3s]" />
            <div className="absolute right-1/4 bottom-8 w-2 h-10 bg-white/40 blur-sm rounded-full animate-[rise_1.8s_ease-in_infinite_0.7s]" />
          </div>
        )}

        {hasTemperature && (
          <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay animate-pulse pointer-events-none z-20" />
        )}

        {isInfected && (
          <div className="absolute inset-0 bg-purple-600/20 mix-blend-color pointer-events-none z-20">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #4c1d95 100%)' }} />
          </div>
        )}

        {hasWater && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="absolute top-0 left-[30%] w-[3px] h-full bg-blue-300/40 animate-[drop_1.2s_linear_infinite]" />
            <div className="absolute top-0 right-[35%] w-[4px] h-full bg-blue-300/30 animate-[drop_1.6s_linear_infinite_0.4s]" />
            <div className="absolute top-0 left-[60%] w-[2px] h-full bg-blue-300/50 animate-[drop_1.4s_linear_infinite_0.8s]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent" />
          </div>
        )}

        {/* SVG Jar */}
        <svg viewBox="0 0 120 160" className="w-full aspect-square mx-auto p-4 drop-shadow-2xl relative z-10">
          <defs>
            <linearGradient id={`jarGradient-${jar.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isInfected ? "#581c87" : "#8b7355"} stopOpacity="0.85" />
              <stop offset="100%" stopColor={isInfected ? "#3b0764" : "#5c3d2e"} stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id={`contentGradient-${jar.index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isInfected ? "#6b21a8" : "#a0522d"} stopOpacity="0.9" />
              <stop offset="100%" stopColor={isInfected ? "#000000" : "#5c3d2e"} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Jar body */}
          <path
            d="M 30 40 Q 25 60 30 90 L 30 130 Q 30 145 45 150 L 75 150 Q 90 145 90 130 L 90 90 Q 95 60 90 40 Z"
            fill={`url(#jarGradient-${jar.index})`}
            stroke={isInfected ? "#a855f7" : hasTemperature ? "#f87171" : "#1f1410"}
            strokeWidth="2"
          />

          {/* Content inside jar */}
          <clipPath id={`jarClip-${jar.index}`}>
            <path d="M 32 45 Q 28 65 32 90 L 32 130 Q 32 143 45 148 L 75 148 Q 88 143 88 130 L 88 90 Q 92 65 88 45 Z" />
          </clipPath>

          <g clipPath={`url(#jarClip-${jar.index})`}>
            <rect
              x="30"
              y={150 - (jar.quality / 100) * 100}
              width="60"
              height={(jar.quality / 100) * 100}
              fill={`url(#contentGradient-${jar.index})`}
            />
            {/* Ambient bubbles */}
            {(jar.quality > 30 || isInfected) && (
              <g className="opacity-50">
                <circle cx="45" cy={140 - (jar.quality / 100) * 40} r="1.5" fill="#fff" className="animate-[rise_2.5s_ease-in_infinite]" />
                <circle cx="65" cy={140 - (jar.quality / 100) * 60} r="2" fill={isInfected ? "#c084fc" : "#fff"} className="animate-[rise_3s_ease-in_infinite_1s]" />
                <circle cx="55" cy={140 - (jar.quality / 100) * 20} r="1" fill="#fff" className="animate-[rise_2s_ease-in_infinite_0.5s]" />
              </g>
            )}
          </g>

          {/* Lid (Shakes if pressure is high) */}
          <g className={hasPressure ? "animate-[shake_0.15s_linear_infinite]" : "transition-transform duration-300"}>
            <rect x="35" y="28" width="50" height="12" rx="2" fill={hasTemperature ? "#991b1b" : "#3d2b1f"} stroke="#1f1410" strokeWidth="1" />
            <ellipse cx="60" cy="28" rx="25" ry="6" fill={hasTemperature ? "#b91c1c" : "#5c3d2e"} />
            <ellipse cx="60" cy="26" rx="25" ry="6" fill={hasTemperature ? "#dc2626" : "#8b7355"} />
          </g>

          {/* Flies SVG animation effect */}
          {hasFlies && (
            <g className="opacity-80">
              <circle cx="40" cy="45" r="1.5" fill="#1f1410" className="animate-[fly1_1.5s_linear_infinite]" />
              <circle cx="80" cy="55" r="2" fill="#1f1410" className="animate-[fly2_2s_linear_infinite]" />
              <circle cx="55" cy="30" r="1.5" fill="#1f1410" className="animate-[fly3_1.8s_linear_infinite]" />
              <circle cx="70" cy="40" r="1" fill="#1f1410" className="animate-[fly1_2.2s_linear_infinite_0.5s]" />
            </g>
          )}
        </svg>

        {/* Treatment overlay - Modern Progress State */}
        {jar.isTreating && (
          <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-t-xl">
            <div className="relative w-16 h-16 mb-3">
              <svg className="w-full h-full -rotate-90 animate-[spin_4s_linear_infinite]">
                <circle className="text-gray-600" strokeWidth="4" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                <circle className="text-blue-500 animate-[dash_1.5s_ease-in-out_infinite]" strokeWidth="4" strokeDasharray="180" strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-300">CLEAN</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-blue-100 bg-blue-900/80 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] tracking-widest border border-blue-400/30">
              XỬ LÝ... {Math.ceil((jar.treatTimeLeft || 0) / 1000)}s
            </div>
          </div>
        )}
      </div>

      {/* Status bars at bottom */}
      <div className="px-4 py-3 space-y-3 bg-gradient-to-t from-[#1f1410] to-[#2a1f17]/80 rounded-b-xl border-t border-[#8b7355]/20">
        
        {/* Health Progress */}
        <div className="flex items-center justify-between gap-3 min-h-6">
          <span className="text-[10px] font-bold text-[#8b7355] uppercase tracking-widest">Sức khỏe</span>
          <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${jar.health}%`,
                backgroundColor: healthColor,
                boxShadow: `0 0 10px ${healthColor}`
              }}
            />
          </div>
          <span className="text-[10px] font-bold w-8 text-right" style={{ color: healthColor }}>
            {Math.round(jar.health)}%
          </span>
        </div>

        {/* Quality Progress */}
        <div className="flex items-center justify-between gap-3 min-h-6">
          <span className="text-[10px] font-bold text-[#8b7355] uppercase tracking-widest">Chất lượng</span>
          <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#b87333] to-[#f5f0e8] transition-all duration-500 ease-out"
              style={{ width: `${jar.quality}%`, boxShadow: '0 0 10px #d4a574' }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#f5f0e8] w-8 text-right">{Math.round(jar.quality)}%</span>
        </div>

      </div>

      {/* Decorative Jar Number */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-gradient-to-b from-[#3d2b1f] to-[#2a1f17] text-[#e8c39e] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#8b7355]/40 shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-widest">
          LU {jar.index + 1}
        </div>
      </div>

      {/* Inline Animations */}
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-1px) translateY(-1px) rotate(-1deg); }
          75% { transform: translateX(1px) translateY(1px) rotate(1deg); }
        }
        @keyframes drop {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(150px); opacity: 0; }
        }
        @keyframes fly1 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(25px, 5px); }
          75% { transform: translate(10px, 15px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fly2 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-15px, -15px); }
          66% { transform: translate(-5px, -20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fly3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; }
          100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124px; }
        }
      `}</style>
    </div>
  );
}
