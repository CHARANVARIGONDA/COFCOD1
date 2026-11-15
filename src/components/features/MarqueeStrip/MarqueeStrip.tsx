import React, { useEffect, useRef } from 'react';
import styles from './MarqueeStrip.module.css';

export const MarqueeStrip: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const items = [
      { text: 'CONSCIOUS FORM COMPANY', gold: false, dot: true },
      { text: 'DELIBERATE LOAD', gold: true, dot: true },
      { text: 'ARJUN', gold: false, dot: false },
      { text: 'BHEEMA', gold: false, dot: false },
      { text: 'KARNA', gold: false, dot: false },
      { text: 'SITA', gold: false, dot: false },
      { text: 'DRAUPADI', gold: false, dot: false },
      { text: 'SAVITRI', gold: false, dot: true },
      { text: 'ZERO ORNAMENTAL EXTRAS', gold: true, dot: true },
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = window.innerWidth < 768 ? 54 : 76;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!isPausedRef.current) {
        offset += window.innerWidth < 768 ? 0.6 : 0.85;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const fontSize = window.innerWidth < 768 ? 26 : 42;
      ctx.font = `900 ${fontSize}px "Barlow Condensed", sans-serif`;
      ctx.textBaseline = 'middle';

      // Measure total sequence width
      let seqWidth = 0;
      const gap = fontSize * 0.7;
      const dotSize = fontSize * 0.18;

      const measures = items.map((item) => {
        const textWidth = ctx.measureText(item.text).width;
        const itemWidth = textWidth + gap + (item.dot ? dotSize + gap : 0);
        seqWidth += itemWidth;
        return { ...item, textWidth, itemWidth };
      });

      // Wrap offset
      const startX = -(offset % seqWidth);
      let currentX = startX;

      // Draw enough repetitions to fill screen + overflow
      while (currentX < w + seqWidth) {
        for (const item of measures) {
          const cy = h / 2;

          if (item.gold) {
            ctx.fillStyle = '#D4AF37';
            ctx.fillText(item.text, currentX, cy);
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.strokeText(item.text, currentX, cy);
          }

          currentX += item.textWidth + gap;

          if (item.dot) {
            ctx.fillStyle = '#D4AF37';
            ctx.beginPath();
            ctx.arc(currentX + dotSize / 2, cy, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
            currentX += dotSize + gap;
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className={styles.marqueeContainer}
      aria-hidden="true"
      onPointerEnter={() => {
        isPausedRef.current = true;
      }}
      onPointerLeave={() => {
        isPausedRef.current = false;
      }}
    >
      <canvas ref={canvasRef} className={styles.marqueeCanvas} />
    </div>
  );
};
