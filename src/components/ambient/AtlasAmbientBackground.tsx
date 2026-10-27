'use client';

import React, { useEffect, useRef } from 'react';
import { AtlasGrid } from './AtlasGrid';
import { AtlasAmbientShape } from './AtlasAmbientShape';
import { AtlasGlow } from './AtlasGlow';
import { AtlasOrbital } from './AtlasOrbital';

export type AmbientIntensity = 'none' | 'subtle' | 'medium' | 'expressive';

export interface AtlasAmbientBackgroundProps {
  fixed?: boolean;
  intensity?: AmbientIntensity;
  showGrid?: boolean;
  showShapes?: boolean;
  showGlow?: boolean;
  showOrbital?: boolean;
  gridSize?: number;
  contained?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// 6 deterministic static liquid blobs (avoids Math.random SSR hydration mismatch, matching Faculty Login source of truth)
const AMBIENT_BLOBS = [
  { size: 280, left: 16, top: 18, delay: -4, duration: 22 },
  { size: 340, left: 60, top: 38, delay: -8, duration: 18 },
  { size: 230, left: 28, top: 58, delay: -12, duration: 25 },
  { size: 270, left: 72, top: 12, delay: -16, duration: 20 },
  { size: 200, left: 42, top: 76, delay: -5, duration: 19 },
  { size: 250, left: 8, top: 68, delay: -10, duration: 24 },
];

/**
 * AtlasAmbientBackground — Engineering Atlas Ambient Visual Design System
 * 
 * Source of Truth: Approved Faculty Login page (`FacultyLogin.tsx` / `faculty-login.css`).
 * 
 * Unifies:
 * 1. Precision 54px technical coordinate grid
 * 2. Organic liquid bubble physics stage (SVG gooey filter + 6 animated blobs)
 * 3. Smooth mouse parallax (disables under prefers-reduced-motion)
 * 4. Technical + editorial academic atmosphere with subtle transparency
 */
export function AtlasAmbientBackground({
  fixed = false,
  intensity = 'subtle',
  showGrid = true,
  showShapes = true,
  showGlow = true,
  showOrbital = false,
  gridSize = 54,
  contained = false,
  className = '',
  style = {},
  children,
}: AtlasAmbientBackgroundProps) {
  if (intensity === 'none') {
    return children ? <>{children}</> : null;
  }

  // High-performance DOM refs for mouse parallax
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !fixed) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const updateParallax = () => {
      blobRefs.current.forEach((blob, index) => {
        if (blob) {
          const speed = (index + 1) * 12;
          blob.style.marginLeft = `${targetX * speed}px`;
          blob.style.marginTop = `${targetY * speed}px`;
        }
      });
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [fixed]);

  // When rendered as the full-viewport fixed background for portal shells (StudentLayout, FacultyLayout, etc.)
  if (fixed) {
    return (
      <div
        aria-hidden="true"
        className={`ea-ambient-viewport-stage ${className}`}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          backgroundColor: 'var(--mercury-bg, #06080F)',
          ...style,
        }}
      >
        {/* SVG Gooey Filter Definition (Hidden Element) */}
        <svg className="svg-filter-hidden" aria-hidden="true">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* 1. Subtle Technical Coordinate Grid Background */}
        {showGrid && <div className="mercury-grid-bg" aria-hidden="true" />}

        {/* 2. Background Liquid Physics Stage with 6 Gooey Blobs */}
        {showShapes && (
          <div className="mercury-stage" aria-hidden="true">
            {AMBIENT_BLOBS.map((blob, index) => (
              <div
                key={index}
                ref={(el) => {
                  blobRefs.current[index] = el;
                }}
                className="mercury-blob"
                style={{
                  width: `${blob.size}px`,
                  height: `${blob.size}px`,
                  left: `${blob.left}%`,
                  top: `${blob.top}%`,
                  animationDelay: `${blob.delay}s`,
                  animationDuration: `${blob.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* 3. Subtle Corner Atmospheric Glow */}
        {showGlow && (
          <>
            <AtlasGlow position="top-right" radius={400} opacity={0.22} />
            <AtlasGlow position="bottom-right" radius={320} opacity={0.16} />
          </>
        )}

        {/* 4. Optional Orbital Motif */}
        {showOrbital && (
          <AtlasOrbital size={380} top="-40px" right="-40px" opacity={0.2} />
        )}
      </div>
    );
  }

  // Intensity parameter profiles for contained mode
  const isSubtle = intensity === 'subtle';
  const isMedium = intensity === 'medium';
  const isExpressive = intensity === 'expressive';

  const gridOpacity = isSubtle ? 0.65 : 1;
  const shapeOpacity1 = isSubtle ? 0.20 : isMedium ? 0.32 : 0.42;
  const shapeOpacity2 = isSubtle ? 0.16 : isMedium ? 0.28 : 0.36;
  const shapeOpacity3 = isSubtle ? 0.12 : isMedium ? 0.24 : 0.32;
  const glowOpacity = isSubtle ? 0.18 : isMedium ? 0.28 : 0.38;

  const containedElements = (
    <div
      aria-hidden="true"
      className="ea-ambient-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 0,
      }}
    >
      {/* 1. Precision Technical Grid */}
      {showGrid && !contained && <AtlasGrid size={gridSize} opacity={gridOpacity} />}

      {/* 2. Atmospheric Ambient Lighting */}
      {showGlow && (
        <>
          <AtlasGlow
            position="top-right"
            radius={isSubtle ? 260 : 360}
            opacity={glowOpacity}
          />
          {(isMedium || isExpressive) && (
            <AtlasGlow
              position="bottom-right"
              radius={300}
              opacity={glowOpacity * 0.75}
            />
          )}
        </>
      )}

      {/* 3. Soft Organic Shapes (for contained areas like cards/headers) */}
      {showShapes && (
        <>
          <AtlasAmbientShape
            size={isSubtle ? 220 : 280}
            top="-10%"
            right="5%"
            opacity={shapeOpacity1}
            blur={34}
            animationIndex={1}
            duration={24}
            delay={-2}
            variant="primary"
          />
          {(isMedium || isExpressive) && (
            <AtlasAmbientShape
              size={isSubtle ? 180 : 240}
              top="40%"
              right="25%"
              opacity={shapeOpacity2}
              blur={38}
              animationIndex={2}
              duration={28}
              delay={-8}
              variant="indigo"
            />
          )}
          {isExpressive && (
            <AtlasAmbientShape
              size={210}
              bottom="5%"
              left="10%"
              opacity={shapeOpacity3}
              blur={36}
              animationIndex={3}
              duration={26}
              delay={-12}
              variant="cyan"
            />
          )}
        </>
      )}

      {/* 4. Atlas Orbital Motif */}
      {(showOrbital || isExpressive) && (
        <AtlasOrbital
          size={isSubtle ? 320 : 400}
          top="-40px"
          right="-40px"
          opacity={isSubtle ? 0.15 : 0.24}
        />
      )}
    </div>
  );

  if (children) {
    return (
      <div
        className={`ea-ambient-container ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        {containedElements}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    );
  }

  return containedElements;
}
