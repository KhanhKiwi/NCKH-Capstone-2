import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface FiltrationPhaseProps {
  onComplete: (qualityBonus: number, clarity: number) => void;
  timeLimit: number;
}

export function FiltrationPhase({ onComplete, timeLimit }: FiltrationPhaseProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [qualityBonus, setQualityBonus] = useState(0);
  const [clarity, setClarity] = useState(45);
  const [dragProgress, setDragProgress] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [accuracy, setAccuracy] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [perfectHits, setPerfectHits] = useState(0);
  const phaseCompleteRef = useRef(false);

  // Timer
  useEffect(() => {
    if (phaseCompleteRef.current || currentLayer === 0) return;
    
    if (timeRemaining <= 0) {
      phaseCompleteRef.current = true;
      onComplete(qualityBonus, clarity);
      return;
    }

    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, currentLayer]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (currentLayer === 1) {
          handleLayer1Click();
        } else if (currentLayer === 2) {
          handleLayer2Click();
        } else if (currentLayer === 3) {
          handleWaveClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLayer, clickCount, wavePhase]);

  // Layer 1: Click-based sweep instead of drag
  const handleLayer1Click = () => {
    if (currentLayer !== 1) return;
    const newProgress = dragProgress + 20;
    setDragProgress(newProgress);

    if (newProgress >= 95) {
      setCurrentLayer(2);
      setQualityBonus(prev => prev + 20);
      setClarity(prev => Math.min(prev + 25, 95));
      setDragProgress(0);
      toast.success('✓ Lọc lớp 1 hoàn tất! +20%', { duration: 2000 });
    }
  };

  // Layer 2: Click rhythm
  const handleLayer2Click = () => {
    if (currentLayer !== 2) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 8) {
      const bonus = 15; // Fixed 15% bonus for completing all 8 clicks
      setCurrentLayer(3);
      setQualityBonus(prev => prev + bonus);
      setClarity(prev => Math.min(prev + 18, 95));
      setClickCount(0);
      toast.success('✓ Lọc lớp 2 hoàn tất! +15%', { duration: 2000 });
    }
  };

  // Layer 3: Rhythm wave
  useEffect(() => {
    if (currentLayer !== 3) return;

    const waveInterval = setInterval(() => {
      setWavePhase(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(waveInterval);
  }, [currentLayer]);

  const handleWaveClick = () => {
    if (currentLayer !== 3) return;

    let bonus = 0;
    let newPerfectHits = perfectHits;
    let newAccuracy: 'perfect' | 'good' | 'miss' = 'miss';

    // Perfect zone: 60-80%
    if (wavePhase >= 60 && wavePhase <= 80) {
      newAccuracy = 'perfect';
      bonus = 12; // Perfect = +12%
      newPerfectHits = perfectHits + 1;
      setQualityBonus(prev => prev + bonus);
      setPerfectHits(newPerfectHits);

      // Check for Master's Touch (3 consecutive perfect hits)
      if (newPerfectHits >= 3) {
        setTimeout(() => {
          setCurrentLayer(0);
          setQualityBonus(prev => prev + 25); // Master's Touch bonus (higher)
          setClarity(prev => Math.min(prev + 30, 100));
          toast.success('🌟 MASTER\'S TOUCH! +25% thêm!', { duration: 3000 });
        }, 800);
      }
    } else if (wavePhase >= 50 && wavePhase <= 90) {
      newAccuracy = 'good';
      bonus = 6; // Good = +6%
      setQualityBonus(prev => prev + bonus);
      setPerfectHits(0); // Reset combo
    } else {
      newAccuracy = 'miss';
      bonus = -15; // Miss = -15% (harsher)
      setQualityBonus(prev => Math.max(-40, prev - 15));
      setPerfectHits(0); // Reset combo
    }

    setAccuracy(newAccuracy);
    setTimeout(() => setAccuracy(null), 600);
  };

  const renderWave = (phase: number) => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const x = (i / 100) * 400;
      const y = Math.sin((i + phase) * 0.1) * 30 + 60;
      points.push([x, y]);
    }
    return `M ${points.map(p => p.join(',')).join(' L ')}`;
  };

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-600/30 backdrop-blur-sm p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">💧 Bước 2: Lọc 3 Lớp ({currentLayer}/3)</h2>
        <p className="text-amber-200/60 text-sm">Thời gian còn lại: {timeRemaining}s</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map(layer => (
          <motion.div
            key={layer}
            className={`flex-1 h-3 rounded-full transition-all ${
              layer < currentLayer
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : layer === currentLayer
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                : 'bg-slate-700/40'
            }`}
            animate={layer === currentLayer ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Layer 1: Click to sweep */}
      {currentLayer === 1 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Lớp 1: Lọc Tổng Hợp - Bấm nút để lọc</p>
          
          {/* Progress bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="h-6 bg-slate-700/40 rounded-lg border-2 border-amber-400/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                initial={{ width: '0%' }}
                animate={{ width: `${dragProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-amber-200 text-sm mt-3 font-semibold">Tiến độ: {Math.floor(dragProgress)}%</p>
          </div>

          {/* Click button */}
          <motion.button
            onClick={handleLayer1Click}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold text-lg hover:from-blue-500 hover:to-cyan-500 transition-all mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💧 Bấm hoặc SPACE để Lọc
          </motion.button>

          <p className="text-amber-200/60 text-sm">💡 Cần 5 lần click để hoàn tất</p>
        </motion.div>
      )}

      {/* Layer 2: Click timing */}
      {currentLayer === 2 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Lớp 2: Lọc Chi Tiết - Click nhanh chóng!</p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[1, 2, 3, 4].map(i => (
              <motion.button
                key={i}
                onClick={handleLayer2Click}
                className={`p-6 rounded-lg border-2 transition-all font-bold text-lg ${
                  clickCount >= i
                    ? 'border-green-400 bg-green-500/20 text-green-300'
                    : 'border-amber-400/50 bg-amber-600/20 text-amber-200 hover:bg-amber-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                {clickCount >= i ? '✓' : i}
              </motion.button>
            ))}
          </div>
          <p className="text-amber-200/60 mt-6 text-sm">Cần click 8 lần để hoàn tất</p>
          <p className="text-amber-300 font-semibold mt-2">{clickCount}/8</p>
        </motion.div>
      )}

      {/* Layer 3: Rhythm wave */}
      {currentLayer === 3 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Lớp 3: Lọc Tinh Khiết - Nhấn Space ở đỉnh sóng!</p>
          
          {/* Wave visualization */}
          <div className="relative h-40 bg-gradient-to-b from-slate-700/30 to-slate-800/30 rounded-lg border border-cyan-400/30 overflow-hidden mb-6">
            <svg className="w-full h-full" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#0369a1', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              
              {/* Wave path */}
              <path
                d={renderWave(wavePhase)}
                stroke="#06b6d4"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />

              {/* Perfect zone indicator */}
              <rect x="240" y="30" width="160" height="60" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <text x="320" y="65" textAnchor="middle" fontSize="10" fill="rgba(34, 197, 94, 0.6)">PERFECT ZONE</text>
            </svg>

            {/* Phase indicator */}
            <div className="absolute bottom-2 left-2 text-xs text-cyan-300">
              Phase: {wavePhase}%
            </div>
          </div>

          <motion.button
            onClick={handleWaveClick}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nhấn SPACE khi sóng ở đỉnh
          </motion.button>

          <p className="text-amber-200/60 text-xs mt-2">💡 Bấm hoặc nhấn SPACE để lọc ở đỉnh sóng (Green Zone)</p>

          <AnimatePresence>
            {accuracy && (
              <motion.div
                className={`mt-6 py-3 px-6 rounded-lg font-bold text-lg ${
                  accuracy === 'perfect'
                    ? 'bg-green-500/20 border border-green-400 text-green-300'
                    : accuracy === 'good'
                    ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                    : 'bg-red-500/20 border border-red-400 text-red-300'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                {accuracy === 'perfect' && '✨ PERFECT! +8%'}
                {accuracy === 'good' && '✓ Good! +4%'}
                {accuracy === 'miss' && '✗ Miss! -10%'}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-sm text-cyan-200">
            Perfect Hits: {perfectHits}/3 {perfectHits >= 3 && '⭐ MASTER\'S TOUCH! +20%'}
          </div>
        </motion.div>
      )}

      {/* Complete */}
      {currentLayer === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
          >
            ✨
          </motion.div>
          <p className="text-amber-100 text-2xl font-bold">Lọc 3 lớp hoàn tất!</p>
          <p className="text-amber-200/60 mt-2">Độ trong: <span className="text-amber-300 font-bold">{Math.round(clarity)}%</span></p>
          <p className="text-amber-200/60">Bonus chất lượng: <span className="text-amber-300 font-bold">+{qualityBonus}%</span></p>
          <motion.button
            onClick={() => {
              phaseCompleteRef.current = true;
              onComplete(qualityBonus, clarity);
            }}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tiếp tục → Pha Trộn
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
