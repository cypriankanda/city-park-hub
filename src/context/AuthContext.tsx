import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/auth';
import jwt_decode from 'jwt-decode';

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
        const decoded: any = jwt_decode(token);
        setUser({ email: decoded.sub });
      } catch (err) {
        console.error('Invalid token', err);
        setUser(null);
      }
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember_me: rememberMe })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    authService.setToken(data.token);
    setToken(data.token);
  };

  const logout = () => {
    authService.clearToken();
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    getToken: () => token
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};