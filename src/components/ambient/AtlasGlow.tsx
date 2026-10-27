'use client';

import React from 'react';

export interface AtlasGlowProps {
  color?: string;
  radius?: number | string;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'center' | 'bottom-right' | 'custom';
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AtlasGlow — Layer 2 Atlas
 * Restrained atmospheric radial illumination layer.
 */
export function AtlasGlow({
  color,
  radius = 320,
  opacity = 0.28,
  position = 'top-right',
  top,
  left,
  right,
  bottom,
  className = '',
  style = {},
}: AtlasGlowProps) {
  const dimension = typeof radius === 'number' ? `${radius}px` : radius;
  const glowColor = color || 'var(--ea-ambient-glow, rgba(99, 102, 241, 0.16))';

  let computedTop = top;
  let computedLeft = left;
  let computedRight = right;
  let computedBottom = bottom;

  if (position === 'top-left') {
    computedTop = top ?? '-10%';
    computedLeft = left ?? '-10%';
  } else if (position === 'top-right') {
    computedTop = top ?? '-12%';
    computedRight = right ?? '-8%';
  } else if (position === 'center') {
    computedTop = top ?? '25%';
    computedLeft = left ?? '30%';
  } else if (position === 'bottom-right') {
    computedBottom = bottom ?? '-10%';
    computedRight = right ?? '-5%';
  }

  return (
    <div
      aria-hidden="true"
      className={`ea-ambient-glow ${className}`}
      style={{
        position: 'absolute',
        width: dimension,
        height: dimension,
        top: computedTop !== undefined ? (typeof computedTop === 'number' ? `${computedTop}px` : computedTop) : undefined,
        left: computedLeft !== undefined ? (typeof computedLeft === 'number' ? `${computedLeft}px` : computedLeft) : undefined,
        right: computedRight !== undefined ? (typeof computedRight === 'number' ? `${computedRight}px` : computedRight) : undefined,
        bottom: computedBottom !== undefined ? (typeof computedBottom === 'number' ? `${computedBottom}px` : computedBottom) : undefined,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}
