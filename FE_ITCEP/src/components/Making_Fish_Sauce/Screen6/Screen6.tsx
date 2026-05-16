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

export default function Screen6() {
  const { triggerEvent } = useAI();
  const userId = getUserId();
  const completionEventRef = useRef(false);

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [finalScore, setFinalScore] = useState(0);

  const triggerSequenceAI = (score: number) => {
    if (completionEventRef.current) return;
    completionEventRef.current = true;
    if (score >= 90) {
      triggerEvent({ event: 'excellent', level: 6, step: 1 }).catch(() => {});
    } else if (score >= 80) {
      triggerEvent({ event: 'high_score', level: 6, step: 1 }).catch(() => {});
    } else if (score >= 60) {
      triggerEvent({ event: 'almost_success', level: 6, step: 1 }).catch(() => {});
    } else {
      triggerEvent({ event: 'fail_many', level: 6, step: 1, fail_count: 1 }).catch(() => {});
    }
  };

  const saveProgress = async (score: number) => {
    try {
      if (userId) {
        const levels = await levelsService.getByVillage(8, userId);
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
          <ResultScreen score={finalScore} onPlayAgain={handlePlayAgain} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
