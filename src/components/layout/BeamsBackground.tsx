'use client';

import React, { useEffect, useRef } from 'react';

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number, initialScatter = false): Beam {
  const angle = -32 + (Math.random() - 0.5) * 8; // -28 to -36 degrees
  // Engineering Atlas palette: Cyan, Sky Blue, Indigo, Violet/Purple
  const hues = [196, 218, 238, 266];
  const selectedHue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() - 0.5) * 16;

  return {
    x: Math.random() * width * 1.4 - width * 0.2,
    y: initialScatter
      ? Math.random() * (height * 2.2) - height * 0.6
      : height + Math.random() * 200,
    width: 55 + Math.random() * 90,
    length: height * 2.6,
    angle,
    speed: 0.35 + Math.random() * 0.45, // Slow, atmospheric drift
    opacity: 0.12 + Math.random() * 0.10,
    hue: selectedHue,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.012 + Math.random() * 0.018,
  };
}

export function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const beamsRef = useRef<Beam[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isDark = true;

    const detectTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-theme');
      const isExplicitLight =
        themeAttr === 'light' || document.documentElement.classList.contains('light');
      isDark = !isExplicitLight;
    };

    detectTheme();

    // Listen to theme switch mutations
    const observer = new MutationObserver(() => {
      detectTheme();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        drawFrame();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    const checkReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupCanvas = () => {
      // Since CSS applies filter: blur(20px), 1x DPR provides identical visual softness
      // while cutting GPU rasterization fillrate by 75%
      const dpr = 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Beam density scaled for desktop vs mobile
      const beamCount = width < 768 ? 14 : 22;
      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(width, height, true)
      );
    };

    setupCanvas();

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulseFactor = 0.85 + Math.sin(beam.pulse) * 0.15;

      // Theme-specific color calibration:
      // Dark mode: luminous glowing cyan, indigo, violet over navy
      // Light mode: rich, soft chromatic indigo, blue, cyan, purple with high contrast against light slate
      const baseOpacity = isDark
        ? beam.opacity * pulseFactor * 1.3
        : beam.opacity * pulseFactor * 1.5;

      const saturation = isDark ? 88 : 82;
      const lightness = isDark ? 64 : 52; // 52% in light mode provides clear chromatic visibility without washed-out pastel

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, 0)`);
      gradient.addColorStop(0.12, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${baseOpacity * 0.45})`);
      gradient.addColorStop(0.45, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${baseOpacity})`);
      gradient.addColorStop(0.65, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${baseOpacity * 0.9})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${baseOpacity * 0.35})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, ${saturation}%, ${lightness}%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < beamsRef.current.length; i++) {
        drawBeam(beamsRef.current[i]);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const beams = beamsRef.current;
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.y -= b.speed;
        b.pulse += b.pulseSpeed;

        // Reset beam seamlessly when off the top
        if (b.y + b.length < -100) {
          b.y = height + 100;
          b.x = Math.random() * width * 1.4 - width * 0.2;
          b.speed = 0.35 + Math.random() * 0.45;
          b.opacity = 0.12 + Math.random() * 0.10;
        }

        drawBeam(b);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (checkReducedMotion()) {
      drawFrame();
    } else {
      animate();
    }

    const handleResize = () => {
      setupCanvas();
      if (checkReducedMotion()) {
        drawFrame();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else if (!checkReducedMotion()) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="ea-beams-container" aria-hidden="true">
      <canvas ref={canvasRef} className="ea-beams-canvas" />
      <div className="ea-beams-overlay" />
    </div>
  );
}
