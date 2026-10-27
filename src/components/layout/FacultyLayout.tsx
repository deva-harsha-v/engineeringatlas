'use client';

import React, { useState } from 'react';
import { FacultySidebar } from './FacultySidebar';
import { FacultyHeader } from './FacultyHeader';
import { AtlasAmbientBackground } from '@/components/ui';

interface FacultyLayoutProps {
  children: React.ReactNode;
}

export function FacultyLayout({ children }: FacultyLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="faculty-layout-root"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        position: 'relative',
      }}
    >
      {/* 0. Ambient Visual System: Floating Liquid Bubbles (Source of truth: Faculty Login) */}
      <AtlasAmbientBackground fixed />

      {/* Sidebar with Desktop collapse & Mobile drawer */}
      <FacultySidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className="faculty-main-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          maxWidth: '100vw',
          minWidth: 0,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Header */}
        <FacultyHeader onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        {/* Page Inner Content */}
        <main className="faculty-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
