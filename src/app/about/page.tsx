'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  CheckSquare,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Global Bar */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'rgba(8, 11, 18, 0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="ea-container"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="4" r="2.5" fill="#6366F1" />
                <circle cx="4" cy="20" r="2.5" fill="#6366F1" />
                <circle cx="20" cy="20" r="2.5" fill="#6366F1" />
                <line x1="12" y1="4" x2="4" y2="20" stroke="#6366F1" strokeWidth="1.8" />
                <line x1="12" y1="4" x2="20" y2="20" stroke="#6366F1" strokeWidth="1.8" />
                <line x1="6.5" y1="15" x2="17.5" y2="15" stroke="#818CF8" strokeWidth="1.8" />
              </svg>
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                }}
              >
                ENGINEERING ATLAS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/student/home">
              <Button variant="primary" size="sm">
                Open Student Portal <ArrowRight size={14} />
              </Button>
            </Link>

            <Link href="/faculty/login" className="desktop-only">
              <Button variant="ghost" size="sm">
                Faculty Login
              </Button>
            </Link>

            <Link href="/admin/login" className="desktop-only">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '72px 0 48px',
          borderBottom: '1px solid var(--border)',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%)',
        }}
      >
        <div className="ea-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div className="badge badge-accent" style={{ marginBottom: '16px' }}>
            PRODUCT PHILOSOPHY & MISSION
          </div>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            An Interactive Academic Companion for B.Tech Students
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}
          >
            Engineering Atlas bridges the gap between abstract computer science theory, institutional course resources, and examination preparation.
          </p>

          <div
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-hover)',
            }}
          >
            See → Understand → Practice → Analyze → Revise → Prepare
          </div>
        </div>
      </section>

      {/* Core Proposition Comparison */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="ea-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              What Engineering Atlas Is — And Isn&apos;t
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              We deliberately avoided building another bureaucratic tool. Here is our product contract:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '28px',
              }}
            >
              <div style={{ color: 'var(--error)', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} /> WHAT WE ARE NOT
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li>❌ <strong>Not another college ERP:</strong> No attendance registers, fee payment gateways, or bureaucratic forms.</li>
                <li>❌ <strong>Not Google Drive with a different skin:</strong> Resources are strictly organized by branch, year, semester, section, and syllabus unit.</li>
                <li>❌ <strong>Not a generic LMS:</strong> No confusing discussion forums, complex course trees, or bloatware.</li>
                <li>❌ <strong>Not an AI chatbot wrapper:</strong> Genuine, deterministic interactive algorithms instead of hallucinated text.</li>
                <li>❌ <strong>Not a social network:</strong> Zero feeds, vanity likes, or addictive distractors.</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.04)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '28px',
              }}
            >
              <div style={{ color: 'var(--accent-hover)', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> WHAT WE ARE
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li>✅ <strong>Zero-Friction Access:</strong> Students never need to register or log in. Your academic profile lives in your device.</li>
                <li>✅ <strong>Interactive Visual Atlas:</strong> Manipulate AVL trees, process schedulers, packet handshakes, and page replacement in real-time.</li>
                <li>✅ <strong>Section-Specific Coursework:</strong> Direct access to notes, PPTs, assignments, and lab manuals from your assigned faculty.</li>
                <li>✅ <strong>Past Paper Intelligence:</strong> Data-driven frequency analysis of past university and autonomous exam papers.</li>
                <li>✅ <strong>Targeted Practice Engine:</strong> Instant feedback, explanations, and topic mastery tracking.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-1)' }}>
        <div className="ea-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <div className="tech-coordinate" style={{ marginBottom: '8px' }}>SYSTEM PILLARS</div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              Four Integrated Foundations
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              The academic resource system provides everyday utility. The Interactive Atlas is the product differentiator.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="ea-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <Compass size={20} color="var(--accent-hover)" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>1. Interactive Atlas</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Simulate complex algorithms step-by-step. Adjust parameters, pause, single-step, inspect state tables, and observe rotation and race conditions.
              </p>
            </div>

            <div className="ea-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <BookOpen size={20} color="var(--accent-hover)" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>2. Academic Hub</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Direct repository of faculty notes, slides, lab manuals, and syllabus units matched directly to your current semester and section.
              </p>
            </div>

            <div className="ea-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckSquare size={20} color="var(--accent-hover)" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>3. Practice Engine</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Timed concept drills, numerical problem sets, and diagnostic quizzes with instant step explanations and revision tagging.
              </p>
            </div>

            <div className="ea-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <FileText size={20} color="var(--accent-hover)" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>4. Paper Intelligence</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Algorithmic extraction of repeated questions, unit-level weight distribution, and high-probability topics from past examination papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Context */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="ea-container" style={{ maxWidth: '800px' }}>
          <div style={{ padding: '32px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div className="tech-coordinate" style={{ marginBottom: '8px' }}>INITIAL LAUNCH PARTNER</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              Sri Vasavi Engineering College (SVEC)
            </h3>
            <div style={{ fontSize: '14px', color: 'var(--accent-hover)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              Autonomous Institution · Tadepalligudem, Andhra Pradesh
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              The initial deployment of Engineering Atlas is calibrated for the Department of Computer Science & Engineering, specifically targeting VII Semester B.Tech students (Sections CSE-A and CSE-B).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRICULUM FOCUS</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  6 Core Subjects
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SECTIONS</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  CSE-A & CSE-B
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FACULTY FACING</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Allocations Derivation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="ea-container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>
            Ready to explore?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Experience engineering concepts through interactive visualization and comprehensive academic materials.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link href="/student/home">
              <Button variant="primary" size="lg">
                Open Student Portal <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/student/atlas">
              <Button variant="secondary" size="lg">
                Explore Atlas Visualizations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-1)',
          padding: '24px 0',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        <div
          className="ea-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <strong>Engineering Atlas</strong> · Sri Vasavi Engineering College (SVEC)
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <Link href="/about" style={{ color: 'var(--accent-hover)' }}>About</Link>
            <Link href="/faculty/login" style={{ color: 'var(--text-secondary)' }}>Faculty Portal</Link>
            <Link href="/admin/login" style={{ color: 'var(--text-secondary)' }}>Admin Control</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
