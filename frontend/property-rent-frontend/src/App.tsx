import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContex';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Пример за защитен руут */}
          {/* 
          <Route path="/create-property" element={
            <ProtectedRoute>
              <CreatePropertyPage />
            </ProtectedRoute>
          } /> 
          */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;