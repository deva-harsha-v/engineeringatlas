'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, FileText, CheckSquare, Bell, LogOut, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { EngineeringAtlasLogo } from '@/components/branding';

interface FacultyNavProps {
  facultyName?: string;
  department?: string;
}

export function FacultyNav({ facultyName = 'Dr. P. Kumar', department = 'CSE' }: FacultyNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
    { label: 'My Classes', path: '/faculty/classes', icon: Users },
    { label: 'Materials', path: '/faculty/materials', icon: BookOpen },
    { label: 'Assignments', path: '/faculty/assignments', icon: CheckSquare },
    { label: 'Papers', path: '/faculty/papers', icon: FileText },
    { label: 'Questions', path: '/faculty/questions', icon: CheckSquare },
    { label: 'Announcements', path: '/faculty/announcements', icon: Bell },
  ];

  return (
    <div className="navbar-container">
      <header className="navbar floating-navbar ea-navbar-shell" aria-label="Faculty Navigation">
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
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EngineeringAtlasLogo size="sm" variant="full" href="/faculty" showSubtitle={false} />
              <span className="brand-badge">FACULTY</span>
            </div>

            {/* Navigation Links */}
            <nav className="desktop-only" style={{ display: 'flex', gap: '3px' }}>
              {navItems.map((item) => {
                const isActive =
                  item.path === '/faculty'
                    ? pathname === '/faculty'
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--border)' : 'transparent',
                      borderRadius: 'var(--radius-pill)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="desktop-only" style={{ textAlign: 'right', lineHeight: 1.1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{facultyName}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{department} Department</div>
            </div>

            <ThemeToggle />

            <Link
              href="/student/home"
              target="_blank"
              className="btn btn-ghost btn-sm desktop-only"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title="Preview student perspective in new tab"
            >
              Student View <ArrowUpRight size={12} />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--error)', padding: '4px 10px', fontSize: '11px' }}
            >
              <LogOut size={13} />
              <span className="desktop-only">Logout</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
