'use client';

import React from 'react';
import Link from 'next/link';
import { AtlasAmbientBackground } from './AtlasAmbientBackground';

export interface AtlasEmptyStateProps {
  icon?: React.ReactNode;
  coordinate?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AtlasEmptyState — Intentional Branded Academic Empty State
 * Replaces stark blank screens with a restrained ambient composition (coordinate grid + soft indigo/blue shapes).
 */
export function AtlasEmptyState({
  icon,
  coordinate,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  className = '',
  style = {},
}: AtlasEmptyStateProps) {
  return (
    <div
      className={`ea-empty-state ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: 'clamp(36px, 6vw, 56px) 24px',
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Restrained Ambient Visual Layer */}
      <AtlasAmbientBackground
        intensity="subtle"
        contained
        showGrid
        showShapes
        showGlow
      />

      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '440px' }}>
        {coordinate && (
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10.5px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            {coordinate}
          </div>
        )}

        {icon && (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-container-high, rgba(99, 102, 241, 0.10))',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent, #6366F1)',
              marginBottom: '6px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            {icon}
          </div>
        )}

        <h3
          style={{
            fontSize: '17px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 2px',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {description}
        </p>

        {actionText && actionHref && (
          <Link href={actionHref} style={{ textDecoration: 'none', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {actionText}
            </button>
          </Link>
        )}

        {actionText && onAction && !actionHref && (
          <button
            type="button"
            onClick={onAction}
            className="btn btn-secondary btn-sm"
            style={{
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginTop: '12px',
            }}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
