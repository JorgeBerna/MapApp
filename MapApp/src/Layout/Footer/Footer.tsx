import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="w-full bg-blue-900/40 backdrop-blur-xl text-white mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 py-6">
        {children || (
          <div className="text-center">
            <p className="text-sm">
              © 2024 MapApp - Explora el mundo y registra tus viajes
            </p>
            <div className="mt-2 flex justify-center space-x-6 text-xs">
              <span>Privacidad</span>
              <span>Términos</span>
              <span>Contacto</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
