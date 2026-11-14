import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  getCharacterBySlug,
  getKitsByCharacter,
  CHARACTERS,
  CharacterEmblem,
} from '@cofoco/shared';
import { KitCard } from '../../components/features/KitCard/KitCard';
import styles from './CharacterPage.module.css';

export const CharacterPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const character = slug ? getCharacterBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!character) {
    return <Navigate to="/404" replace />;
  }

  const kits = getKitsByCharacter(character.slug);
  const otherCharacters = CHARACTERS.filter((c) => c.slug !== character.slug);

  return (
    <>
      {/* 100svh Ken Burns Character Hero */}
      <section
        className={styles.hero}
        style={
          {
            '--char-accent': character.color,
            '--char-text-accent': character.textAccent,
          } as React.CSSProperties
        }
      >
        <div className={styles.heroBackdrop}>
          <img
            src={character.heroImage}
            alt={character.name}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.emblemHeader}>
              <div className={styles.emblemBadge}>
                <CharacterEmblem characterSlug={character.slug} size={32} />
              </div>
              <span className={styles.archetype}>{character.archetype}</span>
            </div>

            <h1 className={styles.name}>{character.name}</h1>
            <div className={styles.title}>{character.title}</div>

            <blockquote className={styles.cueQuote}>
              "{character.cue}"
            </blockquote>
          </div>
        </div>
      </section>

      {/* Philosophy & Routine Protocol Breakdown */}
      <section className={styles.storySection} aria-label="Discipline Protocol">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyCol}>
              <h2 className={styles.colHeading}>THE MYTHIC FOUNDATION</h2>
              <p className={styles.bodyText}>{character.mythicContext}</p>
            </div>

            <div className={styles.storyCol}>
              <h2 className={styles.colHeading}>CALIBRATED ROUTINE PROTOCOL</h2>
              <p className={styles.bodyText}>{character.routineDescription}</p>
              <div style={{ marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.875rem', color: character.textAccent, letterSpacing: '0.08em' }}>
                PRIMARY FOCUS: {character.discipline}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linked Equipment Kits Grid */}
      <section className={styles.kitsSection} aria-label={`${character.name} Equipment Kits`}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            {character.name} CAPSULES ({kits.length})
          </h2>

          <div className={styles.kitsGrid}>
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Archetypes Navigation Row */}
      <section className={styles.otherSection} aria-label="Other Character Archetypes">
        <div className="container">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.08em', margin: 0 }}>
            EXPLORE COMPANION ARCHETYPES
          </h3>

          <div className={styles.otherTrack}>
            {otherCharacters.map((other) => (
              <Link
                key={other.slug}
                to={`/characters/${other.slug}`}
                className={styles.otherCard}
              >
                <CharacterEmblem characterSlug={other.slug} size={24} style={{ color: other.textAccent }} />
                <div className={styles.otherName}>{other.name}</div>
                <div className={styles.otherArchetype}>{other.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
