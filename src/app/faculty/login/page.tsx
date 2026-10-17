'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { LogIn, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function FacultyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dr.kumar@svec.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/faculty');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 30px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={22} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Faculty Authentication</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Engineering Atlas Academic Content Portal
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--error)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--error)',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Institutional Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Faculty Portal'}
          </Button>
        </form>

        {/* Demo Credentials Box */}
        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Quick Demo Faculty Profiles:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setDemoAccount('dr.kumar@svec.edu')}
              style={{
                textAlign: 'left',
                color: 'var(--accent-hover)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              • Dr. P. Kumar (OS & Networks): dr.kumar@svec.edu
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('sunitha@svec.edu')}
              style={{
                textAlign: 'left',
                color: 'var(--accent-hover)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              • Prof. K. Sunitha (DBMS): sunitha@svec.edu
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('murthy@svec.edu')}
              style={{
                textAlign: 'left',
                color: 'var(--accent-hover)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              • Dr. R. Murthy (Compiler Design): murthy@svec.edu
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '11px' }}>
            Password: <strong style={{ color: 'var(--text-secondary)' }}>password123</strong>
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link href="/admin/login" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Switch to Administrator Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
