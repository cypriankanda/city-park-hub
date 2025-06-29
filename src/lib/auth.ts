
import { apiClient } from './api-client';

export interface LoginRequest {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<void> => {
    try {
      await apiClient.post('/api/auth/register', data);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data: res } = await apiClient.post('/api/auth/login', data);
      const { access_token, user } = res;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      return res;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
};
