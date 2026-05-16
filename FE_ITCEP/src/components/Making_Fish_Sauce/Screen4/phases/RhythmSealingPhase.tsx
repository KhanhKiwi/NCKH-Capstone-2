import { useState, useEffect, useRef } from 'react';
import type { Feedback } from '../types/gameTypes';

interface RhythmSealingPhaseProps {
  onComplete: (baseQuality: number) => void;
}

export function RhythmSealingPhase({ onComplete }: RhythmSealingPhaseProps) {
  const [position, setPosition] = useState(0);
  const [completedSeals, setCompletedSeals] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ show: false, type: 'info', message: '' });
  const [baseQuality, setBaseQuality] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameFailed, setGameFailed] = useState(false);
  const gameStartedRef = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const directionRef = useRef(1); // Use ref for direction to avoid dependency issues
  const positionRef = useRef(0);

  const TARGET_SEALS = 5;
  const ZONE_SIZE = 20;
  const ZONE_CENTER = 50;

  // Animation loop - smooth continuous movement
  useEffect(() => {
    if (completedSeals >= TARGET_SEALS) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        let newPos = prev + directionRef.current * 2;
        
        // Bounce at edges
        if (newPos >= 100) {
          directionRef.current = -1;
          newPos = 100;
        } else if (newPos <= 0) {
          directionRef.current = 1;
          newPos = 0;
        }
        
        positionRef.current = newPos;
        return newPos;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [completedSeals]);

  // Auto-complete after 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-complete when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && gameStartedRef.current) {
      gameStartedRef.current = false;
      
      if (completedSeals >= TARGET_SEALS) {
        // Success - move to Phase 2
        setTimeout(() => onComplete(baseQuality), 500);
      } else {
        // Failed - not enough seals
        setGameFailed(true);
      }
    }
  }, [timeRemaining, completedSeals, baseQuality, onComplete]);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.code !== 'Space') return;
      if (completedSeals >= TARGET_SEALS || !gameStartedRef.current) return;
      
      e.preventDefault();

      const distance = Math.abs(positionRef.current - ZONE_CENTER);
      const isInZone = distance < ZONE_SIZE;

      let newQuality = baseQuality;
      let feedbackType: 'perfect' | 'good' | 'failed' = 'failed';
      let feedbackMsg = '❌ Miss! Timing sai rồi';

      if (isInZone) {
        if (distance < ZONE_SIZE / 3) {
          // Perfect
          feedbackType = 'perfect';
          feedbackMsg = '⭐ PERFECT SEAL!';
          newQuality = Math.min(100, baseQuality + 20);
          playSound(800, 0.2);
        } else {
          // Good
          feedbackType = 'good';
          feedbackMsg = '✓ Good seal';
          newQuality = Math.min(100, baseQuality + 10);
          playSound(600, 0.15);
        }

        const newCompleted = completedSeals + 1;
        setCompletedSeals(newCompleted);
        setBaseQuality(newQuality);

        if (newCompleted >= TARGET_SEALS) {
          gameStartedRef.current = false;
          setTimeout(() => onComplete(newQuality), 800);
        }
      } else {
        playSound(200, 0.1);
        newQuality = Math.max(0, baseQuality - 5);
        setBaseQuality(newQuality);
      }

      setFeedback({ show: true, type: feedbackType, message: feedbackMsg });
      setTimeout(() => setFeedback({ show: false, type: 'info', message: '' }), 1500);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [baseQuality, completedSeals]);

  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Silent fail on audio context issues
    }
  };

  const progress = (completedSeals / TARGET_SEALS) * 100;

  // Show fail screen if game failed
  if (gameFailed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#2a1f17]/80 via-[#2a1f17]/70 to-[#2a1f17]/80 backdrop-blur-sm z-50">
        <div className="relative w-full max-w-2xl px-6">
          <div className="bg-card/70 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-12 text-center">
            {/* Icon */}
            <div className="text-7xl mb-6 animate-bounce">❌</div>

            {/* Title */}
            <h2 className="text-4xl font-bold text-[#8b4513] mb-4">
              Niêm Phong Thất Bại
            </h2>

            {/* Reason */}
            <div className="bg-[#8b4513]/20 rounded-lg p-6 mb-6 border border-[#8b4513]/30">
              <p className="text-lg text-[#f5f0e8] font-semibold mb-3">Lý do thua cuộc:</p>
              <ul className="text-sm text-[#f5f0e8] space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-[#b87333] font-bold">•</span>
                  <span>Chỉ hoàn thành <strong>{completedSeals}/5</strong> niêm phong thành công</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b87333] font-bold">•</span>
                  <span>Cần ít nhất <strong>5 niêm phong</strong> để qua màn này</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b87333] font-bold">•</span>
                  <span>Chất lượng hiện tại: <strong>{Math.round(baseQuality)}%</strong> (tối thiểu 30%)</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-[#5f7c8a]/20 rounded-lg p-4 mb-6 border border-[#5f7c8a]/30">
              <p className="text-sm text-[#f5f0e8] font-semibold mb-2">💡 Mẹo:</p>
              <p className="text-xs text-[#f5f0e8] opacity-80">
                Bấm PHẢI hoặc SPACE khi thanh vào vùng xanh để đạt Perfect hoặc Good. Tránh Miss!
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="bg-[#5f7c8a] hover:bg-[#4a6572] text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                ← Quay Lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#a0522d] hover:bg-[#b87333] text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                🔄 Chơi Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#2a1f17]/80 via-[#2a1f17]/70 to-[#2a1f17]/80 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-2xl px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#f5f0e8] mb-2">Niêm Phong Hoàn Hảo</h2>
          <p className="text-sm font-semibold text-[#f5f0e8] drop-shadow-lg">Bấm PHẢI hoặc SPACE khi thanh vào vùng xanh</p>
          
          {/* Timer */}
          <div className="mt-6 flex justify-center">
            <div className={`
              px-6 py-3 rounded-lg font-bold text-xl transition-all duration-300
              ${timeRemaining > 10 
                ? 'bg-[#5f7c8a]/20 text-[#5f7c8a] border border-[#5f7c8a]' 
                : timeRemaining > 5
                ? 'bg-[#b87333]/20 text-[#b87333] border border-[#b87333]'
                : 'bg-[#8b4513]/20 text-[#8b4513] border border-[#8b4513] animate-pulse'}
            `}>
              ⏱️ {timeRemaining}s
            </div>
          </div>
        </div>

        {/* Main rhythm bar */}
        <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8 mb-8">
          {/* Visual Rhythm Bar */}
          <div className="mb-8 space-y-4">
            <div className="relative h-16 bg-[#3d2b1f] rounded-lg overflow-hidden border-2 border-[#8b7355]">
              {/* Perfect Zone (Green) */}
              <div
                className="absolute h-full bg-gradient-to-r from-transparent via-[#5f7c8a]/80 to-transparent pointer-events-none"
                style={{
                  left: `${ZONE_CENTER - ZONE_SIZE}%`,
                  width: `${ZONE_SIZE * 2}%`
                }}
              />

              {/* Moving Indicator */}
              <div
                className="absolute top-0 h-full w-1.5 bg-gradient-to-r from-[#f5f0e8] via-[#f5f0e8] to-transparent shadow-lg transition-colors"
                style={{
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 20px rgba(245, 240, 232, 0.8)'
                }}
              >
                <div className="absolute top-2 left-0 w-0.5 h-2 bg-[#f5f0e8]" />
              </div>

              {/* Center marker */}
              <div className="absolute top-0 left-1/2 h-full w-0.5 bg-[#b87333]/50 pointer-events-none" />
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center px-4 text-xs font-semibold text-[#f5f0e8]">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5f7c8a]" />
                Perfect Zone
              </span>
              <span className="flex items-center gap-2">
                <div className="w-0.5 h-3 bg-[#b87333]" />
                Center
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#f5f0e8]">Niêm phong tiến độ</span>
              <span className="font-semibold text-[#5f7c8a]">{completedSeals}/{TARGET_SEALS}</span>
            </div>
            <div className="h-3 bg-[#3d2b1f] rounded-full overflow-hidden border border-[#8b7355]">
              <div
                className="h-full bg-gradient-to-r from-[#a0522d] to-[#5f7c8a] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quality Score */}
          <div className="text-center bg-[#5f7c8a]/20 rounded-lg p-4 border border-[#5f7c8a]/30">
            <p className="text-xs font-semibold text-[#f5f0e8] mb-1">Chất lượng Seal cơ bản</p>
            <p className="text-2xl font-bold text-[#5f7c8a]">{Math.round(baseQuality)}%</p>
          </div>
        </div>

        {/* Feedback Display */}
        {feedback.show && (
          <div className={`
            text-center mb-4 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300
            ${feedback.type === 'perfect' ? 'bg-[#5f7c8a]/20 border border-[#5f7c8a] text-[#5f7c8a]' :
              feedback.type === 'good' ? 'bg-[#b87333]/20 border border-[#b87333] text-[#b87333]' :
              'bg-[#8b4513]/20 border border-[#8b4513] text-[#8b4513]'}
          `}>
            {feedback.message}
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-xs font-semibold text-[#f5f0e8] drop-shadow-lg">
          <p>Nhấn phím PHẢI (→) hoặc SPACE khi thanh vào vùng xanh</p>
          <p className="mt-1">Hoàn thành 5 niêm phong để qua màn. Hết 30 giây chưa xong = thua!</p>
        </div>
      </div>
    </div>
  );
}
