import { useState } from 'react';
import { loginUser, registerUser } from '../services/UserService';
import { type LoginRequest, type UserRegistrationRequest } from '../types/User';

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(data);
      // Токенът вече се записва в localStorage вътре в loginUser сервиза
      return response;
    } catch (err: any) {
      setError(err.message || 'Грешка при влизане');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: UserRegistrationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Грешка при регистрация');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Тук можеш да добавиш и редирект или промяна в глобалното състояние
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};