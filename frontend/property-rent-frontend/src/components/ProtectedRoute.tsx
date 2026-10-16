import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';
import { type ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Ако не е логнат, го пращаме към страницата за вход
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};