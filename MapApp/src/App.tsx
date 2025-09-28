import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import { AppLayout } from './Layout/index';
import { Home } from './Pages/Home';
import { Login, Register } from './Pages/Login';
import { Map } from './Pages/Map';
import ProtectedRoute from './Routes/ProtectedRoute';
import AdminRoute from './Routes/AdminRoute';
import './App.css';

// TODO: Componente temporal para Countries
const Countries: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen text-white">
    <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
      <h1 className="text-3xl font-bold mb-6">Países</h1>
      <p className="text-lg opacity-90">Próximamente: Listado de países del mundo</p>
    </div>
  </div>
);

// TODO: Componente temporal para Admin
const Admin: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen text-white">
    <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="text-lg opacity-90">Próximamente: Gestión de usuarios y configuración</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/countries"
              element={
                <ProtectedRoute>
                  <Countries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App
