import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart, KITS } from '@cofoco/shared';
import styles from './DemoControls.module.css';

export const DemoControls: React.FC = () => {
  const location = useLocation();
  const { addItem, clearCart } = useCart();
  const [collapsed, setCollapsed] = useState(false);

  // Hidden by default, shown ONLY if URL contains ?demo=1
  const isDemoMode = new URLSearchParams(location.search).get('demo') === '1';

  if (!isDemoMode) return null;

  const handleAddSampleKit = () => {
    const kit = KITS[0];
    const variant = kit.variants[0];
    addItem({
      kitId: kit.id,
      variantId: variant.id,
      kitSlug: kit.slug,
      characterSlug: kit.characterSlug,
      name: kit.name,
      variantName: variant.name,
      price: variant.price,
      mrp: variant.mrp,
      maxStock: variant.stockCount,
      image: kit.primaryImage,
    });
  };

  return (
    <div className={styles.demoPanel} role="region" aria-label="Demo Simulator Controls">
      <div className={styles.demoTitle} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>DEMO QA SIMULATOR</span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}
        >
          {collapsed ? '▲' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <>
          <button type="button" className={styles.demoBtn} onClick={handleAddSampleKit}>
            + Add Sample Kit (Arjun)
          </button>
          <button type="button" className={styles.demoBtn} onClick={clearCart}>
            Clear Cart Items
          </button>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Tip: Checkout failure toggle is available in Payment options.
          </div>
        </>
      )}
    </div>
  );
};
