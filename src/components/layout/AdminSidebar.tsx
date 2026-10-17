'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Users,
  UserCheck,
  FileText,
  Compass,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  const sections = [
    {
      title: 'OVERVIEW',
      items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
    },
    {
      title: 'ACADEMIC STRUCTURE',
      items: [
        { label: 'Hierarchy Manager', path: '/admin/academic', icon: Layers },
      ],
    },
    {
      title: 'PEOPLE',
      items: [
        { label: 'Faculty Directory', path: '/admin/faculty', icon: Users },
        { label: 'Teaching Assignments', path: '/admin/faculty/assignments', icon: UserCheck },
      ],
    },
    {
      title: 'CONTENT & CURATION',
      items: [
        { label: 'Materials & Moderation', path: '/admin/content', icon: FileText },
        { label: 'Interactive Atlas', path: '/admin/atlas', icon: Compass },
        { label: 'Announcements', path: '/admin/announcements', icon: Bell },
      ],
    },
    {
      title: 'INTELLIGENCE & SYSTEM',
      items: [
        { label: 'Institutional Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Institution Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link href="/admin" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          </div>
          <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>
            INSTITUTION CONTROL
          </span>
        </Link>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Sri Vasavi Engg College (SVEC)
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                padding: '0 8px 6px',
              }}
            >
              {section.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--border)' : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--accent-hover)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Link
          href="/student/home"
          target="_blank"
          className="btn btn-ghost btn-sm"
          style={{ justifyContent: 'flex-start', fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          <ExternalLink size={14} /> Open Student View
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ justifyContent: 'flex-start', color: 'var(--error)' }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}
