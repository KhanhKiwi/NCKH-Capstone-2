import { progressService } from '../api/services/progressService';

/**
 * Initialize user progress for a craft's first level
 * This ensures the first level is always unlocked for new users
 * 
 * @param userId - The user ID
 * @param firstLevelId - The database level ID of the first level
 * @returns The initialized user progress
 */
export async function initializeFirstLevel(
  userId: number,
  firstLevelId: number = 1  // Default to level 1 for Mắm Nam Ô
) {
  try {
    console.log(`[Progress] Fetching progress for user ${userId}...`);
    const progress = await progressService.getUserProgress(userId);
    console.log(`[Progress] Current progress count: ${progress.length}`);
    
    // If no progress exists, create initial progress with 'unlocked' status
    if (progress.length === 0) {
      console.log(`[Progress] No progress found. Initializing level ${firstLevelId}...`);
      
      try {
        const initResult = await progressService.saveProgress({
          user_id: userId,
          level_id: firstLevelId,
          status: 'unlocked'
        });
        
        console.log(`[Progress] Level initialized:`, initResult);
        
        // Fetch again to get the updated progress
        const updatedProgress = await progressService.getUserProgress(userId);
        console.log(`[Progress] Updated progress count: ${updatedProgress.length}`, updatedProgress);
        return updatedProgress;
      } catch (initError) {
        console.error('[Progress] Error during initialization:', initError);
        // Return empty array on error (will show all locked)
        return [];
      }
    } else {
      console.log(`[Progress] User already has progress. Levels:`, progress.map(p => ({
        levelId: p.level?.level_id,
        status: p.status
      })));
    }
    
    return progress;
  } catch (error) {
    console.error('[Progress] Failed to initialize first level:', error);
    // Return empty array on error (will show all locked)
    return [];
  }
}

/**
 * Get user ID from localStorage
 * @returns The user ID or null if not found
 */
export function getUserIdFromStorage(): number | null {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id || user.user_id || null;
      console.log('[Auth] User ID from storage:', userId);
      return userId;
    }
  } catch (error) {
    console.error('[Auth] Failed to parse user data:', error);
  }
  console.warn('[Auth] No user data found in localStorage');
  return null;
}
