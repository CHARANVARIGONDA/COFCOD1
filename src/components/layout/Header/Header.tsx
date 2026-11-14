import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@cofoco/shared';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { itemCount, toggleDrawer } = useCart();
  const location = useLocation();

  const navItems = [
    { label: 'CHARACTERS', path: '/#roster' },
    { label: 'KITS', path: '/#kits' },
    { label: 'COMPARE', path: '/compare' },
    { label: 'OPERATIONS', path: '/admin' },
    { label: 'ANALYTICS', path: '/analytics' },
  ];

  return (
    <>
      <header className={styles.headerWrapper} role="banner">
        <nav className={styles.pillNav} aria-label="Main Navigation">
          {/* Brand Logo & Pill Indicator */}
          <Link to="/" className={styles.brandGroup} aria-label="COFOCO Home">
            <span className={styles.brandName}>COFOCO</span>
            <span className={styles.brandSub}>KINETIC LUXE</span>
          </Link>

          {/* Desktop Navigation Links with sliding gold indicator */}
          <div className={styles.navLinks}>
            {navItems.map((item) => {
              const isActive =
                item.path.startsWith('/#')
                  ? location.pathname === '/' && location.hash === item.path.replace('/', '')
                  : location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
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

          {/* Golden Bag Button matching user reference screenshot */}
          <button
            type="button"
            className={styles.bagButton}
            onClick={toggleDrawer}
            aria-label={`Open shopping bag, ${itemCount} items`}
          >
            <span>BAG</span>
            <span className={`${styles.bagCountPill} tabular`}>{itemCount}</span>
          </button>
        </nav>
      </header>

      {/* Mobile Bottom Thumb Bar */}
      <nav className={styles.mobileBar} aria-label="Mobile Navigation">
        <Link
          to="/"
          className={`${styles.mobileTab} ${location.pathname === '/' ? styles.activeTab : ''}`}
        >
          <span>HOME</span>
        </Link>
        <a href="/#roster" className={styles.mobileTab}>
          <span>ROSTER</span>
        </a>
        <a href="/#kits" className={styles.mobileTab}>
          <span>KITS</span>
        </a>
        <Link
          to="/compare"
          className={`${styles.mobileTab} ${location.pathname === '/compare' ? styles.activeTab : ''}`}
        >
          <span>COMPARE</span>
        </Link>
      </nav>
    </>
  );
};
