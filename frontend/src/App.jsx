import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <ClientsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes/:id"
            element={
              <PrivateRoute>
                <ClientDetailPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/clientes" />} />
          <Route path="*" element={<Navigate to="/clientes" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
