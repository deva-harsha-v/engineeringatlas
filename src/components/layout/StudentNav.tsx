'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Compass, BookOpen, CheckSquare, FileText, ChevronDown, Sparkles } from 'lucide-react';
import { useAcademicProfile } from '@/lib/useProfile';
import { AcademicSelectorModal } from '@/components/academic/AcademicSelectorModal';
import { SearchModal } from './SearchModal';

export function StudentNav() {
  const pathname = usePathname();
  const { profile } = useAcademicProfile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/student/home' && (pathname === '/student/home' || pathname === '/student')) return true;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(8, 11, 18, 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="ea-container"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Logo */}
          <Link
            href="/student/home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="4" r="2.5" fill="#6366F1" />
                <circle cx="4" cy="20" r="2.5" fill="#6366F1" />
                <circle cx="20" cy="20" r="2.5" fill="#6366F1" />
                <line x1="12" y1="4" x2="4" y2="20" stroke="#6366F1" strokeWidth="1.8" />
                <line x1="12" y1="4" x2="20" y2="20" stroke="#6366F1" strokeWidth="1.8" />
                <line x1="6.5" y1="15" x2="17.5" y2="15" stroke="#818CF8" strokeWidth="1.8" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                }}
              >
                ENGINEERING ATLAS
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                Sri Vasavi Engg College
              </span>
            </div>
          </Link>

          {/* Search Trigger Input (Desktop) */}
          <div className="desktop-only" style={{ flex: '1', maxWidth: '380px' }}>
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              style={{
                width: '100%',
                padding: '8px 14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-muted)',
                fontSize: '13px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={15} color="var(--accent)" />
                Search concepts, subjects, papers...
              </span>
              <kbd
                style={{
                  padding: '2px 6px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/student/atlas"
              className={`btn ${isActive('/student/atlas') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '13px',
                color: isActive('/student/atlas') ? 'var(--accent-hover)' : undefined,
                borderColor: isActive('/student/atlas') ? 'var(--accent)' : undefined,
              }}
            >
              <Compass size={15} />
              Atlas
            </Link>

            <Link
              href="/student/subjects"
              className={`btn ${isActive('/student/subjects') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '13px',
                color: isActive('/student/subjects') ? 'var(--accent-hover)' : undefined,
                borderColor: isActive('/student/subjects') ? 'var(--accent)' : undefined,
              }}
            >
              <BookOpen size={15} />
              Subjects
            </Link>

            <Link
              href="/student/practice"
              className={`btn ${isActive('/student/practice') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '13px',
                color: isActive('/student/practice') ? 'var(--accent-hover)' : undefined,
                borderColor: isActive('/student/practice') ? 'var(--accent)' : undefined,
              }}
            >
              <CheckSquare size={15} />
              Practice
            </Link>

            <Link
              href="/student/papers"
              className={`btn ${isActive('/student/papers') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '13px',
                color: isActive('/student/papers') ? 'var(--accent-hover)' : undefined,
                borderColor: isActive('/student/papers') ? 'var(--accent)' : undefined,
              }}
            >
              <FileText size={15} />
              Papers
            </Link>
          </nav>

          {/* Academic Context Switcher Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="mobile-only"
              onClick={() => setIsSearchOpen(true)}
              style={{
                padding: '8px',
                color: 'var(--text-secondary)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Search size={16} />
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              title="Click to change academic branch/semester/section"
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
              <span>{profile.section} · {profile.semesterName || 'VII Sem'}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AcademicSelectorModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}
