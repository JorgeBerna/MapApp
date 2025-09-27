import React from 'react';
import Header from './Header/Header';
import Content from './Content/Content';
import Footer from './Footer/Footer';
import DarkVeil from './DarkVeil';

interface AppLayoutProps {
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  headerContent, 
  footerContent 
}) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header>{headerContent}</Header>
        <Content>{children}</Content>
        <Footer>{footerContent}</Footer>
      </div>
    </div>
  );
};

export default AppLayout;
