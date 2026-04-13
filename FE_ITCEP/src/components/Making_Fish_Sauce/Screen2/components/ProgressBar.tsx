import { motion } from 'motion/react';
import { Droplet } from 'lucide-react';

interface ProgressBarProps {
  cleanliness: number;
}

export function ProgressBar({ cleanliness }: ProgressBarProps) {
  const waterColor = cleanliness > 70
    ? 'from-cyan-300 to-blue-400'
    : cleanliness > 40
    ? 'from-blue-300 to-cyan-400'
    : 'from-gray-400 to-gray-500';

  return (
    <div className="relative z-20 px-8 pb-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-200/50">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Droplet className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-900">Độ sạch tổng thể</h3>
                <p className="text-sm text-blue-600">Overall Cleanliness</p>
              </div>
            </div>

            <motion.div
              className="text-3xl font-bold text-blue-900"
              key={Math.floor(cleanliness)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {Math.floor(cleanliness)}%
            </motion.div>
          </div>

          {/* Progress bar container */}
          <div className="relative h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner border-2 border-gray-300/50">
            {/* Water fill */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${waterColor} transition-colors duration-500`}
              style={{ height: `${cleanliness}%` }}
            >
              {/* Water surface wave */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-2 bg-white/30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Bubbles rising */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white/40 rounded-full"
                  style={{
                    left: `${10 + i * 15}%`,
                    bottom: '0%',
                  }}
                  animate={{
                    y: [0, -60],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Percentage markers */}
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-2 pointer-events-none">
              {[0, 25, 50, 75, 100].map((mark) => (
                <div key={mark} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-gray-400/50" />
                  <span className="text-xs text-gray-500 mt-1">{mark}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status message */}
          <motion.div
            className="mt-4 text-center"
            key={cleanliness > 70 ? 'excellent' : cleanliness > 40 ? 'good' : 'start'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-medium text-blue-900">
              {cleanliness > 85 ? (
                '🎉 Xuất sắc! Cá rất sạch!'
              ) : cleanliness > 70 ? (
                '✨ Tốt lắm! Tiếp tục nhé!'
              ) : cleanliness > 40 ? (
                '💧 Đang tiến bộ!'
              ) : (
                '🐟 Hãy rửa sạch cá bằng nước biển!'
              )}
            </p>
            {cleanliness > 70 && (
              <p className="text-xs text-blue-600 mt-1">
                Rửa kỹ bằng nước biển giúp giữ độ tươi và vị ngọt tự nhiên của cá!
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
