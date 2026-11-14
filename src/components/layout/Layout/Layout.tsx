import React from 'react';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { CartDrawer } from '../CartDrawer/CartDrawer';
import { AtmosphereStack } from '../../effects/AtmosphereStack';
import { SkipLink } from '../../ui/SkipLink/SkipLink';
import { DemoControls } from '../DemoControls/DemoControls';

interface LayoutProps {
  children: React.ReactNode;
  characterTint?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, characterTint }) => {
  return (
    <>
      <SkipLink />
      <AtmosphereStack tintColor={characterTint} />
      <Header />
      <main id="main-content" tabIndex={-1} style={{ outline: 'none', minHeight: '80vh', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <CartDrawer />
      <Footer />
      <DemoControls />
    </>
  );
};
