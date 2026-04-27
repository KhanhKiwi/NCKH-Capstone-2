import { ArrowLeft, Clock } from 'lucide-react';

interface GameHeaderProps {
  onBack?: () => void;
  showTimer?: boolean;
  timeRemaining?: number;
}

export function GameHeader({ onBack, showTimer = false, timeRemaining = 180 }: GameHeaderProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="relative w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-gradient-to-b from-black/20 to-transparent">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/90 shadow-md active:scale-95 transition-transform hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" style={{ color: '#4a3f35' }} />
        </button>

        {/* Title */}
        <div className="flex-1 text-center mx-3 md:mx-6">
          <div style={{
            fontSize: 'clamp(14px, 3.5vw, 20px)',
            fontWeight: 700,
            color: '#2d2416',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            letterSpacing: '0.3px'
          }}>
            Công đoạn 2: Rửa & Làm sạch cá
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2.5vw, 14px)',
            color: '#5a4d3d',
            marginTop: '2px',
            fontWeight: 500
          }}>
          </div>
        </div>

        {/* Timer */}
        {showTimer && (
          <div className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-full bg-white/90 shadow-md">
            <Clock className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#8b6f47' }} />
            <span style={{
              fontSize: 'clamp(13px, 3vw, 16px)',
              fontWeight: 600,
              color: '#4a3f35',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
