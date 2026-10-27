'use client';

import React from 'react';
import Image from 'next/image';

export interface RippleLoaderProps {
  size?: 'sm' | 'md' | 'lg' | number;
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  className?: string;
}

export function RippleLoader({
  size = 'md',
  message,
  subMessage,
  fullScreen = false,
  className = '',
}: RippleLoaderProps) {
  // Proportions for concentric ripple system
  let pixelSize = 220;
  let logoSize = 38;

  if (typeof size === 'number') {
    pixelSize = size;
    logoSize = Math.max(20, Math.round(size * 0.17));
  } else if (size === 'sm') {
    pixelSize = 160;
    logoSize = 28;
  } else if (size === 'lg') {
    pixelSize = 260;
    logoSize = 46;
  } else {
    // 'md'
    pixelSize = 220;
    logoSize = 38;
  }

  // Determine typography
  let primaryTitle = 'ENGINEERING ATLAS';
  let statusText = 'LOADING...';

  if (subMessage && subMessage !== 'Engineering Atlas') {
    statusText = subMessage;
  } else if (message) {
    if (message.toLowerCase().includes('engineering atlas') || message.toLowerCase() === 'loading...') {
      primaryTitle = 'ENGINEERING ATLAS';
      statusText = 'LOADING...';
    } else {
      statusText = message;
    }
  }

  const loaderBody = (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${primaryTitle} - ${statusText}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      className={className}
    >
      {/* 5 Concentric Ripple Box Hierarchy */}
      <div
        className="ea-ripple-loader"
        style={{
          ['--loader-size' as any]: `${pixelSize}px`,
        }}
      >
        {/* Box 1 (Innermost with Centered Official Logo) */}
        <div className="box">
          <div className="center-logo-box">
            <Image
              src="/images/logo.png"
              alt="Engineering Atlas"
              width={logoSize}
              height={logoSize}
              priority
              style={{
                objectFit: 'contain',
                width: `${logoSize}px`,
                height: `${logoSize}px`,
                filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.45))',
              }}
            />
          </div>
        </div>

        {/* Outer Concentric Echo Boxes */}
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
      </div>

      {/* Typography Lockup */}
      <div className="ea-loader-text-group">
        <div className="ea-loader-brand-title">{primaryTitle}</div>
        <div className="ea-loader-status-text">{statusText}</div>
      </div>
    </div>
  );

  if (fullScreen) {
    return <div className="ea-loader-overlay">{loaderBody}</div>;
  }

  return loaderBody;
}

export function FullScreenRippleLoader({
  isVisible = true,
  message = 'Loading Engineering Atlas...',
  subMessage,
}: {
  isVisible?: boolean;
  message?: string;
  subMessage?: string;
}) {
  if (!isVisible) return null;
  return <RippleLoader fullScreen size="lg" message={message} subMessage={subMessage} />;
}
