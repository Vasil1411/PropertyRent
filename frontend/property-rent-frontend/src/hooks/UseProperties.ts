import { useState, useEffect, useCallback } from 'react';
import { 
  getAllProperties, 
  searchProperties, 
  createProperty, 
  deleteProperty, 
  type SearchParams, 
} from '../services/PropertyService';
import { type PropertyResponse, type PropertyRequest } from '../types/Property';

export const useProperties = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Зареждане на всички имоти първоначално
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при зареждане на имотите');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Търсене / Филтриране на имоти
  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProperties(params);
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при търсене');
    } finally {
      setLoading(false);
    }
  };

  // Създаване на нов имот
  const handleCreateProperty = async (data: PropertyRequest, images?: File[]) => {
    try {
      const newProperty = await createProperty(data, images);
      setProperties((prev) => [newProperty, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване');
      return false;
    }
  };

  // Изтриване на имот
  const handleDeleteProperty = async (id: number) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Грешка при изтриване');
      return false;
    }
  };

  return {
    properties,
    loading,
    error,
    refreshProperties: fetchProperties,
    searchProperties: handleSearch,
    createProperty: handleCreateProperty,
    deleteProperty: handleDeleteProperty,
  };
};