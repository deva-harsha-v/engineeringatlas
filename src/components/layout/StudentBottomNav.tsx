'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, CheckSquare, FileText } from 'lucide-react';

export function StudentBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/student/home', icon: Home },
    { label: 'Atlas', path: '/student/atlas', icon: Compass },
    { label: 'Subjects', path: '/student/subjects', icon: BookOpen },
    { label: 'Practice', path: '/student/practice', icon: CheckSquare },
    { label: 'Papers', path: '/student/papers', icon: FileText },
  ];

  return (
    <nav
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: 'rgba(13, 17, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/student/home'
            ? pathname === '/student/home' || pathname === '/student'
            : pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              color: isActive ? 'var(--accent-hover)' : 'var(--text-muted)',
              textDecoration: 'none',
              flex: 1,
              transition: 'color 0.15s ease',
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
