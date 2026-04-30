import { useEffect, useState, useRef } from 'react';

interface MixingTimingGameProps {
  onTimingResult: (success: boolean) => void;
  isActive: boolean;
}

export function MixingTimingGame({ onTimingResult, isActive }: MixingTimingGameProps) {
  const [barPosition, setBarPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(1.2); // pixels per frame - slower for easier gameplay
  const targetZoneRef = useRef({ start: 35, end: 65 }); // 35-65% is target zone
  const hasResultRef = useRef(false);

  // Animation loop - move bar back and forth
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      setBarPosition(prev => {
        let newPos = prev + direction * speedRef.current;

        // Bounce at edges
        if (newPos >= 100) {
          setDirection(-1);
          return 100;
        } else if (newPos <= 0) {
          setDirection(1);
          return 0;
        }

        return newPos;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, direction]);

  // Handle spacebar press
  useEffect(() => {
    if (!isActive || hasResultRef.current) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        
        // Check if bar is in target zone
        const isInZone = 
          barPosition >= targetZoneRef.current.start && 
          barPosition <= targetZoneRef.current.end;

        setResult(isInZone ? 'success' : 'failed');
        hasResultRef.current = true;
        onTimingResult(isInZone);

        // Reset after 1s for next timing
        setTimeout(() => {
          setResult(null);
          hasResultRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, barPosition, onTimingResult]);

  if (!isActive) return null;

  return (
    <div className="w-full px-4 py-4 bg-[#3d2a1f]/80 rounded-lg border-2 border-[#6a5a48] backdrop-blur-sm">
      <div className="mb-2 text-center">
        <p className="text-sm text-[#d9cbb5] font-semibold">⏱️ Ấn SPACEBAR khi thanh vào vùng vàng!</p>
      </div>

      {/* Timing bar container */}
      <div className="relative w-full h-12 bg-[#2d1a10] rounded-lg border-2 border-[#5a4830] overflow-hidden shadow-inner">
        {/* Target zone (green area) */}
        <div
          className="absolute h-full bg-gradient-to-r from-transparent via-[#7a9c69]/40 to-transparent"
          style={{
            left: `${targetZoneRef.current.start}%`,
            width: `${targetZoneRef.current.end - targetZoneRef.current.start}%`,
          }}
        />

        {/* Moving bar (indicator) */}
        <div
          className={`absolute h-full w-2 transition-colors ${
            result === 'success'
              ? 'bg-[#5a9c69]'
              : result === 'failed'
              ? 'bg-[#c07a4a]'
              : 'bg-gradient-to-r from-[#8a9aac] to-[#6a7a9c]'
          }`}
          style={{ left: `${barPosition}%` }}
        />

        {/* Target zone labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <span className="text-xs text-[#6a5a48] font-bold">0%</span>
          <span className="text-xs text-[#7a9c69] font-bold">TARGET</span>
          <span className="text-xs text-[#6a5a48] font-bold">100%</span>
        </div>
      </div>

      {/* Feedback */}
      {result && (
        <div className={`mt-2 text-center font-bold ${result === 'success' ? 'text-[#5a9c69]' : 'text-[#c07a4a]'}`}>
          {result === 'success' ? '✓ Trúng! +5%' : '✗ Sai! -6%'}
        </div>
      )}
    </div>
  );
}
