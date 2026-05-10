import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { IntroScreen } from './IntroScreen';
import { AdvancedFermentationGame } from './components/AdvancedFermentationGame';
import { progressService } from '../../../api/progress/progressService';
import { levelsService } from '../../../api/levels/levelsService';
import { getUserId } from '../../../utils/authUtils';

export default function CloseJarFermentGamePage() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleGameEnd = async (passed: boolean, quality: number) => {
    setIsFinishing(true);
    console.log('[Screen4] Game ended:', { passed, quality });
    
    try {
      const userId = getUserId();
      console.log('[Screen4] UserId:', userId);
      
      // Try to save progress if user is logged in AND passed the level
      if (userId && passed && quality >= 75) {
        try {
          const levels = await levelsService.getByVillage(8, userId);
          console.log('[Screen4] Levels fetched:', levels);
          
          const level4 = levels.find((l: any) => l.level_number === 4);
          console.log('[Screen4] Level4:', level4);
          
          if (level4) {
            await progressService.saveProgress({
              user_id: userId,
              level_id: level4.level_id,
              status: 'completed',
              score: quality
            });
            console.log('[Screen4] Progress saved!');
          }
        } catch (apiError) {
          console.error('[Screen4] API Error:', apiError);
          // Continue anyway - don't block navigation
        }
      } else {
        console.log('[Screen4] Skipping API call - userId:', userId, 'passed:', passed, 'quality:', quality);
      }
      
      // Always navigate if level was passed (quality >= 75)
      // This allows testing even without authentication
      if (passed && quality >= 75) {
        console.log('[Screen4] Navigating to Level 5...');
        setTimeout(() => {
          navigate('/game/final-extraction');
        }, 1500);
      } else {
        console.log('[Screen4] Level not passed - staying on result screen');
        setIsFinishing(false);
      }
    } catch (error) {
      console.error('[Screen4] Unexpected Error:', error);
      setIsFinishing(false);
    }
  };

  return (
    <div className={`relative w-full ${gameStarted ? 'min-h-screen overflow-y-auto' : 'min-h-screen overflow-y-auto'}`}>
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <AdvancedFermentationGame onGameEnd={handleGameEnd} />
      )}

      {/* Back Button - Floating */}
      {!isFinishing && (
        <button
          onClick={() => {
            if (gameStarted) {
              setGameStarted(false);
            } else {
              navigate(-1);
            }
          }}
          className="fixed top-6 left-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
          title={gameStarted ? "Quay lại giới thiệu" : "Quay lại"}
        >
          <ChevronLeft size={24} />
        </button>
      )}
    </div>
  );
}
