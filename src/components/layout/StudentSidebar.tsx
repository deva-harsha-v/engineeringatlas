'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Target,
  FileText,
  Compass,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/student/home', icon: Home },
  { id: 'subjects', label: 'Subjects', path: '/student/subjects', icon: BookOpen },
  { id: 'practice', label: 'Practice', path: '/student/practice', icon: Target },
  { id: 'papers', label: 'Papers', path: '/student/papers', icon: FileText },
  { id: 'atlas', label: 'Atlas', path: '/student/atlas', icon: Compass },
];

interface StudentSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function StudentSidebar({
  isMobileOpen = false,
  onMobileClose,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ea-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
      if (current) setTheme(current);
    }

    const handleThemeChange = () => {
      const updated = (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
      setTheme(updated);
    };

    window.addEventListener('ea-theme-change', handleThemeChange);
    return () => window.removeEventListener('ea-theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
    localStorage.setItem('ea-theme', nextTheme);
    window.dispatchEvent(new Event('ea-theme-change'));
  };

  const isItemActive = (path: string) => {
    if (path === '/student/home') {
      return pathname === '/student/home' || pathname === '/student';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      className="student-sidebar-root desktop-only"
      style={{
          width: '240px',
          minWidth: '240px',
          maxWidth: '240px',
          alignSelf: 'stretch',
          minHeight: '100%',
          backgroundColor: 'var(--surface-1)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 14px',
          boxSizing: 'border-box',
          zIndex: 95,
          userSelect: 'none',
        }}
      >
        {/* Top: Logo & Close Button (Mobile) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            paddingLeft: '4px',
          }}
        >
          <EngineeringAtlasLogo
            variant="full"
            size="md"
            href="/student/home"
            showSubtitle={false}
          />
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="mobile-only"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
              }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Primary Navigation List */}
        <nav aria-label="Student Primary Navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);

              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    onClick={() => {
                      if (onMobileClose) onMobileClose();
                    }}
                    className={`student-sidebar-link ${active ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13.5px',
                      fontWeight: active ? 600 : 500,
                      border: active
                        ? '1px solid rgba(99, 102, 241, 0.28)'
                        : '1px solid transparent',
                      transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.2 : 1.8}
                      color="currentColor"
                      style={{ flexShrink: 0 }}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle Pill — Positioned cleanly at the bottom of the sidebar content */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={toggleTheme}
            className="student-sidebar-theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3px 5px 3px 12px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              boxSizing: 'border-box',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="#A8B1C2" />
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Light
                  </span>
                </>
              ) : (
                <>
                  <Sun size={15} color="#0F172A" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>
                    Light
                  </span>
                </>
              )}
            </div>

            {/* Circular active indicator */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? '#080B12' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid #CBD5E1',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? (
                <Moon size={14} color="#818CF8" />
              ) : (
                <Moon size={14} color="#4F46E5" />
              )}
            </div>
          </button>
        </div>
      </aside>
  );
}
