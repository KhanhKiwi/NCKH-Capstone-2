import axios from 'axios';

const CONFIG_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = import.meta.env.DEV ? '' : CONFIG_BASE;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface CreateSessionDto {
  user_id: number;
  craft_id: number;
  start_time?: string; // ISO datetime
}

export interface UpdateSessionDto {
  end_time?: string | null;
  total_time?: number | null; // seconds
  craft_id?: number;
}

export interface PlayerSession {
  session_id: number;
  user_id?: number;
  craft?: { craft_id: number; name?: string } | null;
  start_time?: string | null;
  end_time?: string | null;
  total_time?: number | null;
  created_at?: string;
  updated_at?: string;
}

export const playerSessionsService = {
  async create(dto: CreateSessionDto): Promise<PlayerSession> {
    try {
      const { data } = await apiClient.post<PlayerSession>('/sessions', dto);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create session');
    }
  },

  async update(id: number, dto: UpdateSessionDto): Promise<PlayerSession> {
    try {
      const { data } = await apiClient.patch<PlayerSession>(`/sessions/${id}`, dto);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update session');
    }
  },

  async findOne(id: number): Promise<PlayerSession> {
    try {
      const { data } = await apiClient.get<PlayerSession>(`/sessions/${id}`);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch session');
    }
  },

  async findByUser(userId: number): Promise<PlayerSession[]> {
    try {
      const { data } = await apiClient.get<PlayerSession[]>(`/sessions/user/${userId}`);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch user sessions');
    }
  },
};
