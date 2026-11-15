import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@cofoco/shared';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { itemCount, toggleDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // In-page smooth scroll without pushing history entries
  const handleInPageScroll = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const navItems = [
    { label: 'CHARACTERS', action: (e: React.MouseEvent) => handleInPageScroll('roster', e), tag: '06 ROSTER' },
    { label: 'KITS', action: (e: React.MouseEvent) => handleInPageScroll('kits', e), tag: 'EQUIPMENT' },
    { label: 'COMPARE', path: '/compare', tag: 'MATRIX' },
    { label: 'OPERATIONS', path: '/admin', tag: 'PORTAL' },
    { label: 'ANALYTICS', path: '/analytics', tag: 'LIVE BI' },
  ];

  return (
    <>
      <header className={styles.headerWrapper} role="banner">
        <nav className={styles.pillNav} aria-label="Main Navigation">
          {/* Brand Logo - COFOCO only, NO 'KINETIC LUXE' */}
          <Link to="/" className={styles.brandGroup} aria-label="COFOCO Home">
            <span className={styles.brandName}>COFOCO</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={styles.navLinks}>
            {navItems.map((item) => {
              if (item.action) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className={styles.navLink}
                  >
                    {item.label}
                  </button>
                );
              }

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path!}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-active"
                      className={styles.activeIndicator}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Action Group: Cart Button + 3-Bar Hamburger */}
          <div className={styles.actionGroup}>
            <button
              type="button"
              className={styles.bagButton}
              onClick={toggleDrawer}
              aria-label={`Open shopping bag, ${itemCount} items`}
            >
              <span className={styles.bagLabel}>BAG</span>
              <span className={`${styles.bagCountPill} tabular`}>{itemCount}</span>
            </button>

            {/* 3-Bar Mobile Hamburger Menu Button */}
            <button
              type="button"
              className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>
          </div>
        </nav>
      </header>

      {/* Luxury Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className={styles.mobileOverlayHeader}>
              <div className={styles.brandGroup}>
                <span className={styles.brandName}>COFOCO</span>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className={styles.mobileMenuList}>
              <Link
                to="/"
                className={`${styles.mobileMenuItem} ${location.pathname === '/' ? styles.mobileMenuActive : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={styles.mobileMenuLeft}>
                  <span className={styles.mobileMenuIndex}>01</span>
                  <span className={styles.mobileMenuLabel}>HOME</span>
                </div>
                <span className={styles.mobileMenuTag}>SANCTUARY</span>
              </Link>

              {navItems.map((item, idx) => {
                if (item.action) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={styles.mobileMenuItem}
                      onClick={item.action}
                    >
                      <div className={styles.mobileMenuLeft}>
                        <span className={styles.mobileMenuIndex}>0{idx + 2}</span>
                        <span className={styles.mobileMenuLabel}>{item.label}</span>
                      </div>
                      <span className={styles.mobileMenuTag}>{item.tag}</span>
                    </button>
                  );
                }

                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    to={item.path!}
                    className={`${styles.mobileMenuItem} ${isActive ? styles.mobileMenuActive : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={styles.mobileMenuLeft}>
                      <span className={styles.mobileMenuIndex}>0{idx + 2}</span>
                      <span className={styles.mobileMenuLabel}>{item.label}</span>
                    </div>
                    <span className={styles.mobileMenuTag}>{item.tag}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Bag Action Button */}
            <div className={styles.mobileOverlayFooter}>
              <button
                type="button"
                className={styles.mobileBagCta}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleDrawer();
                }}
              >
                <span>OPEN EQUIPMENT BAG</span>
                <span className={styles.mobileBagCount}>{itemCount} ITEMS</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
