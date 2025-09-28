import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { authService } from '../../Services/AuthService';
import { Role } from '../../Services/IAuthService';

const Navbar: React.FC = () => {
  const { user, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link to="/" className="hover:text-blue-300 transition-colors">
          MapApp
        </Link>
      </div>
      
      <nav className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="hover:text-blue-300 transition-colors font-medium"
        >
          Home
        </Link>
        
        {user && (
          <Link 
            to="/map" 
            className="hover:text-blue-300 transition-colors font-medium"
          >
            Mapa
          </Link>
        )}
        
        {user && (
          <Link 
            to="/countries" 
            className="hover:text-blue-300 transition-colors font-medium"
          >
            Países
          </Link>
        )}
        
        {user && roles && roles.includes(Role.ADMIN) && (
          <Link 
            to="/admin" 
            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded-lg transition-colors font-medium border border-yellow-500/40"
          >
            Admin
          </Link>
        )}
        
        {!user && (
          <>
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="border border-white/30 hover:border-white/50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Registro
            </Link>
          </>
        )}
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-sm">
              {user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
