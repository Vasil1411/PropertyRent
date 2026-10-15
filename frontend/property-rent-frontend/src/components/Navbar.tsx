import React from 'react';
import  { type User }  from '../types/User';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, currentUser, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '75px' }}>
        <div 
          onClick={() => setCurrentPage('catalog')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '1.35rem' }}
        >
          <span style={{ background: '#2563eb', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>RE</span>
          <span>PropRent</span>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('catalog')} 
            style={{ 
              background: currentPage === 'catalog' ? '#eff6ff' : 'none', 
              border: 'none', padding: '0.6rem 1rem', borderRadius: '0.5rem', 
              fontWeight: 600, color: currentPage === 'catalog' ? '#2563eb' : '#64748b', cursor: 'pointer' 
            }}
          >
            Каталог
          </button>

          {currentUser ? (
            <>
              <button 
                onClick={() => setCurrentPage('profile')} 
                style={{ 
                  background: currentPage === 'profile' ? '#eff6ff' : 'none', 
                  border: 'none', padding: '0.6rem 1rem', borderRadius: '0.5rem', 
                  fontWeight: 600, color: currentPage === 'profile' ? '#2563eb' : '#64748b', cursor: 'pointer' 
                }}
              >
                Моят профил / Табло
              </button>
              <span className={`role-badge role-${currentUser.role}`}>{currentUser.role}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.firstName}</span>
              <button onClick={onLogout} className="btn btn-secondary btn-sm">Изход</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} className="btn btn-secondary btn-sm">Вход</button>
              <button onClick={() => setCurrentPage('register')} className="btn btn-primary btn-sm">Регистрация</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};