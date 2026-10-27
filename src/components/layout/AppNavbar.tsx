'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { ThemeToggle } from './ThemeToggle';
import { StudentNav } from './StudentNav';
import { FacultyNav } from './FacultyNav';
import { PublicNavbar } from './PublicNavbar';

export interface AppNavbarProps {
  context?: 'public' | 'student' | 'faculty' | 'admin';
  facultyName?: string;
  department?: string;
  onOpenAboutModal?: () => void;
}

export function AppNavbar({
  context = 'public',
  facultyName,
  department,
  onOpenAboutModal,
}: AppNavbarProps) {
  // Delegate directly to role-specific implementations for student and faculty
  if (context === 'student') {
    return <StudentNav />;
  }

  if (context === 'faculty') {
    return <FacultyNav facultyName={facultyName} department={department} />;
  }

  // Admin Top Navbar
  if (context === 'admin') {
    return (
      <div className="navbar-container">
        <header className="navbar floating-navbar ea-navbar-shell" aria-label="Admin Navigation">
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EngineeringAtlasLogo size="sm" variant="full" href="/admin" showSubtitle={false} />
                <span className="brand-badge">ADMIN</span>
              </div>

              <nav className="desktop-only" style={{ display: 'flex', gap: '3px' }}>
                <Link
                  href="/admin"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/academic"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Academic
                </Link>
                <Link
                  href="/admin/faculty"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Faculty
                </Link>
                <Link
                  href="/admin/content"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Content
                </Link>
                <Link
                  href="/admin/atlas"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Atlas
                </Link>
                <Link
                  href="/admin/analytics"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}
                >
                  Analytics
                </Link>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                href="/admin/settings"
                className="btn btn-ghost btn-sm desktop-only"
                style={{ fontSize: '12px' }}
              >
                Settings
              </Link>
              <Link
                href="/student/home"
                target="_blank"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '4px 8px' }}
                title="Preview Student View"
              >
                Student View <ArrowUpRight size={12} />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
      </div>
    );
  }

  // Public Landing / Information Navigation
  return (
    <PublicNavbar
      onOpenAboutModal={onOpenAboutModal}
      showLandingLinks={true}
    />
  );
}
