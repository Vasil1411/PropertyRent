import { useState, useEffect, useCallback } from 'react';
import { 
  getAllBrokers, 
  getBrokerById, 
  registerBrokerProfile, 
  updateBroker, 
  deleteBroker 
} from '../services/BrokerService';
import { type BrokerProfileRequest, type BrokerResponse } from '../types/Broker';

export const useBrokers = () => {
  const [brokers, setBrokers] = useState<BrokerResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBrokers();
      setBrokers(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при зареждане на брокерите');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  // Регистрация на текущ потребител като брокер
  const registerAsBroker = async (data: BrokerProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const message = await registerBrokerProfile(data);
      await fetchBrokers(); // Обновяваме списъка
      return { success: true, message };
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване на брокерски профил');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBroker = async (id: number, data: BrokerProfileRequest) => {
    try {
      const updated = await updateBroker(id, data);
      setBrokers((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при редакция на брокер');
      return false;
    }
  };

  const handleDeleteBroker = async (id: number) => {
    try {
      await deleteBroker(id);
      setBrokers((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при изтриване на брокер');
      return false;
    }
  };

  return {
    brokers,
    loading,
    error,
    refreshBrokers: fetchBrokers,
    registerAsBroker,
    updateBroker: handleUpdateBroker,
    deleteBroker: handleDeleteBroker,
  };
};