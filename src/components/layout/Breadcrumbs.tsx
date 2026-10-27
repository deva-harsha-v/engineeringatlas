'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  includeJsonLd?: boolean;
}

export function Breadcrumbs({ items, includeJsonLd = true }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://engineering-atlas.svec.edu${item.href}` : undefined,
    })),
  };

  return (
    <>
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className="no-scrollbar ea-breadcrumb-nav"
      >
        <Link
          href="/student/home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
            flexShrink: 0,
          }}
          title="Student Home"
        >
          <Home size={13} />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <ChevronRight size={12} color="var(--border)" style={{ flexShrink: 0 }} />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  className="hover-underline"
                  title={item.label}
                >
                  <span className="ea-breadcrumb-label">{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{
                    color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isLast ? 600 : 400,
                  }}
                  title={item.label}
                >
                  <span className="ea-breadcrumb-label">{item.label}</span>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
