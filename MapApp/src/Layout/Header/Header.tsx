import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="w-full bg-blue-900/40 backdrop-blur-xl text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        {children || (
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">MapApp</div>
            <nav className="flex space-x-4">
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
