import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface PrepPhaseProps {
  onComplete: (qualityBonus: number) => void;
  timeLimit: number;
}

export function PrepPhase({ onComplete, timeLimit }: PrepPhaseProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [shakeCount, setShakeCount] = useState(0);
  const [step, setStep] = useState<'shake' | 'density' | 'aroma' | 'complete'>('shake');
  const [qualityBonus, setQualityBonus] = useState(0);
  const [densityValue, setDensityValue] = useState(0);
  const [densityFeedback, setDensityFeedback] = useState<string>('');
  const phaseCompleteRef = useRef(false);

  // Timer
  useEffect(() => {
    if (phaseCompleteRef.current || step === 'complete') return;
    
    if (timeRemaining <= 0) {
      phaseCompleteRef.current = true;
      onComplete(qualityBonus || -15);
      return;
    }

    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, step]);

  // Keyboard listener for shaking
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && step === 'shake') {
        e.preventDefault();
        handleShakeClick();
      } else if (e.code === 'ArrowRight' && step === 'aroma') {
        e.preventDefault();
        // Will be handled by aroma buttons
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, shakeCount]);

  // Shake - Click button instead of drag
  const handleShakeClick = () => {
    if (step !== 'shake') return;
    const newShakeCount = shakeCount + 1;
    setShakeCount(newShakeCount);

    if (newShakeCount >= 5) {
      setQualityBonus(prev => prev + 15);
      toast.success('✓ Lắc 5 lần! +15%', { duration: 2000 });
      setTimeout(() => {
        setStep('density');
      }, 600);
    }
  };

  // Density slider
  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDensityValue(value);

    const closeness = Math.abs(value - 50);
    let bonus = 0;
    let feedback = '';

    if (closeness < 5) {
      bonus = 18;
      feedback = '✓ Hoàn hảo! +18%';
      setDensityFeedback(feedback);
      
      setTimeout(() => {
        setStep('aroma');
        setQualityBonus(prev => prev + bonus);
      }, 600);
    } else if (closeness < 15) {
      bonus = 8;
      feedback = '~ Khá tốt! +8%';
      setDensityFeedback(feedback);
      setTimeout(() => {
        setStep('aroma');
        setQualityBonus(prev => prev + bonus);
      }, 1200);
    } else if (closeness < 30) {
      bonus = -10;
      feedback = '⚠️ Sai! -10%';
      setDensityFeedback(feedback);
      setTimeout(() => {
        setStep('aroma');
        setQualityBonus(prev => prev + bonus);
      }, 1200);
    } else {
      bonus = -20;
      feedback = '✗ Rất sai! -20%';
      setDensityFeedback(feedback);
      setTimeout(() => {
        setStep('aroma');
        setQualityBonus(prev => prev + bonus);
      }, 1200);
    }
  };

  // Aroma test
  const handleAromaClick = (aroma: string) => {
    if (aroma === 'umami') {
      setQualityBonus(prev => prev + 12);
      toast.success('✓ Chính xác! Chọn đúng UMAMI! +12%', { duration: 2000 });
      setTimeout(() => {
        setStep('complete');
      }, 600);
    } else {
      setQualityBonus(prev => Math.max(-30, prev - 15));
      toast.error('✗ Sai rồi! -15%', { duration: 2000 });
    }
  };

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-amber-900/20 to-slate-900/40 border border-amber-600/30 backdrop-blur-sm p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">⏱️ Bước 1: Chuẩn Bị (Prep)</h2>
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
          <motion.div
            className="inline-block w-40 h-40 bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl border-4 border-amber-400 shadow-2xl flex items-center justify-center text-6xl mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🫙
          </motion.div>
          <p className="text-amber-100 text-xl font-semibold mb-4">Lắc chai để kiểm tra độ trong</p>
          <p className="text-amber-200/60 mb-6">Cần lắc {shakeCount}/5 lần</p>
          
          {/* Shake button */}
          <motion.button
            onClick={handleShakeClick}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-amber-50 rounded-lg font-bold text-lg hover:from-amber-500 hover:to-yellow-500 transition-all mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👋 Bấm hoặc Nhấn SPACE ({shakeCount}/5)
          </motion.button>

          {/* Keyboard hint */}
          <p className="text-xs text-amber-300/60">💡 Gợi ý: Bấm nút hoặc nhấn phím SPACE để lắc</p>

          {/* Progress bar */}
          <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(shakeCount / 5) * 100}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Step 2: Density */}
      {step === 'density' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-xl font-semibold mb-8">Điều chỉnh phao nổi - Cần vào giữa (50%)</p>
          <div className="max-w-md mx-auto">
            <input
              type="range"
              min="0"
              max="100"
              value={densityValue}
              onChange={handleDensityChange}
              className="w-full h-4 bg-slate-700/40 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(51, 65, 85) 0%, rgb(180, 83, 9) ${densityValue}%, rgb(51, 65, 85) ${densityValue}%, rgb(51, 65, 85) 100%)`
              }}
            />
            <div className="text-amber-200/60 text-sm mt-4 flex justify-between px-2 text-xs">
              <span>Thấp</span>
              <span className="font-bold text-amber-300">CẦN Ở ĐÂY (50%)</span>
              <span>Cao</span>
            </div>
            <p className="text-amber-100 font-semibold mt-6 text-lg">Giá trị hiện tại: {densityValue}%</p>
            {densityFeedback && (
              <motion.p
                className="text-amber-300 mt-4 text-lg font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={densityFeedback}
              >
                {densityFeedback}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}

      {/* Step 3: Aroma */}
      {step === 'aroma' && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="text-amber-100 text-xl font-semibold mb-8">Chọn mùi đặc trưng nhất</p>
          <div className="flex gap-4 justify-center">
            {[
              { key: 'umami', label: '👃 UMAMI', desc: 'Vị gốc - Đặc trưng' },
              { key: 'salty', label: '🧂 MẶN', desc: 'Vị mặn' },
              { key: 'sour', label: '🍋 CHUA', desc: 'Vị chua nhẹ' }
            ].map(aroma => (
              <motion.button
                key={aroma.key}
                onClick={() => handleAromaClick(aroma.key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  aroma.key === 'umami'
                    ? 'border-amber-400 bg-amber-600/20 hover:bg-amber-500/30'
                    : 'border-amber-600/40 bg-slate-700/20 hover:bg-slate-600/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl">{aroma.label}</div>
                <div className="text-xs text-amber-200/60 mt-1">{aroma.desc}</div>
              </motion.button>
            ))}
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
            ✨
          </motion.div>
          <p className="text-amber-100 text-2xl font-bold">Chuẩn bị hoàn tất!</p>
          <p className="text-amber-200/60 mt-2">Bonus chất lượng: <span className="text-amber-300 font-bold">+{Math.max(qualityBonus, 0)}%</span></p>
          <motion.button
            onClick={() => {
              phaseCompleteRef.current = true;
              onComplete(qualityBonus);
            }}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-amber-50 rounded-lg font-semibold hover:from-amber-500 hover:to-yellow-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tiếp tục → Lọc Lớp 1
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
