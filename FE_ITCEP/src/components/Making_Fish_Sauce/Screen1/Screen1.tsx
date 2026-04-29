import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, AnimatePresence } from 'motion/react';

// Fish type definitions
type FishType = 'correct' | 'wrong' | 'spoiled';

interface Fish {
  id: string;
  type: FishType;
  x: number;
  y: number;
  speed: number;
  depth: number;
  angle: number;
  scale: number;
}

export default function Screen1() {
  const navigate = useNavigate();
  
  const [quality, setQuality] = useState(0); // 0-100% quality rating
  const [fishCaught, setFishCaught] = useState(0); // Count of correct fish
  const [wrongCount, setWrongCount] = useState(0); // Count of wrong fish (3 = lose)
  const [target] = useState(12); // Need 12 correct fish to win
  const [time, setTime] = useState(90); // 90 seconds
  const [fish, setFish] = useState<Fish[]>([]);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [screenShake, setScreenShake] = useState(0);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lossReason, setLossReason] = useState<'timeout' | 'spoiled' | null>(null);

  const boatY = useMotionValue(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Generate initial fish
  useEffect(() => {
    const initialFish: Fish[] = [];
    for (let i = 0; i < 12; i++) {
      initialFish.push(createFish());
    }
    setFish(initialFish);
  }, []);

  // Fish animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFish(prev =>
        prev.map(f => {
          let newX = f.x + f.speed;
          let newAngle = f.angle;

          // Wrap around screen
          if (newX > 110) {
            newX = -10;
            newAngle = Math.random() * 0.3 - 0.15;
          }

          return {
            ...f,
            x: newX,
            y: f.y + Math.sin(newX * 0.1) * 0.3,
            angle: newAngle
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Boat bobbing animation
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      boatY.set(Math.sin(time * 0.8) * 8 + Math.sin(time * 1.3) * 4);
    }, 30);

    return () => clearInterval(interval);
  }, [boatY]);

  // Timer countdown
  useEffect(() => {
    if (time <= 0 || gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setGameStatus('lost');
          setLossReason('timeout');
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, gameStatus]);

  // Create new fish
  function createFish(): Fish {
    const types: FishType[] = ['correct', 'correct', 'correct', 'wrong', 'spoiled'];
    const type = types[Math.floor(Math.random() * types.length)];
    const depth = 0.5 + Math.random() * 0.5;

    return {
      id: Math.random().toString(36),
      type,
      x: Math.random() * 100,
      y: 30 + Math.random() * 50,
      speed: (0.3 + Math.random() * 0.4) * (type === 'correct' ? 1.3 : 1),
      depth,
      angle: Math.random() * 0.2 - 0.1,
      scale: depth * (0.8 + Math.random() * 0.4)
    };
  }

  // Catch fish handler
  function catchFish(fishId: string, fishData: Fish) {
    if (gameStatus !== 'playing') return;

    const fishElement = document.getElementById(fishId);
    if (!fishElement) return;

    const rect = fishElement.getBoundingClientRect();

    // Remove fish
    setFish(prev => prev.filter(f => f.id !== fishId));

    if (fishData.type === 'correct') {
      // Correct fish: +8.33% quality (12 fish = 100%)
      const newQuality = Math.min(100, quality + 8.33);
      const newFishCaught = fishCaught + 1;
      
      setQuality(newQuality);
      setFishCaught(newFishCaught);
      createSplashParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      // Check win condition
      if (newFishCaught >= target) {
        setGameStatus('won');
      }
      
      setTimeout(() => setFish(prev => [...prev, createFish()]), 500);
    } else {
      // Wrong/spoiled fish: increase wrong count
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      // Check lose condition: 3 wrong fish = lose
      if (newWrongCount >= 3) {
        setGameStatus('lost');
        setLossReason('spoiled');
      }
      
      setScreenShake(Date.now());
      setTimeout(() => setScreenShake(0), 200);
      setTimeout(() => setFish(prev => [...prev, createFish()]), 500);
    }
  }

  // Create splash particles
  function createSplashParticles(x: number, y: number) {
    const newParticles = Array.from({ length: 8 }, () => ({
      id: Math.random().toString(36),
      x,
      y
    }));

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }

  // Fish hover handler
  function handleFishHover(e: React.MouseEvent, fishData: Fish) {
    const messages = {
      correct: 'Cá cơm than tươi - Nhấn để bắt!',
      wrong: 'Loại cá không phù hợp',
      spoiled: 'Cá không đủ tươi'
    };

    setTooltip({
      text: messages[fishData.type],
      x: e.clientX,
      y: e.clientY - 60
    });
  }

  const shakeX = screenShake ? Math.sin(Date.now() * 0.1) * 4 : 0;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sky Layer with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFE5B4] via-[#FFD4A3] to-[#87CEEB]" />

      {/* Clouds Layer */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ x: [0, 100] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-0 w-[200px] h-[80px] bg-white/40 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, 80] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[20%] left-[30%] w-[250px] h-[100px] bg-white/30 rounded-full blur-2xl"
        />
      </div>

      {/* Volumetric Light Rays */}
      <div className="absolute top-0 left-[20%] w-[300px] h-[400px] bg-gradient-to-b from-[#FFD700]/20 to-transparent rotate-12 blur-xl pointer-events-none" />
      <div className="absolute top-0 left-[50%] w-[250px] h-[500px] bg-gradient-to-b from-[#FFA500]/15 to-transparent -rotate-6 blur-xl pointer-events-none" />

      {/* Ocean Layer */}
      <div className="absolute inset-0 top-[30%]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C7DA0] via-[#1B4965] to-[#0D2C3D]" />

        {/* Wave animations */}
        <motion.div
          animate={{ x: [-100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.1) 50px, transparent 100px)'
          }}
        />
      </div>

      {/* Atmospheric Haze */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B8D4E8]/10 to-transparent pointer-events-none" />

      {/* HUD - Glassmorphism Top Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-xl bg-[#FFF8E7]/65 rounded-3xl px-8 py-4 shadow-2xl border border-white/40"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\' /%3E%3C/svg%3E")'
          }}
        >
          <div className="flex items-center gap-8">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C7DA0] to-[#1B4965] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#7F5539]/60 tracking-wide uppercase">Thời gian</div>
                <div className="text-xl font-semibold text-[#1B4965]">
                  {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Quality Bar */}
            <div className="flex items-center gap-3 min-w-[280px]">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-[#7F5539]/60 mb-1 tracking-wide uppercase">
                  <span>Sản Lượng</span>
                  <span>{Math.round(quality)}/100</span>
                </div>
                <div className="h-3 bg-[#1B4965]/20 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full relative transition-all duration-300"
                    style={{
                      width: `${quality}%`,
                      background: quality < 40 ? 'linear-gradient(to right, #FF4D4F, #FF7875)' : 'linear-gradient(to right, #00C897, #00E5A8)'
                    }}
                  >
                    <motion.div
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Fish Caught Counter */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD166] to-[#EEC88F] flex items-center justify-center shadow-lg">
                <span className="text-xl">🐟</span>
              </div>
              <div>
                <div className="text-xs text-[#7F5539]/60 tracking-wide uppercase">Cá Bắt</div>
                <div className="text-xl font-semibold text-[#1B4965]">{fishCaught}/{target}</div>
              </div>
            </div>

            {/* Wrong Fish Counter */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4D4F] to-[#FF7875] flex items-center justify-center shadow-lg">
                <span className="text-xl">❌</span>
              </div>
              <div>
                <div className="text-xs text-[#7F5539]/60 tracking-wide uppercase">Sai Bắt</div>
                <div className="text-xl font-semibold text-[#FF4D4F]">{wrongCount}/3</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tutorial Card - Diegetic UI */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-32 left-6 z-40 backdrop-blur-xl bg-[#FFF8E7]/75 rounded-2xl px-6 py-4 shadow-2xl border border-white/40 max-w-[320px]"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        <h3 className="text-lg font-semibold text-[#1B4965] mb-2">🎯 Chọn cá cơm than tươi</h3>
        <div className="text-sm text-[#7F5539] space-y-1.5">
          <p>💡 <span className="text-[#1B4965]">Cá nhỏ, ánh bạc, bơi nhanh</span></p>
          <p>📘 <span className="text-[#2C7DA0]/80">Mùa cá: tháng 1-3 âm lịch</span></p>
          <p>✨ <span className="text-[#00C897]">Di chuột để xem chi tiết</span></p>
        </div>
      </motion.div>

      {/* Game World - Fish Area */}
      <motion.div
        ref={gameAreaRef}
        className="absolute inset-0 top-[40%] cursor-pointer"
        style={{ x: shakeX }}
      >
        {/* Fish rendering with depth */}
        {fish.map(f => (
          <motion.div
            key={f.id}
            id={f.id}
            className="absolute cursor-pointer"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: `scale(${f.scale})`,
              filter: `blur(${(1 - f.depth) * 2}px) brightness(${0.7 + f.depth * 0.3})`,
              zIndex: Math.floor(f.depth * 10)
            }}
            whileHover={{
              scale: f.scale * 1.15,
              filter: `blur(0px) brightness(1.2) drop-shadow(0 0 ${f.type === 'correct' ? '12px rgba(255,209,102,0.8)' : '8px rgba(255,77,79,0.5)'})`
            }}
            whileTap={{ scale: f.scale * 0.9 }}
            onClick={() => catchFish(f.id, f)}
            onMouseEnter={(e) => handleFishHover(e, f)}
            onMouseLeave={() => setTooltip(null)}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Fish Shadow */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-2 bg-black/20 rounded-full blur-sm"
              style={{ transform: `translateX(-50%) scaleY(${0.3 + f.depth * 0.2})` }}
            />

            {/* Fish Body */}
            <div className="relative">
              <svg
                width="60"
                height="30"
                viewBox="0 0 60 30"
                className="drop-shadow-lg"
                style={{ transform: `rotate(${f.angle}rad)` }}
              >
                {f.type === 'correct' ? (
                  <>
                    {/* Correct Fish - Silver/Blue shimmer */}
                    <defs>
                      <linearGradient id={`shimmer-${f.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C0D6E8" />
                        <stop offset="50%" stopColor="#E8F4F8" />
                        <stop offset="100%" stopColor="#C0D6E8" />
                      </linearGradient>
                      <filter id={`glow-${f.id}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <ellipse cx="30" cy="15" rx="25" ry="10" fill={`url(#shimmer-${f.id})`} filter={`url(#glow-${f.id})`} />
                    <path d="M 5 15 L 0 10 L 0 20 Z" fill="#A0C0D8" />
                    <circle cx="45" cy="13" r="2" fill="#1B4965" />
                    <motion.circle
                      cx="47"
                      cy="12"
                      r="0.5"
                      fill="white"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                ) : f.type === 'wrong' ? (
                  <>
                    {/* Wrong Fish - Dull gray/green */}
                    <ellipse cx="30" cy="15" rx="25" ry="10" fill="#8FA5A0" />
                    <path d="M 5 15 L 0 10 L 0 20 Z" fill="#7A8F8A" />
                    <circle cx="45" cy="13" r="2" fill="#4A5A55" />
                  </>
                ) : (
                  <>
                    {/* Spoiled Fish - Reddish tint */}
                    <ellipse cx="30" cy="15" rx="25" ry="10" fill="#B8A5A0" opacity="0.8" />
                    <path d="M 5 15 L 0 10 L 0 20 Z" fill="#A08F8A" opacity="0.8" />
                    <circle cx="45" cy="13" r="2" fill="#6A4A45" />
                  </>
                )}
              </svg>

              {/* Shimmer effect for correct fish */}
              {f.type === 'correct' && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2 }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Splash Particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-[#D9F0FF] to-[#2C7DA0]"
              initial={{
                x: p.x,
                y: p.y,
                scale: 1,
                opacity: 1
              }}
              animate={{
                x: p.x + (Math.random() - 0.5) * 100,
                y: p.y + (Math.random() - 0.5) * 100,
                scale: 0,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Boat Layer - Physics-based bobbing */}
      <motion.div
        className="absolute left-1/2 top-[32%] -translate-x-1/2 z-30"
        style={{ y: boatY }}
      >
        <motion.div
          animate={{ rotate: [0, -1, 0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="drop-shadow-2xl"
        >
          <img 
            src="/picture/langmam/43a505bd-814f-42b6-b91c-b1b70facdaef.png" 
            alt="Boat with Fisherman" 
            className="h-[180px] object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none backdrop-blur-lg bg-[#1B4965]/95 text-white px-4 py-2 rounded-xl shadow-2xl text-sm border border-white/20"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Modal */}
      <AnimatePresence>
        {gameStatus === 'won' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE5B4] rounded-3xl p-12 shadow-2xl border-4 border-[#EEC88F] max-w-md text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-bold text-[#1B4965] mb-2">Thắng Cuộc!</h2>
              <p className="text-lg text-[#7F5539] mb-6">
                Bạn bắt được {fishCaught} con cá cơm than tươi không lỗi!
              </p>
              <div className="bg-[#FFF9E6] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">✅ Lý do thắng:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Đạt đủ {target} con cá</li>
                  <li>• Không bắt cá sai/hỏng</li>
                  <li>• Chọn lựa cá tốt</li>
                </ul>
              </div>
              <div className="bg-[#E8F4E8] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">💡 Mẹo cho lần tới:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Tìm cá nhỏ, sáng bạc</li>
                  <li>• Chọn cá bơi nhanh</li>
                  <li>• Tránh cá mờ nhạt hoặc hỏng</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#FFD166] to-[#EEC88F] text-[#1B4965] px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => window.location.reload()}
                >
                  🔄 Chơi lại
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#00C897] to-[#00E5A8] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => navigate('/game/wash-fish')}
                >
                  ➡️ Đi Tiếp
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loss Modal - Timeout */}
      <AnimatePresence>
        {gameStatus === 'lost' && lossReason === 'timeout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE5B4] rounded-3xl p-12 shadow-2xl border-4 border-[#EEC88F] max-w-md text-center"
            >
              <div className="text-7xl mb-4">⏰</div>
              <h2 className="text-4xl font-bold text-[#1B4965] mb-2">Thua Cuộc!</h2>
              <p className="text-lg text-[#7F5539] mb-4">Hết giờ ra khơi rồi!</p>
              <p className="text-sm text-[#5d7a8c] mb-6">Bạn bắt được {fishCaught}/{target} con cá</p>
              
              <div className="bg-[#FFF9E6] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">❌ Lý do thua:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Hết thời gian 90 giây</li>
                  <li>• Chỉ bắt được {fishCaught}/12 con cá</li>
                  <li>• Cần bắt nhanh hơn</li>
                </ul>
              </div>
              
              <div className="bg-[#E8F4E8] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">💡 Cách cải thiện:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Xác định vị trí cá nhanh hơn</li>
                  <li>• Ưu tiên cá sáng bạc ở trên</li>
                  <li>• Click liên tục, không chần chừ</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6B5839] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => navigate('/craft-selection')}
                >
                  ⬅️ Quay lại
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => window.location.reload()}
                >
                  🔄 Chơi lại
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loss Modal - Spoiled (3 wrong fish) */}
      <AnimatePresence>
        {gameStatus === 'lost' && lossReason === 'spoiled' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE5B4] rounded-3xl p-12 shadow-2xl border-4 border-[#EEC88F] max-w-md text-center"
            >
              <div className="text-7xl mb-4">😢</div>
              <h2 className="text-4xl font-bold text-[#1B4965] mb-2">Thua Cuộc!</h2>
              <p className="text-lg text-[#7F5539] mb-4">Bắt quá nhiều cá sai rồi!</p>
              <p className="text-sm text-[#5d7a8c] mb-6">Bạn bắt {wrongCount}/3 con cá không đủ tươi</p>
              
              <div className="bg-[#FFF9E6] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">❌ Lý do thua:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Bắt 3 con cá không tươi</li>
                  <li>• Mỗi cá sai mất 1 trái tim ❤️</li>
                  <li>• Phải chọn cá tươi hoàn toàn</li>
                </ul>
              </div>
              
              <div className="bg-[#E8F4E8] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#2a1a0f] font-semibold mb-2">💡 Cách phân biệt cá tốt:</p>
                <ul className="text-xs text-[#5d7a8c] space-y-1">
                  <li>• Cá tươi: ánh sáng bạc, chuyển động nhanh</li>
                  <li>• Cá sai: màu nhạt, di chuyển chậm</li>
                  <li>• Cá hỏng: mờ, nâu, bơi kỳ lạ</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6B5839] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => navigate('/craft-selection')}
                >
                  ⬅️ Quay lại
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold"
                  onClick={() => window.location.reload()}
                >
                  🔄 Chơi lại
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
