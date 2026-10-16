import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Лого / Име на приложението */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-extrabold text-blue-600 hover:text-blue-700">
            🏠 RentProperty
          </Link>
        </div>

        {/* Навигационни бутони и връзки */}
        <nav className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Начало
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/create-property" 
                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                + Добави имот
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-200"
              >
                Изход
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};