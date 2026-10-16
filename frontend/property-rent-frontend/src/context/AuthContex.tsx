import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginUser, registerUser } from '../services/UserService';
import { type LoginRequest, type UserRegistrationRequest } from '../types/User';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<boolean>;
  register: (data: UserRegistrationRequest) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const login = async (data: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(data);
      // Очакваме отговорът да съдържа токена, напр. response.token или директно стринг
      const jwtToken = typeof response === 'string' ? response : response.token;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при влизане');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: UserRegistrationRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(data);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при регистрация');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хуук за лесно използване в компонентите
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth трябва да се използва вътре в AuthProvider');
  }
  return context;
};