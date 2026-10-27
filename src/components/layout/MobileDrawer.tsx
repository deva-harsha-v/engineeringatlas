'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  Bookmark,
  Bell,
  Settings,
  HelpCircle,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { ThemeToggle } from './ThemeToggle';
import { AcademicProfile } from '@/lib/types';
import { useRevisionDesk } from '@/lib/useRevisionDesk';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AcademicProfile;
  onOpenSearch: () => void;
  onOpenCohortSwitcher: () => void;
  onOpenRevisionDesk?: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  profile,
  onOpenSearch,
  onOpenCohortSwitcher,
  onOpenRevisionDesk,
}: MobileDrawerProps) {
  const { count: revisionCount } = useRevisionDesk();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus management & body lock
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the close button for accessibility
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
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
      aria-label="Mobile Navigation Menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fade-in 0.2s ease-out',
        }}
      />

      {/* Drawer Surface */}
      <div
        style={{
          position: 'relative',
          width: 'min(88vw, 360px)',
          height: '100%',
          backgroundColor: 'var(--surface-container-low)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2001,
          animation: 'slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Drawer Header: Engineering Atlas Branding + Close Button */}
        <div
          style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          }}
        >
          <EngineeringAtlasLogo size="sm" variant="full" href="/student/home" showSubtitle={false} />
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-container)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: ACADEMIC CONTEXT */}
        <div style={{ padding: '18px 18px 14px' }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            Academic Context
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-container)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Branch</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {profile.branchName || profile.branch}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Year</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {profile.yearName || 'IV Year'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Semester</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {profile.semesterName || 'VII Semester'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Section</span>
              <span style={{ fontWeight: 600, color: 'var(--tertiary)', fontFamily: 'var(--font-mono)' }}>
                {profile.section}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenCohortSwitcher();
            }}
            className="btn btn-secondary"
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <SlidersHorizontal size={15} color="var(--tertiary)" />
            <span>Change Academic Profile</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 18px 14px' }} />

        {/* Section 2: NAVIGATION / TOOLS */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}
          >
            Navigation & Tools
          </div>

          {/* Search */}
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '44px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-container)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="var(--accent)" />
              <span>Search</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Concepts, Papers
            </span>
          </button>

          {/* Revision Desk */}
          <button
            onClick={() => {
              onClose();
              if (onOpenRevisionDesk) onOpenRevisionDesk();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '44px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bookmark size={18} color="var(--accent)" />
              <span>Revision Desk</span>
            </div>
            {revisionCount > 0 ? (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                {revisionCount}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>0</span>
            )}
          </button>

          {/* Announcements */}
          <Link
            href="/student/home#announcements"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '44px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={18} color="var(--tertiary)" />
              <span>Announcements</span>
            </div>
            <ChevronRight size={15} color="var(--text-muted)" />
          </Link>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 18px 14px' }} />

        {/* Section 3: PREFERENCES & SUPPORT */}
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}
          >
            Preferences & Support
          </div>

          {/* Theme Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '44px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>Theme</span>
            <ThemeToggle showLabel={true} />
          </div>

          {/* Settings */}
          <Link
            href="/student/setup"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
            }}
          >
            <Settings size={18} color="var(--text-secondary)" />
            <span>Settings</span>
          </Link>

          {/* Help */}
          <Link
            href="/about"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
            }}
          >
            <HelpCircle size={18} color="var(--accent)" />
            <span>Help</span>
          </Link>
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Sri Vasavi Engineering College</span>
          <span className="live-indicator" />
        </div>
      </div>
    </div>
  );
}
