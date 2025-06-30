
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo mode flag
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const { isAuthenticated, user } = useAuth();
  
  // Allow admin routes for demo admin user
  if (isAdminRoute && user?.email === 'admin@parksmart.com') {
    return <>{children}</>;
  }
  
  if (useMock || isAdminRoute) return <>{children}</>; // bypass protection
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
