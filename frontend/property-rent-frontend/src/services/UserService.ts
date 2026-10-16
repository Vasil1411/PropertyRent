import {API_BASE_URL, getAuthHeaders} from '../services/apiConfig'
import type { LoginRequest, LoginResponse, UserProfileResponse, UserRegistrationRequest, UserUpdateRequest } from '../types/User';

const USER_URL = `${API_BASE_URL}/user`;

export const registerUser = async (data: UserRegistrationRequest) => {
  const response = await fetch(`${USER_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Грешка при регистрация');
  }

  return response.json();
};

// 2. Вход в системата (Login)
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Невалиден имейл или парола');
  }

  const result: LoginResponse = await response.json();
  
  // Запазваме токена в localStorage при успешен вход
  if (result.token) {
    localStorage.setItem('token', result.token);
  }

  return result;
};

// 3. Вземане на профил по ID
export const getUserById = async (id: number): Promise<UserProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при зареждане на профила');
  }

  return response.json();
};

// 4. Вземане на всички потребители (Само за Админ)
export const getAllUsers = async (): Promise<UserProfileResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Нямате права за достъп до списъка с потребители');
  }

  return response.json();
};

// 5. Редакция на профил по ID
export const updateUserProfile = async (id: number, data: UserUpdateRequest): Promise<UserProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Грешка при обновяване на профила');
  }

  return response.json();
};

// 6. Изтриване на профил по ID
export const deleteUserProfile = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при изтриване на профила');
  }
};