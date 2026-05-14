import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SequencePhaseProps {
  onPhaseComplete: (score: number) => void;
  duration: number;
}

type SequenceKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

const KEY_SYMBOLS: Record<SequenceKey, string> = {
  ArrowUp: '⬆️',
  ArrowDown: '⬇️',
  ArrowLeft: '⬅️',
  ArrowRight: '➡️',
};

const KEY_NAMES: Record<SequenceKey, string> = {
  ArrowUp: 'UMAMI',
  ArrowDown: 'SALTY',
  ArrowLeft: 'AROMA',
  ArrowRight: 'AFTERTASTE',
};

export function SequencePhase({ onPhaseComplete, duration }: SequencePhaseProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [sequence, setSequence] = useState<SequenceKey[]>([]);
  const [playerInput, setPlayerInput] = useState<SequenceKey[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'display' | 'playing'>('display');
  const [displayingIndex, setDisplayingIndex] = useState(-1);
  const [multiplier, setMultiplier] = useState(1);

  const ALLOWED_KEYS: SequenceKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  // Initialize sequence
  useEffect(() => {
    const initialSequence = generateSequence(4);
    setSequence(initialSequence);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onPhaseComplete(score);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onPhaseComplete, score]);

  // Auto-start display phase after 1 second
  useEffect(() => {
    if (sequence.length === 0) return;

    const timer = setTimeout(() => {
      displaySequence();
    }, 1000);

    return () => clearTimeout(timer);
  }, [sequence]);

  // Display sequence
  const displaySequence = async () => {
    setCurrentPhase('display');
    setPlayerInput([]);
    setFeedback(null);

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setDisplayingIndex(i);
      await new Promise(r => setTimeout(r, 400));
      setDisplayingIndex(-1);
    }

    await new Promise(r => setTimeout(r, 500));
    setCurrentPhase('playing');
  };

  // Handle keyboard input
  useEffect(() => {
    if (currentPhase !== 'playing' || mistakes >= 3) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!ALLOWED_KEYS.includes(e.code as SequenceKey)) return;

      const key = e.code as SequenceKey;
      const expectedKey = sequence[playerInput.length];

      if (key === expectedKey) {
        // Correct
        setFeedback('correct');
        const newPlayerInput = [...playerInput, key];
        setPlayerInput(newPlayerInput);

        const speedBonus = Math.max(0, 10 - (duration - timeLeft) * 0.15);
        const stepScore = Math.round((10 + speedBonus) * multiplier);
        setScore(prev => prev + stepScore);

        // Visual feedback
        setTimeout(() => setFeedback(null), 300);

        // Check if sequence complete
        if (newPlayerInput.length === sequence.length) {
          // Delay trước khi extend sequence
          setTimeout(() => {
            // Extend sequence
            const newKey = ALLOWED_KEYS[Math.floor(Math.random() * ALLOWED_KEYS.length)];
            setSequence(prev => [...prev, newKey]);
            setMultiplier(prev => Math.min(prev + 0.2, 3));
            displaySequence();
          }, 800);
        }
      } else {
        // Wrong
        setFeedback('incorrect');
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        setPlayerInput([]);
        setTimeout(() => setFeedback(null), 500);

        if (newMistakes >= 3) {
          // Game over after 3 mistakes
          setTimeout(() => {
            onPhaseComplete(score);
          }, 1000);
          return;
        }

        // Restart display for this sequence
        setTimeout(() => {
          displaySequence();
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhase, playerInput, sequence, mistakes, duration, timeLeft, multiplier, score, onPhaseComplete]);

  function generateSequence(length: number): SequenceKey[] {
    const result: SequenceKey[] = [];
    for (let i = 0; i < length; i++) {
      result.push(ALLOWED_KEYS[Math.floor(Math.random() * ALLOWED_KEYS.length)]);
    }
    return result;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden p-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-8 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl text-amber-100 font-serif mb-2">
          Dãy Thần Thánh
        </h1>
        <p className="text-amber-300/70">
          {currentPhase === 'display' ? '👁️ Ghi nhớ dãy phím' : '⌨️ Gõ lại dãy phím'}
        </p>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl w-full">
        {/* Left: Sequence Display */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-amber-400 mb-4 tracking-widest">DÃY HIỆN TẠI</div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {ALLOWED_KEYS.map((key) => (
              <motion.div
                key={key}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-lg flex flex-col items-center justify-center cursor-default transition-all ${
                  sequence[displayingIndex] === key && currentPhase === 'display'
                    ? 'bg-amber-400 shadow-lg shadow-amber-400/50'
                    : 'bg-amber-900/40 border-2 border-amber-700/50'
                }`}
              >
                <div className="text-3xl md:text-4xl mb-2">{KEY_SYMBOLS[key]}</div>
                <div className="text-xs font-bold text-amber-300">{KEY_NAMES[key]}</div>
              </motion.div>
            ))}
          </div>

          {/* Sequence length */}
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-xl border border-amber-700/50 p-4 w-full text-center">
            <div className="text-amber-400 text-sm mb-1">ĐỘ DÀI DÃY</div>
            <div className="text-3xl text-amber-200 font-serif">{sequence.length}</div>
          </div>
        </motion.div>

        {/* Right: Stats & Feedback */}
        <motion.div
          className="flex flex-col justify-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Score */}
          <div className="bg-gradient-to-br from-amber-600/40 to-amber-800/40 backdrop-blur-sm rounded-2xl border border-amber-500/50 p-6">
            <div className="text-amber-400 text-sm mb-2 tracking-widest">ĐIỂM</div>
            <motion.div
              className="text-5xl font-serif text-amber-200"
              key={score}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {score}
            </motion.div>
          </div>

          {/* Multiplier */}
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-xl border border-amber-700/50 p-4">
            <div className="text-amber-400 text-sm mb-1">MULTIPLIER</div>
            <div className="text-2xl text-amber-300 font-bold">
              {multiplier.toFixed(1)}x
            </div>
          </div>

          {/* Mistakes */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  i < mistakes
                    ? 'bg-red-600 shadow-lg shadow-red-600/50'
                    : 'bg-amber-900/40 border-2 border-amber-700/50'
                }`}
              >
                <span className="text-2xl">{i < mistakes ? '✗' : '❤️'}</span>
              </motion.div>
            ))}
          </div>

          {/* Time */}
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-xl border border-amber-700/50 p-4">
            <div className="text-amber-400 text-sm mb-1">THỜI GIAN</div>
            <motion.div
              className="text-3xl text-amber-200 font-serif"
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {timeLeft}s
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`text-6xl font-bold ${
                feedback === 'correct' ? 'text-green-400' : 'text-red-400'
              }`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {feedback === 'correct' ? '✓' : '✗'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-6 left-4 right-4 text-center text-amber-300/60 text-sm max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          {currentPhase === 'display'
            ? 'Ghi nhớ dãy phím được hiển thị'
            : 'Sử dụng Arrow Keys để gõ lại dãy phím'}
        </p>
        <p className="mt-2 text-xs">3 lỗi = Game Over</p>
      </motion.div>
    </div>
  );
}
