'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely without exposing raw secrets to client DOM
    console.error('Application runtime error boundary caught:', error.message);
  }, [error]);

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
          maxWidth: '500px',
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
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--error)',
          }}
        >
          <AlertCircle size={26} />
        </div>

        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {error?.message?.includes('ChunkLoadError') || error?.message?.includes('Loading chunk')
              ? 'A network timeout or application bundle update occurred while loading this page.'
              : "We couldn't complete this request. The system encountered an unexpected condition."}
          </p>

          {/* Diagnostic details for debugging */}
          {error?.message && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                textAlign: 'left',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
              }}
            >
              <div style={{ color: 'var(--error)', fontWeight: 600, marginBottom: '4px' }}>
                {error.name || 'Error'}: {error.message}
              </div>
              {error.digest && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Error Digest: {error.digest}
                </div>
              )}
            </div>
          )}
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
          <button
            onClick={() => reset()}
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
            <RotateCcw size={15} /> Try Again
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
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
            <RotateCcw size={15} /> Reload Page
          </button>

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
              <Home size={15} /> Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
