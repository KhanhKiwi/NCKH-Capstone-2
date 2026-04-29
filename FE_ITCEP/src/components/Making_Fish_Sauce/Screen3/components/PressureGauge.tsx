import { useEffect, useState, useRef } from 'react';

interface PressureGaugeProps {
  onPressureResult: (success: boolean) => void;
  isActive: boolean;
}

export function PressureGauge({ onPressureResult, isActive }: PressureGaugeProps) {
  const [pressure, setPressure] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const pressureIntervalRef = useRef<number | null>(null);
  const hasResultRef = useRef(false);
  const targetZoneRef = useRef({ min: 70, max: 100 });

  // Increase pressure when spacebar is held
  useEffect(() => {
    if (!isActive || !isPressed || hasResultRef.current) return;

    pressureIntervalRef.current = window.setInterval(() => {
      setPressure(prev => Math.min(100, prev + 3)); // Increase by 3 per frame
    }, 50);

    return () => {
      if (pressureIntervalRef.current) clearInterval(pressureIntervalRef.current);
    };
  }, [isActive, isPressed]);

  // Handle spacebar down and up
  useEffect(() => {
    if (!isActive || hasResultRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPressed) {
          setIsPressed(true);
          setPressure(0);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPressed) {
          setIsPressed(false);

          // Check if pressure is in target zone (70-100%)
          const isInZone =
            pressure >= targetZoneRef.current.min && 
            pressure <= targetZoneRef.current.max;

          setResult(isInZone ? 'success' : 'failed');
          hasResultRef.current = true;
          onPressureResult(isInZone);

          // Reset for next press
          setTimeout(() => {
            setResult(null);
            hasResultRef.current = false;
            setPressure(0);
          }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, isPressed, pressure, onPressureResult]);

  if (!isActive) return null;

  return (
    <div className="w-full px-4 py-4 bg-[#3d2a1f]/80 rounded-lg border-2 border-[#6a5a48] backdrop-blur-sm">
      <div className="mb-3 text-center">
        <p className="text-sm text-[#d9cbb5] font-semibold">
          ⬇️ Giữ SPACEBAR để nén chặt (70-100% là tốt)
        </p>
      </div>

      {/* Pressure gauge container */}
      <div className="relative w-full h-16 bg-[#2d1a10] rounded-lg border-2 border-[#5a4830] overflow-hidden shadow-inner">
        {/* Target zone (green area) */}
        <div
          className="absolute h-full bg-gradient-to-r from-transparent via-[#7a9c69]/50 to-transparent"
          style={{
            left: `${targetZoneRef.current.min}%`,
            width: `${targetZoneRef.current.max - targetZoneRef.current.min}%`,
          }}
        />

        {/* Pressure bar (filling from left to right) */}
        <div
          className={`absolute h-full transition-colors flex items-center justify-center font-bold text-white ${
            result === 'success'
              ? 'bg-gradient-to-r from-[#5a9c69] to-[#7ab88f]'
              : result === 'failed'
              ? 'bg-gradient-to-r from-[#c07a4a] to-[#d08a5a]'
              : 'bg-gradient-to-r from-[#4a7c9c] to-[#6a9cbc]'
          }`}
          style={{ width: `${pressure}%` }}
        >
          {pressure > 10 && <span className="text-xs sm:text-sm">{Math.round(pressure)}%</span>}
        </div>

        {/* Zone labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <span className="text-xs text-[#6a5a48] font-bold opacity-60">0%</span>
          <span className="text-xs text-[#7a9c69] font-bold">MỤC TIÊU</span>
          <span className="text-xs text-[#6a5a48] font-bold opacity-60">100%</span>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-3 text-center">
        {isPressed ? (
          <p className="text-xs sm:text-sm text-[#d9cbb5] font-semibold">
            Đang nén... Giữ spacebar!
          </p>
        ) : result ? (
          <p className={`text-sm font-bold ${result === 'success' ? 'text-[#5a9c69]' : 'text-[#c07a4a]'}`}>
            {result === 'success' 
              ? `✓ Nén chặt hoàn hảo! ${Math.round(pressure)}% +8%` 
              : `✗ Nén chặt không đủ/quá tay! ${Math.round(pressure)}% -5%`}
          </p>
        ) : (
          <p className="text-xs text-[#8a7a68]">Bấm SPACEBAR để bắt đầu nén chặt</p>
        )}
      </div>
    </div>
  );
}
