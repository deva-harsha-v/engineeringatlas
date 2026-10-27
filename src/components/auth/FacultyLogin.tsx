'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  X,
  UserCheck,
} from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const SVEC_ADMIN_CELL_EMAIL = 'admincell@svec.edu.in';
const RESET_EMAIL_SUBJECT = '[Faculty Password Reset Request] Engineering Atlas - SVEC';
const RESET_EMAIL_TEMPLATE = `Dear SVEC Academic Administration & IT Cell,

I am requesting a password reset for my Faculty account on Engineering Atlas. Please find my verification details below:

--------------------------------------------------
Faculty Full Name         : [ Enter Full Name, e.g. Dr. P. Kumar ]
Faculty Institutional ID  : [ Enter ID, e.g. SVEC-CSE-FAC-102 ]
Department                : [ Enter Department, e.g. CSE ]
Designation               : [ Enter Designation, e.g. Associate Professor ]
Registered Email Address  : [ Enter your institutional @svec.edu email ]
Contact Mobile Number     : [ Enter 10-digit Phone Number ]
Reason for Reset Request  : [ Forgot password / Temporary credential reset ]
--------------------------------------------------

Kindly verify my institutional records and dispatch a temporary password reset token to my registered email address.

Regards,
[ Your Name ]
[ Contact Phone Number ]`;

function getGmailComposeUrl(): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SVEC_ADMIN_CELL_EMAIL)}&su=${encodeURIComponent(RESET_EMAIL_SUBJECT)}&body=${encodeURIComponent(RESET_EMAIL_TEMPLATE)}`;
}

// 6 deterministic static liquid blobs (avoids Math.random SSR hydration mismatch)
const BLOBS_DATA = [
  { size: 280, left: 16, top: 18, delay: -4, duration: 22 },
  { size: 340, left: 60, top: 38, delay: -8, duration: 18 },
  { size: 230, left: 28, top: 58, delay: -12, duration: 25 },
  { size: 270, left: 72, top: 12, delay: -16, duration: 20 },
  { size: 200, left: 42, top: 76, delay: -5, duration: 19 },
  { size: 250, left: 8, top: 68, delay: -10, duration: 24 },
];

export function FacultyLogin() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('dr.kumar@svec.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State for Password Reset
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // High-performance DOM refs for mouse parallax
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Apply subtle parallax effect to each blob
      blobRefs.current.forEach((blob, index) => {
        if (blob) {
          const speed = (index + 1) * 12;
          // Using margin displacement so it does not override CSS transform float animation
          blob.style.marginLeft = `${x * speed}px`;
          blob.style.marginTop = `${y * speed}px`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your institutional email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid institutional credentials. Please try again.');
      }

      const role = data.user?.role;
      if (role === 'FACULTY') {
        router.push('/faculty');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/student/home');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleCopyTemplate = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(RESET_EMAIL_TEMPLATE);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    }
  };

  const handleAutofillKumar = () => {
    setEmail('dr.kumar@svec.edu');
    setPassword('password123');
    setError(null);
  };

  const handleAutofillAdmin = () => {
    setEmail('admin@svec.edu');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="mercury-wrapper">
      {/* SVG Gooey Filter Definition (Hidden Element) */}
      <svg className="svg-filter-hidden" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Subtle Technical Coordinate Grid Background */}
      <div className="mercury-grid-bg" aria-hidden="true" />

      {/* Background Liquid Physics Stage with 6 Gooey Blobs */}
      <div className="mercury-stage" aria-hidden="true">
        {BLOBS_DATA.map((blob, index) => (
          <div
            key={index}
            ref={(el) => {
              blobRefs.current[index] = el;
            }}
            className="mercury-blob"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              left: `${blob.left}%`,
              top: `${blob.top}%`,
              animationDelay: `${blob.delay}s`,
              animationDuration: `${blob.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar with Branding & Theme Toggle */}
      <header className="mercury-top-bar">
        <div className="mercury-top-brand">
          <EngineeringAtlasLogo
            variant="full"
            size="md"
            href="/"
            showSubtitle={false}
          />
          <div className="mercury-brand-divider" aria-hidden="true" />
          <div className="mercury-institution-text">
            <span className="mercury-institution-title">Sri Vasavi Engineering College</span>
            <span className="mercury-institution-sub">Autonomous · Tadepalligudem</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Neural Access / Mercury Interface Container */}
      <main className="mercury-auth-container">
        <header className="mercury-header">
          <span className="mercury-brand-id">
            <span className="mercury-brand-dot" aria-hidden="true" />
            ENGINEERING ATLAS · SVEC
          </span>
          <h1>
            FACULTY<br />PORTAL
          </h1>
          <p className="mercury-header-sub">
            Welcome back, Faculty. Access your classes, materials, assignments and academic workspace.
          </p>
        </header>

        {error && (
          <div className="mercury-error" role="alert" aria-live="polite">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="mercury-form">
          {/* Institutional Email Field */}
          <div className="mercury-form-group">
            <label htmlFor="fl-email-input">Institutional Email</label>
            <div className="mercury-input-row">
              <input
                id="fl-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@svec.edu"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                disabled={loading}
                required
              />
              <div className="mercury-input-glow" aria-hidden="true" />
            </div>
          </div>

          {/* Sequence Key / Password Field */}
          <div className="mercury-form-group">
            <div className="mercury-form-label-row">
              <label htmlFor="fl-password-input">Sequence Key / Password</label>
            </div>
            <div className="mercury-input-row">
              <input
                id="fl-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <div className="mercury-input-glow" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="mercury-eye-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* The Mercury Gooey Submit Button */}
          <div className="mercury-submit-wrap">
            <div className="mercury-drop" aria-hidden="true" />
            <button
              type="submit"
              disabled={loading}
              className="mercury-btn-base"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="ea-btn-spinner"
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid currentColor',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'ea-btn-spin 0.6s linear infinite',
                      marginRight: '6px',
                    }}
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize Stream</span>
                  <ArrowRight size={15} strokeWidth={2.4} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Accounts Helper */}
        <div className="mercury-quick-demo">
          <div className="mercury-quick-meta">
            <span className="mercury-quick-title">Faculty Access</span>
            <span className="mercury-quick-email">dr.kumar@svec.edu · password123</span>
          </div>
          <button
            type="button"
            onClick={handleAutofillKumar}
            className="mercury-quick-btn"
          >
            Auto-fill
          </button>
        </div>

        {/* Footer Navigation */}
        <footer className="mercury-footer-nav">
          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
          >
            FORGOT PASSWORD?
          </button>
          <Link href="/">
            ← BACK TO HOME
          </Link>
        </footer>
      </main>

      {/* Institutional Password Reset Modal */}
      {isForgotModalOpen && (
        <div
          className="fl-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mercury-reset-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsForgotModalOpen(false);
          }}
        >
          <div className="fl-modal">
            <div className="fl-modal-header">
              <h2 id="mercury-reset-title" className="fl-modal-title">
                Faculty Password Reset
              </h2>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="fl-modal-close"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="fl-modal-content">
              <p className="fl-modal-text">
                Faculty accounts are managed centrally by the <strong>SVEC IT & Academic Cell</strong>.
                To request a temporary password or reset credentials, dispatch an email to{' '}
                <strong style={{ color: '#6366F1' }}>{SVEC_ADMIN_CELL_EMAIL}</strong> using the format below:
              </p>

              <div className="fl-template-box">
                {RESET_EMAIL_TEMPLATE}
              </div>
            </div>

            <div className="fl-modal-actions">
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="fl-autofill-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px' }}
              >
                {copiedTemplate ? (
                  <>
                    <Check size={14} color="#22C55E" />
                    <span>Copied Template</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Request Template</span>
                  </>
                )}
              </button>

              <a
                href={getGmailComposeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="fl-submit-btn"
                style={{
                  width: 'auto',
                  height: '36px',
                  padding: '0 14px',
                  margin: 0,
                  textDecoration: 'none',
                  fontSize: '12px',
                }}
              >
                <ExternalLink size={14} />
                <span>Open in Webmail</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom-Right Quick Access for Admin Login */}
      <div className="mercury-fixed-admin">
        <button
          type="button"
          onClick={handleAutofillAdmin}
          className="mercury-admin-badge"
          title="Fill Administrator credentials"
        >
          <UserCheck size={12} color="#38BDF8" />
          <span>Admin Login</span>
        </button>
      </div>
    </div>
  );
}
