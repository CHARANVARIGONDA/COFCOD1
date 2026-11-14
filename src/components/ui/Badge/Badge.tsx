import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'surface' | 'lowStock' | 'preOrder' | 'outOfStock';
  isPill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  isPill = false,
  className = '',
  style,
}) => {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${isPill ? styles.pill : ''} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
