'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';
import { StudentBottomNav } from './StudentBottomNav';
import { ScrollToTopButton, AtlasAmbientBackground } from '@/components/ui';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();

  // If this is the standalone onboarding setup page, render directly without the persistent portal shell
  if (pathname === '/student/setup') {
    return <>{children}</>;
  }

  return (
    <div className="student-dashboard-shell" style={{ position: 'relative' }}>
      {/* 0. Ambient Visual System: Floating Liquid Bubbles (Source of Truth: Faculty Login) */}
      <AtlasAmbientBackground fixed />

      {/* 1. Left Primary Navigation Sidebar (Desktop Only) */}
      <StudentSidebar />

      {/* 2. Main Area (Header + Scrollable Page Content) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Top Header: Academic Context, Global Search, Theme Toggle, Profile */}
        <StudentHeader />

        {/* Page Inner Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {children}
        </div>
      </div>

      {/* 3. Mobile Student Bottom Navigation Bar */}
      <StudentBottomNav />

      {/* 4. Adaptive Scroll To Top Utility */}
      <ScrollToTopButton bottomOffset={92} />
    </div>
  );
}
