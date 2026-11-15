import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { OrderSnapshot } from '@cofoco/shared';
import { formatINR } from '@cofoco/shared';
import { Button } from '../../components/ui/Button/Button';
import styles from './OrderConfirmationPage.module.css';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [typedId, setTypedId] = useState<string>('');

  useEffect(() => {
    let retrieved: OrderSnapshot | null = null;
    if (id) {
      const stored = sessionStorage.getItem(`cofoco_order_${id}`);
      if (stored) {
        try {
          retrieved = JSON.parse(stored);
        } catch (e) {
          console.warn('Error reading order snapshot:', e);
        }
      }
    }

    // Fallback sample snapshot if refreshed or opened directly
    if (!retrieved) {
      retrieved = {
        orderId: id || 'CF-A89E4F',
        createdAt: new Date().toISOString(),
        customer: {
          fullName: 'Vikramaditya Sharma',
          email: 'vikram@domain.com',
          phone: '9876543210',
          addressLine1: 'Flat 402, Titan Heights, 12th Main Rd',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560001',
        },
        items: [
          {
            kitId: 'kit-arjun-01',
            variantId: 'var-arjun-01-stealth',
            kitSlug: 'arjun-morning-prep-kit',
            characterSlug: 'arjun',
            name: 'Morning Velocity Prep Kit',
            variantName: 'Stealth Matte Black',
            price: 2899,
            mrp: 3499,
            quantity: 1,
            maxStock: 12,
            image: '/characters/arjun-morning-prep-kit.jpg',
          },
        ],
        totals: {
          subtotal: 2899,
          discount: 600,
          tax: 442,
          shipping: 0,
          totalPayable: 2899,
          qualifiesForFreeShipping: true,
          amountToFreeShipping: 0,
        },
        paymentMethod: 'Instant UPI (Mock)',
        paymentStatus: 'paid',
        estimatedDeliveryDate: 'Fri, Nov 17',
        trackingTimeline: [
          {
            status: 'confirmed',
            label: 'Order Confirmed & Payment Verified',
            date: 'Today, 14:30',
            description: 'Your kit order has been secured and sent to fulfillment.',
            completed: true,
            current: false,
          },
          {
            status: 'assembled',
            label: 'Precision Hand-Assembly & Inspection',
            date: 'Pending Fulfillment',
            description: 'All components, tension calibrations, and certifications packed.',
            completed: false,
            current: true,
          },
          {
            status: 'dispatched',
            label: 'Dispatched via Express Air',
            date: 'Estimated Tomorrow',
            description: 'Courier AWB generated. Carbon-neutral priority transit.',
            completed: false,
            current: false,
          },
          {
            status: 'out_for_delivery',
            label: 'Out for Local Delivery',
            date: 'Fri, Nov 17',
            description: 'Delivery courier dispatched to your pinned shipping address.',
            completed: false,
            current: false,
          },
          {
            status: 'delivered',
            label: 'Delivered to Doorstep',
            date: 'Fri, Nov 17',
            description: 'Kit received. Welcome to the Conscious Form collective.',
            completed: false,
            current: false,
          },
        ],
      };
    }

    setOrder(retrieved);

    // Typing effect for Order ID
    const targetId = retrieved.orderId;
    let curr = '';
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < targetId.length) {
        curr += targetId[idx];
        setTypedId(curr);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [id]);

  if (!order) return null;

  return (
    <div className={styles.confirmationContainer}>
      <div className="container">
        {/* Top Success Banner */}
        <div className={styles.successCard}>
          <div className={styles.eyebrow}>DISPATCH MANIFEST CONFIRMED // PAYMENT SECURED</div>
          <h1 className={styles.title}>WELCOME TO THE DISCIPLINE.</h1>
          <p style={{ color: '#E0E0E0', fontSize: '1.05rem', maxWidth: '640px', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            Your equipment order has been calibrated and committed to fulfillment. A tracking manifest has been sent to{' '}
            <strong style={{ color: 'var(--gold-light)' }}>{order.customer.email}</strong>.
          </p>

          <div className={styles.orderIdPill}>
            <span>ORDER REFERENCE:</span>
            <span className="tabular">{typedId || order.orderId}</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Vertical Tracking Timeline */}
          <div className={styles.timelineCard}>
            <h2 className={styles.sectionHeading}>VERTICAL DISPATCH TIMELINE</h2>
            <div className={styles.timeline}>
              {order.trackingTimeline.map((step, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div
                    className={`${styles.timelineNode} ${
                      step.completed ? styles.nodeCompleted : step.current ? styles.nodeCurrent : ''
                    }`}
                  >
                    {step.completed ? '✓' : ''}
                  </div>
                  <div>
                    <h3 className={styles.timelineLabel}>{step.label}</h3>
                    <p className={styles.timelineDesc}>{step.description}</p>
                    <span className={styles.timelineDate}>{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frozen Order Summary Details */}
          <div className={styles.sideCard}>
            <h2 className={styles.sectionHeading}>FROZEN DISPATCH SUMMARY</h2>

            <div className={styles.addressBox}>
              <div className={styles.addressName}>{order.customer.fullName}</div>
              <div>{order.customer.addressLine1}</div>
              <div>
                {order.customer.city}, {order.customer.state} — {order.customer.pinCode}
              </div>
              <div style={{ marginTop: '0.25rem' }}>Phone: {order.customer.phone}</div>
              <div>Payment: {order.paymentMethod}</div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
                COMMITTED CAPSULES ({order.items.length})
              </div>
              {order.items.map((item) => (
                <div
                  key={item.variantId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      {item.variantName} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold-light)', fontWeight: 700 }} className="tabular">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                <span>Subtotal (18% GST Incl.)</span>
                <span className="tabular">{formatINR(order.totals.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                <span>Express Courier Shipping</span>
                <span style={{ color: 'var(--gold-light)' }}>
                  {order.totals.shipping === 0 ? 'FREE' : formatINR(order.totals.shipping)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: 'var(--text)',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <span>TOTAL SETTLED</span>
                <span style={{ color: 'var(--gold-light)' }} className="tabular">
                  {formatINR(order.totals.totalPayable)}
                </span>
              </div>
            </div>

            <Link to="/#kits">
              <Button variant="outline" fullWidth>
                RETURN TO CATALOG →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
