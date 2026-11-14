import React from 'react';
import { Badge } from '../../ui/Badge/Badge';
import styles from './PinnedStorySection.module.css';

export const PinnedStorySection: React.FC = () => {
  return (
    <section id="discipline" className={styles.storySection} aria-label="Brand Philosophy and Discipline">
      <div className="container">
        <div className={styles.storyGrid}>
          {/* Story Copy */}
          <div className={styles.storyTextCol}>
            <div className={styles.eyebrow}>CONSCIOUS FORM ETHOS // THE STANDARD</div>

            <h2 className={styles.headline}>
              BUILT FOR LOAD.
              <br />
              <span className="gold-gradient-text">STRIPPED OF NOISE.</span>
            </h2>

            <p className={styles.narrative}>
              Most gym equipment is noisy, plastic-bound, and designed for disposable obsolescence. At COFOCO, we reject the ornamental. Every implement is machined, cast, or hand-stitched for athletes who respect physical tension.
            </p>

            <div className={styles.pointsList}>
              <div className={styles.pointItem}>
                <span className={styles.pointNum}>01</span>
                <div>
                  <h3 className={styles.pointTitle}>TACTILE INTEGRITY OVER DECORATION</h3>
                  <p className={styles.pointDesc}>
                    Top-grain bridle leather, aircraft-grade billet aluminum, and Portuguese bark cork. Materials that gain character as they absorb chalk and sweat.
                  </p>
                </div>
              </div>

              <div className={styles.pointItem}>
                <span className={styles.pointNum}>02</span>
                <div>
                  <h3 className={styles.pointTitle}>CHARACTER CALIBRATION</h3>
                  <p className={styles.pointDesc}>
                    Six distinct physical archetypes. You do not just buy equipment; you adopt a discipline cue engineered to govern your entire morning or recovery ritual.
                  </p>
                </div>
              </div>

              <div className={styles.pointItem}>
                <span className={styles.pointNum}>03</span>
                <div>
                  <h3 className={styles.pointTitle}>COMPLETE BOM TRANSPARENCY</h3>
                  <p className={styles.pointDesc}>
                    Every kit includes an uncompromised Bill of Materials with exact specifications, tolerances, and materials disclosed upfront.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className={styles.visualFrame}>
            <img
              src="/characters/bheema-heavy-training-kit.jpg"
              alt="COFOCO Heavy Compound Equipment Craft"
              className={styles.visualImage}
              loading="lazy"
            />
            <div className={styles.badgeOverlay}>
              <Badge variant="gold">IPF SPEC // CAST STEEL</Badge>
            </div>
            <div className={styles.stampOverlay}>
              ENGINEERED IN INDIA // 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
