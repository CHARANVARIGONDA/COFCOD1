import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Kit } from '@cofoco/shared';
import { useCart, useCompare, BomItemIcon, getCharacterBySlug } from '@cofoco/shared';
import { Button } from '../../ui/Button/Button';
import { Badge } from '../../ui/Badge/Badge';
import { Price } from '../../ui/Price/Price';
import styles from './KitCard.module.css';

interface KitCardProps {
  kit: Kit;
}

export const KitCard: React.FC<KitCardProps> = ({ kit }) => {
  const { addItem } = useCart();
  const { toggleKit, isInCompare } = useCompare();
  const [showBomModal, setShowBomModal] = useState(false);

  const character = getCharacterBySlug(kit.characterSlug);
  const selectedVariant = kit.variants[0];
  const inCompare = isInCompare(kit.slug);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (kit.status === 'out_of_stock') return;

    addItem({
      kitId: kit.id,
      variantId: selectedVariant.id,
      kitSlug: kit.slug,
      characterSlug: kit.characterSlug,
      name: kit.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      mrp: selectedVariant.mrp,
      maxStock: selectedVariant.stockCount,
      image: kit.primaryImage,
    });
  };

  const getStatusBadge = () => {
    switch (kit.status) {
      case 'low_stock':
        return <Badge variant="lowStock">LOW STOCK // {kit.stockCount} LEFT</Badge>;
      case 'pre_order':
        return <Badge variant="preOrder">PRE-ORDER // SHIPS IN 10 DAYS</Badge>;
      case 'out_of_stock':
        return <Badge variant="outOfStock">WAITLIST // SOLD OUT</Badge>;
      default:
        return kit.badge ? <Badge variant="gold">{kit.badge}</Badge> : null;
    }
  };

  return (
    <article
      className={styles.card}
      style={
        {
          '--char-text-accent': character?.textAccent || 'var(--gold)',
        } as React.CSSProperties
      }
    >
      {/* 4:5 Image Frame with Atmospheric Grading */}
      <div className={styles.imageFrame}>
        <Link to={`/kits/${kit.slug}`} tabIndex={-1}>
          <img
            src={kit.primaryImage}
            alt={kit.name}
            className={styles.image}
            loading="lazy"
          />
        </Link>
        <div className={styles.imageGradient} />

        {/* Status Badges */}
        <div className={styles.badgesOverlay}>{getStatusBadge()}</div>

        {/* Floating Compare Pill */}
        <div className={styles.compareOverlay}>
          <button
            type="button"
            className={`${styles.compareCheckboxBtn} ${inCompare ? styles.compareActive : ''}`}
            onClick={() => toggleKit(kit.slug)}
            aria-label={`${inCompare ? 'Remove from' : 'Add to'} comparison`}
          >
            {inCompare ? '✓ COMPARING' : '+ COMPARE'}
          </button>
        </div>

        {/* Slide-Up Bill Of Materials Preview */}
        <AnimatePresence>
          {showBomModal && (
            <motion.div
              className={styles.bomModalOverlay}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            >
              <div>
                <div className={styles.bomModalHeader}>
                  <h4 className={styles.bomModalTitle}>BILL OF MATERIALS // SPEC</h4>
                  <button
                    type="button"
                    onClick={() => setShowBomModal(false)}
                    style={{ color: 'var(--text-dim)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Close BOM"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.bomModalList}>
                  {kit.bom.map((item) => (
                    <div key={item.id} className={styles.bomModalItem}>
                      <BomItemIcon iconName={item.iconName} size={20} className={styles.bomModalItemIcon} />
                      <div>
                        <div className={styles.bomModalItemName}>
                          {item.qty}x {item.name}
                        </div>
                        <div className={styles.bomModalItemSpec}>{item.spec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link to={`/kits/${kit.slug}`}>
                <Button variant="outline" size="small" fullWidth>
                  FULL TECHNICAL SPECS →
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div className={styles.body}>
        <div>
          <div className={styles.headerRow}>
            <span className={styles.charTag}>
              {character?.name} // {character?.discipline.split('//')[0].trim()}
            </span>
            <span className={styles.specPill}>
              {kit.weight} // {kit.bom.length} PCS
            </span>
          </div>

          <Link to={`/kits/${kit.slug}`}>
            <h3 className={styles.title}>{kit.name}</h3>
          </Link>
          <p className={styles.tagline}>{kit.tagline}</p>
        </div>

        {/* Pricing & Machined Action Button */}
        <div className={styles.footerSection}>
          <div className={styles.pricingRow}>
            <Price price={kit.price} mrp={kit.mrp} showGstNote={true} />
          </div>

          <button
            type="button"
            className={styles.inspectBomBtn}
            onClick={() => setShowBomModal(!showBomModal)}
            aria-label="Inspect Bill of Materials"
          >
            {showBomModal ? '▲ HIDE SPECIFICATIONS' : '▼ INSPECT BILL OF MATERIALS (' + kit.bom.length + ' ITEMS)'}
          </button>

          {kit.status === 'out_of_stock' ? (
            <button className={styles.actionBtn} disabled>
              JOIN WAITLIST // SOLD OUT
            </button>
          ) : kit.status === 'pre_order' ? (
            <button className={styles.actionBtn} onClick={handleAddToCart}>
              PRE-ORDER // SHIPS IN 10 DAYS
            </button>
          ) : (
            <button className={styles.actionBtn} onClick={handleAddToCart}>
              ADD TO BAG +
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
