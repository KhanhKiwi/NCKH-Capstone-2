import { ArrowLeft, Clock } from 'lucide-react';

interface GameHeaderProps {
  onBack: () => void;
  quality: number;
  timeRemaining: number;
}

export function GameHeader({ onBack, quality, timeRemaining }: GameHeaderProps) {
  return (
    <div className="relative z-10 px-4 sm:px-6 md:px-4 py-3 md:py-2 bg-gradient-to-b from-[#4a3a2a]/90 to-[#5d4a38]/85 backdrop-blur-md border-b-2 border-[#3d2817] shadow-lg flex-shrink-0">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-[#4a3220]/90 border border-[#6d4e2c] flex items-center justify-center hover:bg-[#5a4230] transition-all shadow-md hover:shadow-lg flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[#e8dcc8]" strokeWidth={2.5} />
        </button>

        <div className="flex-1 mx-2 md:mx-3 text-center min-w-0">
          <h1
            className="text-base md:text-lg font-semibold drop-shadow-lg text-[#f5ebe0] tracking-wide truncate"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Công đoạn 3: Pha muối & Ướp cá
          </h1>
          <span className="text-xs md:text-sm text-[#d9cbb5] bg-[#3d2a1f]/70 px-2 md:px-3 py-0.5 md:py-1 rounded border border-[#6a5a48] inline-block mt-1">
         
          </span>
        </div>

        <div className="w-10 md:w-12 flex-shrink-0" />
      </div>

      {/* Timer & Quality Container */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Timer */}
        <div className="bg-gradient-to-b from-[#6a5240]/70 to-[#5a4230]/70 backdrop-blur-sm rounded-lg p-2 md:p-2 border-2 border-[#4a3820] shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs md:text-xs text-[#d9cbb5] tracking-wide flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              Thời gian
            </span>
            <span className={`text-sm md:text-sm font-bold tabular-nums flex-shrink-0 ${
              timeRemaining <= 30 ? 'text-[#ff6b6b] animate-pulse' : 'text-[#f5ebe0]'
            }`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="h-3 md:h-3 bg-[#3d2a1f] rounded-sm overflow-hidden border-2 border-[#5a4830] shadow-inner">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(timeRemaining / 150) * 100}%`,
                background: `linear-gradient(to right, ${
                  timeRemaining > 30 ? '#4a7c59' : '#ff6b6b'
                }, ${timeRemaining > 30 ? '#5a9c69' : '#ff8787'})`
              }}
            />
          </div>
        </div>

        {/* Quality Progress Bar */}
        <div className="bg-gradient-to-b from-[#6a5240]/70 to-[#5a4230]/70 backdrop-blur-sm rounded-lg p-2 md:p-2 border-2 border-[#4a3820] shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs md:text-xs text-[#d9cbb5] tracking-wide truncate">
              Chất lượng
            </span>
            <span className="text-sm md:text-sm font-bold text-[#f5ebe0] tabular-nums flex-shrink-0">
              {Math.round(quality)}%
            </span>
          </div>
          <div className="h-3 md:h-3 bg-[#3d2a1f] rounded-sm overflow-hidden border-2 border-[#5a4830] shadow-inner relative">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, #6a5a48 3px, #6a5a48 4px)`
            }}
          />
          <div
            className="h-full transition-all duration-500 relative z-10"
            style={{
              width: `${Math.min(100, Math.max(0, quality))}%`,
              background: `linear-gradient(to right, ${
                quality >= 70
                  ? '#4a7c59'
                  : quality >= 40
                  ? '#b8936d'
                  : '#a0452e'
              }, ${
                quality >= 70
                  ? '#4a7c59'
                  : quality >= 40
                  ? '#b8936d'
                  : '#a0452e'
              }dd)`,
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)'
            }}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
