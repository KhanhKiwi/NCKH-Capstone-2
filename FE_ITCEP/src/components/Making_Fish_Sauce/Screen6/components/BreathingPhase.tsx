import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BreathingPhaseProps {
  onPhaseComplete: () => void;
  duration: number;
}

export function BreathingPhase({ onPhaseComplete, duration }: BreathingPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onPhaseComplete();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onPhaseComplete]);

  useEffect(() => {
    const cycleSequence = async () => {
      // Inhale: 4 seconds
      setPhase('inhale');
      await new Promise(r => setTimeout(r, 4000));

      // Hold: 4 seconds
      setPhase('hold');
      await new Promise(r => setTimeout(r, 4000));

      // Exhale: 4 seconds
      setPhase('exhale');
      await new Promise(r => setTimeout(r, 4000));

      setCycles(c => c + 1);
    };

    if (timeLeft > 0) {
      cycleSequence();
    }
  }, [timeLeft]);

  const getScale = () => {
    if (phase === 'inhale') return 1.5;
    if (phase === 'hold') return 1.5;
    if (phase === 'exhale') return 0.8;
    return 1;
  };

  const getInstruction = () => {
    if (phase === 'inhale') return '🫁 HÍT VÀO';
    if (phase === 'hold') return '🧘 GIỮ YÊN';
    if (phase === 'exhale') return '💨 THỞ RA';
    return '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl text-amber-100 font-serif mb-4">
            Nhập Tâm Thần
          </h1>
          <p className="text-amber-300/70 text-lg">
            Chuẩn bị tinh thần cho nghi thức di sản
          </p>
        </motion.div>

        {/* Breathing Circle */}
        <motion.div
          className="relative w-64 h-64 flex items-center justify-center"
          animate={{ scale: getScale() }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 4 : 4, ease: 'easeInOut' }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 opacity-30 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          {/* Main circle */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/50 shadow-2xl shadow-amber-900/50" />

          {/* Inner circle */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-inner"
            animate={{
              opacity: [0.8, 0.6, 0.8],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          {/* Instruction text */}
          <div className="relative z-10 text-center">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="text-5xl mb-4"
            >
              {phase === 'inhale' ? '↑' : phase === 'hold' ? '◯' : '↓'}
            </motion.div>
            <motion.p
              key={`text-${phase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-bold text-amber-950"
            >
              {getInstruction()}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex gap-12 justify-center text-center">
          {/* Cycles */}
          <motion.div
            className="bg-amber-900/30 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-amber-400 text-sm mb-2">CHỈ SỐ</div>
            <div className="text-3xl text-amber-200 font-serif">{cycles}</div>
            <div className="text-amber-300/70 text-xs mt-2">Vòng Thở</div>
          </motion.div>

          {/* Time left */}
          <motion.div
            className="bg-amber-900/30 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-amber-400 text-sm mb-2">THỜI GIAN</div>
            <div className="text-3xl text-amber-200 font-serif">{timeLeft}s</div>
            <div className="text-amber-300/70 text-xs mt-2">Còn Lại</div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div className="w-full max-w-md">
          <div className="h-1 bg-amber-950/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
              initial={{ width: '100%' }}
              animate={{ width: `${((duration - timeLeft) / duration) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-amber-300/60 text-sm max-w-md"
        >
          <p>Theo dõi nhịp thở của bạn. Chuẩn bị tinh thần cho nghi thức niêm phong di sản bất diệt.</p>
        </motion.div>
      </div>
    </div>
  );
}
