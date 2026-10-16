import { useState, useEffect, useCallback } from 'react';
import { getPropertyById, updateProperty, deleteProperty } from '../services/PropertyService';
import { type PropertyResponse, type PropertyRequest } from '../types/Property';

export const usePropertyDetails = (propertyId: number) => {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyById(propertyId);
      setProperty(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при зареждане на имота');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleUpdate = async (data: PropertyRequest, newImages?: File[]) => {
    try {
      const updated = await updateProperty(propertyId, data, newImages);
      setProperty(updated);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при обновяване');
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(propertyId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при изтриване');
      return false;
    }
  };

  return {
    property,
    loading,
    error,
    refreshProperty: fetchProperty,
    updateProperty: handleUpdate,
    deleteProperty: handleDelete,
  };
};