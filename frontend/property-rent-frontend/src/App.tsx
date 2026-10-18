import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { PropertiesPage } from './pages/PropertiesPage';
import { CreatePropertyPage } from './pages/CreatePropertyPage';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { BrokerPage } from './pages/BrokersPage';
import { RegisterBrokerPage } from './pages/RegisterBroker';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* Имоти */}
          <Route path="/" element={<PropertiesPage />} />
          <Route 
            path="/create-property" 
            element={
              <ProtectedRoute>
                <CreatePropertyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-property/:id" 
            element={
              <ProtectedRoute>
                <EditPropertyPage />
              </ProtectedRoute>
            } 
          />

          {/* Брокери */}
          {/* <Route path="/brokers" element={<BrokerPage />} /> */}
          <Route path="/brokers/:id" element={<BrokerPage />} />
          <Route 
            path="/broker/register" 
            element={
              <ProtectedRoute>
                <RegisterBrokerPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};