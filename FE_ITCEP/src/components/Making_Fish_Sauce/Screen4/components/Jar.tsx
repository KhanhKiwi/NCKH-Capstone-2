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
  const hasCritical = jarEvents.some(e => e.severity === 'critical');

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer
        ${isActive ? 'ring-2 ring-[#5f7c8a] shadow-2xl scale-105' : 'opacity-75 scale-100'}
        ${hasCritical ? 'animate-pulse' : ''}
        border-2
        ${jar.health > 70 ? 'border-[#5f7c8a]/50 bg-card/60' :
          jar.health > 40 ? 'border-[#b87333]/50 bg-card/60' :
          'border-[#8b4513]/70 bg-[#8b4513]/20'}
      `}
    >
      {/* Jar visualization */}
      <svg viewBox="0 0 120 160" className="w-full aspect-square mx-auto p-4">
        <defs>
          <linearGradient id={`jarGradient-${jar.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b7355" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b7355" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`contentGradient-${jar.index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a0522d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5c3d2e" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Jar body */}
        <path
          d="M 30 40 Q 25 60 30 90 L 30 130 Q 30 145 45 150 L 75 150 Q 90 145 90 130 L 90 90 Q 95 60 90 40 Z"
          fill={`url(#jarGradient-${jar.index})`}
          stroke="#3d2b1f"
          strokeWidth="1.5"
        />

        {/* Content */}
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
        </g>

        {/* Lid */}
        <rect x="35" y="28" width="50" height="12" rx="2" fill="#5c3d2e" />
        <ellipse cx="60" cy="28" rx="25" ry="6" fill="#8b7355" />
        <ellipse cx="60" cy="26" rx="25" ry="6" fill="#a0522d" />

        {/* Pressure indicator wave */}
        {jar.pressure > 60 && (
          <>
            <circle cx="60" cy="80" r="35" fill="none" stroke="#b87333" strokeWidth="1" opacity="0.5" />
            <circle cx="60" cy="80" r="42" fill="none" stroke="#b87333" strokeWidth="0.5" opacity="0.3" />
          </>
        )}

        {/* Water droplets if water event */}
        {jarEvents.some(e => e.type === 'water') && (
          <>
            <circle cx="45" cy="35" r="2" fill="#5f7c8a" opacity="0.8" />
            <circle cx="70" cy="32" r="1.5" fill="#5f7c8a" opacity="0.6" />
            <circle cx="55" cy="30" r="1" fill="#5f7c8a" opacity="0.4" />
          </>
        )}
      </svg>

      {/* Status bar */}
      <div className="px-3 py-3 space-y-2.5 border-t border-border/50">
        {/* Health */}
        <div className="flex items-center justify-between gap-2 min-h-6">
          <span className="text-xs font-semibold text-[#f5f0e8] whitespace-nowrap">Sức khỏe</span>
          <div className="flex-1 h-2 bg-[#3d2b1f] rounded-full overflow-hidden min-w-[40px]">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${jar.health}%`,
                backgroundColor: healthColor
              }}
            />
          </div>
          <span className="text-xs font-semibold text-[#f5f0e8] whitespace-nowrap min-w-[32px] text-right" style={{ color: healthColor }}>
            {Math.round(jar.health)}%
          </span>
        </div>

        {/* Quality */}
        <div className="flex items-center justify-between gap-2 min-h-6">
          <span className="text-xs font-semibold text-[#f5f0e8] whitespace-nowrap">Chất lượng</span>
          <div className="flex-1 h-2 bg-[#3d2b1f] rounded-full overflow-hidden min-w-[40px]">
            <div
              className="h-full bg-gradient-to-r from-[#a0522d] to-[#5f7c8a] transition-all duration-300"
              style={{ width: `${jar.quality}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#f5f0e8] whitespace-nowrap min-w-[32px] text-right">{Math.round(jar.quality)}%</span>
        </div>
      </div>

      {/* Event indicators */}
      {jarEvents.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {jarEvents.map(event => (
            <div
              key={event.id}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
                ${event.severity === 'critical' ? 'bg-[#8b4513] animate-pulse' :
                  event.severity === 'high' ? 'bg-[#b87333]' :
                  event.severity === 'medium' ? 'bg-[#d4a574]' :
                  'bg-[#5f7c8a]'}
              `}
              title={`${event.type} - ${event.severity}`}
            >
              {event.type === 'pressure' && '💨'}
              {event.type === 'water' && '💧'}
              {event.type === 'flies' && '🪰'}
              {event.type === 'temperature' && '🌡'}
            </div>
          ))}
        </div>
      )}

      {/* Infected indicator */}
      {jar.infected && !jar.isTreating && (
        <div className="absolute top-2 left-2 text-xl animate-bounce">
          🦠
        </div>
      )}

      {/* Treatment overlay animation */}
      {jar.isTreating && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          {/* Pulsing overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5f7c8a]/40 to-transparent animate-pulse" />
          
          {/* Treatment progress circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              {/* Animated circles */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#5f7c8a] border-r-[#5f7c8a]"
                style={{
                  animation: 'spin 2s linear infinite'
                }}
              />
              <div 
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#b87333]"
                style={{
                  animation: 'spin 3s linear infinite reverse'
                }}
              />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                🔬
              </div>
            </div>
          </div>

          {/* Time remaining text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-sm font-bold text-[#f5f0e8] bg-[#2a1f17]/70 px-2 py-1 rounded mx-auto w-fit">
              {Math.ceil((jar.treatTimeLeft || 0) / 1000)}s
            </div>
          </div>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Jar number */}
      <div className="absolute -bottom-6 left-2 z-10 text-xs font-bold text-[#f5f0e8]">
        Chum {jar.index + 1}
      </div>
    </div>
  );
}
