'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, FileText, CheckSquare, Bell, LogOut, ArrowUpRight } from 'lucide-react';

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
      router.push('/faculty/login');
      router.refresh();
    } catch (e) {
      router.push('/faculty/login');
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
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        className="ea-container"
        style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/faculty" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
              }}
            >
              ENGINEERING ATLAS
            </span>
            <span className="badge badge-accent">FACULTY PORTAL</span>
          </Link>

          {/* Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '4px' }}>
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
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="desktop-only" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{facultyName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{department} Department</div>
          </div>

          <Link
            href="/student/home"
            target="_blank"
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '12px' }}
            title="Preview student perspective in new tab"
          >
            Student View <ArrowUpRight size={13} />
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--error)' }}
          >
            <LogOut size={14} />
            <span className="desktop-only">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
