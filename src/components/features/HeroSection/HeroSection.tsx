import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS, BRAND_IMAGES, CharacterEmblem } from '@cofoco/shared';
import { Button } from '../../ui/Button/Button';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const [activeBackdrop, setActiveBackdrop] = useState<string>(BRAND_IMAGES.homeHero);
  const [activeCharSlug, setActiveCharSlug] = useState<string | null>(null);

  const handleCharHover = (charSlug: string, heroImage: string) => {
    setActiveBackdrop(heroImage);
    setActiveCharSlug(charSlug);
  };

  const handleCharLeave = () => {
    setActiveBackdrop(BRAND_IMAGES.homeHero);
    setActiveCharSlug(null);
  };

  const activeChar = CHARACTERS.find((c) => c.slug === activeCharSlug);

  return (
    <section className={styles.heroContainer} aria-label="Hero Overview">
      {/* Background with crossfade transitions */}
      <div className={styles.heroBackdrop}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeBackdrop}
            src={activeBackdrop}
            alt="COFOCO Kinetic Performance"
            className={styles.heroImage}
            initial={{ opacity: 0.7, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.7 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </AnimatePresence>
        <div className={styles.heroGradientOverlay} />
      </div>

      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>CONSCIOUS FORM COMPANY // KINETIC LUXE</span>
          </div>

          <h1 className={styles.headline}>
            RAW CAPACITY.
            <br />
            <span className="gold-gradient-text">DELIBERATE LOAD.</span>
          </h1>

          <p className={styles.subline}>
            Character-calibrated gym equipment and somatic decompression capsules. Engineered in India for uncompromising athletes who operate without ornamental extras.
          </p>

          <div className={styles.ctaRow}>
            <a href="#kits">
              <Button variant="primary">
                EXPLORE EQUIPMENT KITS ↓
              </Button>
            </a>
            <a href="#roster">
              <Button variant="outline">
                ROSTER DISCIPLINES →
              </Button>
            </a>
          </div>

          {/* Upgraded Stylish Kinetic Archetype Grid */}
          <div className={styles.disciplinesBar}>
            <div className={styles.disciplineHeaderRow}>
              <span className={styles.disciplineLabel}>
                SELECT ATHLETIC DISCIPLINE // HOVER TO ACTIVATE PROTOCOL:
              </span>
              {activeChar && (
                <span className={styles.activeHintPill} style={{ borderColor: activeChar.color, color: activeChar.textAccent }}>
                  ● ACTIVE: {activeChar.name} // {activeChar.discipline.split('//')[0].trim()}
                </span>
              )}
            </div>

            <div className={styles.disciplineGrid}>
              {CHARACTERS.map((char) => (
                <Link
                  key={char.slug}
                  to={`/characters/${char.slug}`}
                  className={`${styles.disciplineBadge} ${activeCharSlug === char.slug ? styles.activeDiscipline : ''}`}
                  onMouseEnter={() => handleCharHover(char.slug, char.heroImage)}
                  onMouseLeave={handleCharLeave}
                  onFocus={() => handleCharHover(char.slug, char.heroImage)}
                  onBlur={handleCharLeave}
                  style={
                    {
                      '--char-color': char.color,
                      '--char-text-accent': char.textAccent,
                      '--char-glow': char.glowColor || 'rgba(212, 175, 55, 0.4)',
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.emblemContainer}>
                    <CharacterEmblem characterSlug={char.slug} size={22} className={styles.disciplineItemIcon} />
                  </div>
                  <div className={styles.badgeTextCol}>
                    <span className={styles.charBadgeName}>{char.name}</span>
                    <span className={styles.charDisciplineTag}>
                      {char.discipline.split('//')[0].trim()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
