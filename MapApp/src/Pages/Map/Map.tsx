import React, { useContext } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import { Role } from '../../Services/IAuthService';

const Map: React.FC = () => {
  const { user, roles } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
        <h1 className="text-3xl font-bold mb-6">Mapa Interactivo</h1>
        <p className="text-lg mb-4 opacity-90">
          Bienvenido, {user?.email}
        </p>
        <p className="text-sm opacity-70 mb-4">
          Aquí podrás gestionar tus países visitados y por visitar
        </p>
        {roles && roles.includes(Role.ADMIN) && (
          <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3 mt-4">
            <p className="text-yellow-300 text-sm font-semibold">
              🔑 Acceso de Administrador
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
