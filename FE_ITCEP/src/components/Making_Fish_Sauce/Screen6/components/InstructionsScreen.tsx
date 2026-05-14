import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface InstructionsScreenProps {
  onComplete: () => void;
}

export function InstructionsScreen({ onComplete }: InstructionsScreenProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    // Cuộn hết khi: scrollHeight - (scrollTop + clientHeight) < 10px
    const isAtBottom = element.scrollHeight - (element.scrollTop + element.clientHeight) < 10;
    setScrolledToBottom(isAtBottom);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden p-4">
      {/* Header */}
      <motion.div
        className="relative z-10 w-full max-w-3xl text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-serif text-amber-100 mb-2">Cách Chơi</h1>
        <p className="text-amber-300/70">Hướng dẫn chi tiết từng bước</p>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl bg-gradient-to-br from-amber-900/20 via-stone-900/40 to-amber-950/20 backdrop-blur-md rounded-3xl border border-amber-700/30 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Scrollable content */}
        <div
          className="max-h-96 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-amber-950"
          onScroll={handleScroll}
        >
          {/* Phase 1 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <h2 className="text-2xl font-serif text-amber-100">Nhập Tâm Thần (12 giây)</h2>
            </div>

            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30 space-y-3">
              <p className="text-amber-200">Chuẩn bị tinh thần theo nhịp thở:</p>
              <div className="space-y-2 text-amber-300/80">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🫁</span>
                  <span><span className="font-bold text-amber-300">Hít vào (4s)</span> - Hình tròn khi phóng to</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⏸️</span>
                  <span><span className="font-bold text-amber-300">Giữ yên (4s)</span> - Giữ nguyên kích thước</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💨</span>
                  <span><span className="font-bold text-amber-300">Thở ra (4s)</span> - Hình tròn teo nhỏ</span>
                </div>
              </div>
              <p className="text-amber-300/60 text-sm">💡 Mục đích: Giúp bạn focus và tập trung cho phần tiếp theo</p>
            </div>
          </motion.div>

          <div className="border-t border-amber-700/30" />

          {/* Phase 2 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <h2 className="text-2xl font-serif text-amber-100">Dãy Thần Thánh (45 giây)</h2>
            </div>

            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30 space-y-3">
              <p className="text-amber-200 font-semibold">Máy sẽ hiển thị dãy phím → Bạn gõ lại chính xác!</p>

              <div className="bg-amber-950/50 rounded-lg p-3 space-y-2 text-sm">
                <p className="text-amber-300">4 Phím Arrow:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-amber-900/30 rounded p-2 text-center">⬆️ UMAMI (Mặn)</div>
                  <div className="bg-amber-900/30 rounded p-2 text-center">⬇️ SALTY (Chua)</div>
                  <div className="bg-amber-900/30 rounded p-2 text-center">⬅️ AROMA (Mùi)</div>
                  <div className="bg-amber-900/30 rounded p-2 text-center">➡️ AFTERTASTE (Vị)</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-amber-300 font-semibold">Cách hoạt động:</p>
                <div className="space-y-1 text-amber-300/80 text-sm">
                  <div>• Máy hiển thị 4 phím đầu tiên (0.4s/phím)</div>
                  <div>• Bạn gõ lại chính xác → <span className="text-green-400">✓ +10-20 pts</span></div>
                  <div>• Phím sai → <span className="text-red-400">✗ Mistake -15%</span>, restart</div>
                  <div>• 3 lỗi = GAME OVER 💀</div>
                </div>
              </div>

              <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50">
                <p className="text-yellow-300 text-sm">
                  📈 <span className="font-bold">Progression:</span> Sau mỗi dãy đúng, sẽ thêm 1 phím (4→5→6→...)
                </p>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                <p className="text-blue-300 text-sm">
                  ⚡ <span className="font-bold">Speed Bonus:</span> Gõ càng nhanh → Điểm càng cao (Max 3.0x multiplier)
                </p>
              </div>
            </div>
          </motion.div>

          <div className="border-t border-amber-700/30" />

          {/* Scoring */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <h2 className="text-2xl font-serif text-amber-100">Hệ Thống Điểm</h2>
            </div>

            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg p-3 text-center">
                  <div className="text-xl font-serif text-white">500+</div>
                  <div className="text-sm text-amber-100">S+ Di sản Vàng</div>
                </div>
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg p-3 text-center">
                  <div className="text-xl font-serif text-white">400+</div>
                  <div className="text-sm text-gray-100">S Di sản Bạc</div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-3 text-center">
                  <div className="text-xl font-serif text-white">300+</div>
                  <div className="text-sm text-orange-100">A Nghệ Nhân</div>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-3 text-center">
                  <div className="text-xl font-serif text-white">200+</div>
                  <div className="text-sm text-amber-100">B Học Việc</div>
                </div>
              </div>

              <p className="text-amber-300/70 text-sm text-center">
                🎯 <span className="text-amber-300">Cần ≥ 300 điểm để Thắng!</span>
              </p>
            </div>
          </motion.div>

          <div className="border-t border-amber-700/30" />

          {/* Tips */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                💡
              </div>
              <h2 className="text-2xl font-serif text-amber-100">Mẹo Chơi</h2>
            </div>

            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30 space-y-2">
              <div className="flex gap-3 items-start">
                <span className="text-xl">🧠</span>
                <p className="text-amber-200 text-sm">Ghi nhớ: Xem kỹ dãy phím, ghi nhớ thứ tự trước khi gõ</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-xl">⚡</span>
                <p className="text-amber-200 text-sm">Gõ nhanh: Tốc độ nhanh = Bonus điểm cao</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-xl">🎯</span>
                <p className="text-amber-200 text-sm">Tập trung: Tắt âm, loại bỏ xao nhãng xung quanh</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-xl">✅</span>
                <p className="text-amber-200 text-sm">Chính xác hơn tốc độ: 1 phím sai = Phải restart, mất thời gian</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {!scrolledToBottom && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-950 via-amber-950/50 to-transparent flex items-end justify-center pb-2 pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="text-amber-400 w-6 h-6" />
          </motion.div>
        )}
      </motion.div>

      {/* Start Button */}
      <motion.div
        className="relative z-10 mt-8 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolledToBottom ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={onComplete}
          disabled={!scrolledToBottom}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-lg transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={scrolledToBottom ? { scale: 1.05, y: -2 } : {}}
          whileTap={scrolledToBottom ? { scale: 0.95 } : {}}
        >
          {scrolledToBottom ? '✓ Tôi Đã Hiểu - Bắt Đầu Chơi' : '👇 Cuộn Xuống Để Tiếp Tục'}
        </motion.button>
      </motion.div>
    </div>
  );
}
