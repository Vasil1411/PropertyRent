import {API_BASE_URL, getAuthHeaders} from '../services/apiConfig'


import { type PropertyResponse, type PropertyRequest,type  DealType, type PropertyType } from '../types/Property';

const PROPERTY_URL = `${API_BASE_URL}/properties`;

// Помощна функция за хедъри без 'Content-Type', за да може броузерът сам да сложи 'multipart/form-data' с границата (boundary)
const getMultipartAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// 1. Създаване на имот с качване на снимки (FormData)
// src/services/propertyService.ts
export const createProperty = async (formData: FormData) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: {
      // Слагаме само автентикацията, НО НЕ И 'Content-Type', за да може браузърът да обработи FormData правилно!
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Грешка при създаване на имота');
  }

  return response.json();
};

// 2. Взимане на всички имоти (публичен)
export const getAllProperties = async (): Promise<PropertyResponse[]> => {
  const response = await fetch(PROPERTY_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Грешка при зареждане на имотите');
  }

  return response.json();
};

// 3. Взимане на имот по ID (публичен)
export const getPropertyById = async (id: number): Promise<PropertyResponse> => {
  const response = await fetch(`${PROPERTY_URL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Имотът не е намерен');
  }

  return response.json();
};

// 4. Изтриване на имот (изисква JWT)
export const deleteProperty = async (id: number): Promise<void> => {
  const response = await fetch(`${PROPERTY_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при изтриване на имота');
  }
};

// 5. Редакция на имот (FormData)
export const updateProperty = async (id: number, data: PropertyRequest, newImages?: File[]): Promise<PropertyResponse> => {
  const formData = new FormData();
  
  formData.append('property', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (newImages && newImages.length > 0) {
    newImages.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${PROPERTY_URL}/${id}`, {
    method: 'PUT',
    headers: getMultipartAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Грешка при обновяване на имота');
  }

  return response.json();
};

// 6. Търсене и филтриране на имоти по параметри
export interface SearchParams {
  city?: string;
  dealType?: DealType;
  minPrice?: number;
  maxPrice?: number;
  roomsCount?: number;
}

export const searchProperties = async (params: SearchParams): Promise<PropertyResponse[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.city) queryParams.append('city', params.city);
  if (params.dealType) queryParams.append('dealType', params.dealType);
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.roomsCount !== undefined) queryParams.append('roomsCount', params.roomsCount.toString());

  const response = await fetch(`${PROPERTY_URL}/search?${queryParams.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Грешка при търсене на имоти');
  }

  return response.json();
};