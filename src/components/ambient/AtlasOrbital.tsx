'use client';

import React from 'react';

export interface AtlasOrbitalProps {
  size?: number;
  top?: string | number;
  right?: string | number;
  left?: string | number;
  bottom?: string | number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AtlasOrbital — Layer 2 Atlas Motif
 * Subtle geometric orbital rings with knowledge node coordinates, evoking the Atlas exploration engine.
 */
export function AtlasOrbital({
  size = 420,
  top = '-60px',
  right = '-60px',
  left,
  bottom,
  opacity = 0.22,
  className = '',
  style = {},
}: AtlasOrbitalProps) {
  return (
    <div
      aria-hidden="true"
      className={`ea-ambient-orbital ${className}`}
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top: top !== undefined ? (typeof top === 'number' ? `${top}px` : top) : undefined,
        right: right !== undefined ? (typeof right === 'number' ? `${right}px` : right) : undefined,
        left: left !== undefined ? (typeof left === 'number' ? `${left}px` : left) : undefined,
        bottom: bottom !== undefined ? (typeof bottom === 'number' ? `${bottom}px` : bottom) : undefined,
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        style={{
          width: '100%',
          height: '100%',
          animation: 'ea-orbital-rotate 120s linear infinite',
        }}
      >
        {/* Concentric Orbital Rings */}
        <circle cx="200" cy="200" r="180" stroke="var(--ea-ambient-orbital, rgba(99, 102, 241, 0.15))" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="125" stroke="var(--ea-ambient-orbital, rgba(99, 102, 241, 0.20))" strokeWidth="1" />
        <circle cx="200" cy="200" r="70" stroke="var(--ea-ambient-orbital, rgba(99, 102, 241, 0.25))" strokeWidth="1" strokeDasharray="2 4" />

        {/* Orbiting Knowledge Nodes */}
        <circle cx="200" cy="20" r="3.5" fill="var(--accent, #6366F1)" />
        <circle cx="325" cy="200" r="2.5" fill="var(--secondary, #38BDF8)" />
        <circle cx="150" cy="250" r="2" fill="var(--accent-hover, #818CF8)" />
      </svg>
    </div>
  );
}
