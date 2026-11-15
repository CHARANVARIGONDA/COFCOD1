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

  // Optimized smooth spotlight - only updates on actual mouse movement
  useEffect(() => {
    if (reducedMotion || !DEFAULT_EFFECTS_CONFIG.spotlight) return;

    // Don't run cursor spotlight on touch devices to save 100% CPU/GPU
    if (window.matchMedia('(hover: none)').matches) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isMoving = false;
    let stopTimeout: any;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateSpotlight);
      }
      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        isMoving = false;
      }, 400);
    };

    const updateSpotlight = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx * 0.18;
      currentY += dy * 0.18;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spot-x', `${Math.round(currentX)}px`);
        spotlightRef.current.style.setProperty('--spot-y', `${Math.round(currentY)}px`);
      }

      // Keep running while moving or closing distance
      if (isMoving || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        requestAnimationFrame(updateSpotlight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(stopTimeout);
    };
  }, [reducedMotion]);

  // Ultra-light Chalk dust particle simulation (paused on touch/mobile for pure 60fps)
  useEffect(() => {
    if (reducedMotion || !DEFAULT_EFFECTS_CONFIG.dust) return;

    // Disable canvas loop on mobile/touch screens for silky 60-120fps performance
    const isMobile = window.innerWidth < 768 || window.matchMedia('(hover: none)').matches;
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const particleCount = 24; // Streamlined particle count (down from 85)

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
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 1.5 + 0.6;
        const baseAlpha = Math.random() * 0.25 + 0.08;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -(Math.random() * 0.25 + 0.08),
          alpha: baseAlpha,
          baseAlpha,
          tint: Math.random() > 0.6 ? tintColor : 'rgba(240, 240, 240, 0.3)',
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
      {/* L1 Knurl Texture */}
      {DEFAULT_EFFECTS_CONFIG.knurl && <div className={styles.knurl} />}

      {/* L2 High-Performance CSS Grain Overlay (0% CPU, No SVG feTurbulence lag) */}
      {DEFAULT_EFFECTS_CONFIG.grain && <div className={styles.grain} />}

      {/* L3 Chalk Dust Canvas (Desktop Only) */}
      {DEFAULT_EFFECTS_CONFIG.dust && !reducedMotion && <canvas ref={canvasRef} className={styles.canvas} />}

      {/* L4 Vignette */}
      <div className={styles.vignette} />

      {/* L5 Gold Cursor Spotlight (Desktop Only) */}
      {DEFAULT_EFFECTS_CONFIG.spotlight && !reducedMotion && <div ref={spotlightRef} className={styles.spotlight} />}
    </div>
  );
};
