import React from 'react';
import styles from './MarqueeStrip.module.css';

export const MarqueeStrip: React.FC = () => {
  const textGroup = (
    <div className={styles.marqueeItem}>
      <span>CONSCIOUS FORM COMPANY</span>
      <span className={styles.dot} />
      <span className={styles.goldWord}>DELIBERATE LOAD</span>
      <span className={styles.dot} />
      <span>ARJUN</span>
      <span>BHEEMA</span>
      <span>KARNA</span>
      <span>SITA</span>
      <span>DRAUPADI</span>
      <span>SAVITRI</span>
      <span className={styles.dot} />
      <span className={styles.goldWord}>ZERO ORNAMENTAL EXTRAS</span>
      <span className={styles.dot} />
    </div>
  );

  return (
    <div className={styles.marqueeContainer} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {textGroup}
        {textGroup}
        {textGroup}
        {textGroup}
      </div>
    </div>
  );
};
