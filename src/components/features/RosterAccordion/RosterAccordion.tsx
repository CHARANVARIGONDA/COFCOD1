import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHARACTERS, CharacterEmblem } from '@cofoco/shared';
import { Button } from '../../ui/Button/Button';
import styles from './RosterAccordion.module.css';

export const RosterAccordion: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string>('arjun');

  return (
    <section id="roster" className={styles.rosterSection} aria-label="Character Roster Disciplines">
      <div className="container">
        <div className={styles.headerBlock}>
          <div className={styles.eyebrow}>FOUNDATIONAL DISCIPLINES // 06 ARCHETYPES</div>
          <h2 className={styles.sectionTitle}>THE ACTIVE ROSTER</h2>
        </div>

        <div className={styles.accordionTrack}>
          {CHARACTERS.map((char) => {
            const isActive = activeSlug === char.slug;

            return (
              <Link
                key={char.slug}
                to={`/characters/${char.slug}`}
                className={`${styles.panel} ${isActive ? styles.activePanel : ''}`}
                onMouseEnter={() => setActiveSlug(char.slug)}
                onFocus={() => setActiveSlug(char.slug)}
                style={
                  {
                    '--char-accent': char.color,
                    '--char-text-accent': char.textAccent,
                    '--char-glow': char.glowColor,
                  } as React.CSSProperties
                }
                aria-label={`${char.name}: ${char.title}`}
              >
                <img
                  src={char.heroImage}
                  alt={`${char.name} Discipline`}
                  className={styles.panelBgImage}
                  loading="lazy"
                />
                <div className={styles.panelOverlay} />
                <div className={styles.panelGlow} />

                {/* Vertical text label when collapsed */}
                <div className={styles.collapsedTitle}>{char.name}</div>

                {/* Expanded Details */}
                <div className={styles.panelContent}>
                  <div className={styles.expandedDetails}>
                    <div className={styles.emblemBadge}>
                      <CharacterEmblem characterSlug={char.slug} size={24} />
                    </div>

                    <div className={styles.charArchetype}>{char.archetype}</div>
                    <h3 className={styles.charName}>{char.name}</h3>
                    <p className={styles.charCue}>"{char.cue}"</p>

                    <div className={styles.actionButton}>
                      <Button variant="outline" size="small">
                        VIEW CAPSULES →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
