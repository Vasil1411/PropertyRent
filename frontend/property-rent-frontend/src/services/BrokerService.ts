import {API_BASE_URL, getAuthHeaders} from '../services/apiConfig'



import { type BrokerProfileRequest, type BrokerResponse } from '../types/Broker';

const BROKER_URL = `${API_BASE_URL}/broker`;

// 1. Превръщане на логнат потребител в брокер (изисква JWT токен)
export const registerBrokerProfile = async (data: BrokerProfileRequest): Promise<string> => {
  const response = await fetch(`${BROKER_URL}/register-profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Грешка при създаване на брокерски профил');
  }

  return response.text();
};

// 2. Вземане на всички брокери
export const getAllBrokers = async (): Promise<BrokerResponse[]> => {
  const response = await fetch(`${BROKER_URL}/all`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Грешка при зареждане на брокерите');
  }

  return response.json();
};

// 3. Вземане на брокер по ID
export const getBrokerById = async (id: number): Promise<BrokerResponse> => {
  const response = await fetch(`${BROKER_URL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Брокерът не е намерен');
  }

  return response.json();
};

// 4. Редакция на брокерски профил
export const updateBroker = async (id: number, data: BrokerProfileRequest): Promise<BrokerResponse> => {
  const response = await fetch(`${BROKER_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Грешка при обновяване на брокерския профил');
  }

  return response.json();
};

// 5. Изтриване на брокерски профил
export const deleteBroker = async (id: number): Promise<void> => {
  const response = await fetch(`${BROKER_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при изтриване на брокерския профил');
  }
};