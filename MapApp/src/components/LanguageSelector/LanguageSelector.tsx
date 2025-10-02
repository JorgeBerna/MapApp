import React from 'react';
import { useLanguage } from '../../Contexts/LanguageContext';
import PqoqubbwIcon from '../Icons/PqoqubbwIcon';

const LanguageSelector: React.FC = () => {
  const { locale, changeLanguage } = useLanguage();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <PqoqubbwIcon name="globe" className="w-4 h-4 text-white" />
        <select
          id="language-select"
          value={locale}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-transparent border border-white/30 rounded px-2 py-1 text-white text-sm hover:border-white/50 transition-colors cursor-pointer focus:outline-none focus:border-blue-400"
          aria-label="Language selector"
        >
          <option value="es" className="bg-gray-800 text-white">
            Español
          </option>
          <option value="en" className="bg-gray-800 text-white">
            English
          </option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;