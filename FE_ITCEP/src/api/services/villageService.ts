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

export interface VillageResponse {
  id: number;
  name: string;
  description?: string;
  is_open: boolean;
  updated_at?: string;
}

export const villageService = {
  /**
   * Unlock a village by setting is_open to true
   * @param villageId - The ID of the village to unlock
   */
  async unlockVillage(villageId: number): Promise<VillageResponse> {
    try {
      const { data } = await apiClient.patch<VillageResponse>(
        `/villages/${villageId}/open`,
        { open: true }
      );
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to unlock village');
    }
  },

  /**
   * Lock a village by setting is_open to false
   * @param villageId - The ID of the village to lock
   */
  async lockVillage(villageId: number): Promise<VillageResponse> {
    try {
      const { data } = await apiClient.patch<VillageResponse>(
        `/villages/${villageId}/open`,
        { open: false }
      );
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to lock village');
    }
  },

  /**
   * Get village details by ID
   * @param villageId - The ID of the village
   */
  async getVillageById(villageId: number): Promise<VillageResponse> {
    try {
      const { data } = await apiClient.get<VillageResponse>(`/villages/${villageId}`);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get village');
    }
  },
};
