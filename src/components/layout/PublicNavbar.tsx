'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  Home,
  Info,
  LogIn,
  Compass,
  Sparkles,
} from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { ThemeToggle } from './ThemeToggle';

export interface PublicNavbarProps {
  onOpenAboutModal?: () => void;
  showLandingLinks?: boolean;
}

/**
 * PublicMobileDrawer
 * Lightweight, strictly public drawer for marketing and institutional pages (/, /about, /login).
 * NEVER renders student bottom navigation, academic cohorts, or revision desks.
 */
function PublicMobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus management & body scroll lock
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Public Navigation Menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fade-in 0.2s ease-out',
        }}
      />

      {/* Drawer Surface */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px',
          height: '100%',
          backgroundColor: 'var(--surface-container-high)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface-container)',
          }}
        >
          <EngineeringAtlasLogo size="sm" variant="full" href="/" showSubtitle={true} />
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Primary Navigation Links */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
              }}
            >
              Public Navigation
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: pathname === '/' ? 'var(--surface-3)' : 'transparent',
                  color: pathname === '/' ? 'var(--accent-hover)' : 'var(--text-primary)',
                  fontWeight: pathname === '/' ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>

              <Link
                href="/about"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: pathname === '/about' ? 'var(--surface-3)' : 'transparent',
                  color: pathname === '/about' ? 'var(--accent-hover)' : 'var(--text-primary)',
                  fontWeight: pathname === '/about' ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <Info size={16} />
                <span>About</span>
              </Link>

              <Link
                href="/login"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: pathname === '/login' ? 'var(--surface-3)' : 'transparent',
                  color: pathname === '/login' ? 'var(--accent-hover)' : 'var(--text-primary)',
                  fontWeight: pathname === '/login' ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          {/* Student Portal CTA */}
          <div style={{ padding: '14px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              B.Tech Academic Workspace
            </div>
            <Link
              href="/student/home"
              onClick={onClose}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
              }}
            >
              <span>Student Companion</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Theme & Preferences */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
              }}
            >
              Appearance
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Theme Mode
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-container-low)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          <div>Sri Vasavi Engineering College (SVEC)</div>
          <div style={{ marginTop: '2px', fontFamily: 'var(--font-mono)' }}>Autonomous Institution</div>
        </div>
      </div>
    </div>
  );
}

/**
 * PublicNavbar
 * Dedicated navbar for public marketing/information pages (/, /about, /login).
 * Desktop: Floating rounded pill with [Logo + SVEC] About Sign In Student Companion → Theme
 * Mobile: Header with [EA Logo] Engineering Atlas ... ☰ and PublicMobileDrawer
 */
export function PublicNavbar({
  onOpenAboutModal,
  showLandingLinks = false,
}: PublicNavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar-container">
        <header className="navbar floating-navbar ea-navbar-shell" aria-label="Main Navigation">
          {/* Brand Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <EngineeringAtlasLogo
              size="md"
              variant="full"
              href="/"
              showSubtitle={true}
            />
          </div>

          {/* Public Desktop Navigation Links */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showLandingLinks && (
              <>
                <a
                  href="#explore"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Explore Atlas
                </a>

                <a
                  href="#philosophy"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Learning Loop
                </a>
              </>
            )}

            {onOpenAboutModal ? (
              <button
                type="button"
                onClick={onOpenAboutModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: pathname === '/about' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'all 0.15s ease',
                }}
              >
                About
              </button>
            ) : (
              <Link
                href="/about"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: pathname === '/about' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'all 0.15s ease',
                }}
              >
                About
              </Link>
            )}

            <Link
              href="/login"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: pathname === '/login' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </Link>

            <Link href="/student/home" className="btn-companion">
              <span className="nav-cohort-full">Student Companion</span>
              <span className="nav-cohort-compact">Companion</span>
              <span aria-hidden="true">→</span>
            </Link>

            <ThemeToggle />
          </div>

          {/* Mobile Actions: Companion Link & Hamburger */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/student/home"
              className="btn-companion"
              style={{ padding: '6px 10px', fontSize: '11px', height: '34px' }}
            >
              <span>Companion</span>
              <span aria-hidden="true">→</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              title="Open Menu"
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                minHeight: '38px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </header>
      </div>

      {/* Public Mobile Drawer */}
      <PublicMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
