import axios from 'axios';

const CONFIG_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = CONFIG_BASE;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SaveProgressDto {
  user_id: number;
  level_id: number;
  status: 'in_progress' | 'completed' | 'locked' | 'unlocked';
  score?: number;
}

export interface UserProgressResponse {
  progress_id: number;
  user_id?: number;
  level: {
    level_id: number;
    level_number: number;
    difficulty: string;
  };
  status: 'in_progress' | 'completed' | 'locked' | 'unlocked';
  score?: number;
  completed_at?: string;
}

export const progressService = {
  /**
   * Save progress and trigger unlock of next level
   */
  async saveProgress(dto: SaveProgressDto): Promise<UserProgressResponse> {
    try {
      const { data } = await apiClient.post<UserProgressResponse>('/progress', dto);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to save progress');
    }
  },

  /**
   * Get all progress for a user
   */
  async getUserProgress(userId: number): Promise<UserProgressResponse[]> {
    try {
      const { data } = await apiClient.get<UserProgressResponse[]>(`/progress/user/${userId}`);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get user progress');
    }
  },

  /**
   * Unlock a specific level for a user
   */
  async unlockLevel(userId: number, levelId: number): Promise<UserProgressResponse> {
    return this.saveProgress({
      user_id: userId,
      level_id: levelId,
      status: 'unlocked',
    });
  },

  /**
   * Complete a level and unlock next level
   */
  async completeLevel(userId: number, levelId: number, score: number): Promise<UserProgressResponse> {
    try {
      // First, complete the current level
      await this.saveProgress({
        user_id: userId,
        level_id: levelId,
        status: 'completed',
        score,
      });

      // Then, unlock the next level
      const nextLevelId = levelId + 1;
      await this.unlockLevel(userId, nextLevelId);

      console.log(`[Progress] Level ${levelId} completed, Level ${nextLevelId} unlocked!`);
      return this.saveProgress({
        user_id: userId,
        level_id: levelId,
        status: 'completed',
        score,
      });
    } catch (error) {
      console.error('[Progress] Error completing level:', error);
      throw error;
    }
  },
};
