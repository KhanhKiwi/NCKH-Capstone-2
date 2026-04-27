import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackToastProps {
  message: string | null;
}

export function FeedbackToast({ message }: FeedbackToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-20 sm:top-24 md:top-28 left-4 right-4 sm:left-1/4 sm:right-1/4 bg-gradient-to-br from-[#4a3a2a]/90 to-[#3d2a1f]/90 backdrop-blur-xl border-2 border-[#d4a575] rounded-lg p-4 md:p-5 shadow-2xl z-50"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d9a574]/25 flex items-center justify-center flex-shrink-0 border border-[#d9a574]/50">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 1 }}
              >
                <AlertTriangle className="w-4 h-4 text-[#d9a574]" strokeWidth={2.5} />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <motion.p
                className="text-xs sm:text-sm md:text-base text-[#f5ebe0] leading-relaxed tracking-wide break-words"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {message}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
