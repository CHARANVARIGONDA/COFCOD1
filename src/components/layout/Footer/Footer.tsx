import React from 'react';
import { Link } from 'react-router-dom';
import { CHARACTERS, APP_CONFIG } from '@cofoco/shared';
import {
  IconFreeShipping,
  IconTrial,
  IconEngineeredIndia,
  IconPlasticFree,
} from '@cofoco/shared';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        {/* Trust Signals Strip */}
        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <IconFreeShipping size={32} className={styles.trustIcon} />
            <div>
              <div className={styles.trustHeading}>NATIONWIDE EXPRESS</div>
              <p className={styles.trustDesc}>
                Complimentary tracked dispatch on all orders above ₹999 across India.
              </p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <IconTrial size={32} className={styles.trustIcon} />
            <div>
              <div className={styles.trustHeading}>30-DAY TRIAL GUARANTEE</div>
              <p className={styles.trustDesc}>
                Train with the gear. If it does not transform your routine, return for a prompt refund.
              </p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <IconEngineeredIndia size={32} className={styles.trustIcon} />
            <div>
              <div className={styles.trustHeading}>ENGINEERED IN INDIA</div>
              <p className={styles.trustDesc}>
                Machined alloys, vulcanized rubbers, and vegetable-tanned leather crafted locally.
              </p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <IconPlasticFree size={32} className={styles.trustIcon} />
            <div>
              <div className={styles.trustHeading}>100% ZERO PLASTIC</div>
              <p className={styles.trustDesc}>
                Packaged strictly in recycled kraft paper, unbleached cotton, and waxed canvas rolls.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className={styles.directoryGrid}>
          <div className={styles.brandCol}>
            <div className={styles.brandTitle}>COFOCO</div>
            <p className={styles.brandMission}>
              Conscious Form Company. We engineer uncompromising physical implements calibrated to ancient mythic archetypes. Zero ornamental extras. Strict functional utility.
            </p>
          </div>

          <div>
            <div className={styles.colTitle}>ROSTER DISCIPLINES</div>
            <ul className={styles.linkList}>
              {CHARACTERS.map((char) => (
                <li key={char.slug}>
                  <Link to={`/characters/${char.slug}`} className={styles.linkItem}>
                    {char.name} // {char.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className={styles.colTitle}>SYSTEM</div>
            <ul className={styles.linkList}>
              <li>
                <Link to="/#kits" className={styles.linkItem}>
                  Equipment Capsules
                </Link>
              </li>
              <li>
                <Link to="/compare" className={styles.linkItem}>
                  Specification Matrix
                </Link>
              </li>
              <li>
                <a href="#discipline" className={styles.linkItem}>
                  Routine Protocol
                </a>
              </li>
              <li>
                <a href={`mailto:${APP_CONFIG.supportEmail}`} className={styles.linkItem}>
                  Concierge Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className={styles.colTitle}>INTERNAL ENGINES (P0)</div>
            <ul className={styles.linkList}>
              <li>
                <Link to="/admin" className={styles.linkItem}>
                  Operations & Orders (OP01–05)
                </Link>
              </li>
              <li>
                <Link to="/analytics" className={styles.linkItem}>
                  Founder Analytics (AN01–03)
                </Link>
              </li>
              <li>
                <span className={styles.linkItem}>
                  Staff Access: MFA Protected
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className={styles.colTitle}>SANCTUARY</div>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.linkItem}>Bengaluru // Mumbai // Delhi</span>
              </li>
              <li>
                <span className={styles.linkItem}>{APP_CONFIG.contactPhone}</span>
              </li>
              <li>
                <a
                  href={APP_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                >
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Outlined Wordmark */}
        <div className={styles.giantWordmarkContainer} aria-hidden="true">
          <span className={styles.giantWordmark}>COFOCO</span>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>© {new Date().getFullYear()} Conscious Form Company. All rights reserved.</div>
          <div>Prices in INR (₹) inclusive of applicable taxes. Demo simulation.</div>
        </div>
      </div>
    </footer>
  );
};
