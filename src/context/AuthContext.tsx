import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ correct


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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          remember_me: rememberMe
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login API Error:', error);
        throw new Error(error.detail || error.error || 'Login failed');
      }

      const data = await response.json();
      authService.setToken(data.token);
      setToken(data.token);
      
      // Decode token to get user data
      const decoded = jwtDecode(data.token);
      setUser(decoded);

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
