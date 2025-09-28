import React from 'react';
import Navbar from './Navbar';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="w-full bg-blue-900/40 backdrop-blur-xl text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        {children || <Navbar />}
      </div>
    </header>
  );
};

export default Header;
