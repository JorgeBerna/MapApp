import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import './index.css'
import App from './App.tsx'
import { LanguageProvider, LanguageContext } from './Contexts/LanguageContext.tsx'

const Root = () => {
  const { locale, messages } = React.useContext(LanguageContext);
  return (
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </StrictMode>,
)
