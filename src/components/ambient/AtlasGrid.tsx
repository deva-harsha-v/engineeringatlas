'use client';

import React from 'react';

export interface AtlasGridProps {
  opacity?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AtlasGrid — Layer 1 Engineering
 * Precision technical coordinate grid directly derived from Faculty Login (54px x 54px).
 */
export function AtlasGrid({
  opacity = 1,
  size = 54,
  className = '',
  style = {},
}: AtlasGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`ea-ambient-grid ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, var(--ea-ambient-grid, rgba(255, 255, 255, 0.025)) 1px, transparent 1px),
          linear-gradient(to bottom, var(--ea-ambient-grid, rgba(255, 255, 255, 0.025)) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: '0 0',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        ...style,
      }}
    />
  );
}
