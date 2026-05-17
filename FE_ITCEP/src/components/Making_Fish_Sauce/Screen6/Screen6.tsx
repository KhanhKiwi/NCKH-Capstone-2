import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';
import { useAI } from '../../../contexts/AIContext';
import { IntroScreen } from './components/IntroScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { BreathingPhase } from './components/BreathingPhase';
import { SequencePhase } from './components/SequencePhase';
import { ResultScreen } from './components/ResultScreen';

type GamePhase = 'intro' | 'instructions' | 'breathing' | 'sequence' | 'result';

interface Screen6Props {
  challengeMode?: boolean;
  onComplete?: () => void;
}

export default function Screen6({ challengeMode = false, onComplete }: Screen6Props) {
  const { triggerEvent } = useAI();
  const userId = getUserId();
  const completionEventRef = useRef(false);
  // Skip intro & instructions in challenge mode — go straight to breathing exercise
  const [gamePhase, setGamePhase] = useState<GamePhase>(challengeMode ? 'sequence' : 'intro');
  const [finalScore, setFinalScore] = useState(0);

  const NAM_O_LEVEL_6_AI_CONTEXT = {
    village_name: 'Nam Ô',
    craft_name: 'Nước mắm truyền thống',
    phase_name: 'Hoàn thiện sản phẩm',
    cultural_context:
      'Nam Ô nổi tiếng với nghề làm nước mắm truyền thống, trong đó công đoạn hoàn thiện giúp đánh giá hương vị, độ ổn định và chất lượng thành phẩm.',
  };

  const triggerSequenceAI = (score: number) => {
    if (completionEventRef.current) return;
    completionEventRef.current = true;
    if (score >= 90) {
      triggerEvent({
        event: 'excellent',
        level: 6,
        step: 1,
        ...NAM_O_LEVEL_6_AI_CONTEXT,
        step_name: 'Đánh giá thành phẩm xuất sắc',
        learning_goal:
          'Người chơi đã hoàn thiện nước mắm với chất lượng rất cao và thể hiện sự kiểm soát tốt trong giai đoạn cuối.',
      }).catch(() => {});
    } else if (score >= 80) {
      triggerEvent({
        event: 'high_score',
        level: 6,
        step: 1,
        ...NAM_O_LEVEL_6_AI_CONTEXT,
        step_name: 'Đánh giá thành phẩm tốt',
        learning_goal: 'Người chơi đã hoàn thành công đoạn cuối với chất lượng tốt và sản phẩm ổn định.',
      }).catch(() => {});
    } else if (score >= 60) {
      triggerEvent({
        event: 'almost_success',
        level: 6,
        step: 1,
        ...NAM_O_LEVEL_6_AI_CONTEXT,
        step_name: 'Thành phẩm gần đạt yêu cầu',
        learning_goal:
          'Người chơi đã tiến gần đến tiêu chuẩn thành phẩm và chỉ cần cải thiện một vài chi tiết cuối.',
      }).catch(() => {});
    } else {
      triggerEvent({
        event: 'fail_many',
        level: 6,
        step: 1,
        fail_count: 1,
        ...NAM_O_LEVEL_6_AI_CONTEXT,
        step_name: 'Thành phẩm chưa đạt yêu cầu',
        learning_goal:
          'Cần luyện thêm để kiểm soát nhịp thao tác và hoàn thiện quá trình đánh giá thành phẩm tốt hơn.',
      }).catch(() => {});
    }
  };

  const saveProgress = async (score: number) => {
    try {
      if (userId) {
        const levels = await levelsService.getByVillage(2, userId);
        const level6 = levels.find((l: { level_number?: number }) => l.level_number === 6);

        if (level6) {
          await progressService.saveProgress({
            user_id: userId,
            level_id: level6.level_id,
            status: 'completed',
            score: Math.round(score),
          });

          console.log('[Screen6] Level 6 (FINAL) completed with score:', score);
        }
      }
    } catch (error) {
      console.error('[Screen6] Error saving progress:', error);
    }
  };

  const handleIntroComplete = () => {
    setGamePhase('instructions');
  };

  const handleInstructionsComplete = () => {
    setGamePhase('breathing');
  };

  const handleBreathingComplete = () => {
    setGamePhase('sequence');
  };

  const handleSequenceComplete = async (score: number) => {
    setFinalScore(score);
    triggerSequenceAI(score);
    await saveProgress(score);
    setGamePhase('result');
    // In challenge mode, notify parent after showing result briefly
    if (challengeMode && onComplete) {
      setTimeout(() => onComplete(), 3000);
    }
  };

  const handlePlayAgain = () => {
    completionEventRef.current = false;
    setFinalScore(0);
    setGamePhase('intro');
  };

  return (
    <AnimatePresence mode="wait">
      {gamePhase === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IntroScreen onStart={handleIntroComplete} />
        </motion.div>
      )}

      {gamePhase === 'instructions' && (
        <motion.div
          key="instructions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InstructionsScreen onComplete={handleInstructionsComplete} />
        </motion.div>
      )}

      {gamePhase === 'breathing' && (
        <motion.div
          key="breathing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BreathingPhase onPhaseComplete={handleBreathingComplete} duration={12} />
        </motion.div>
      )}

      {gamePhase === 'sequence' && (
        <motion.div
          key="sequence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SequencePhase onPhaseComplete={handleSequenceComplete} duration={45} />
        </motion.div>
      )}

      {gamePhase === 'result' && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultScreen score={finalScore} onPlayAgain={handlePlayAgain} challengeMode={challengeMode} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
