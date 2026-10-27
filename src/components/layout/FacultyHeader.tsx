'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface FacultyHeaderProps {
  facultyName?: string;
  department?: string;
  onMobileMenuToggle?: () => void;
}

export function FacultyHeader({
  facultyName = 'Dr. P. Kumar',
  department = 'CSE Department',
  onMobileMenuToggle,
}: FacultyHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      router.push('/login');
    }
  };

  const initial = facultyName.replace(/^Dr\.\s*|^Prof\.\s*/, '').charAt(0) || 'P';

  return (
    <header
      className="faculty-header-bar ea-mobile-navbar-header"
      style={{
        height: '62px',
        padding: '0 clamp(14px, 3.5vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
    >
      {/* If mobile search is open, display full-width sleek mobile search input */}
      {isMobileSearchOpen ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              autoFocus
              placeholder="Search classes, materials, assignments..."
              className="faculty-search-input"
              style={{
                width: '100%',
                height: '38px',
                paddingLeft: '36px',
                paddingRight: '12px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="ea-navbar-circle-btn"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          {/* Left controls: Circular Hamburger on Mobile & Desktop Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {/* Mobile menu circular hamburger button matching reference */}
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="ea-navbar-circle-btn mobile-only"
                aria-label="Open navigation menu"
                title="Navigation menu"
              >
                <Menu size={19} color="currentColor" strokeWidth={2.2} />
              </button>
            )}

            {/* Desktop Search Bar */}
            <div className="faculty-desktop-search-wrap desktop-only" style={{ position: 'relative', width: '320px' }}>
              <Search
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search classes, materials, assignments..."
                className="faculty-search-input"
                style={{
                  width: '100%',
                  height: '38px',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Right Controls: [Search] [ThemeToggle] [Notifications] [Profile Capsule] */}
          <div className="ea-navbar-right-group">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="ea-navbar-circle-btn mobile-only"
              title="Search"
              aria-label="Open search bar"
            >
              <Search size={18} color="#6366F1" strokeWidth={2.2} />
            </button>

            {/* Instant Theme Toggle (persists and switches whole portal) */}
            <ThemeToggle variant="circle" />

            {/* Notification Bell Button (Visible on both Mobile and Desktop) */}
            <div ref={notifRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (dropdownOpen) setDropdownOpen(false);
                }}
                className="ea-navbar-circle-btn"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} color="#6366F1" strokeWidth={2.2} />
                {/* Red alert dot */}
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    border: '2px solid var(--surface-1, #FFFFFF)',
                  }}
                />
              </button>

              {notifOpen && (
                <div
                  className="faculty-card faculty-dropdown-menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '280px',
                    maxWidth: 'min(300px, calc(100vw - 20px))',
                    padding: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Notifications
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6' }}>
                      2 new
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                      <span style={{ fontWeight: 600, color: '#3B82F6' }}>Assignment 03 · Normalization</span> scheduled for publication.
                    </div>
                    <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                      <span style={{ fontWeight: 600, color: '#F59E0B' }}>Unpublished Draft:</span> Assignment 04 is waiting in Drafts.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Capsule Pill & Dropdown (ONLY Sign Out) */}
            <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  if (notifOpen) setNotifOpen(false);
                }}
                className="ea-navbar-profile-pill"
                aria-label="User account menu"
              >
                {/* Blue Avatar Circle with Initial */}
                <div className="ea-navbar-avatar-badge">
                  {initial}
                </div>

                {/* Desktop Name & Department text */}
                <div className="faculty-profile-text desktop-only" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginRight: '4px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary, #0F172A)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {facultyName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary, #64748B)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {department}
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  color="#64748B"
                  style={{
                    flexShrink: 0,
                    transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="faculty-card faculty-dropdown-menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                    padding: '6px',
                    width: '160px',
                    zIndex: 100,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#DC2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
