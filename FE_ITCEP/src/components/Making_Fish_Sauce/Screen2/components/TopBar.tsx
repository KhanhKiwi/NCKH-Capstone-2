import { motion } from 'motion/react';
import { Star, Clock, Trophy, Zap } from 'lucide-react';

interface TopBarProps {
  level: number;
  timeLeft: number;
  score: number;
  stars: number;
  combo: number;
}

export function TopBar({ level, timeLeft, score, stars, combo }: TopBarProps) {
  const progress = (timeLeft / 60) * 100;

  return (
    <div className="relative z-20 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Level indicator */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{level}</span>
              </div>
              <div>
                <div className="text-sm text-blue-900 font-semibold">Màn {level}</div>
                <div className="text-xs text-blue-600">Rửa & Làm sạch cá</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timer with ripple effect */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-4 shadow-lg border border-blue-200/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Clock className="w-8 h-8 text-blue-600" />
                {timeLeft <= 10 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-blue-600">Thời gian còn lại</div>
              </div>
            </div>

            {/* Timer progress bar with water effect */}
            <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 relative"
                style={{ width: `${progress}%` }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Score and stars */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-blue-200/50">
            <div className="flex items-center gap-6">
              {/* Combo display */}
              <div className="flex items-center gap-2">
                {combo > 0 && (
                  <motion.div
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Zap className="w-4 h-4" />
                    {combo}x COMBO
                  </motion.div>
                )}
              </div>

              <div className="w-px h-10 bg-blue-200" />

              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{score}</div>
                  <div className="text-xs text-blue-600">Điểm</div>
                </div>
              </div>

              <div className="w-px h-10 bg-blue-200" />

              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: i <= stars ? 1 : 0.5,
                      rotate: 0,
                      opacity: i <= stars ? 1 : 0.3
                    }}
                    transition={{
                      delay: i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
