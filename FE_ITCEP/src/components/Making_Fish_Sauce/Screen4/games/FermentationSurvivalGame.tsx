import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameEvent, JarState, GameStats, Feedback, GameDifficulty } from '../types/gameTypes';
import { eventSystem } from '../utils/eventSystem';
import { Jar } from '../components/Jar';

interface FermentationSurvivalGameProps {
  difficulty: GameDifficulty;
  baseQuality: number;
  onGameEnd: (passed: boolean, finalQuality: number, jars: JarState[]) => void;
}

const TOTAL_MONTHS = 12;
const JAR_COUNT = 3;
const EVENT_CHECK_INTERVAL = 1200; // ms - faster event generation
const MONTH_DURATION = 6000; // 6 seconds per month for playable pacing

export function FermentationSurvivalGame({
  difficulty,
  baseQuality,
  onGameEnd
}: FermentationSurvivalGameProps) {
  // Game state
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'finished'>('playing');
  const [currentMonth, setCurrentMonth] = useState(1);
  const [jars, setJars] = useState<JarState[]>(() =>
    Array.from({ length: JAR_COUNT }, (_, i) => ({
      id: `jar-${i}`,
      index: i,
      quality: baseQuality,
      pressure: 30,
      water: 0,
      temperature: 28,
      infected: false,
      health: 100,
      isTreating: false,
      treatTimeLeft: 0,
      infectionDuration: 0
    }))
  );
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [stats, setStats] = useState<GameStats>({
    chainCombo: 0,
    totalActions: 0,
    successActions: 0,
    failedActions: 0,
    quality: baseQuality,
    currentMonth: 1
  });
  const [feedback, setFeedback] = useState<Feedback>({ show: false, type: 'info', message: '' });
  const [activeJar, setActiveJar] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeInCurrentMonth, setTimeInCurrentMonth] = useState(0);

  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const eventLoopRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const cameraShakeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const jarsRef = useRef<JarState[]>([]);

  // Initialize event system
  useEffect(() => {
    eventSystem.setDifficulty(difficulty);
  }, [difficulty]);

  // Keep jarsRef in sync with jars state
  useEffect(() => {
    jarsRef.current = jars;
  }, [jars]);

  // Track time within current month for UI display
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeInCurrentMonth(prev => {
        const newTime = prev + 100;
        return newTime >= MONTH_DURATION ? 0 : newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState]);

  // Infection damage loop - quality -1% per second
  useEffect(() => {
    if (gameState !== 'playing') return;

    const infectionTimer = setInterval(() => {
      setJars(prev =>
        prev.map(jar => {
          if (jar.infected && !jar.isTreating) {
            return {
              ...jar,
              quality: Math.max(0, jar.quality - 1),
              infectionDuration: (jar.infectionDuration || 0) + 1
            };
          }
          return jar;
        })
      );
    }, 1000); // Every second

    return () => clearInterval(infectionTimer);
  }, [gameState]);

  // Treatment countdown loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const treatmentTimer = setInterval(() => {
      setJars(prev =>
        prev.map(jar => {
          if (jar.isTreating && jar.treatTimeLeft! > 0) {
            const newTreatTime = jar.treatTimeLeft! - 100;
            if (newTreatTime <= 0) {
              // Treatment finished
              return {
                ...jar,
                isTreating: false,
                treatTimeLeft: 0,
                infected: false,
                infectionDuration: 0
              };
            }
            return { ...jar, treatTimeLeft: newTreatTime };
          }
          return jar;
        })
      );
    }, 100);

    return () => clearInterval(treatmentTimer);
  }, [gameState]);

  // Main game loop - advance months and handle fermentation
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setCurrentMonth(prev => {
        if (prev >= TOTAL_MONTHS) {
          // Calculate final quality
          const inRangeBonus = calculateInRangeBonus();
          const finalQuality = Math.min(100, baseQuality + inRangeBonus);
          const passed = finalQuality >= 80;

          // Change game state to finished but DON'T call onGameEnd yet
          setGameState('finished');
          // Call onGameEnd after a delay so result screen shows first
          // Pass current jars state from ref to parent
          setTimeout(() => {
            onGameEnd(passed, finalQuality, jarsRef.current);
          }, 2000);
          return prev;
        }

        // Advance month
        setStats(s => ({ ...s, currentMonth: prev + 1 }));

        // Natural drift in conditions
        setJars(prev =>
          prev.map(jar => ({
            ...jar,
            pressure: Math.max(20, Math.min(100, jar.pressure + (Math.random() - 0.5) * 10)),
            temperature: Math.max(20, Math.min(40, jar.temperature + (Math.random() - 0.5) * 3)),
            water: Math.max(0, jar.water - Math.random() * 5)
          }))
        );

        return prev + 1;
      });
    }, MONTH_DURATION);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, baseQuality, onGameEnd]);

  // Event generation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    eventLoopRef.current = setInterval(() => {
      // Don't generate events for jars that are treating
      const treatingJars = jars.filter(j => j.isTreating).map(j => j.index);
      const availableJars = [0, 1, 2].filter(idx => !treatingJars.includes(idx));
      
      if (availableJars.length > 0) {
        const newEvent = eventSystem.generateRandomEvent(availableJars);
        if (newEvent && events.filter(e => e.active).length < (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3)) {
          setEvents(prev => [...prev, newEvent]);
          playSound(200, 0.15);
        }
      }
    }, EVENT_CHECK_INTERVAL);

    return () => clearInterval(eventLoopRef.current);
  }, [gameState, difficulty]);

  // Event timeout handling
  useEffect(() => {
    const now = Date.now();
    const expiredEvents = events.filter(e => e.active && now - e.createdAt > e.duration);

    if (expiredEvents.length > 0) {
      // Event expired - jar takes damage
      expiredEvents.forEach(expiredEvent => {
        setJars(prev =>
          prev.map((jar, idx) =>
            idx === expiredEvent.jarIndex
              ? {
                  ...jar,
                  health: Math.max(0, jar.health - (expiredEvent.severity === 'critical' ? 30 : 15)),
                  quality: Math.max(0, jar.quality - (expiredEvent.severity === 'critical' ? 20 : 10)),
                  infected: expiredEvent.type === 'flies' ? true : jar.infected
                }
              : jar
          )
        );

        showFeedback('failed', `⚠️ ${getEventName(expiredEvent.type)} không xử lý!`, expiredEvent.jarIndex);
      });

      setEvents(prev => prev.filter(e => !expiredEvents.includes(e)));
    }
  }, [events]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      // Prevent actions if jar is treating
      if (jars[activeJar].isTreating) return;

      // Handle H key separately for swat action
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        e.stopPropagation();
        handleJarAction('swat'); // Đuổi ruồi
        return;
      }

      const key = e.key.toLowerCase();
      
      // Prevent default for game keys
      if (['a', 's', 'd', 'j', 'k', 'l', 'i'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (key) {
        case 'a':
          setActiveJar(0); // Chum 1
          break;
        case 's':
          setActiveJar(1); // Chum 2
          break;
        case 'd':
          setActiveJar(2); // Chum 3
          break;
        case 'j':
          handleJarAction('treat'); // Xử lý nhiễm
          break;
        case 'k':
          handleJarAction('vent'); // Xả khí
          break;
        case 'l':
          handleJarAction('drain'); // Lau nước
          break;
        case 'i':
          handleJarAction('cool'); // Hạ nhiệt độ
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, events, jars, activeJar]);

  const handleJarAction = useCallback((action: string) => {
    const jarEvents = events.filter(e => e.jarIndex === activeJar && e.active);

    let success = false;
    let bonus = 0;
    let message = '';
    let wrongAction = false;

    setJars(prev =>
      prev.map((jar, idx) => {
        if (idx !== activeJar) return jar;

        switch (action) {
          case 'treat': // J - Xử lý nhiễm (treatment)
            if (jar.infected) {
              success = true;
              bonus = 0; // Không tăng quality khi xử lý, chỉ ngừng mất
              message = `🔬 Đang xử lý nhiễm (3s)...`;
              playSound(800, 0.2);
              triggerCameraShake();
            } else {
              // Ấn J nhưng không bị nhiễm - hành động sai
              wrongAction = true;
              message = `❌ Chưa bị nhiễm! Chất lượng -8%`;
              playSound(200, 0.1);
            }
            break;

          case 'vent': // K - Xả khí (handle pressure events with different method)
            if (jarEvents.some(e => e.type === 'pressure')) {
              const event = jarEvents.find(e => e.type === 'pressure')!;
              success = true;
              bonus = 8;
              message = `✓ Khí xả ra an toàn!`;
              setEvents(prev => prev.filter(e => e.id !== event.id));
              playSound(600, 0.15);
            } else {
              // Ấn sai nút - giảm quality
              wrongAction = true;
              message = `❌ Hành động sai! Chất lượng -8%`;
              playSound(200, 0.1);
            }
            break;

          case 'drain': // L - Lau nước
            if (jarEvents.some(e => e.type === 'water')) {
              const event = jarEvents.find(e => e.type === 'water')!;
              success = true;
              bonus = 6;
              message = `✓ Nước đã được lau sạch!`;
              setEvents(prev => prev.filter(e => e.id !== event.id));
              playSound(500, 0.12);
            } else {
              // Ấn sai nút - giảm quality
              wrongAction = true;
              message = `❌ Hành động sai! Chất lượng -8%`;
              playSound(200, 0.1);
            }
            break;

          case 'swat': // SPACE - Đuổi ruồi
            if (jarEvents.some(e => e.type === 'flies')) {
              const event = jarEvents.find(e => e.type === 'flies')!;
              success = true;
              bonus = 9;
              message = `✓ Ruồi đã được đuổi!`;
              setEvents(prev => prev.filter(e => e.id !== event.id));
              playSound(700, 0.1);
            } else {
              // Ấn sai nút - giảm quality
              wrongAction = true;
              message = `❌ Hành động sai! Chất lượng -8%`;
              playSound(200, 0.1);
            }
            break;

          case 'cool': // I - Hạ nhiệt độ (handle temperature events)
            if (jarEvents.some(e => e.type === 'temperature')) {
              const event = jarEvents.find(e => e.type === 'temperature')!;
              success = true;
              bonus = 7;
              message = `✓ Nhiệt độ giảm!`;
              setEvents(prev => prev.filter(e => e.id !== event.id));
              playSound(650, 0.1);
            } else {
              // Ấn sai nút - giảm quality
              wrongAction = true;
              message = `❌ Hành động sai! Chất lượng -8%`;
              playSound(200, 0.1);
            }
            break;
        }

        if (success) {
          // Special handling for treatment action
          if (action === 'treat') {
            return {
              ...jar,
              isTreating: true,
              treatTimeLeft: 3000,
              infectionDuration: 0
            };
          }
          
          return {
            ...jar,
            quality: Math.min(100, jar.quality + bonus),
            health: Math.min(100, jar.health + 5),
            pressure: Math.max(20, jar.pressure - 15),
            water: Math.max(0, jar.water - 20),
            temperature: Math.max(25, Math.min(35, jar.temperature + (Math.random() - 0.5) * 2))
          };
        } else if (wrongAction) {
          // Ấn sai nút - giảm 8% quality
          const newQuality = Math.max(0, jar.quality - 8);
          return { ...jar, quality: newQuality };
        }

        return jar;
      })
    );

    if (success) {
      setStats(prev => ({
        ...prev,
        chainCombo: prev.chainCombo + 1,
        successActions: prev.successActions + 1,
        totalActions: prev.totalActions + 1
      }));
      showFeedback('perfect', message, activeJar);
    } else if (wrongAction) {
      setStats(prev => ({
        ...prev,
        chainCombo: 0,
        failedActions: prev.failedActions + 1,
        totalActions: prev.totalActions + 1
      }));
      showFeedback('failed', message, activeJar);
    }
  }, [activeJar, events]);

  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = frequency;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Silent fail
    }
  };

  const triggerCameraShake = () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    if (cameraShakeRef.current) clearTimeout(cameraShakeRef.current);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        gameContainer.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;
      }, i * 50);
    }

    cameraShakeRef.current = setTimeout(() => {
      gameContainer.style.transform = 'translate(0, 0)';
    }, 300);
  };

  const showFeedback = (type: 'perfect' | 'good' | 'failed' | 'info', message: string, jarIndex?: number) => {
    setFeedback({ show: true, type, message, jarIndex });
    setTimeout(() => setFeedback({ show: false, type: 'info', message: '' }), 1500);
  };

  const calculateInRangeBonus = (): number => {
    // Simplified: base bonus on months completed
    return (currentMonth / TOTAL_MONTHS) * 40;
  };

  const getEventName = (type: string): string => {
    const names: Record<string, string> = {
      pressure: 'Áp suất',
      water: 'Nước biển',
      flies: 'Ruồi',
      temperature: 'Nhiệt độ'
    };
    return names[type] || type;
  };

  const gameFailed = jars.some(jar => jar.health <= 0 || jar.quality < 30);

  return (
    <div className="min-h-screen w-full relative overflow-auto bg-gradient-to-b from-[#2a1f17] via-[#1f1410] to-[#2a1f17]">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
      </div>

      <div id="game-container" className="relative min-h-screen transition-transform duration-100">
        {/* Header HUD */}
        <div className="sticky top-0 z-40 bg-card/70 backdrop-blur-xl border-b border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Month */}
              <div className="bg-[#3d2b1f]/60 p-3 rounded-lg border border-[#8b7355]/30">
                <p className="text-xs font-semibold text-[#f5f0e8]">Tháng</p>
                <p className="text-lg font-bold text-[#f5f0e8]">{currentMonth}/{TOTAL_MONTHS}</p>
              </div>

              {/* Time Remaining */}
              <div className={`p-3 rounded-lg border transition-all ${
                (MONTH_DURATION - timeInCurrentMonth) > 2000 
                  ? 'bg-[#5f7c8a]/20 border-[#5f7c8a]/30'
                  : (MONTH_DURATION - timeInCurrentMonth) > 1000
                  ? 'bg-[#b87333]/20 border-[#b87333]/30'
                  : 'bg-[#8b4513]/20 border-[#8b4513]/30 animate-pulse'
              }`}>
                <p className="text-xs font-semibold text-[#f5f0e8]">Thời gian</p>
                <p className={`text-lg font-bold ${
                  (MONTH_DURATION - timeInCurrentMonth) > 2000 
                    ? 'text-[#5f7c8a]'
                    : (MONTH_DURATION - timeInCurrentMonth) > 1000
                    ? 'text-[#b87333]'
                    : 'text-[#8b4513]'
                }`}>
                  {((MONTH_DURATION - timeInCurrentMonth) / 1000).toFixed(1)}s
                </p>
              </div>

              {/* Chain Combo */}
              <div className="bg-[#5f7c8a]/20 p-3 rounded-lg border border-[#5f7c8a]/30">
                <p className="text-xs font-semibold text-[#f5f0e8]">CHAIN</p>
                <p className={`text-lg font-bold ${stats.chainCombo > 0 ? 'text-[#5f7c8a] animate-pulse' : 'text-[#8b7355]'}`}>
                  x{stats.chainCombo}
                </p>
              </div>

              {/* Success Rate */}
              <div className="bg-[#a0522d]/20 p-3 rounded-lg border border-[#a0522d]/30">
                <p className="text-xs font-semibold text-[#f5f0e8]">Thành công</p>
                <p className="text-lg font-bold text-[#a0522d]">
                  {stats.totalActions > 0 ? Math.round((stats.successActions / stats.totalActions) * 100) : 0}%
                </p>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-[#8b7355]/20 p-3 rounded-lg border border-[#8b7355]/30 hover:bg-[#8b7355]/30 transition-colors text-lg font-bold"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>
        </div>

        {/* Jars Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {jars.map((jar, idx) => (
              <div
                key={jar.id}
                onClick={() => setActiveJar(idx)}
                className="relative transition-all duration-300"
              >
                <Jar
                  jar={jar}
                  events={events}
                  isActive={activeJar === idx}
                />
              </div>
            ))}
          </div>

          {/* Feedback Display */}
          {feedback.show && (
            <div className={`
              text-center py-4 px-6 rounded-lg font-bold text-lg mb-6 transition-all duration-300 max-w-md mx-auto
              ${feedback.type === 'perfect' ? 'bg-[#5f7c8a]/20 border border-[#5f7c8a] text-[#5f7c8a]' :
                feedback.type === 'good' ? 'bg-[#b87333]/20 border border-[#b87333] text-[#b87333]' :
                'bg-[#8b4513]/20 border border-[#8b4513] text-[#8b4513]'}
            `}>
              {feedback.message}
            </div>
          )}

          {/* Controls Guide */}
          <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-border p-6 mb-8">
            <h3 className="text-sm font-bold mb-4 text-[#f5f0e8]">Phím điều khiển:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">A</p>
                <p className="text-[#f5f0e8] font-semibold">Chum 1</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">S</p>
                <p className="text-[#f5f0e8] font-semibold">Chum 2</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">D</p>
                <p className="text-[#f5f0e8] font-semibold">Chum 3</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">J</p>
                <p className="text-[#f5f0e8] font-semibold">Xử lý nhiễm</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">K</p>
                <p className="text-[#f5f0e8] font-semibold">Xả khí</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">L</p>
                <p className="text-[#f5f0e8] font-semibold">Lau nước</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">I</p>
                <p className="text-[#f5f0e8] font-semibold">Hạ nhiệt độ</p>
              </div>
              <div className="bg-[#3d2b1f]/60 p-2 rounded">
                <p className="font-bold text-[#5f7c8a]">H</p>
                <p className="text-[#f5f0e8] font-semibold">Đuổi ruồi</p>
              </div>
            </div>
          </div>

          {/* Game Over Alert */}
          {gameFailed && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border p-8 text-center max-w-sm">
                <div className="text-5xl mb-4 animate-bounce">⚠️</div>
                <p className="text-xl font-bold text-[#8b4513] mb-2">Quá trình lên men thất bại!</p>
                <p className="opacity-70 mb-6">Game Over - Chất lượng phải trên 30% và tất cả chum phải sống sót</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#8b4513] hover:bg-[#a0522d] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
