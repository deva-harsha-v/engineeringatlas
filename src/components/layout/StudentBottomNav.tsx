'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_NAVIGATION, isRouteActive } from '@/lib/navigation';

export interface StudentBottomNavProps {
  isHidden?: boolean;
}

/**
 * Engineering Atlas Student Mobile Bottom Navigation
 *
 * Floating capsule pill navigation bar for mobile students.
 * - 5 primary destinations: Home, Atlas, Subjects, Practice, Papers
 * - Active item: soft inner pill highlight, accent icon + bold label
 * - Inactive items: muted icon + label
 * - Dual-theme: dark (#111722) and light (#FFFFFF)
 * - Safe-area aware, touch-target >= 44px, zero new dependencies
 */
export function StudentBottomNav({ isHidden = false }: StudentBottomNavProps) {
  const pathname = usePathname();

  // Only render inside authenticated student routes
  if (isHidden || !pathname || !pathname.startsWith('/student') || pathname === '/student/setup') {
    return null;
  }

  return (
    <nav
      className="student-bottom-nav"
      aria-label="Student Mobile Primary Navigation"
    >
      {PRIMARY_NAVIGATION.map((item) => {
        const Icon = item.icon;
        const active = isRouteActive(item.path, pathname);

        return (
          <Link
            key={item.id}
            href={item.path}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
            className={`student-nav-item${active ? ' active' : ''}`}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.75}
              className="student-nav-icon"
              aria-hidden="true"
            />
            <span className="student-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
