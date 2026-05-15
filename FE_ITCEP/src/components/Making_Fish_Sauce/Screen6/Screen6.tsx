import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroScreen } from './components/IntroScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { BreathingPhase } from './components/BreathingPhase';
import { SequencePhase } from './components/SequencePhase';
import { ResultScreen } from './components/ResultScreen';

type GamePhase = 'intro' | 'instructions' | 'breathing' | 'sequence' | 'result';

interface Screen6Props {
  challengeMode?: boolean;
}

export default function Screen6({ challengeMode = false }: Screen6Props) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [finalScore, setFinalScore] = useState(0);

  const handleIntroComplete = () => {
    setGamePhase('instructions');
  };

  const handleInstructionsComplete = () => {
    setGamePhase('breathing');
  };

  const handleBreathingComplete = () => {
    setGamePhase('sequence');
  };

  const handleSequenceComplete = (score: number) => {
    setFinalScore(score);
    setGamePhase('result');
  };

  const handlePlayAgain = () => {
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
