import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
        <h1 className="text-4xl font-bold mb-6">MapApp</h1>
        <p className="text-lg mb-4 opacity-90">
          Explora el mundo y registra tus viajes
        </p>
        <p className="text-sm opacity-70">
          Una aplicación para gestionar tus países visitados y por visitar
        </p>
      </div>
    </div>
  );
};

export default Home;
