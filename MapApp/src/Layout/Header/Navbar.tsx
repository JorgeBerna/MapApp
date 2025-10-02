import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { AuthContext } from '../../Contexts/AuthContext';
import { authService } from '../../Services/AuthService';
import PqoqubbwIcon from '../../components/Icons/PqoqubbwIcon';
import LanguageSelector from '../../components/LanguageSelector';

const Navbar: React.FC = () => {
  const { user } = useContext(AuthContext);
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
    <div className="flex items-center w-full">
      <div className="text-xl font-bold">
        <Link to="/" className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
          <PqoqubbwIcon name="globe" className="w-5 h-5 text-white" />
          <span className="font-semibold">
            <FormattedMessage id="app.title" defaultMessage="MapApp" />
          </span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-6">
          {user && (
            <Link to="/map" className="hover:text-blue-300 transition-colors font-medium">
              <FormattedMessage id="nav.map" defaultMessage="Mapa" />
            </Link>
          )}
          {user && (
            <Link to="/countries" className="hover:text-blue-300 transition-colors font-medium">
              <FormattedMessage id="nav.countries" defaultMessage="Países" />
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Selector de idioma */}
        <LanguageSelector />
        
        {!user && (
          <>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              <FormattedMessage id="nav.login" defaultMessage="Login" />
            </Link>
            <Link to="/register" className="border border-white/30 hover:border-white/50 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              <FormattedMessage id="nav.register" defaultMessage="Registro" />
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-sm">{user.email}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              <FormattedMessage id="nav.logout" defaultMessage="Logout" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
