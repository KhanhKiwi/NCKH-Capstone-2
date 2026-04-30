import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LossScreenProps {
  reason: 'timeout' | 'low-quality';
  quality?: number;
}

export function LossScreen({ reason, quality = 0 }: LossScreenProps) {
  const navigate = useNavigate();

  const getLossMessage = () => {
    if (reason === 'timeout') {
      return {
        icon: '⏰',
        title: 'Hết Thời Gian!',
        message: 'Bạn đã hết thời gian trước khi hoàn thành công đoạn ướp cá. Hãy nhanh hơn trong lần tiếp theo!',
        color: 'from-[#ff6b6b] to-[#ff8787]',
        tips: [
          'Chọn tỷ lệ muối nhanh hơn',
          'Trộn đều trong thời gian ngắn',
          'Nén chặt hỗn hợp một cách hiệu quả',
        ],
      };
    } else {
      return {
        icon: '😢',
        title: 'Chất Lượng Quá Thấp!',
        message: `Chất lượng của bạn chỉ còn ${Math.round(quality)}%. Bạn cần duy trì chất lượng ít nhất 30% để hoàn thành công đoạn này.`,
        color: 'from-[#ff9999] to-[#ffb3b3]',
        tips: [
          'Chọn tỷ lệ muối chính xác hơn',
          'Trộn muối đều trước khi chuyển',
          'Nén chặt hợp lý để tạo môi trường kỵ khí',
        ],
      };
    }
  };

  const msg = getLossMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* Modal Card */}
      <motion.div
        className={`relative w-full max-w-sm mx-4 p-5 sm:p-6 rounded-xl border-3 border-[#d4af37] bg-gradient-to-br ${msg.color} shadow-2xl`}
        initial={{ y: 30 }}
        animate={{ y: 0 }}
      >
        {/* Icon with sad animation */}
        <motion.div
          className="text-5xl sm:text-6xl text-center mb-3"
          animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {msg.icon}
        </motion.div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] mb-2">
          {msg.title}
        </h1>

        {/* Quality Display (if applicable) */}
        {reason === 'low-quality' && (
          <motion.div
            className="bg-[#1a1a1a]/40 rounded-lg p-3 mb-3 text-center border-2 border-[#1a1a1a]/50"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-[#1a1a1a]/70 font-semibold mb-1">CHẤT LƯỢNG HIỆN TẠI</p>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-1">
              {Math.round(quality)}%
            </p>
            <p className="text-xs text-[#1a1a1a]/60">
              Cần tối thiểu 30%
            </p>
          </motion.div>
        )}

        {/* Message */}
        <p className="text-center text-sm sm:text-base text-[#1a1a1a] mb-3 leading-relaxed font-medium">
          {msg.message}
        </p>

        {/* Encouraging Message */}
        <motion.div
          className="bg-[#1a1a1a]/30 rounded-lg p-2 mb-3 border-l-4 border-[#d4af37]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-[#1a1a1a]/80 font-semibold">
            💪 Động Viên
          </p>
          <p className="text-xs text-[#1a1a1a]/70 mt-1">
            Hãy cố gắng lại! Mỗi lần thất bại là cơ hội để cải thiện.
          </p>
        </motion.div>

        {/* Tips for improvement */}
        {msg.tips.length > 0 && (
          <motion.div
            className="bg-[#1a1a1a]/20 rounded-lg p-2 mb-3 border-l-4 border-[#ff6b6b]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-[#1a1a1a]/80 font-semibold">
              🎯 Gợi Ý
            </p>
            <ul className="text-xs text-[#1a1a1a]/70 space-y-0.5 list-disc list-inside mt-1">
              {msg.tips.slice(0, 2).map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <motion.button
            onClick={() => navigate('/craft-selection')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 sm:py-3 bg-[#1a1a1a] text-[#d4af37] font-bold rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm sm:text-base"
          >
            🔙 Quay Lại
          </motion.button>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 sm:py-3 bg-[#d4af37] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e0c158] transition-colors text-sm sm:text-base"
          >
            🔁 Chơi Lại
          </motion.button>
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-3 text-center text-xs text-[#1a1a1a]/50"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✗ Công đoạn 3 chưa hoàn thành
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
