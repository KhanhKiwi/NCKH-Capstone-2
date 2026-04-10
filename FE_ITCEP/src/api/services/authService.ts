import axios, { AxiosError } from 'axios';

const CONFIG_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = import.meta.env.DEV ? '' : CONFIG_BASE;

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

// Handle error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  },

  async register(email: string, password: string, name?: string, username?: string): Promise<RegisterResponse> {
    try {
      const { data } = await apiClient.post<RegisterResponse>('/auth/register', {
        email,
        password,
        name,
        username,
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', {
        email,
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to send reset email');
    }
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', {
        token,
        password,
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to reset password');
    }
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  removeToken(): void {
    localStorage.removeItem('access_token');
  },

  logout(): void {
    this.removeToken();
  },

  async getProfile(): Promise<any> {
    try {
      const { data } = await apiClient.get('/users/profile');
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch profile');
    }
  },

  async updateProfile(update: { name?: string; avatar?: string }): Promise<any> {
    try {
      const { data } = await apiClient.patch('/users/profile', update);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const { data } = await apiClient.patch('/users/profile/password', {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to change password');
    }
  },

  async uploadAvatar(file: File): Promise<any> {
    try {
      const form = new FormData();
      form.append('avatar', file);

      const { data } = await apiClient.post('/users/profile/avatar', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to upload avatar');
    }
  },
};
