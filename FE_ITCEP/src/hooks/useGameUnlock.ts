import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { villageService } from '../api/services/villageService';
import { progressService } from '../api/services/progressService';

interface UseGameUnlockOptions {
  levelId: number;
  villageId: number;
  nextRoute: string;
}

export function useGameUnlock(options: UseGameUnlockOptions) {
  const navigate = useNavigate();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const getUserId = (): number | null => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user.user_id;
      } catch {
        console.log('Could not parse user data');
        return null;
      }
    }
    return null;
  };

  /**
   * Handle game completion - save progress, unlock village, and navigate
   * @param score - The score/quality achieved in the game
   */
  const handleGameCompletion = async (score: number = 100) => {
    setIsUnlocking(true);
    try {
      const userId = getUserId();
      
      if (userId) {
        // Save progress for this level
        await progressService.completeLevel(userId, options.levelId, score);
        console.log(`Progress saved for level ${options.levelId}`);
        
        // Unlock the village
        await villageService.unlockVillage(options.villageId);
        console.log(`Village ${options.villageId} unlocked successfully!`);
      } else {
        console.warn('User ID not found in localStorage');
      }
      
      // Navigate to next level
      navigate(options.nextRoute);
    } catch (error) {
      console.error('Error in game completion:', error);
      // Still navigate even if unlock fails (graceful degradation)
      navigate(options.nextRoute);
    } finally {
      setIsUnlocking(false);
    }
  };

  return {
    isUnlocking,
    handleGameCompletion,
  };
}
