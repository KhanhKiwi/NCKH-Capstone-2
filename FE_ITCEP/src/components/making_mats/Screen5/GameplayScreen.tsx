import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Grid3x3, Award, Volume2, VolumeX } from 'lucide-react';

interface Thread {
  id: string;
  lane: number;
  position: number;
  action: 'weave' | 'press' | 'hold';
  pressed: boolean;
  missed: boolean;
}

interface PatternRow {
  colors: string[];
  revealed: boolean;
}

interface TimingFeedback {
  show: boolean;
  lane: number;
  type: 'perfect' | 'good' | 'early' | 'late';
}

const LANES = 3;
const MAX_LIVES = 3;

const LANE_ACTIONS = [
  { 
    id: 'weave' as const, 
    name: 'Luồn sợi ngang',
    icon: 'A',
    color: 'from-amber-500 to-yellow-600',
    solidColor: '#F59E0B'
  },
  { 
    id: 'press' as const, 
    name: 'Nén sợi',
    icon: 'S',
    color: 'from-orange-500 to-amber-600',
    solidColor: '#EA580C'
  },
  { 
    id: 'hold' as const, 
    name: 'Giữ hoa văn',
    icon: 'D',
    color: 'from-yellow-600 to-orange-600',
    solidColor: '#D97706'
  },
];

const playSound = (type: 'perfect' | 'good' | 'miss' | 'combo') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    switch (type) {
      case 'perfect': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'good': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'miss': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 200;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'combo': {
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.frequency.value = 700;
        gain1.gain.setValueAtTime(0.1, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc1.start(now);
        osc1.stop(now + 0.08);

        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 900;
        gain2.gain.setValueAtTime(0.1, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.18);
        break;
      }
    }
  } catch (e) {
    // Silent fail
  }
};

export default function GameplayScreen() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'win' | 'loss' | null>(null);
  const [patternRows, setPatternRows] = useState<PatternRow[]>([]);
  const [completedRows, setCompletedRows] = useState(0);
  const [timingFeedback, setTimingFeedback] = useState<TimingFeedback>({
    show: false,
    lane: -1,
    type: 'perfect'
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [keyFeedback, setKeyFeedback] = useState<{ key: string; show: boolean }>({ key: '', show: false });

  const gameLoopRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const isRunningRef = useRef(true);
  const threadsRef = useRef<Thread[]>([]);  // Keep current threads in ref
  const scoreRef = useRef(0);  // Track score without triggering re-render
  const bestScoreRef = useRef(0);  // Track best score without triggering re-render

  const patternColors = ['#D97706', '#F59E0B', '#FBBF24', '#92400E', '#EA580C'];

  useEffect(() => {
    const saved = localStorage.getItem('weavingGameBestScore');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  // Keep threadsRef in sync with threads state
  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  // Keep scoreRef and bestScoreRef in sync
  useEffect(() => {
    scoreRef.current = score;
    bestScoreRef.current = bestScore;
  }, [score, bestScore]);

  // Check if level is complete (12/12)
  useEffect(() => {
    if (completedRows === 12 && gameStarted && !gameOver) {
      setGameOver(true);
      setGameOverReason('win');
      isRunningRef.current = false;
      if (soundEnabled) playSound('combo');
    }
  }, [completedRows, gameStarted, gameOver, soundEnabled]);

  const getDifficultySettings = (diff: 'easy' | 'normal' | 'hard') => {
    const settings = {
      easy: { 
        speed: 0.5, 
        spawn: 1200,
        zoneStart: 75,
        zoneEnd: 115,
        perfectStart: 82,
        perfectEnd: 98,
        earlyStart: 75,
        earlyEnd: 82,
        lateStart: 98,
        lateEnd: 115
      },
      normal: { 
        speed: 0.7, 
        spawn: 800,
        zoneStart: 80,
        zoneEnd: 110,
        perfectStart: 87,
        perfectEnd: 97,
        earlyStart: 80,
        earlyEnd: 87,
        lateStart: 97,
        lateEnd: 110
      },
      hard: { 
        speed: 1.0, 
        spawn: 600,
        zoneStart: 85,
        zoneEnd: 105,
        perfectStart: 92,
        perfectEnd: 97,
        earlyStart: 85,
        earlyEnd: 92,
        lateStart: 97,
        lateEnd: 105
      }
    };
    return settings[diff];
  };

  const startGame = (diff: 'easy' | 'normal' | 'hard') => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setGameOverReason(null);
    setScore(0);
    setCombo(0);
    setLives(MAX_LIVES);
    setThreads([]);
    setCompletedRows(0);
    setPatternRows(Array.from({ length: 12 }, () => ({
      colors: Array.from({ length: 6 }, () => patternColors[Math.floor(Math.random() * patternColors.length)]),
      revealed: false
    })));
    nextIdRef.current = 0;
    isRunningRef.current = true;
  };

  const spawnThread = useCallback(() => {
    if (!isRunningRef.current) return;
    const lane = Math.floor(Math.random() * LANES);
    const newThread: Thread = {
      id: String(nextIdRef.current++),
      lane,
      position: 0,
      action: LANE_ACTIONS[lane].id,
      pressed: false,
      missed: false
    };
    setThreads(prev => [...prev, newThread]);
  }, []);

  const handleThreadClick = useCallback((threadId: string, laneIndex: number) => {
    setThreads(prev => {
      const thread = prev.find(t => t.id === threadId);
      if (!thread || thread.pressed || thread.missed) return prev;

      const position = thread.position;
      const settings = getDifficultySettings(difficulty);

      // Only register hits when in zone - ignore clicks outside zone
      if (position < settings.zoneStart || position > settings.zoneEnd) {
        return prev; // Do nothing, don't mark as missed
      }

      let newCombo = combo;
      let timing: TimingFeedback['type'] = 'late';

      if (position >= settings.perfectStart && position <= settings.perfectEnd) {
        timing = 'perfect';
        newCombo = combo + 1;
        setScore(s => s + 10 + Math.floor(newCombo * 3));
      } else if (position >= settings.earlyStart && position < settings.earlyEnd) {
        timing = 'early';
        newCombo = 0;
        setScore(s => s + 5);
      } else if (position > settings.lateStart && position <= settings.lateEnd) {
        timing = 'late';
        newCombo = 0;
        setScore(s => s + 5);
      } else {
        newCombo = 0;
      }

      if (timing === 'perfect') {
        if (soundEnabled) playSound('perfect');
        // Increment completedRows for each perfect hit
        setCompletedRows(prev => prev + 1);
        // Reveal the next pattern row
        setPatternRows(prev => {
          const updated = [...prev];
          if (completedRows < 12 && updated[completedRows]) {
            updated[completedRows].revealed = true;
          }
          return updated;
        });
      } else if (timing === 'early' || timing === 'late') {
        if (soundEnabled) playSound('good');
      } else {
        if (soundEnabled) playSound('miss');
      }

      setCombo(newCombo);
      setTimingFeedback({ show: true, lane: laneIndex, type: timing });
      setKeyFeedback({ key: LANE_ACTIONS[laneIndex].icon, show: true });
      setTimeout(() => setTimingFeedback(prev => ({ ...prev, show: false })), 500);
      setTimeout(() => setKeyFeedback({ key: '', show: false }), 200);

      return prev.map(t => t.id === threadId ? { ...t, pressed: true } : t);
    });
  }, [combo, soundEnabled, difficulty]);

  // Keyboard input handler - Use threadsRef to avoid stale state
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'S' || key === 'D') {
        e.preventDefault();
        const laneIndex = LANE_ACTIONS.findIndex(action => action.icon === key);
        if (laneIndex >= 0) {
          const settings = getDifficultySettings(difficulty);
          // Find hittable thread in current threads from ref
          const hittableThread = threadsRef.current.find(
            t => t.lane === laneIndex && 
                 !t.pressed && 
                 !t.missed && 
                 t.position >= settings.zoneStart && 
                 t.position <= settings.zoneEnd
          );
          
          if (hittableThread) {
            // Process the hit directly
            const position = hittableThread.position;
            let hitTiming: TimingFeedback['type'] = 'late';
            let hitCombo = combo;

            if (position >= settings.perfectStart && position <= settings.perfectEnd) {
              hitTiming = 'perfect';
              hitCombo = combo + 1;
              setScore(s => s + 10 + Math.floor(hitCombo * 3));
            } else if (position >= settings.earlyStart && position < settings.earlyEnd) {
              hitTiming = 'early';
              setScore(s => s + 5);
            } else if (position > settings.lateStart && position <= settings.lateEnd) {
              hitTiming = 'late';
              setScore(s => s + 5);
            }

            if (hitTiming === 'perfect') {
              if (soundEnabled) playSound('perfect');
              // Increment completedRows for each perfect hit
              setCompletedRows(prev => prev + 1);
              // Reveal the next pattern row
              setPatternRows(prev => {
                const updated = [...prev];
                if (completedRows < 12 && updated[completedRows]) {
                  updated[completedRows].revealed = true;
                }
                return updated;
              });
            } else {
              if (soundEnabled) playSound('good');
            }

            setCombo(hitCombo);
            setTimingFeedback({ show: true, lane: laneIndex, type: hitTiming });
            setKeyFeedback({ key: LANE_ACTIONS[laneIndex].icon, show: true });
            setTimeout(() => setTimingFeedback(prev => ({ ...prev, show: false })), 500);
            setTimeout(() => setKeyFeedback({ key: '', show: false }), 200);

            // Mark thread as pressed
            setThreads(prev => prev.map(t => t.id === hittableThread.id ? { ...t, pressed: true } : t));
          }
          // If no hittable thread, do nothing - don't treat as miss
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, combo, soundEnabled, difficulty]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      setThreads(prev => {
        let hasMissed = false;
        const settings = getDifficultySettings(difficulty);
        const updated = prev
          .map(t => {
            const newPos = t.position + settings.speed;
            // If note passes the hit zone without being pressed, mark it as missed
            if (!t.missed && newPos > settings.zoneEnd && !t.pressed) {
              hasMissed = true;
              return null; // Remove immediately instead of keeping it in array
            }
            return { ...t, position: newPos };
          })
          .filter((t): t is Thread => t !== null);

        if (hasMissed) {
          setLives(l => {
            const newLives = l - 1;
            if (soundEnabled) playSound('miss');
            if (newLives <= 0) {
              const newBestScore = Math.max(scoreRef.current, bestScoreRef.current);
              setBestScore(newBestScore);
              localStorage.setItem('weavingGameBestScore', String(newBestScore));
              setGameOver(true);
              setGameOverReason('loss');
              isRunningRef.current = false;
            }
            return newLives;
          });
          setCombo(0);
        }

        return updated;
      });

      if (isRunningRef.current) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    const settings = getDifficultySettings(difficulty);
    const spawnTimer = setInterval(() => {
      if (isRunningRef.current) spawnThread();
    }, settings.spawn);
    spawnTimerRef.current = spawnTimer as any;

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      clearInterval(spawnTimer);
    };
  }, [gameStarted, gameOver, difficulty, spawnThread, soundEnabled]);

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
    };
  }, []);

  const getTimingText = (type: TimingFeedback['type']) => {
    const texts = { perfect: 'Perfect!', good: 'Good!', early: 'Quá sớm!', late: 'Trễ rồi!' };
    return texts[type] || '';
  };

  const getTimingColor = (type: TimingFeedback['type']) => {
    const colors = { perfect: 'text-yellow-400', good: 'text-lime-400', early: 'text-blue-400', late: 'text-red-400' };
    return colors[type] || '';
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="traditional-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="#D97706" opacity="0.3" />
              <path d="M 50 30 Q 60 40 50 50 Q 40 40 50 30" fill="#EA580C" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#traditional-pattern)" />
        </svg>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`deco-${i}`}
            className="absolute w-40 h-40 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${['#F59E0B', '#EA580C', '#D97706', '#92400E'][i]} 0%, transparent 70%)`,
              left: `${20 + i * 25}%`,
              top: `${10 + i * 20}%`
            }}
            animate={{ x: [0, Math.sin(i) * 80, 0], y: [0, Math.cos(i) * 80, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* HEADER - Simple + Clear */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 pt-3 pb-3 px-4 md:px-6 bg-gradient-to-b from-amber-200/40 to-transparent border-b-3 border-amber-300/50"
      >
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Level Title */}
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl font-black text-amber-900 flex-shrink-0"
          >
            Level 5 – Thực hiện dệt chiếu
          </motion.h1>

          {/* Right: Stats */}
          <div className="flex gap-4 md:gap-5 items-center ml-auto flex-shrink-0">
            {/* Sound Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3.5 md:p-4 bg-white/85 backdrop-blur-sm rounded-xl shadow-xl border-3 border-amber-200 hover:bg-white transition-all"
            >
              {soundEnabled ? <Volume2 className="w-7 h-7 md:w-8 md:h-8 text-amber-800" /> : <VolumeX className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />}
            </button>

            {/* Lives */}
            <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-sm px-5 md:px-6 py-3 rounded-xl shadow-xl border-3 border-red-300">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <Heart key={i} className={`w-7 h-7 md:w-8 md:h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
              ))}
            </div>

            {/* Score */}
            <motion.div animate={{ scale: combo > 0 ? [1, 1.08, 1] : 1 }} className="text-center bg-white/85 backdrop-blur-sm px-5 md:px-6 py-3 rounded-xl shadow-xl border-3 border-amber-300 hidden md:block">
              <div className="text-sm md:text-base text-amber-600 font-black">Điểm</div>
              <div className="text-2xl md:text-3xl font-black text-amber-800">{score}</div>
            </motion.div>

            {/* Combo */}
            {combo > 0 && (
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="text-center bg-gradient-to-br from-orange-500 to-amber-600 px-5 md:px-6 py-3 rounded-xl shadow-xl border-3 border-white hidden md:block">
                <div className="text-sm md:text-base text-white font-black">Combo</div>
                <div className="text-2xl md:text-3xl font-black text-white">{combo}x</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Area */}
      <div className="relative z-10 h-[calc(100vh-80px)]">
        {!gameStarted || gameOver ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center px-3 py-4 gap-2">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="mb-4">
                  <Award className="w-24 h-24 md:w-32 md:h-32 mx-auto text-amber-600" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-black text-amber-800 mb-3">{gameOverReason === 'win' ? 'Chiếu Hoàn Thành!' : 'Kết thúc!'}</h2>
                
                <div className="bg-white/85 backdrop-blur-md rounded-xl p-5 md:p-6 mb-4 shadow-xl border-4 border-amber-300">
                  <p className="text-2xl md:text-3xl text-amber-700 font-black mb-2">Điểm: <span className="text-orange-600">{score}</span></p>
                  <p className="text-base md:text-lg text-amber-600 font-bold mb-1">Hàng dệt: <span className="text-orange-600">{completedRows}/12</span></p>
                  {bestScore > 0 && <p className="text-sm md:text-base text-amber-600 border-t-2 border-amber-200 pt-2 font-bold">Kỷ lục: <span className="text-orange-600">{bestScore}</span></p>}
                </div>

                <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                  {gameOverReason === 'win' && (
                    <motion.button 
                      whileHover={{ scale: 1.08, y: -3 }} 
                      whileTap={{ scale: 0.92 }} 
                      onClick={() => navigate('/level-6')}
                      className="px-8 md:px-12 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base md:text-lg font-black rounded-xl shadow-lg border-3 border-blue-800"
                    >
                      Tiếp Tục
                    </motion.button>
                  )}
                  
                  <motion.button 
                    whileHover={{ scale: 1.08, y: -3 }} 
                    whileTap={{ scale: 0.92 }} 
                    onClick={() => { 
                      setGameStarted(false); 
                      setGameOver(false);
                      setGameOverReason(null);
                    }} 
                    className="px-8 md:px-12 py-2.5 md:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-base md:text-lg font-black rounded-xl shadow-lg border-3 border-amber-800"
                  >
                    Chơi Lại!
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-4 max-w-4xl h-full">
                {/* CENTER ICON - Weaving Theme */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl border-8 border-white/90 relative overflow-hidden">
                    {/* Weaving pattern inside */}
                    <div className="absolute inset-0 opacity-40">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-2 bg-white/50 rounded-full"
                          style={{ width: '75%', left: '12.5%', top: `${16 + i * 14}%` }}
                          animate={{ x: [0, 20, 0], opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>

                    {/* Grid Icon - Weaving Grid */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="relative z-10"
                    >
                      <Grid3x3 className="w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </motion.div>
                  </div>
                </motion.div>

                {/* MAIN TEXT - Bold CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-5xl md:text-7xl font-black text-amber-950 leading-tight mb-1">
                    Sẵn Sàng?
                  </h2>
                  <p className="text-lg md:text-2xl font-bold text-amber-800">
                    Chạm đúng lúc để dệt chiếu hoàn hảo
                  </p>
                </motion.div>

                {/* DIFFICULTY BUTTONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4 md:gap-6 px-2 mt-2 flex-wrap md:flex-nowrap justify-center"
                >
                  {(['easy', 'normal', 'hard'] as const).map((diff) => (
                    <motion.button
                      key={diff}
                      whileHover={{ scale: 1.12, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startGame(diff)}
                      className={`px-8 md:px-14 py-5 md:py-6 font-black rounded-2xl shadow-2xl text-lg md:text-2xl border-4 md:border-5 transition-all ${
                        diff === 'easy'
                          ? 'bg-green-500 hover:bg-green-600 border-green-700 text-white shadow-green-500/70'
                          : diff === 'normal'
                          ? 'bg-amber-600 hover:bg-amber-700 border-amber-900 text-white shadow-amber-600/70'
                          : 'bg-red-500 hover:bg-red-600 border-red-700 text-white shadow-red-500/70'
                      }`}
                    >
                      {diff === 'easy' && 'Dễ'}{diff === 'normal' && 'Bình Thường'}{diff === 'hard' && 'Khó'}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-3 w-full max-w-3xl"
                >
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {LANE_ACTIONS.map((action, idx) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 + idx * 0.1 }}
                        className="bg-white/80 backdrop-blur-md px-4 md:px-6 py-4 md:py-5 rounded-lg border-3 md:border-4 border-amber-300 shadow-lg"
                      >
                        <div className="text-4xl md:text-5xl font-black mb-2 text-amber-800">{action.icon}</div>
                        <p className="text-sm md:text-base font-bold text-amber-900 leading-tight">{action.name}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Gameplay Hint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="mt-4 md:mt-5 px-3 md:px-6 py-3 md:py-4 bg-gradient-to-r from-yellow-100/80 to-amber-100/80 backdrop-blur-md rounded-xl border-2 md:border-3 border-yellow-300/60 shadow-lg"
                  >
                    <p className="text-xs md:text-sm font-bold text-amber-900 leading-relaxed mb-1.5">
                      Chạm A - S - D theo nhip để luon và nén sợi
                    </p>
                    <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                      Cảm nhận nhịp điệu như chơi đàn - giữ đúng timing để dệt nên hoa văn hoàn hảo
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="relative h-full w-11/12 md:w-4/5 max-w-3xl">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-2 shadow-lg border-2 border-amber-300 z-40 w-11/12">
                <div className="text-center">
                  <h3 className="text-xs md:text-sm font-black text-amber-900">Hoa Văn: {completedRows}/12</h3>
                </div>
                
                <div className="space-y-0.5 bg-white/50 backdrop-blur-sm p-1.5 rounded mt-1">
                  {patternRows.slice(0, 6).map((row, rowIdx) => (
                    <motion.div key={rowIdx} initial={{ opacity: 0 }} animate={{ opacity: row.revealed ? 1 : 0.3 }} transition={{ duration: 0.5 }} className="flex gap-0.5 justify-center">
                      {row.colors.map((color, colIdx) => (
                        <motion.div key={colIdx} initial={{ scale: 0 }} animate={{ scale: row.revealed ? 1 : 0.5 }} transition={{ delay: row.revealed ? colIdx * 0.05 : 0, duration: 0.3 }} className="w-3 h-3 md:w-4 md:h-4 rounded shadow-sm border border-white" style={{ backgroundColor: row.revealed ? color : '#D1D5DB' }} />
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="relative h-full w-full flex rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-amber-100/30 to-orange-100/30 border-4 border-amber-200 mt-24">
                {Array.from({ length: LANES }).map((_, laneIndex) => (
                  <div key={laneIndex} className="flex-1 relative border-r-2 border-amber-200/40 last:border-r-0">
                    {timingFeedback.show && timingFeedback.lane === laneIndex && (
                      <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} className={`absolute bottom-32 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${getTimingColor(timingFeedback.type)} font-black text-2xl md:text-3xl drop-shadow-lg`}>
                        {getTimingText(timingFeedback.type)}
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Hit Zone - Enhanced with glow */}
                <motion.div 
                  initial={{ scaleX: 0 }} 
                  animate={{ scaleX: 1 }} 
                  transition={{ duration: 0.5 }} 
                  className="absolute bottom-12 md:bottom-16 left-0 right-0 h-24 md:h-28 bg-gradient-to-r from-amber-300/80 via-yellow-300 to-amber-300/80 backdrop-blur-sm border-y-4 border-amber-500 shadow-2xl z-20 pointer-events-none"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-200/40 to-yellow-400/20 animate-pulse"></div>
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }} 
                    transition={{ duration: 1.5, repeat: Infinity }} 
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-amber-950 font-black text-xs md:text-lg px-6 py-2 bg-white/70 rounded-lg shadow-lg border-2 border-yellow-400">CHẠM VÀO ĐÂY</span>
                  </motion.div>
                </motion.div>

                {/* Falling Tiles */}
                <AnimatePresence>
                  {threads.map(thread => {
                    const laneIndex = thread.lane;
                    const actionLabel = LANE_ACTIONS[laneIndex];
                    const settings = getDifficultySettings(difficulty);
                    const inHitZone = thread.position >= settings.zoneStart && thread.position <= settings.zoneEnd;
                    
                    let tileClass = 'h-full mx-1 md:mx-2 rounded-xl cursor-pointer transform transition-all flex flex-col items-center justify-center font-black drop-shadow-lg ';
                    
                    if (thread.pressed) {
                      tileClass += 'scale-75 opacity-30 bg-green-500 shadow-xl';
                    } else if (thread.missed) {
                      tileClass += 'opacity-20 bg-gray-400';
                    } else if (inHitZone) {
                      tileClass += 'hover:scale-110 shadow-2xl bg-gradient-to-b from-orange-500 to-red-600 border-4 border-white scale-105 animate-pulse';
                    } else {
                      tileClass += 'hover:scale-105 shadow-lg bg-gradient-to-b from-amber-400 to-amber-600 border-3 border-yellow-300';
                    }
                    
                    return (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute left-0 right-0 h-14 md:h-20 pointer-events-auto z-10"
                        style={{ width: `${100 / LANES}%`, left: `${(thread.lane / LANES) * 100}%`, top: `${thread.position}%` }}
                        onClick={() => handleThreadClick(thread.id, thread.lane)}
                      >
                        <div className={tileClass}>
                          <div className="text-3xl md:text-4xl text-white">
                            {actionLabel.icon}
                          </div>
                          <div className="text-xs md:text-sm text-white leading-tight hidden md:block">
                            {actionLabel.name.split(' ')[0]}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Keyboard Feedback Display */}
            {gameStarted && !gameOver && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4 z-40">
                {['A', 'S', 'D'].map((key) => (
                  <motion.div
                    key={key}
                    animate={keyFeedback.key === key && keyFeedback.show ? { scale: [1, 1.3, 1], y: [0, -8, 0] } : { scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl font-black text-xl md:text-2xl flex items-center justify-center border-3 transition-all cursor-pointer ${
                      keyFeedback.key === key && keyFeedback.show
                        ? 'bg-yellow-300 border-yellow-600 text-amber-900 shadow-2xl'
                        : 'bg-white/70 border-amber-300 text-amber-700 shadow-lg'
                    }`}
                  >
                    {key}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
