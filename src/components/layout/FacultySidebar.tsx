'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Box,
  FileCheck,
  FileText,
  HelpCircle,
  Megaphone,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
} from 'lucide-react';
import { FACULTY_NAV_ITEMS, FacultyNavItem } from '@/lib/facultyNavConfig';
import { useFacultyClass } from '@/lib/useFacultyClass';

const ICON_MAP = {
  LayoutDashboard,
  Users,
  Box,
  FileCheck,
  FileText,
  HelpCircle,
  Megaphone,
};

interface FacultySidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FacultySidebar({
  className = '',
  isMobileOpen = false,
  onMobileClose,
}: FacultySidebarProps) {
  const pathname = usePathname();
  const { classes } = useFacultyClass();
  const [draftCount, setDraftCount] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Dynamic fetch of pending draft count for active badges
  useEffect(() => {
    async function loadDrafts() {
      try {
        const res = await fetch('/api/assignments?status=DRAFT');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDraftCount(json.data.length);
        }
      } catch (e) {
        // silent fallback
      }
    }
    loadDrafts();
  }, [pathname]);

  // Load saved collapsed state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ea_faculty_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch (e) {}
  }, []);

  const toggleCollapsed = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem('ea_faculty_sidebar_collapsed', String(nextState));
    } catch (e) {}
  };

  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        className={`faculty-sidebar ${className} ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          height: '100vh',
          maxHeight: '100vh',
          flexShrink: 0,
          backgroundColor: 'var(--surface-1)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: isMobileOpen ? 100 : 50,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease',
          ...(isMobileOpen
            ? {
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '260px',
                minWidth: '260px',
                maxWidth: '260px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }
            : {}),
        }}
      >
        {/* Brand Header with Exact Engineering Atlas Logo Asset */}
        <div
          style={{
            padding: isCollapsed ? '20px 12px' : '22px 18px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <Link
            href="/faculty"
            onClick={onMobileClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            {/* Reusing the official Engineering Atlas logo asset (/images/logo.png) */}
            <div
              style={{
                width: '32px',
                height: '32px',
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
                width={32}
                height={32}
                priority
                style={{
                  objectFit: 'contain',
                  height: 'auto',
                  width: '100%',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                }}
              />
            </div>

            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono, monospace)',
                    lineHeight: 1.15,
                  }}
                >
                  ENGINEERING
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#2563EB',
                    lineHeight: 1.15,
                    marginTop: '1px',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  ATLAS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse / Expand Toggle */}
          <button
            onClick={toggleCollapsed}
            className="faculty-sidebar-desktop-toggle"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px',
              borderRadius: '6px',
              display: isCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
            }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={onMobileClose}
            className="faculty-sidebar-mobile-close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '6px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close navigation"
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation - Strictly the Centralized FACULTY_NAV_ITEMS */}
        <nav
          style={{
            padding: isCollapsed ? '12px 8px' : '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
          }}
        >
          {FACULTY_NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);

            const Icon = ICON_MAP[item.iconName] || LayoutDashboard;

            // Badges
            let badgeText: string | undefined;
            if (item.id === 'classes' && classes.length > 0) {
              badgeText = `${classes.length}`;
            } else if (item.id === 'assignments' && draftCount > 0) {
              badgeText = `${draftCount} draft`;
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onMobileClose}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '10px' : '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? '#FFFFFF' : 'currentColor'} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {/* Badge (only when not collapsed) */}
                {!isCollapsed && badgeText && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '9999px',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : badgeText.includes('draft')
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'var(--surface-2)',
                      color: isActive
                        ? '#FFFFFF'
                        : badgeText.includes('draft')
                        ? '#D97706'
                        : 'var(--text-secondary)',
                    }}
                  >
                    {badgeText}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapsed state expand toggle button at bottom */}
        {isCollapsed && (
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            <button
              onClick={toggleCollapsed}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Bottom Tip Card (when not collapsed) */}
        {!isCollapsed && (
          <div style={{ padding: '14px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            <div
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={14} color="#2563EB" />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, fontWeight: 500 }}>
                Build a better learning experience for your classes.
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
