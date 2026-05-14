import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { levelsService } from '../../../../api/levels/levelsService';
import { progressService } from '../../../../api/progress/progressService';
import { getUserId } from '../../../../utils/authUtils';

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

export function ResultScreen({ score, onPlayAgain }: ResultScreenProps) {
  const navigate = useNavigate();
  const userId = getUserId();

  // Determine grade
  const getGrade = () => {
    if (score >= 500) return { grade: 'S+', title: 'Di sản Vàng', emoji: '🏆', color: 'from-yellow-500 to-amber-500' };
    if (score >= 400) return { grade: 'S', title: 'Di sản Bạc', emoji: '⭐', color: 'from-gray-400 to-gray-500' };
    if (score >= 300) return { grade: 'A', title: 'Nghệ nhân Tinh Hoa', emoji: '🎖️', color: 'from-orange-400 to-orange-600' };
    if (score >= 200) return { grade: 'B', title: 'Học Việc Lành Nghề', emoji: '📜', color: 'from-amber-400 to-amber-600' };
    return { grade: 'C', title: 'Tiếp Tục Rèn Luyện', emoji: '🔄', color: 'from-stone-400 to-stone-600' };
  };

  const gradeInfo = getGrade();

  // Confetti
  useEffect(() => {
    if (score >= 300) {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#FCD34D', '#FBBF24', '#F59E0B', '#D97706'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [score]);

  // Save progress
  useEffect(() => {
    const saveProgress = async () => {
      try {
        if (!userId) return;

        const levels = await levelsService.getByVillage(8, userId);
        const level6 = levels.find((l: any) => l.level_number === 6);

        if (level6) {
          await progressService.saveProgress({
            user_id: userId,
            level_id: level6.level_id,
            status: 'completed',
            score: Math.min(100, Math.round((score / 500) * 100)),
          });

          console.log('[Screen6] Level 6 completed with score:', score);
        }
      } catch (error) {
        console.error('[Screen6] Error saving progress:', error);
      }
    };

    saveProgress();
  }, [userId, score]);

  const handleGoBack = () => {
    navigate('/craft-selection');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-md w-full text-center space-y-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Trophy/Medal */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${gradeInfo.color} shadow-2xl`}>
            <span className="text-6xl">{gradeInfo.emoji}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-5xl font-serif text-amber-100 mb-2">Hoàn Thành!</h1>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradeInfo.color} bg-clip-text text-transparent`}>
            {gradeInfo.grade} - {gradeInfo.title}
          </p>
        </motion.div>

        {/* Score */}
        <motion.div
          className="bg-amber-900/40 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-amber-400 text-sm mb-3 tracking-widest">TỔNG ĐIỂM</div>
          <motion.div
            className="text-6xl font-serif text-amber-200 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            {score}
          </motion.div>
          <div className="text-amber-300/70 text-sm">/ 500 điểm tối đa</div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-700/30 p-4">
            <div className="text-amber-400 text-xs mb-2">ĐIỂM CHUẨN HOÁ</div>
            <div className="text-2xl text-amber-200 font-serif">{Math.min(100, Math.round((score / 500) * 100))}%</div>
          </div>
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-700/30 p-4">
            <div className="text-amber-400 text-xs mb-2">XẾP HẠNG</div>
            <div className="text-2xl text-amber-200 font-serif">{gradeInfo.grade}</div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="bg-amber-900/20 backdrop-blur-sm rounded-xl border border-amber-700/30 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-amber-200 text-lg leading-relaxed">
            {score >= 400
              ? '🏆 Bạn đã trở thành một nghệ nhân mắm nam ô thực thụ!'
              : score >= 300
              ? '⭐ Kỹ năng của bạn rất ấn tượng! Hãy tiếp tục rèn luyện.'
              : score >= 200
              ? '📜 Bạn đang trên con đường trở thành một nghệ nhân.'
              : '🔄 Hãy cố gắng hơn nữa! Bạn sẽ thành công.'}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-lg transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Chơi Lại
          </motion.button>

          <motion.button
            onClick={handleGoBack}
            className="flex-1 px-6 py-4 bg-amber-900/40 border border-amber-700/50 text-amber-200 rounded-lg font-semibold hover:bg-amber-900/60 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Quay Lại
          </motion.button>
        </motion.div>

        {/* Footer message */}
        <motion.p
          className="text-amber-300/60 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Di sản mắm Nam Ô đã được hoàn thiện!
        </motion.p>
      </motion.div>
    </div>
  );
}
