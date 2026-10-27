'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
  isHidden?: boolean;
}

/**
 * MobileMenuButton
 * Compact fixed floating hamburger trigger positioned at top-right
 * respecting safe-area-inset-top, giving full vertical space to page content.
 */
export function MobileMenuButton({
  onClick,
  isOpen = false,
  className = '',
  isHidden = false,
}: MobileMenuButtonProps) {
  if (isHidden) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mobile-only mobile-menu-btn ${className}`}
      aria-label="Open mobile navigation menu"
      aria-expanded={isOpen}
      title="Open Menu"
      style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top, 0px))',
        right: '16px',
        zIndex: 150,
        width: '42px',
        height: '42px',
        minWidth: '42px',
        minHeight: '42px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface-container)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.28), 0 1px 3px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      <Menu size={20} strokeWidth={2.2} />
    </button>
  );
}
