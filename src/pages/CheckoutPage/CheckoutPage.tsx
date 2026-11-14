import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  useCart,
  validatePinCode,
  createOrderSnapshot,
  formatINR,
  type ShippingAddress,
} from '@cofoco/shared';
import { Button } from '../../components/ui/Button/Button';
import styles from './CheckoutPage.module.css';

export const CheckoutPage: React.FC = () => {
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [pinMessage, setPinMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [failureError, setFailureError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pin Code auto-lookup
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pinCode: val }));

    if (val.length === 6) {
      const res = validatePinCode(val);
      if (res.isValid && res.pinData) {
        setFormData((prev) => ({
          ...prev,
          city: res.pinData?.city || prev.city,
          state: res.pinData?.state || prev.state,
        }));
        setPinMessage(res.message);
      } else {
        setPinMessage(res.message);
      }
    } else {
      setPinMessage('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = '10-digit Phone is required';
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim() || formData.pinCode.length !== 6)
      newErrors.pinCode = 'Valid 6-digit PIN code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFailureError(null);

    // Simulate gateway delay
    setTimeout(() => {
      if (simulateFailure) {
        setIsSubmitting(false);
        setFailureError(
          'DEMO ERROR SIMULATION (US02): Payment gateway transaction timed out or bank rejected mock authorization. Please retry or switch payment method.'
        );
        return;
      }

      // Successful order
      const snapshot = createOrderSnapshot(
        items,
        formData,
        paymentMethod === 'upi' ? 'UPI / QR Intent' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'
      );

      // Save order to session storage for confirmation page retrieval
      try {
        sessionStorage.setItem(`cofoco_order_${snapshot.orderId}`, JSON.stringify(snapshot));
        sessionStorage.setItem('cofoco_latest_order_id', snapshot.orderId);
      } catch (err) {
        console.warn('Failed saving order to sessionStorage:', err);
      }

      clearCart();
      setIsSubmitting(false);
      navigate(`/order/${snapshot.orderId}`);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className={styles.title}>YOUR BAG IS EMPTY</h1>
          <p style={{ color: 'var(--text-dim)', margin: '1.5rem auto', maxWidth: '400px' }}>
            No equipment capsules found for checkout. Add a kit from our roster before proceeding.
          </p>
          <Link to="/#kits">
            <Button variant="primary">EXPLORE CAPSULES →</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className="container">
        <div className={styles.checkoutHeader}>
          <div className={styles.eyebrow}>SECURE GUEST CHECKOUT // STEP-BY-STEP</div>
          <h1 className={styles.title}>ORDER DISPATCH FORM</h1>
        </div>

        {failureError && (
          <div className={styles.failureBanner} role="alert">
            {failureError}
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className={styles.layoutGrid}>
            {/* Steps Column */}
            <div>
              {/* Step 1: Shipping Address */}
              <div className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>01</span>
                  <h2 className={styles.stepTitle}>SHIPPING & COURIER DESTINATION</h2>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Vikramaditya Sharma"
                    />
                    {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">
                      Email Address (Tracking Updates) *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="athlete@domain.com"
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="phone">
                      Mobile Number (Courier SMS Dispatch) *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile (e.g. 9876543210)"
                      maxLength={10}
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="pinCode">
                      6-Digit Indian PIN Code *
                    </label>
                    <input
                      id="pinCode"
                      type="text"
                      className={`${styles.input} ${errors.pinCode ? styles.inputError : ''}`}
                      value={formData.pinCode}
                      onChange={handlePinChange}
                      placeholder="e.g. 560001"
                      maxLength={6}
                    />
                    {pinMessage && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                        {pinMessage}
                      </span>
                    )}
                    {errors.pinCode && <span className={styles.errorText}>{errors.pinCode}</span>}
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullSpan}`}>
                    <label className={styles.label} htmlFor="addressLine1">
                      Street Address / House / Flat Number *
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      className={`${styles.input} ${errors.addressLine1 ? styles.inputError : ''}`}
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Flat 402, Titan Heights, 12th Main Rd"
                    />
                    {errors.addressLine1 && <span className={styles.errorText}>{errors.addressLine1}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="city">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bengaluru"
                    />
                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="state">
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Karnataka"
                    />
                    {errors.state && <span className={styles.errorText}>{errors.state}</span>}
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Simulator & Error Trigger */}
              <div className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>02</span>
                  <h2 className={styles.stepTitle}>PAYMENT SIMULATOR (MOCK GATEWAY)</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label
                    className={`${styles.paymentOption} ${paymentMethod === 'upi' ? styles.paymentActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className={styles.radioInput}
                    />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)' }}>
                        INSTANT UPI // QR INTENT (RECOMMENDED)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Google Pay, PhonePe, Paytm, or BHIM. Zero processing fee.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.paymentActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className={styles.radioInput}
                    />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)' }}>
                        CREDIT / DEBIT CARD
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Visa, Mastercard, RuPay, and American Express.
                      </div>
                    </div>
                  </label>

                  {/* US02 Failure Simulator Switch */}
                  <div
                    style={{
                      background: 'rgba(217, 131, 36, 0.1)',
                      border: '1px solid rgba(217, 131, 36, 0.4)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="simulateFailureCheck"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      style={{ accentColor: '#D98324' }}
                    />
                    <label
                      htmlFor="simulateFailureCheck"
                      style={{ fontSize: '0.8125rem', color: '#D98324', cursor: 'pointer' }}
                    >
                      QA Simulator: Simulate payment failure (tests US02 error message & retry behavior)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Column (Sticky) */}
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryHeading}>ORDER SUMMARY ({items.length} ITEMS)</h2>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.variantId} className={styles.itemSnapshot}>
                    <img src={item.image} alt={item.name} className={styles.itemSnapshotImg} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {item.variantName} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--gold-light)' }} className="tabular">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className="tabular">{formatINR(totals.subtotal)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Estimated 18% GST (Included)</span>
                <span className="tabular">{formatINR(totals.tax)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>FREE</span>
                  ) : (
                    <span className="tabular">{formatINR(totals.shipping)}</span>
                  )}
                </span>
              </div>

              <div className={styles.totalRow}>
                <span>TOTAL PAYABLE</span>
                <span className={`${styles.totalAmount} tabular`}>
                  {formatINR(totals.totalPayable)}
                </span>
              </div>

              <Button
                variant="primary"
                fullWidth
                type="submit"
                loading={isSubmitting}
                style={{ marginTop: '0.5rem' }}
              >
                AUTHORIZE & PLACE ORDER →
              </Button>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                30-day return guarantee // 100% plastic-free packaging
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
