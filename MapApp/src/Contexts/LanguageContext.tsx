import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import esMessages from '../lang/es.json';
import enMessages from '../lang/en.json';

interface LanguageContextProps {
  locale: string;
  messages: Record<string, string>;
  changeLanguage: (lang: string) => void;
}

const messagesMap: { [key: string]: Record<string, string> } = {
  en: enMessages,
  es: esMessages,
};

export const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  messages: enMessages,
  changeLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Detectar idioma inicial basado en el navegador
  const detectInitialLanguage = (): string => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    return 'en';
  };

  const [locale, setLocale] = useState<string>(detectInitialLanguage());

  const changeLanguage = (lang: string) => {
    if (messagesMap[lang]) {
      setLocale(lang);
      document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        messages: messagesMap[locale],
        changeLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar el contexto de idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};