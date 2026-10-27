'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface EngineeringAtlasLogoProps {
  variant?: 'icon' | 'full' | 'extended';
  size?: 'sm' | 'md' | 'lg' | number;
  href?: string;
  className?: string;
  showSubtitle?: boolean;
  compactText?: boolean;
}

export function EngineeringAtlasLogo({
  variant = 'full',
  size = 'md',
  href = '/student/home',
  className = '',
  showSubtitle = true,
  compactText = false,
}: EngineeringAtlasLogoProps) {
  // Compute pixel dimensions
  let height = 36;
  if (typeof size === 'number') {
    height = size;
  } else if (size === 'sm') {
    height = 30;
  } else if (size === 'lg') {
    height = 42;
  } else {
    height = 36;
  }

  const logoContent = (
    <div
      className={`ea-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Official Engineering Atlas Logo Mark */}
      <div
        className="ea-logo-mark"
        style={{
          height: `${height}px`,
          width: `${Math.round(height * 1.05)}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/logo.png"
          alt="Engineering Atlas Logo"
          width={Math.round(height * 1.05)}
          height={height}
          priority
          style={{
            objectFit: 'contain',
            height: '100%',
            width: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
          }}
        />
      </div>

      {/* Typography Lockup */}
      {variant !== 'icon' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: size === 'sm' ? '12px' : size === 'lg' ? '15px' : '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
            }}
          >
            {compactText ? (
              <>
                <span className="ea-brand-title-full">ENGINEERING ATLAS</span>
                <span className="ea-brand-title-compact">ATLAS</span>
              </>
            ) : (
              'ENGINEERING ATLAS'
            )}
          </span>
          {(variant === 'extended' || (showSubtitle && variant === 'full')) && (
            <span
              style={{
                fontSize: size === 'sm' ? '9px' : '10px',
                color: 'var(--text-muted)',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginTop: '2px',
                fontWeight: 500,
              }}
            >
              Sri Vasavi Engg College
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
