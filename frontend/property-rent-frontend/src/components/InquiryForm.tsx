import { useState, type FormEvent } from 'react';
import { createInquiry } from '../services/InquiryService';

interface InquiryFormProps {
  propertyId: number;
}

export const InquiryForm = ({ propertyId }: InquiryFormProps) => {
  const [formData, setFormData] = useState({
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Тук подаваме propertyId като първи аргумент и обекта с данни като втори, точно както го изисква сервизът ти:
      await createInquiry(propertyId, {
        clientFirstName: formData.clientFirstName,
        clientLastName: formData.clientLastName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        clientFirstName: '',
        clientLastName: '',
        clientEmail: '',
        clientPhone: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Грешка при изпращане на запитването.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Изпратете запитване за този имот</h3>

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-3 text-green-700 text-sm rounded">
          Запитването е изпратено успешно! Брокерът ще се свърже с вас скоро.
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Име *</label>
            <input
              type="text"
              name="clientFirstName"
              required
              value={formData.clientFirstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Иван"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
            <input
              type="text"
              name="clientLastName"
              required
              value={formData.clientLastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Георгиев"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имейл *</label>
          <input
            type="email"
            name="clientEmail"
            required
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="ivan@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
          <input
            type="tel"
            name="clientPhone"
            required
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="+359 888 123 456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Съобщение *</label>
          <textarea
            name="message"
            rows={3}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Здравейте, заинтересован съм от този имот..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? 'Изпращане...' : 'Изпрати запитване'}
        </button>
      </form>
    </div>
  );
};