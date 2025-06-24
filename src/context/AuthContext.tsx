import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/auth';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());

  useEffect(() => {
    if (token) {
      // Fetch user data if token exists
      // This would typically be done with a profile endpoint
      setUser({ token });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      authService.setToken(response.access_token);
      setUser(response.user);
      setToken(response.access_token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.clearToken();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
