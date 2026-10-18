import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/PropertyService'; // Увери се, че пътят до сервиза е верен
import { type PropertyRequest, type PropertyType, type DealType, type PropertyStatus } from '../types/Property'; // или спрямо твоя път към типовете

export const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Форм състояние съобразено с PropertyRequest
  const [formData, setFormData] = useState<PropertyRequest>({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    dealType: 'RENT',
    status: 'ACTIVE',
    price: 0,
    areaSqm: 0,
    floor: undefined,
    totalFloors: undefined,
    roomsCount: undefined,
    city: '',
    neighborhood: '',
    address: '',
    amenitiesText: '',
  });

  // Файлове за качване (снимки)
  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Използваме FormData за изпращане на данните заедно със снимките (ако бекендът ги очаква заедно)
      const data = new FormData();
      
      // Добавяме полетата от заявката
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          data.append(key, String(value));
        }
      });

      // Добавяме снимките, ако има избрани
      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append('images', images[i]);
        }
      }

      await createProperty(data); // Извикваме сервиза за създаване
      navigate('/'); // При успех връщаме към списъка с имоти
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване на имота');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавяне на нов имот</h1>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Заглавие */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие на обявата *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Луксозен двустаен апартамент в центъра"
            />
          </div>

          {/* Тип имот и Тип сделка */}
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

          {/* Цена и Площ */}
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

          {/* Локация (Град, Квартал, Адрес) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Град *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="София"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Квартал</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Младост 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ул. Александър Малинов 23"
              />
            </div>
          </div>

          {/* Допълнителни параметри (Етаж, Стаи) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Етаж</label>
              <input
                type="number"
                name="floor"
                value={formData.floor || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Общо етажи</label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Брой стаи</label>
              <input
                type="number"
                name="roomsCount"
                value={formData.roomsCount || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Подробно описание на имота, обзавеждане, удобства..."
            />
          </div>

          {/* Снимки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Снимки на имота</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Бутон за изпращане */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Публикуване...' : 'Публикувай имота'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};