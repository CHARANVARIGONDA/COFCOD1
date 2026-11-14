import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@cofoco/shared';
import { DEFAULT_EFFECTS_CONFIG } from '../../config/effects';
import styles from './AtmosphereStack.module.css';

interface AtmosphereStackProps {
  tintColor?: string;
}

export const AtmosphereStack: React.FC<AtmosphereStackProps> = ({ tintColor = 'rgba(212, 175, 55, 0.4)' }) => {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Mouse position lerping for smooth spotlight
  useEffect(() => {
    if (reducedMotion || !DEFAULT_EFFECTS_CONFIG.spotlight) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateSpotlight = () => {
      // Lerp smoothing factor
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spot-x', `${currentX}px`);
        spotlightRef.current.style.setProperty('--spot-y', `${currentY}px`);
      }

      rafId = requestAnimationFrame(updateSpotlight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Chalk dust particle simulation on HTML5 Canvas
  useEffect(() => {
    if (reducedMotion || !DEFAULT_EFFECTS_CONFIG.dust) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 28 : 85;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      baseAlpha: number;
      tint: string;
    }

    let particles: Particle[] = [];

    const resize = () => {
      // Cap DPR to 1.5 to protect performance on high-DPI displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 1.8 + 0.6;
        const baseAlpha = Math.random() * 0.35 + 0.1;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.1), // gentle upward drift like gym chalk
          alpha: baseAlpha,
          baseAlpha,
          tint: Math.random() > 0.6 ? tintColor : 'rgba(240, 240, 240, 0.4)',
        });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isDocumentVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Wrap boundaries
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.tint;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, tintColor]);

  return (
    <div className={styles.stack} aria-hidden="true">
      {/* L1 Knurl */}
      {DEFAULT_EFFECTS_CONFIG.knurl && <div className={styles.knurl} />}

      {/* L2 SVG Turbulence Grain */}
      {DEFAULT_EFFECTS_CONFIG.grain && (
        <svg className={styles.grain} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="c-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#c-noise)" />
        </svg>
      )}

      {/* L3 Chalk Dust Canvas */}
      {DEFAULT_EFFECTS_CONFIG.dust && !reducedMotion && <canvas ref={canvasRef} className={styles.canvas} />}

      {/* L4 Vignette */}
      <div className={styles.vignette} />

      {/* L5 Gold Cursor Spotlight */}
      {DEFAULT_EFFECTS_CONFIG.spotlight && !reducedMotion && <div ref={spotlightRef} className={styles.spotlight} />}
    </div>
  );
};
