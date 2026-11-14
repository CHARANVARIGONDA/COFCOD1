import React, { useState } from 'react';
import { KITS, CHARACTERS } from '@cofoco/shared';
import { HeroSection } from '../../components/features/HeroSection/HeroSection';
import { MarqueeStrip } from '../../components/features/MarqueeStrip/MarqueeStrip';
import { RosterAccordion } from '../../components/features/RosterAccordion/RosterAccordion';
import { PinnedStorySection } from '../../components/features/PinnedStorySection/PinnedStorySection';
import { KitCard } from '../../components/features/KitCard/KitCard';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const [selectedCharFilter, setSelectedCharFilter] = useState<string>('all');

  const filteredKits =
    selectedCharFilter === 'all'
      ? KITS
      : KITS.filter((k) => k.characterSlug === selectedCharFilter);

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <RosterAccordion />
      <PinnedStorySection />

      {/* Filterable Kits Catalog */}
      <section id="kits" className={styles.kitsSection} aria-label="COFOCO Equipment Capsules">
        <div className="container">
          <div className={styles.kitsHeader}>
            <div>
              <div className={styles.eyebrow}>CALIBRATED EQUIPMENT CATALOG // 08 CAPSULES</div>
              <h2 className={styles.title}>TRAINING & RECOVERY KITS</h2>
            </div>
          </div>

          {/* Character Discipline Filter Buttons */}
          <div className={styles.filterBar} role="tablist" aria-label="Filter equipment by character discipline">
            <button
              type="button"
              role="tab"
              aria-selected={selectedCharFilter === 'all'}
              className={`${styles.filterPill} ${selectedCharFilter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCharFilter('all')}
            >
              ALL CAPSULES ({KITS.length})
            </button>

            {CHARACTERS.map((char) => (
              <button
                key={char.slug}
                type="button"
                role="tab"
                aria-selected={selectedCharFilter === char.slug}
                className={`${styles.filterPill} ${selectedCharFilter === char.slug ? styles.activeFilter : ''}`}
                onClick={() => setSelectedCharFilter(char.slug)}
              >
                {char.name}
              </button>
            ))}
          </div>

          {/* Grid of KitCards */}
          <div className={styles.kitsGrid}>
            {filteredKits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
