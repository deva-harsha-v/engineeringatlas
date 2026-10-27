'use client';

import React from 'react';

interface FacultyPageHeaderProps {
  breadcrumbs: string[];
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function FacultyPageHeader({
  breadcrumbs,
  title,
  description,
  action,
}: FacultyPageHeaderProps) {

  return (
    <div
      className="faculty-page-header-root"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px',
        width: '100%',
      }}
    >
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        {/* Breadcrumbs */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary, #64748B)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span style={{ opacity: 0.5 }}>/</span>}
              <span
                style={{
                  color: idx === breadcrumbs.length - 1 ? 'var(--text-primary, #0F172A)' : 'var(--text-secondary, #64748B)',
                  fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        <h1
          style={{
            fontSize: 'clamp(20px, 4.5vw, 26px)',
            fontWeight: 700,
            color: 'var(--text-primary, #0F172A)',
            letterSpacing: '-0.4px',
            margin: '0 0 6px 0',
            lineHeight: 1.25,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 'clamp(12.5px, 2.5vw, 14px)',
            color: 'var(--text-secondary, #64748B)',
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
      </div>

      {action && <div className="faculty-page-header-action">{action}</div>}
    </div>
  );
}
