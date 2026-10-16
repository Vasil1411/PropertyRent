import { useState, useCallback } from 'react';
import { 
  createInquiry, 
  getInquiriesForProperty, 
  updateInquiryStatus, 
  deleteInquiry 
} from '../services/InquiryService';
import { type Inquiry, type InquiryStatus } from '../types/Inquiry';

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Зареждане на запитванията за даден имот
  const fetchInquiriesForProperty = useCallback(async (propertyId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInquiriesForProperty(propertyId);
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при зареждане на запитванията');
    } finally {
      setLoading(false);
    }
  }, []);

  // Изпращане на ново запитване (от клиент)
  const sendInquiry = async (propertyId: number, data: Partial<Inquiry>) => {
    setLoading(true);
    setError(null);
    try {
      const newInquiry = await createInquiry(propertyId, data);
      setInquiries((prev) => [newInquiry, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при изпращане на запитването');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Промяна на статус (напр. NEW -> CONTACTED)
  const changeStatus = async (id: number, status: InquiryStatus) => {
    try {
      const updated = await updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при промяна на статуса');
      return false;
    }
  };

  // Изтриване на запитване
  const removeInquiry = async (id: number) => {
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при изтриване');
      return false;
    }
  };

  return {
    inquiries,
    loading,
    error,
    fetchInquiriesForProperty,
    sendInquiry,
    changeStatus,
    removeInquiry,
  };
};