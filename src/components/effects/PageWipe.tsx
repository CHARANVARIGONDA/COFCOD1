import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@cofoco/shared';
import { DEFAULT_EFFECTS_CONFIG } from '../../config/effects';
import styles from './PageWipe.module.css';

interface PageWipeProps {
  label?: string;
}

export const PageWipe: React.FC<PageWipeProps> = ({ label = 'COFOCO' }) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion || !DEFAULT_EFFECTS_CONFIG.pageWipe) {
    return null;
  }

  return (
    <motion.div
      className={styles.wipePanel}
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      exit={{ scaleX: 1 }}
      transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
      aria-hidden="true"
    >
      <div className={styles.wipeText}>{label}</div>
    </motion.div>
  );
};
