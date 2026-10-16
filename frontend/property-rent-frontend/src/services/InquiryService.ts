import { API_BASE_URL, getAuthHeaders } from './apiConfig';
import { type Inquiry, type InquiryStatus } from '../types/Inquiry';

const INQUIRY_URL = `${API_BASE_URL}/inquiries`;

// 1. Изпращане на запитване за конкретен имот
export const createInquiry = async (propertyId: number, data: Partial<Inquiry>): Promise<Inquiry> => {
  const response = await fetch(`${INQUIRY_URL}/property/${propertyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Грешка при изпращане на запитването');
  }

  return response.json();
};

// 2. Взимане на запитванията за даден имот (за брокера)
export const getInquiriesForProperty = async (propertyId: number): Promise<Inquiry[]> => {
  const response = await fetch(`${INQUIRY_URL}/property/${propertyId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при зареждане на запитванията');
  }

  return response.json();
};

// 3. Промяна на статуса на запитване
export const updateInquiryStatus = async (id: number, status: InquiryStatus): Promise<Inquiry> => {
  const response = await fetch(`${INQUIRY_URL}/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при промяна на статуса');
  }

  return response.json();
};

// 4. Изтриване на запитване
export const deleteInquiry = async (id: number): Promise<void> => {
  const response = await fetch(`${INQUIRY_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Грешка при изтриване на запитването');
  }
};