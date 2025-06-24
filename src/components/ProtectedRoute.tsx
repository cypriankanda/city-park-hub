import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Clear any invalid token
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  if (!isAuthenticated || !token) {
    return null; // Return null while redirecting
  }

  return <>{children}</>;
};
