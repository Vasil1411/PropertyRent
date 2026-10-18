import { useProperties } from '../hooks/UseProperties';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';
import { deleteProperty } from '../services/PropertyService';


export const PropertiesPage = () => {
  const { properties, loading, error } = useProperties(); // Приехме, че имаш refetch или правиш презареждане
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

 const handleDelete = async (id: number) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този имот?')) {
      try {
        await deleteProperty(id); // Извикваме реалния метод за изтриване от сервиза
        
        // Премахваме изтрития имот от текущия масив в state-а, за да се скрие веднага от екрана
        // (Ако в хуука useProperties връщаш и функция за задаване на имотите, например setProperties, я използваш тук. 
        // Ако ли не, можеш да направиш window.location.reload() за най-лесно).
        window.location.reload(); 
      } catch (err: any) {
        alert(err.message || 'Грешка при изтриване');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-600 text-lg">Зареждане на имоти...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Налични имоти под наем</h1>
          <p className="text-gray-600 mt-2">Разгледайте нашите актуални предложения</p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">Все още няма добавени имоти.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0].imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span>Няма снимка</span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-sm font-bold px-2.5 py-1 rounded">
                      {property.price} €
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  <p className="text-gray-500 text-xs font-medium">
                    📍 {property.city}
                  </p>
                </div>
              </div>

              {/* Бутони за действия */}
              <div className="p-5 pt-0 flex flex-col gap-2">
                <button 
                  onClick={() => alert(`Преглед на имот с ID: ${property.id}`)}
                  className="w-full bg-gray-50 hover:bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded border border-gray-200 hover:border-blue-200 transition-colors text-sm"
                >
                  Виж детайли
                </button>

                {isAuthenticated && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/edit-property/${property.id}`)}
                      className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-1.5 px-3 rounded border border-yellow-200 transition-colors text-xs"
                    >
                      Редакция
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded border border-red-200 transition-colors text-xs"
                    >
                      Изтрий
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};