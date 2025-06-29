import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/lib/api-client';
import { authService } from '../lib/auth';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        setUser({ email: decoded.sub });
      } catch (err) {
        console.error('Invalid token', err);
        setUser(null);
      }
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
        remember_me: rememberMe
      });

      const data = response.data;
      const { access_token, user: userData } = data;

      authService.setToken(access_token);
      setToken(access_token);
      
      // Prefer user data from response; fallback to decoded token
      let decoded: any = null;
      try {
        decoded = jwtDecode(access_token);
      } catch (err) {
        console.error('Invalid token', err);
      }
      setUser(userData ?? decoded);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, getToken: () => token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
