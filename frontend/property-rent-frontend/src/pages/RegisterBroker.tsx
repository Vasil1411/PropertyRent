import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerBrokerProfile } from '../services/BrokerService';

export const RegisterBrokerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    agencyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerBrokerProfile(formData);
      alert('Успешно станахте брокер!');
      navigate('/brokers');
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване на брокерски профил');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Стани брокер</h1>
        <p className="text-gray-600 text-sm mb-6">Попълнете данните си, за да активирате брокерски профил</p>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефонен номер *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="+359 888 123 456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Име на агенция (опционално)</label>
            <input
              type="text"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Home Rent Agency"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 text-sm disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? 'Регистриране...' : 'Регистрирай се като брокер'}
          </button>
        </form>
      </div>
    </div>
  );
};