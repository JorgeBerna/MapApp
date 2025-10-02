import React from 'react';
import { FormattedMessage } from 'react-intl';

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
              <FormattedMessage id="footer.copyright" defaultMessage="© 2025 MapApp - Explora el mundo y registra tus viajes" />
            </p>
            <div className="mt-2 flex justify-center space-x-6 text-xs">
              <span><FormattedMessage id="footer.privacy" defaultMessage="Privacidad" /></span>
              <span><FormattedMessage id="footer.terms" defaultMessage="Términos" /></span>
              <span><FormattedMessage id="footer.contact" defaultMessage="Contacto" /></span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
