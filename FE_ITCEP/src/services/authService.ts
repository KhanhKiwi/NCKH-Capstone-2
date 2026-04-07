const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(email: string, password: string, name?: string, username?: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, username }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return response.json();
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
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
};
