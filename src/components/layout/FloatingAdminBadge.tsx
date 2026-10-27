'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';

export function FloatingAdminBadge() {
  const pathname = usePathname();

  // Hide on authenticated management dashboards and the login page itself
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/faculty') ||
    pathname === '/login' ||
    pathname === '/admin/login' ||
    pathname === '/faculty/login'
  ) {
    return null;
  }

  return (
    <Link
      href="/login"
      className="floating-admin-badge"
      title="Staff & Administrator Sign In"
      aria-label="Admin Login"
    >
      <Settings size={13} />
      <span>Admin Login</span>
    </Link>
  );
}
