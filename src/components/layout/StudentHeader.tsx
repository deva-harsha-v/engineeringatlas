'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAcademicProfile } from '@/lib/useProfile';
import { AcademicSelectorModal } from '@/components/academic/AcademicSelectorModal';
import { SearchModal } from './SearchModal';
import { ThemeToggle } from './ThemeToggle';

interface StudentHeaderProps {
  onMobileMenuToggle?: () => void;
}

export function StudentHeader({ onMobileMenuToggle }: StudentHeaderProps) {
  const { profile } = useAcademicProfile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sectionLabel = profile.section || 'CSE-A';
  const semesterLabel = profile.semesterName ? profile.semesterName.toUpperCase() : 'VII SEMESTER';
  const studentName = profile.studentName || 'Aspirant';
  const studentInitial = studentName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className="student-header-root ea-mobile-navbar-header"
        style={{
          height: '62px',
          padding: '0 clamp(14px, 3.5vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        {/* Left Side: Academic Context Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, minWidth: 0 }}>
          {/* Academic Context Selector Pill */}
          <button
            type="button"
            onClick={() => setIsContextModalOpen(true)}
            aria-label="Change academic context"
            title="Click to view details or switch cohort / semester"
            className="ea-navbar-context-pill student-header-context-pill"
          >
            <span className="ea-navbar-context-dot" />
            <span suppressHydrationWarning className="ea-navbar-context-text">
              {sectionLabel} · {profile.semesterName ? profile.semesterName.replace(/Semester/i, 'SEM').toUpperCase() : 'VII SEM'}
            </span>
            <ChevronDown size={14} color="#64748B" style={{ flexShrink: 0 }} />
          </button>
        </div>

        {/* Center: Global Search Bar (Desktop only) */}
        <div className="desktop-only" style={{ flex: 1, maxWidth: '520px', minWidth: '180px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            id="search-trigger-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search subjects, topics, materials, quizzes (Ctrl+K)"
            className="student-header-search-bar"
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '38px',
              borderRadius: '9999px',
              backgroundColor: 'var(--surface-container-low, #111722)',
              border: '1px solid var(--border)',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <Search size={15} color="var(--accent, #6366F1)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Search subjects, topics, materials, quizzes...
              </span>
            </div>

            <kbd
              style={{
                padding: '2px 7px',
                backgroundColor: 'var(--surface-container-high, #1A2233)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--text-secondary)',
                flexShrink: 0,
              }}
            >
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Side: [Search] [ThemeToggle] [Profile Capsule] */}
        <div className="ea-navbar-right-group">
          {/* Mobile Search Button matching reference */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search dialog"
            title="Search"
            className="ea-navbar-circle-btn mobile-only"
          >
            <Search size={18} color="#6366F1" strokeWidth={2.2} />
          </button>

          {/* Theme Toggle - Circular button matching reference */}
          <ThemeToggle variant="circle" />

          {/* Profile Dropdown Capsule Pill */}
          <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              aria-expanded={isProfileDropdownOpen}
              aria-label="Student account menu"
              className="ea-navbar-profile-pill student-header-profile-pill"
            >
              {/* Blue Avatar Circle with Initial */}
              <div className="ea-navbar-avatar-badge" suppressHydrationWarning>
                {studentInitial}
              </div>

              <span
                suppressHydrationWarning
                className="desktop-only"
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  paddingRight: '2px',
                }}
              >
                {studentName}
              </span>

              <ChevronDown
                size={14}
                color="#64748B"
                style={{
                  flexShrink: 0,
                  transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

          {/* Profile Dropdown Popover */}
          {isProfileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {studentInitial}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {studentName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {profile.branch} • {profile.section}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a
                  href="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--error, #EF4444)',
                    fontSize: '12.5px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Exit Session</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AcademicSelectorModal isOpen={isContextModalOpen} onClose={() => setIsContextModalOpen(false)} />
    </>
  );
}
