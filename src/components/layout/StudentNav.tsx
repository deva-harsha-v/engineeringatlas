'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  User,
  Menu,
  Bookmark,
  MoreHorizontal,
  FileText,
  Layers,
} from 'lucide-react';
import { useAcademicProfile } from '@/lib/useProfile';
import { useRevisionDesk } from '@/lib/useRevisionDesk';
import { AcademicSelectorModal } from '@/components/academic/AcademicSelectorModal';
import { RevisionDeskModal } from '@/components/academic/RevisionDeskModal';
import { SearchModal } from './SearchModal';
import { ThemeToggle } from './ThemeToggle';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { MobileDrawer } from './MobileDrawer';
import { MobileMenuButton } from './MobileMenuButton';

export interface StudentNavProps {
  isHidden?: boolean;
}

export function StudentNav({ isHidden = false }: StudentNavProps) {
  const pathname = usePathname();
  const { profile } = useAcademicProfile();
  const { count: revisionCount } = useRevisionDesk();

  // Strict route boundary guard: only render inside student portal routes
  if (isHidden || !pathname || !pathname.startsWith('/student')) {
    return null;
  }
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRevisionDeskOpen, setIsRevisionDeskOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Popover state for compact elements
  const [isContextPopoverOpen, setIsContextPopoverOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const contextRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on navigation
  useEffect(() => {
    setIsContextPopoverOpen(false);
    setIsMoreMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for all popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setIsContextPopoverOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/student/home' && (pathname === '/student/home' || pathname === '/student')) return true;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Floating Navbar (Hidden on Mobile) */}
      <div className="desktop-only navbar-container">
        <header className="navbar floating-navbar student-navbar-dock">
          <div className="student-nav-inner">
          {/* Official Engineering Atlas Brand Logo (Subtitle removed, responsive compact to ATLAS) */}
          <EngineeringAtlasLogo
            size="md"
            variant="full"
            href="/student/home"
            showSubtitle={false}
            compactText={true}
          />

          {/* Compact Academic Context Selector ([CSE-A ▾] / [CSE-A · III Sem ▾]) */}
          <div ref={contextRef} className="desktop-only" style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsContextPopoverOpen(!isContextPopoverOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                flexShrink: 0,
                color: 'var(--tertiary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'border-color 0.15s ease',
              }}
              title="Academic Profile: Click to view details or switch cohort"
              aria-expanded={isContextPopoverOpen}
            >
              <span className="live-indicator" />
              <span className="nav-cohort-full">
                {profile.section} · {profile.semesterName || 'VII Sem'}
              </span>
              <span className="nav-cohort-compact">
                {profile.section}
              </span>
              <ChevronDown
                size={13}
                color="var(--text-muted)"
                style={{
                  transform: isContextPopoverOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {/* Complete Academic Context Popover */}
            {isContextPopoverOpen && (
              <div className="nav-popover-menu" style={{ width: '230px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Academic Profile
                  </span>
                  <span className="badge badge-accent" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    ACTIVE
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Branch:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {profile.branchName || profile.branch}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Year:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {profile.yearName || 'IV Year'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Semester:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {profile.semesterName || 'VII Semester'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Section:</span>
                    <span style={{ fontWeight: 600, color: 'var(--tertiary)' }}>
                      {profile.section}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsContextPopoverOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: '11px',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Change Academic Context
                </button>
              </div>
            )}
          </div>

          {/* Compact Search Trigger Input (Desktop: 150-180px or icon on narrow) */}
          <div className="desktop-only nav-search-wrapper">
            <button
              id="search-trigger-btn"
              className="nav-search-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Search concepts, subjects, papers (Ctrl+K)"
              aria-label="Search concepts, subjects, papers (Ctrl+K)"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Search size={13} color="var(--accent)" />
                <span>Search...</span>
              </span>
              <kbd
                className="nav-search-kbd"
                style={{
                  padding: '1px 5px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                Ctrl K
              </kbd>
            </button>

            <button
              className="nav-search-icon-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Search (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Link
              href="/student/home"
              className={`btn ${isActive('/student/home') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                color: isActive('/student/home') ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive('/student/home') ? 'var(--surface-2)' : 'transparent',
                borderColor: isActive('/student/home') ? 'var(--border)' : 'transparent',
                fontWeight: isActive('/student/home') ? 600 : 500,
              }}
            >
              Home
            </Link>

            <Link
              href="/student/atlas"
              className={`btn ${isActive('/student/atlas') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                color: isActive('/student/atlas') ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive('/student/atlas') ? 'var(--surface-2)' : 'transparent',
                borderColor: isActive('/student/atlas') ? 'var(--border)' : 'transparent',
                fontWeight: isActive('/student/atlas') ? 600 : 500,
              }}
            >
              Atlas
            </Link>

            <Link
              href="/student/subjects"
              className={`btn ${isActive('/student/subjects') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                color: isActive('/student/subjects') ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive('/student/subjects') ? 'var(--surface-2)' : 'transparent',
                borderColor: isActive('/student/subjects') ? 'var(--border)' : 'transparent',
                fontWeight: isActive('/student/subjects') ? 600 : 500,
              }}
            >
              Subjects
            </Link>

            <Link
              href="/student/practice"
              className={`btn ${isActive('/student/practice') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                color: isActive('/student/practice') ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive('/student/practice') ? 'var(--surface-2)' : 'transparent',
                borderColor: isActive('/student/practice') ? 'var(--border)' : 'transparent',
                fontWeight: isActive('/student/practice') ? 600 : 500,
              }}
            >
              Practice
            </Link>

            <Link
              href="/student/papers"
              className={`btn nav-item-papers ${isActive('/student/papers') ? 'btn-secondary active' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                color: isActive('/student/papers') ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive('/student/papers') ? 'var(--surface-2)' : 'transparent',
                borderColor: isActive('/student/papers') ? 'var(--border)' : 'transparent',
                fontWeight: isActive('/student/papers') ? 600 : 500,
              }}
            >
              Papers
            </Link>

            {/* Compact Revision Desk Trigger ([🔖³]) */}
            <button
              type="button"
              onClick={() => setIsRevisionDeskOpen(true)}
              className="btn btn-ghost"
              style={{
                position: 'relative',
                padding: '4px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: revisionCount > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              title="Revision Desk"
              aria-label="Revision Desk"
            >
              <Bookmark size={16} color={revisionCount > 0 ? 'var(--accent)' : 'currentColor'} />
              {revisionCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '15px',
                    height: '15px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1,
                  }}
                >
                  {revisionCount}
                </span>
              )}
            </button>

            {/* Compact Secondary '⋯' Menu (Visible on 769-1099px or on demand) */}
            <div ref={moreRef} className="nav-more-dropdown-trigger" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="btn btn-ghost"
                style={{
                  padding: '6px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
                title="More Navigation"
                aria-label="More Navigation"
                aria-expanded={isMoreMenuOpen}
              >
                <MoreHorizontal size={16} />
              </button>

              {isMoreMenuOpen && (
                <div className="nav-popover-menu align-right" style={{ width: '190px' }}>
                  <Link
                    href="/student/papers"
                    onClick={() => setIsMoreMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                  >
                    <FileText size={14} color="var(--accent)" />
                    <span>Past Papers</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsRevisionDeskOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bookmark size={14} color="var(--accent)" />
                      <span>Revision Desk</span>
                    </span>
                    {revisionCount > 0 && (
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: 'var(--accent)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {revisionCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Layers size={14} color="var(--tertiary)" />
                    <span>Academic Profile</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Theme Toggle & Profile Badge on desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Theme Toggle (Preserved icon-only) */}
            <ThemeToggle />

            {/* Student Generic Identity Chip ("Aspirant") on Desktop */}
            <div
              ref={profileRef}
              className="desktop-only"
              style={{ position: 'relative' }}
            >
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingLeft: '6px',
                  borderLeft: '1px solid var(--border)',
                  background: 'none',
                  border: 'none',
                  borderLeftStyle: 'solid',
                  borderLeftWidth: '1px',
                  borderLeftColor: 'var(--border)',
                  cursor: 'pointer',
                  padding: '2px 4px 2px 6px',
                }}
                title="Aspirant — Click to view profile / academic cohort"
                aria-label="Student Profile"
                aria-expanded={isProfileDropdownOpen}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  A
                </div>
                <div className="nav-profile-name" style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    Aspirant
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  color="var(--text-muted)"
                  style={{
                    transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="nav-popover-menu align-right" style={{ width: '210px' }}>
                  <div style={{ padding: '4px 6px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Aspirant</div>
                    <div style={{ fontSize: '11px', color: 'var(--tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {profile.branch} • {profile.section}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Layers size={14} color="var(--accent)" />
                    <span>Academic Profile & Cohort</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsRevisionDeskOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Bookmark size={14} color="var(--tertiary)" />
                    <span>My Revision Desk</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* Floating Mobile Menu Button (Top Right Hamburger, Hidden on Desktop) */}
      <MobileMenuButton
        onClick={() => setIsMobileMenuOpen(true)}
        isOpen={isMobileMenuOpen}
        isHidden={isHidden}
        className="mobile-only"
      />

      {/* Global Modals & Mobile Drawer */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <RevisionDeskModal isOpen={isRevisionDeskOpen} onClose={() => setIsRevisionDeskOpen(false)} />
      <AcademicSelectorModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        profile={profile}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCohortSwitcher={() => setIsProfileModalOpen(true)}
        onOpenRevisionDesk={() => setIsRevisionDeskOpen(true)}
      />
    </>
  );
}
