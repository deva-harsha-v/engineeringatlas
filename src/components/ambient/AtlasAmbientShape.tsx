'use client';

import React from 'react';

export interface AtlasAmbientShapeProps {
  size?: number | string;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  blur?: number;
  opacity?: number;
  delay?: number;
  duration?: number;
  animationIndex?: 1 | 2 | 3;
  variant?: 'primary' | 'indigo' | 'cyan' | 'violet';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AtlasAmbientShape — Layer 3 Organic
 * Soft, blurred, floating indigo/blue organic shape derived from the approved Faculty Login physics.
 */
export function AtlasAmbientShape({
  size = 260,
  top,
  left,
  right,
  bottom,
  blur = 32,
  opacity = 0.35,
  delay = 0,
  duration = 22,
  animationIndex = 1,
  variant = 'primary',
  className = '',
  style = {},
}: AtlasAmbientShapeProps) {
  // Gradient variants matching Engineering Atlas palette
  let gradient = 'linear-gradient(135deg, var(--ea-ambient-shape-start, #e0e6ed), var(--ea-ambient-shape-mid, #6366f1), var(--ea-ambient-shape-end, #38bdf8))';

  if (variant === 'indigo') {
    gradient = 'linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(79, 70, 229, 0.8), rgba(67, 56, 202, 0.6))';
  } else if (variant === 'cyan') {
    gradient = 'linear-gradient(135deg, rgba(56, 189, 248, 0.6), rgba(99, 102, 241, 0.7), rgba(2, 132, 199, 0.5))';
  } else if (variant === 'violet') {
    gradient = 'linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(99, 102, 241, 0.75), rgba(79, 70, 229, 0.5))';
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      aria-hidden="true"
      className={`ea-ambient-shape ea-ambient-shape-anim-${animationIndex} ${className}`}
      style={{
        position: 'absolute',
        width: dimension,
        height: dimension,
        top: top !== undefined ? (typeof top === 'number' ? `${top}px` : top) : undefined,
        left: left !== undefined ? (typeof left === 'number' ? `${left}px` : left) : undefined,
        right: right !== undefined ? (typeof right === 'number' ? `${right}px` : right) : undefined,
        bottom: bottom !== undefined ? (typeof bottom === 'number' ? `${bottom}px` : bottom) : undefined,
        borderRadius: '50%',
        background: gradient,
        filter: `blur(${blur}px)`,
        opacity,
        boxShadow: 'inset -8px -8px 20px var(--ea-ambient-shadow-in, rgba(0,0,0,0.3)), 8px 8px 24px var(--ea-ambient-shadow-out, rgba(255,255,255,0.1))',
        animation: `ea-ambient-float-${animationIndex} ${duration}s infinite alternate ease-in-out`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
        ...style,
      }}
    />
  );
}
