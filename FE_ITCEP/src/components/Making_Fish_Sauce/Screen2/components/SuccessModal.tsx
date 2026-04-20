import { motion } from 'motion/react';
import { Trophy, Star, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface SuccessModalProps {
  score: number;
  combo: number;
  onClose: () => void;
}

export function SuccessModal({ score, combo, onClose }: SuccessModalProps) {
  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#00A8E8', '#0077B6', '#FFD700', '#FFA500'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#00A8E8', '#0077B6', '#FFD700', '#FFA500'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-12 shadow-2xl max-w-2xl w-full mx-4 border-4 border-blue-300/50"
        initial={{ scale: 0.5, rotate: -10, y: 100 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-50" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-50" />

        {/* Trophy icon */}
        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center mt-8">
          {/* Stars */}
          <motion.div
            className="flex justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-2">
              Hoàn thành xuất sắc!
            </h2>
            <p className="text-xl text-blue-600 mb-8">
              Excellent Completion!
            </p>
          </motion.div>

          {/* Score */}
          <motion.div
            className="bg-white/80 rounded-2xl p-8 mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-blue-600 mb-1">Tổng điểm / Total Score</p>
                  <motion.p
                    className="text-5xl font-bold text-blue-900"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    {score}
                  </motion.p>
                </div>
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>

              {combo > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                  <motion.div
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Zap className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm text-orange-600 font-semibold">Best Combo</p>
                      <p className="text-3xl font-bold text-orange-600">{combo}x</p>
                    </div>
                    <Zap className="w-6 h-6 text-orange-500" />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Cultural stamp */}
          <motion.div
            className="inline-block bg-gradient-to-br from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold mb-8 shadow-lg"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 1.2 }}
          >
            ✓ Truyền thống Nam Ô • Nam Ô Heritage
          </motion.div>

          {/* Educational message */}
          <motion.div
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">📚 Bạn đã học được:</span> Việc rửa cá bằng nước biển không chỉ làm sạch
              mà còn giúp giữ nguyên vị ngọt tự nhiên và độ tươi của cá cơm - đây là bước quan trọng trong quy trình
              làm nước mắm Nam Ô truyền thống tại Đà Nẵng.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Washing with sea water preserves the natural sweetness and freshness - a crucial step in traditional fish sauce making.
            </p>
          </motion.div>

          {/* Continue button */}
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            Tiếp tục • Continue
          </motion.button>
        </div>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-400/40 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
