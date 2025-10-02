import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './Contexts/AuthContext';
import { AppLayout } from './Layout/index';
import { Home } from './Pages/Home';
import { Login, Register } from './Pages/Login';
import { Map } from './Pages/Map';
import { Countries } from './Pages/Countries';
import ProtectedRoute from './Routes/ProtectedRoute';
import store from './store/store';
import './App.css';


const App: React.FC = () => {
  return (
    <Provider store={store}>
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
              <Route path="*" element={<Home />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App
