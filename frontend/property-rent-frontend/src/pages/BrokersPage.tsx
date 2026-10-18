import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBrokerById, deleteBroker, updateBroker } from '../services/BrokerService';
import { type BrokerResponse } from '../types/Broker';

export const BrokerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [broker, setBroker] = useState<BrokerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Състояние за формата за редакция
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    agencyName: '',
  });

  useEffect(() => {
    const fetchBroker = async () => {
      if (!id) return;
      try {
        const data = await getBrokerById(Number(id));
        setBroker(data);
        setFormData({
          phone: data.phone || '',
          agencyName: data.agencyName || '',
        });
      } catch (err: any) {
        setError(err.message || 'Грешка при зареждане на брокера');
      } finally {
        setLoading(false);
      }
    };

    fetchBroker();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Сигурни ли сте, че искате да изтриете този брокерски профил?')) {
      try {
        await deleteBroker(Number(id));
        alert('Профилът е изтрит успешно.');
        navigate('/brokers');
      } catch (err: any) {
        alert(err.message || 'Грешка при изтриване');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const updated = await updateBroker(Number(id), formData);
      setBroker(updated);
      setIsEditing(false);
      alert('Профилът е обновен успешно!');
    } catch (err: any) {
      alert(err.message || 'Грешка при обновяване');
    }
  };

  if (loading) return <div className="text-center py-12">Зареждане...</div>;
  if (error || !broker) return <div className="text-center py-12 text-red-600">{error || 'Брокерът не е намерен'}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{broker.firstName} {broker.lastName}</h1>
            <p className="text-blue-600 text-sm font-medium">{broker.agencyName || 'Независим брокер'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              {isEditing ? 'Отказ' : 'Редактирай'}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-md transition-colors"
            >
              Изтрий
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Агенция</label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 text-sm"
            >
              Запази промените
            </button>
          </form>
        ) : (
          <div className="space-y-3 border-t pt-6 text-sm text-gray-700">
            <p><strong>Имейл:</strong> {broker.email}</p>
            <p><strong>Телефон:</strong> {broker.phone}</p>
            <p><strong>Агенция:</strong> {broker.agencyName || 'Няма посочена'}</p>
            {broker.rating !== undefined && <p><strong>Рейтинг:</strong> ⭐ {broker.rating}</p>}
          </div>
        )}
      </div>
    </div>
  );
};