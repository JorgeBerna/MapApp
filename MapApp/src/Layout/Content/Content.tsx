import React from 'react';
import { FormattedMessage } from 'react-intl';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <main className="flex-1 relative">
      {children || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">
              <FormattedMessage id="content.welcome" defaultMessage="Bienvenido a MapApp" />
            </h1>
            <p className="text-lg opacity-80">
              <FormattedMessage id="content.placeholder" defaultMessage="Contenido de la página aquí" />
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Content;
