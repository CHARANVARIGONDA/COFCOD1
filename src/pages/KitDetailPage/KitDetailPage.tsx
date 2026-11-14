import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  getKitBySlug,
  getCharacterBySlug,
  validatePinCode,
  useCart,
  useCompare,
} from '@cofoco/shared';
import { Price } from '../../components/ui/Price/Price';
import { Button } from '../../components/ui/Button/Button';
import { QuantityStepper } from '../../components/ui/QuantityStepper/QuantityStepper';
import { BomList } from '../../components/features/BomList/BomList';
import styles from './KitDetailPage.module.css';

export const KitDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const kit = slug ? getKitBySlug(slug) : undefined;
  const { addItem } = useCart();
  const { toggleKit, isInCompare } = useCompare();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Pin Code State
  const [pinInput, setPinInput] = useState('');
  const [pinResult, setPinResult] = useState<{ isValid?: boolean; message?: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (kit) {
      setSelectedImage(kit.primaryImage);
      setSelectedVariantIndex(0);
    }
  }, [slug, kit]);

  if (!kit) {
    return <Navigate to="/404" replace />;
  }

  const character = getCharacterBySlug(kit.characterSlug);
  const activeVariant = kit.variants[selectedVariantIndex] || kit.variants[0];
  const inCompare = isInCompare(kit.slug);

  const handleAddToCart = () => {
    if (kit.status === 'out_of_stock') return;
    addItem(
      {
        kitId: kit.id,
        variantId: activeVariant.id,
        kitSlug: kit.slug,
        characterSlug: kit.characterSlug,
        name: kit.name,
        variantName: activeVariant.name,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        maxStock: activeVariant.stockCount,
        image: kit.primaryImage,
      },
      quantity
    );
  };

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const res = validatePinCode(pinInput);
    setPinResult(res);
  };

  const galleryImages = [
    kit.primaryImage,
    ...(kit.secondaryImage ? [kit.secondaryImage] : []),
  ];

  return (
    <div
      className={styles.pdpContainer}
      style={
        {
          '--char-text-accent': character?.textAccent || 'var(--gold)',
        } as React.CSSProperties
      }
    >
      {/* Blurred Character Atmospheric Backdrop Banner */}
      <div className={styles.bannerBackdrop} aria-hidden="true">
        <img
          src={character?.heroImage || kit.primaryImage}
          alt=""
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay} />
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Gallery Column (Sticky on Desktop) */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageFrame}>
              <img
                src={selectedImage || kit.primaryImage}
                alt={kit.name}
                className={styles.mainImage}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className={styles.thumbnailsRow}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.thumbnailBtn} ${selectedImage === img ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View image thumbnail ${idx + 1}`}
                  >
                    <img src={img} alt="" className={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info & Purchase Column */}
          <div className={styles.infoCol}>
            <div>
              <div className={styles.eyebrow}>
                <Link to={`/characters/${character?.slug}`}>
                  {character?.name} ARCHETYPE // {character?.title} ↗
                </Link>
              </div>
              <h1 className={styles.title}>{kit.name}</h1>
              <p className={styles.tagline}>"{kit.tagline}"</p>
            </div>

            <div>
              <Price
                price={activeVariant.price}
                mrp={activeVariant.mrp}
                isLarge={true}
                showGstNote={true}
              />
            </div>

            <p className={styles.description}>{kit.longDescription}</p>

            {/* Variant Selector */}
            {kit.variants.length > 0 && (
              <div className={styles.variantSection}>
                <div className={styles.variantLabel}>
                  SELECT CONFIGURATION: <span style={{ color: 'var(--gold-light)' }}>{activeVariant.name}</span>
                </div>
                <div className={styles.variantPills}>
                  {kit.variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.variantPill} ${selectedVariantIndex === i ? styles.variantActive : ''}`}
                      onClick={() => setSelectedVariantIndex(i)}
                    >
                      <span
                        className={styles.colorSwatch}
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Controls */}
            <div className={styles.purchaseActions}>
              {kit.status !== 'out_of_stock' && (
                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={activeVariant.stockCount}
                  onChange={setQuantity}
                  ariaLabelPrefix={kit.name}
                />
              )}

              {kit.status === 'out_of_stock' ? (
                <Button variant="outline" fullWidth disabled>
                  JOIN WAITLIST (OUT OF STOCK)
                </Button>
              ) : kit.status === 'pre_order' ? (
                <Button variant="primary" fullWidth onClick={handleAddToCart}>
                  PRE-ORDER NOW (SHIPS IN 10 DAYS)
                </Button>
              ) : (
                <Button variant="primary" fullWidth onClick={handleAddToCart}>
                  ADD TO BAG
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => toggleKit(kit.slug)}
                aria-label="Toggle comparison"
              >
                {inCompare ? '✓ COMPARING' : '+ COMPARE'}
              </Button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className={styles.pinCheckerContainer}>
              <div className={styles.pinCheckerTitle}>CHECK DELIVERY & ESTIMATED TRANSIT</div>
              <form className={styles.pinInputRow} onSubmit={handlePinCheck}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 560001)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className={styles.pinInput}
                  aria-label="Indian PIN code"
                />
                <Button variant="surface" size="small" type="submit">
                  CHECK
                </Button>
              </form>
              {pinResult && (
                <div
                  className={`${styles.pinResult} ${pinResult.isValid ? styles.pinSuccess : styles.pinError}`}
                  role="status"
                >
                  {pinResult.message}
                </div>
              )}
            </div>

            {/* Routine Protocol Guide */}
            {kit.routines && kit.routines.length > 0 && (
              <div className={styles.routinesCard}>
                <h3 className={styles.routinesTitle}>RECOMMENDED DISCIPLINE PROTOCOL</h3>
                <div className={styles.routineList}>
                  {kit.routines.map((r, idx) => (
                    <div key={idx} className={styles.routineItem}>
                      • {r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Bill of Materials */}
            <BomList items={kit.bom} />
          </div>
        </div>
      </div>
    </div>
  );
};
