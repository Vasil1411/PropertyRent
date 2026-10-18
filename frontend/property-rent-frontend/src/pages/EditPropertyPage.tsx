 import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../services/PropertyService'; // Увери се, че тези методи съществуват в сервиза ти

export const EditPropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    dealType: 'RENT',
    status: 'ACTIVE',
    price: 0,
    areaSqm: 0,
    floor: '' as number | '',
    totalFloors: '' as number | '',
    roomsCount: '' as number | '',
    city: '',
    neighborhood: '',
    address: '',
    amenitiesText: '',
  });

  // Зареждане на съществуващите данни за имота при отваряне
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await getPropertyById(Number(id));
        setFormData({
          title: data.title || '',
          description: data.description || '',
          propertyType: data.propertyType || 'APARTMENT',
          dealType: data.dealType || 'RENT',
          status: data.status || 'ACTIVE',
          price: data.price || 0,
          areaSqm: data.areaSqm || 0,
          floor: data.floor ?? '',
          totalFloors: data.totalFloors ?? '',
          roomsCount: data.roomsCount ?? '',
          city: data.city || '',
          neighborhood: data.neighborhood || '',
          address: data.address || '',
          amenitiesText: data.amenitiesText || '',
        });
      } catch (err: any) {
        setError(err.message || 'Грешка при зареждане на имота');
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          data.append(key, String(value));
        }
      });

      await updateProperty(Number(id), data as any);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Грешка при обновяване на имота');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Зареждане на данните...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Редакция на имот</h1>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие на обявата *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Вид имот *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="APARTMENT">Апартамент</option>
                <option value="HOUSE">Къща</option>
                <option value="OFFICE">Офис</option>
                <option value="GARAGE">Гараж</option>
                <option value="LAND">Земя</option>
                <option value="COMMERCIAL">Търговско помещение</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип сделка *</label>
              <select
                name="dealType"
                value={formData.dealType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="RENT">Под наем</option>
                <option value="SALE">Продажба</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена (€) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Площ (кв.м) *</label>
              <input
                type="number"
                name="areaSqm"
                required
                min="0"
                value={formData.areaSqm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Град *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/2 bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Записване...' : 'Запази промените'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};