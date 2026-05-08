import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { levelsService } from '../../../../api/levels/levelsService';
import { progressService } from '../../../../api/progress/progressService';

interface WinScreenProps {
  quality: number;
  userId: number | null;
}

export function WinScreen({ quality, userId }: WinScreenProps) {
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      if (userId) {
        // Get level 3 from fish sauce village (village_id = 6)
        const levels = await levelsService.getByVillage(6, userId);
        const level3 = levels.find((l: any) => l.level_number === 3);
        
        if (level3) {
          // Save progress for level 3
          await progressService.saveProgress({
            level_id: level3.level_id,
            status: 'completed',
            score: quality
          });
          
          // Unlock level 4
          const level4 = levels.find((l: any) => l.level_number === 4);
          if (level4) {
            await progressService.unlockLevel(level4.level_id);
          }
          
          console.log('[Screen3] Level 3 completed, Level 4 unlocked!');
        }
      }
    } catch (error) {
      console.error('[Screen3] Error saving progress:', error);
    }
    
    // Navigate to next level
    navigate('/game/close-jar-ferment');
  };

  const getEncouragingMessage = (q: number) => {
    if (q >= 90) {
      return {
        icon: '🏆',
        title: 'Tiệp Cực Tuyệt Vời!',
        message: 'Bạn đã tạo ra một đốc mắm chuẩn bản! Quá trình lên men 3-6 tháng sẽ tạo ra hương vị tuyệt vời.',
        color: 'from-[#ffd700] to-[#ffed4e]',
      };
    } else if (q >= 80) {
      return {
        icon: '⭐',
        title: 'Công Việc Tốt!',
        message: 'Chất lượng tốt! Nước mắm của bạn sẽ có hương vị nhẹ nhàng sau 3-6 tháng lên men.',
        color: 'from-[#87ceeb] to-[#e0ffff]',
      };
    } else if (q >= 70) {
      return {
        icon: '👍',
        title: 'Hoàn Thành!',
        message: 'Bạn đã hoàn thành công đoạn ướp cá. Quá trình lên men sẽ cải thiện chất lượng hơn nữa.',
        color: 'from-[#90ee90] to-[#98fb98]',
      };
    } else {
      return {
        icon: '😊',
        title: 'Bạn Đã Cố Gắng!',
        message: 'Chất lượng có thể tốt hơn, nhưng bạn vẫn có thể học hỏi từ lần này. Hãy thử lại!',
        color: 'from-[#ffa07a] to-[#ffb347]',
      };
    }
  };

  const msg = getEncouragingMessage(quality);

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
        {/* Celebration Animation */}
        {quality >= 80 && (
          <>
            <motion.div
              className="absolute -top-8 left-1/4 text-4xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -top-8 right-1/4 text-4xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            >
              🎉
            </motion.div>
          </>
        )}

        {/* Icon */}
        <motion.div
          className="text-5xl sm:text-6xl text-center mb-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {msg.icon}
        </motion.div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] mb-2">
          {msg.title}
        </h1>

        {/* Quality Display */}
        <motion.div
          className="bg-[#1a1a1a]/40 rounded-lg p-3 mb-3 text-center border-2 border-[#1a1a1a]/50"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-[#1a1a1a]/70 font-semibold mb-1">CHẤT LƯỢNG CUỐI CÙNG</p>
          <p className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-1">
            {Math.round(quality)}%
          </p>
          <div className="flex gap-1 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  (i + 1) * 20 <= quality
                    ? 'bg-[#d4af37]'
                    : 'bg-[#1a1a1a]/20'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Message */}
        <p className="text-center text-sm sm:text-base text-[#1a1a1a] mb-4 leading-relaxed font-medium">
          {msg.message}
        </p>

        {/* Tips */}
        {quality < 90 && (
          <motion.div
            className="bg-[#1a1a1a]/30 rounded-lg p-2 mb-4 border-l-4 border-[#d4af37]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-[#1a1a1a]/80 font-semibold">
              💡 Lần sau:
            </p>
            <ul className="text-xs text-[#1a1a1a]/70 mt-1 space-y-0.5 list-disc list-inside">
              {quality < 70 && (
                <>
                  <li>Chọn tỷ lệ muối chính xác</li>
                  <li>Trộn đều hơn</li>
                </>
              )}
              {quality < 80 && <li>Nén chặt hợp lực</li>}
              <li>Phủ muối trên nắp</li>
            </ul>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 sm:py-3 bg-[#1a1a1a] text-[#d4af37] font-bold rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm sm:text-base"
          >
            ➡️ Đi Tiếp
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
          ✓ Công đoạn 3 hoàn thành
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
