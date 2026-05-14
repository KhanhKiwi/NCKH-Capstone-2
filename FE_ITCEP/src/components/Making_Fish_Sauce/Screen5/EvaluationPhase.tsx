import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface EvaluationPhaseProps {
  onComplete: (qualityBonus: number) => void;
  timeLimit: number;
}

export function EvaluationPhase({ onComplete, timeLimit }: EvaluationPhaseProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [step, setStep] = useState<'shake' | 'aroma' | 'color' | 'complete'>('shake');
  const [shakeCount, setShakeCount] = useState(0);
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [qualityBonus, setQualityBonus] = useState(0);
  const phaseCompleteRef = useRef(false);

  // Keyboard listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && step === 'shake') {
        e.preventDefault();
        handleShakeClick();
      } else if (e.code === 'Digit1' && step === 'aroma') {
        e.preventDefault();
        handleAromaSelect('umami');
      } else if (e.code === 'Digit2' && step === 'aroma') {
        e.preventDefault();
        handleAromaSelect('salty');
      } else if (e.code === 'Digit3' && step === 'aroma') {
        e.preventDefault();
        handleAromaSelect('aromatic');
      } else if (e.code === 'ArrowLeft' && step === 'color') {
        e.preventDefault();
        handleColorSelect((selectedColor || 50) - 10);
      } else if (e.code === 'ArrowRight' && step === 'color') {
        e.preventDefault();
        handleColorSelect((selectedColor || 50) + 10);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, shakeCount, selectedAroma, selectedColor]);

  // Timer
  useEffect(() => {
    if (phaseCompleteRef.current || step === 'complete') return;
    
    if (timeRemaining <= 0) {
      phaseCompleteRef.current = true;
      onComplete(qualityBonus);
      return;
    }

    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, step]);

  // Shake detection - Click button version
  const handleShakeClick = () => {
    if (step !== 'shake') return;
    const newShakeCount = shakeCount + 1;
    setShakeCount(newShakeCount);

    if (newShakeCount >= 3) {
      setQualityBonus(prev => prev + 8);
      toast.success('✓ Lắc 3 lần! +8%', { duration: 2000 });
      setTimeout(() => {
        setStep('aroma');
        setShakeCount(0);
      }, 600);
    }
  };

  const handleAromaSelect = (aroma: string) => {
    setSelectedAroma(aroma);
    const isCorrect = aroma === 'umami';
    if (isCorrect) {
      setQualityBonus(prev => prev + 10);
      toast.success('✓ Chính xác! Chọn đúng UMAMI! +10%', { duration: 2000 });
    } else {
      setQualityBonus(prev => Math.max(-30, prev - 12));
      toast.error('✗ Sai! -12%', { duration: 2000 });
    }
    setTimeout(() => setStep('color'), 600);
  };

  const handleColorSelect = (colorValue: number) => {
    setSelectedColor(colorValue);
    const closeness = Math.abs(colorValue - 50); // 50 is optimal golden/amber
    let bonus = 0;
    let feedback = '';
    
    if (closeness < 10) {
      bonus = 12;
      feedback = '✓ Hoàn hảo! +12%';
    } else if (closeness < 20) {
      bonus = 6;
      feedback = '~ Tốt! +6%';
    } else {
      bonus = -12;
      feedback = '⚠️ Sai! -12%';
    }

    setQualityBonus(prev => prev + bonus);
    toast.success(feedback, { duration: 2000 });
    
    setTimeout(() => setStep('complete'), 600);
  };

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-yellow-900/20 to-slate-900/40 border border-yellow-600/30 backdrop-blur-sm p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">🎯 Bước 4: Đánh Giá Cuối Cùng</h2>
        <p className="text-amber-200/60 text-sm">Thời gian còn lại: {timeRemaining}s</p>
      </div>

      {/* Step 1: Shake - Click button version */}
      {step === 'shake' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Lắc chai để kiểm tra độ trong cuối cùng</p>
          <motion.div
            className="inline-block w-40 h-40 bg-gradient-to-br from-yellow-700 to-amber-900 rounded-2xl border-4 border-yellow-400 shadow-2xl flex items-center justify-center text-6xl mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🫙
          </motion.div>
          <p className="text-amber-100 text-xl font-semibold mb-4">Lắc {shakeCount}/3 lần</p>
          
          {/* Shake button */}
          <motion.button
            onClick={handleShakeClick}
            className="px-12 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-amber-50 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-amber-500 transition-all mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👋 Bấm hoặc SPACE ({shakeCount}/3)
          </motion.button>

          <p className="text-xs text-amber-300/60">💡 Gợi ý: Bấm nút hoặc nhấn SPACE</p>

          {/* Progress bar */}
          <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(shakeCount / 3) * 100}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Step 2: Aroma */}
      {step === 'aroma' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Chọn mùi đặc trưng nhất</p>
          <div className="flex gap-4 justify-center flex-wrap max-w-2xl mx-auto">
            {[
              { key: 'umami', emoji: '👃', label: 'UMAMI', desc: 'Vị gốc đặc trưng', key_hint: '1' },
              { key: 'salty', emoji: '🧂', label: 'MẶN', desc: 'Vị mặn', key_hint: '2' },
              { key: 'fishy', emoji: '🐟', label: 'CÁ', desc: 'Vị cá', key_hint: '3' }
            ].map((aroma) => (
              <motion.button
                key={aroma.key}
                onClick={() => handleAromaSelect(aroma.key)}
                className={`p-4 rounded-lg border-2 transition-all text-center min-w-[100px] ${
                  selectedAroma === aroma.key
                    ? 'border-green-400 bg-green-500/20 text-green-300'
                    : aroma.key === 'umami'
                    ? 'border-yellow-400 bg-yellow-600/20 text-yellow-200 hover:bg-yellow-500/30'
                    : 'border-yellow-600/40 bg-slate-700/20 text-amber-200 hover:bg-slate-600/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl">{aroma.emoji}</div>
                <div className="text-sm font-bold mt-2">{aroma.label}</div>
                <div className="text-xs opacity-70 mt-1">{aroma.desc}</div>
                <div className="text-xs text-amber-300/60 mt-2">Phím: {aroma.key_hint}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 3: Color */}
      {step === 'color' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-lg font-semibold mb-8">Chọn màu sắc (Nên là màu vàng nhạt)</p>
          
          {/* Color spectrum */}
          <div className="max-w-md mx-auto mb-6">
            <div className="h-12 rounded-lg border-2 border-yellow-400 overflow-hidden bg-gradient-to-r from-yellow-900 via-yellow-600 to-red-700 shadow-lg mb-4" />
            
            {/* Color slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={selectedColor || 0}
              onChange={(e) => handleColorSelect(Number(e.target.value))}
              className="w-full h-4 bg-slate-700/40 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex justify-between text-xs text-amber-200 mt-2 px-2">
              <span>Nhạt</span>
              <span className="font-bold text-amber-300">IDEAL (50%)</span>
              <span>Đậm</span>
            </div>

            <p className="text-xs text-amber-300/60 mt-3">💡 Hoặc dùng phím ← / → để điều chỉnh</p>
          </div>

          {/* Preview */}
          <div className="mt-6 flex gap-4 justify-center items-center">
            <motion.div
              className="w-16 h-16 rounded-lg border-2 border-yellow-400 shadow-lg"
              style={{
                background: selectedColor ? 
                  `linear-gradient(to right, #8B4513 ${selectedColor}%, #DAA520 ${selectedColor}%)` 
                  : '#8B4513'
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="text-left">
              <p className="text-amber-100 font-semibold">Màu Hiện Tại: {selectedColor || 0}%</p>
              <p className="text-xs text-amber-200/60">
                {selectedColor && Math.abs(selectedColor - 50) < 10 ? '✓ Tốt!' : 'Điều chỉnh'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2 }}
          >
            🏆
          </motion.div>
          <p className="text-amber-100 text-2xl font-bold">Đánh giá hoàn tất!</p>
          <p className="text-amber-200/60 mt-2">Tổng chất lượng từ đánh giá: <span className="text-amber-300 font-bold">+{Math.max(qualityBonus, 0)}%</span></p>
          <motion.button
            onClick={() => {
              phaseCompleteRef.current = true;
              onComplete(qualityBonus);
            }}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-amber-50 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hoàn Tất Level 5! 🎉
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
