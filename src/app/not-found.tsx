import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowLeft, Search } from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '40px 32px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-container-low)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <EngineeringAtlasLogo size="md" variant="full" href="/student/home" />

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent)',
            backgroundColor: 'var(--accent-subtle)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          HTTP 404 // CONCEPT NOT RESOLVED
        </div>

        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            This concept couldn&apos;t be found.
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            The topic, subject, or academic resource you are looking for may have moved, been reorganized in the syllabus, or does not exist.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            width: '100%',
            marginTop: '8px',
          }}
        >
          <Link href="/student/atlas" style={{ textDecoration: 'none' }}>
            <button
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <Compass size={16} /> Explore Atlas Topics
            </button>
          </Link>

          <Link href="/student/home" style={{ textDecoration: 'none' }}>
            <button
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <Home size={16} /> Student Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
