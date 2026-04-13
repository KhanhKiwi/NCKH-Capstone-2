import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lightbulb, Info } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  feedbackMessage: string;
}

export function Sidebar({ feedbackMessage }: SidebarProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <motion.div
      className="absolute right-8 top-1/2 -translate-y-1/2 w-80 space-y-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      {/* Instructions panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Hướng dẫn</h3>
            <p className="text-xs text-blue-600">Instructions</p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-1">•</span>
            <span>Nhấp vào cá để rửa bằng nước biển tươi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-1">•</span>
            <span>Làm sạch tất cả cá trước khi hết giờ</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-1">•</span>
            <span>Đạt độ sạch 85% để hoàn thành xuất sắc</span>
          </li>
        </ul>
      </div>

      {/* Hint button */}
      <motion.button
        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowHint(!showHint)}
      >
        <Lightbulb className="w-5 h-5" />
        <span>Gợi ý</span>
        <span className="text-sm opacity-80">Hint</span>
      </motion.button>

      {/* Hint content */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-2">💡 Mẹo từ nghệ nhân:</p>
                <p className="leading-relaxed">
                  Nước biển tự nhiên có muối giúp loại bỏ chất nhờn và giữ vị ngọt của cá cơm.
                  Rửa nhanh nhưng kỹ để cá không bị nhão!
                </p>
                <p className="text-xs text-amber-700 mt-2 italic">
                  Sea water naturally cleanses and preserves the fish's sweetness
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback panel */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold mb-1">Phản hồi</p>
                <p className="text-sm leading-relaxed opacity-95">{feedbackMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cultural note */}
      <motion.div
        className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-5 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs text-teal-800 leading-relaxed">
          <span className="font-semibold">🏖️ Truyền thống Nam Ô:</span> Cá cơm được rửa sạch bằng nước biển ngay sau khi đánh bắt,
          đây là bí quyết để làm nước mắm thơm ngon đặc trưng của vùng biển Đà Nẵng.
        </p>
      </motion.div>
    </motion.div>
  );
}
