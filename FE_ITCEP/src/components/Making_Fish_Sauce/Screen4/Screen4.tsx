import { useState } from 'react';
import { useNavigate } from 'react-router';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';
import { RhythmSealingPhase } from './phases/RhythmSealingPhase';
import { FermentationSurvivalGame } from './games/FermentationSurvivalGame';
import { WinScreen } from './components/WinScreen';
import { LoseScreen } from './components/LoseScreen';
import type { JarState } from './types/gameTypes';

type GamePhase = 'sealing' | 'survival' | 'finished';

interface Screen4Props {
  challengeMode?: boolean;
}

export default function Screen4({ challengeMode = false }: Screen4Props) {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>('sealing');
  const [baseQuality, setBaseQuality] = useState(0);
  const [gamePassed, setGamePassed] = useState(false);
  const [jars, setJars] = useState<JarState[]>([]);
  const userId = getUserId();

  const handleSealingComplete = (quality: number) => {
    setBaseQuality(quality);
    setGamePhase('survival');
  };

  const handleSurvivalGameEnd = async (passed: boolean, quality: number, jarsData: JarState[]) => {
    setGamePassed(passed);
    setJars(jarsData);
    setGamePhase('finished');

    // Save progress to backend (only if passed)
    if (userId && passed) {
      try {
        const levels = await levelsService.getByVillage(2, userId);
        const level4 = levels.find((l: any) => l.level_number === 4);
        
        if (level4) {
          await progressService.saveProgress({
            user_id: userId,
            level_id: level4.level_id,
            status: 'completed',
            score: Math.round(quality)
          });

          console.log('[Screen4] Level 4 completed with quality:', quality);
        }
      } catch (error) {
        console.error('[Screen4] Error saving progress:', error);
      }
    }
  };

  // Render different phases
  if (gamePhase === 'sealing') {
    return (
      <div>
        <RhythmSealingPhase onComplete={handleSealingComplete} />
      </div>
    );
  }

  if (gamePhase === 'survival') {
    return (
      <div>
        <FermentationSurvivalGame
          difficulty="medium"
          baseQuality={baseQuality}
          onGameEnd={handleSurvivalGameEnd}
        />
      </div>
    );
  }

  // Finished screen
  if (gamePhase === 'finished') {
    if (gamePassed) {
      return (
        <WinScreen
          jars={jars}
          baseQuality={baseQuality}
          onContinue={() => navigate('/game/final-extraction')}
          onRetry={() => {
            setGamePhase('sealing');
            setBaseQuality(0);
            setGamePassed(false);
            setJars([]);
          }}
          onBack={() => navigate(-1)}
          challengeMode={challengeMode}
        />
      );
    } else {
      return (
        <LoseScreen
          jars={jars}
          onRetry={() => {
            setGamePhase('sealing');
            setBaseQuality(0);
            setGamePassed(false);
            setJars([]);
          }}
          onBack={() => navigate(-1)}
          challengeMode={challengeMode}
        />
      );
    }
  }

  // Should not reach here
  return null;
}
