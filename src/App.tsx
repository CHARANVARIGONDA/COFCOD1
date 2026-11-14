import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, CompareProvider, getCharacterBySlug } from '@cofoco/shared';
import { Layout } from './components/layout/Layout/Layout';
import { SmoothScrollProvider } from './components/effects/SmoothScrollProvider';

// Pages
import { HomePage } from './pages/HomePage/HomePage';
import { CharacterPage } from './pages/CharacterPage/CharacterPage';
import { KitDetailPage } from './pages/KitDetailPage/KitDetailPage';
import { ComparePage } from './pages/ComparePage/ComparePage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage/OrderConfirmationPage';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { AnalyticsPage } from './pages/AnalyticsPage/AnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export const App: React.FC = () => {
  const location = useLocation();

  // Dynamic character tint if on a character or kit page
  let charTint: string | undefined;
  if (location.pathname.startsWith('/characters/')) {
    const slug = location.pathname.split('/')[2];
    const char = getCharacterBySlug(slug);
    if (char) charTint = char.glowColor;
  }

  return (
    <CartProvider>
      <CompareProvider>
        <SmoothScrollProvider>
          <Layout characterTint={charTint}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/characters/:slug" element={<CharacterPage />} />
              <Route path="/kits/:slug" element={<KitDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:id" element={<OrderConfirmationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </SmoothScrollProvider>
      </CompareProvider>
    </CartProvider>
  );
};
