import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare, useCart, KITS, getKitBySlug, getCharacterBySlug, formatINR } from '@cofoco/shared';
import { Button } from '../../ui/Button/Button';
import { Badge } from '../../ui/Badge/Badge';
import { Price } from '../../ui/Price/Price';
import styles from './CompareMatrix.module.css';

export const CompareMatrix: React.FC = () => {
  const { selectedSlugs, removeKit, addKit } = useCompare();
  const { addItem } = useCart();

  const kit1 = selectedSlugs[0] ? getKitBySlug(selectedSlugs[0]) : undefined;
  const kit2 = selectedSlugs[1] ? getKitBySlug(selectedSlugs[1]) : undefined;

  const char1 = kit1 ? getCharacterBySlug(kit1.characterSlug) : undefined;
  const char2 = kit2 ? getCharacterBySlug(kit2.characterSlug) : undefined;

  const availableKits = KITS.filter((k) => !selectedSlugs.includes(k.slug));

  const handleAddToCart = (kit: typeof kit1) => {
    if (!kit || kit.status === 'out_of_stock') return;
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

  const renderKitCol = (kit: typeof kit1, char: typeof char1) => {
    if (!kit) {
      return (
        <div className={styles.emptySlot}>
          <div className={styles.emptySlotTitle}>EMPTY COMPARISON SLOT</div>
          <p className={styles.emptySlotDesc}>
            Select another equipment capsule to compare specifications side-by-side.
          </p>

          <select
            className={styles.selectorSelect}
            onChange={(e) => {
              if (e.target.value) addKit(e.target.value);
            }}
            defaultValue=""
            aria-label="Select kit to compare"
          >
            <option value="" disabled>
              + CHOOSE EQUIPMENT CAPSULE
            </option>
            {availableKits.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.name} ({formatINR(k.price)})
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className={styles.kitCol}>
        <button
          type="button"
          className={styles.removeCompareBtn}
          onClick={() => removeKit(kit.slug)}
          aria-label={`Remove ${kit.name} from comparison`}
        >
          ✕
        </button>

        <div className={styles.kitImageFrame}>
          <img src={kit.primaryImage} alt={kit.name} className={styles.kitImage} />
        </div>

        <div>
          <Badge variant="gold">{char?.name} // {char?.title}</Badge>
          <h3 className={styles.kitName}>{kit.name}</h3>
          <Price price={kit.price} mrp={kit.mrp} />
        </div>

        {/* Spec Rows */}
        <div className={styles.specRow}>
          <span className={styles.specMobileLabel}>Discipline Archetype</span>
          <span className={styles.specVal}>{char?.discipline}</span>
        </div>

        <div className={styles.specRow}>
          <span className={styles.specMobileLabel}>Dimensions</span>
          <span className={`${styles.specVal} tabular`}>{kit.dimensions}</span>
        </div>

        <div className={styles.specRow}>
          <span className={styles.specMobileLabel}>Packaged Weight</span>
          <span className={`${styles.specVal} tabular`}>{kit.weight}</span>
        </div>

        <div className={styles.specRow}>
          <span className={styles.specMobileLabel}>Included BOM Items</span>
          <span className={styles.specVal}>
            {kit.bom.map((b) => `${b.qty}x ${b.name}`).join(', ')}
          </span>
        </div>

        <div className={styles.specRow}>
          <span className={styles.specMobileLabel}>Status</span>
          <span className={styles.specVal}>
            {kit.status === 'in_stock' && 'In Stock - Dispatches Today'}
            {kit.status === 'low_stock' && `Low Stock (${kit.stockCount} left)`}
            {kit.status === 'pre_order' && 'Pre-Order Dispatches in 10 Days'}
            {kit.status === 'out_of_stock' && 'Sold Out - Join Waitlist'}
          </span>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          {kit.status === 'out_of_stock' ? (
            <Button variant="outline" fullWidth disabled>
              WAITLIST ONLY
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={() => handleAddToCart(kit)}>
              ADD TO BAG
            </Button>
          )}
          <Link to={`/kits/${kit.slug}`} style={{ display: 'block', marginTop: '0.5rem' }}>
            <Button variant="outline" size="small" fullWidth>
              VIEW DETAILS →
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.compareSection} aria-label="Side-by-side Equipment Matrix">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>SPECIFICATION AUDIT // DUAL COMPARISON</div>
          <h1 className={styles.title}>COMPARE CAPSULES</h1>
        </div>

        <div className={styles.matrixGrid}>
          {/* Labels Column (Desktop Only) */}
          <div className={styles.labelsCol} aria-hidden="true">
            <div className={styles.labelItem}>Discipline Archetype</div>
            <div className={styles.labelItem}>Dimensions</div>
            <div className={styles.labelItem}>Packaged Weight</div>
            <div className={styles.labelItem}>Included BOM Items</div>
            <div className={styles.labelItem}>Availability</div>
            <div className={styles.labelItem}>Acquisition</div>
          </div>

          {/* Kit 1 */}
          {renderKitCol(kit1, char1)}

          {/* Kit 2 */}
          {renderKitCol(kit2, char2)}
        </div>
      </div>
    </section>
  );
};
