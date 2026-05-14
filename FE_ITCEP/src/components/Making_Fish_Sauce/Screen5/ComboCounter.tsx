import { motion, AnimatePresence } from 'motion/react';

interface ComboCounterProps {
  comboCount: number;
  maxCombo: number;
  masterTouch: boolean;
}

export function ComboCounter({ comboCount, maxCombo, masterTouch }: ComboCounterProps) {
  return (
    <div className="relative w-full">
      <AnimatePresence>
        {comboCount > 0 && (
          <motion.div
            className="text-center py-4 px-4 rounded-lg bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-400/40 backdrop-blur-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div
              className="text-4xl font-bold text-amber-300"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.4, repeat: comboCount > 0 ? 1 : 0 }}
            >
              COMBO x{comboCount}
            </motion.div>
            <div className="text-sm text-amber-200 mt-1">
              {comboCount}/{maxCombo}
            </div>

            {/* Progress bar */}
            <div className="mt-2 w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-400"
                initial={{ width: '0%' }}
                animate={{ width: `${(comboCount / maxCombo) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {masterTouch && (
        <motion.div
          className="mt-3 text-center py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/50 backdrop-blur-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], textShadow: ['0 0 0px rgba(168, 85, 247, 0)', '0 0 20px rgba(168, 85, 247, 1)', '0 0 0px rgba(168, 85, 247, 0)'] }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-purple-300"
          >
            ✨ MASTER'S TOUCH! ✨
          </motion.div>
          <div className="text-xs text-purple-200 mt-1">+20% Chất Lượng Thêm!</div>
        </motion.div>
      )}
    </div>
  );
}
