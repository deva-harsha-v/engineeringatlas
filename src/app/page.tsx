'use client';

import React, { useState } from 'react';
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
  ExternalLink,
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { AVLTreeVisualizer } from '@/components/atlas/visualizations/AVLTreeVisualizer';
import { CPUSchedulingVisualizer } from '@/components/atlas/visualizations/CPUSchedulingVisualizer';
import { TCPHandshakeVisualizer } from '@/components/atlas/visualizations/TCPHandshakeVisualizer';

export default function LandingPage() {
  const [activeHeroTab, setActiveHeroTab] = useState<'AVL' | 'CPU' | 'TCP'>('CPU');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

            <Link href="/about" className="desktop-only">
              <Button variant="ghost" size="sm">
                About
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

      {/* SECTION 1: HERO (Matching UI/UX Spec Page 4, Section 8) */}
      <section style={{ padding: '64px 0 48px', position: 'relative' }}>
        <div className="ea-container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
            <div className="tech-coordinate" style={{ marginBottom: '16px' }}>
              ● SRI VASAVI ENGINEERING COLLEGE · B.TECH ACADEMIC COMPANION
            </div>
            <h1 className="text-hero" style={{ marginBottom: '20px' }}>
              Understand Engineering. <span style={{ color: 'var(--accent-hover)' }}>Visually.</span>
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto 28px',
              }}
            >
              Learn difficult concepts interactively, access your faculty's curated course materials, practice past papers, and prepare for examinations — without friction.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/student/atlas">
                <Button variant="primary" size="lg">
                  <Compass size={18} /> Explore Interactive Atlas
                </Button>
              </Link>
              <Link href="/student/subjects">
                <Button variant="secondary" size="lg">
                  <BookOpen size={18} /> Find My Subjects
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Hero Visualization Preview Box */}
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Visual Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '14px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  LIVE MODULE:
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setActiveHeroTab('CPU')}
                    className={`btn btn-sm ${activeHeroTab === 'CPU' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    CPU Scheduling
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('AVL')}
                    className={`btn btn-sm ${activeHeroTab === 'AVL' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    AVL Tree Balancer
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('TCP')}
                    className={`btn btn-sm ${activeHeroTab === 'TCP' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    TCP 3-Way Handshake
                  </button>
                </div>
              </div>

              <Link
                href={`/student/atlas/${activeHeroTab === 'CPU' ? 'cpu-scheduling' : activeHeroTab === 'AVL' ? 'avl-tree' : 'tcp-handshake'}`}
                style={{ fontSize: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Open Full Laboratory <ArrowRight size={13} />
              </Link>
            </div>

            {/* Live Interactive Visualization Render */}
            <div>
              {activeHeroTab === 'CPU' && <CPUSchedulingVisualizer />}
              {activeHeroTab === 'AVL' && <AVLTreeVisualizer />}
              {activeHeroTab === 'TCP' && <TCPHandshakeVisualizer />}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS (Matching UI/UX Spec Page 5, Section 9) */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="ea-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="tech-coordinate">THE ACADEMIC WORKSPACE</span>
            <h2 className="text-section-title" style={{ marginTop: '8px' }}>
              How Engineering Atlas Works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { num: '01', title: 'Choose Your Academic Profile', desc: 'Select Branch, Year, Semester, and Section (e.g. CSE-A · VII Sem). Stored locally on device with zero account barriers.' },
              { num: '02', title: 'Explore Your Subjects', desc: 'Operating Systems, DBMS, Networks, Compiler Design — all organized with units, syllabus, and learning paths.' },
              { num: '03', title: 'Understand Concepts Visually', desc: 'Manipulate parameters, step through Gantt charts, observe balance factors, and inspect packet flights in real time.' },
              { num: '04', title: 'Practice & Prepare for Exams', desc: 'Attempt topic-wise questions with instant feedback and uncover high-frequency trends from past question papers.' },
            ].map((step) => (
              <Card key={step.num} className="ea-card">
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: '12px',
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE FOUR PILLARS */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--border)' }}>
        <div className="ea-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="tech-coordinate">CONNECTED ECOSYSTEM</span>
            <h2 className="text-section-title" style={{ marginTop: '8px' }}>
              The Four Academic Pillars
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <Card hoverable className="ea-card">
              <Link href="/student/atlas" style={{ display: 'block', textDecoration: 'none' }}>
                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>PILLAR 01</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  LEARN · Interactive Atlas
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  Transform abstract theories into interactive systems. Watch AVL rotations, trace Banker's algorithm safe sequences, and simulate TCP connection state transitions.
                </p>
                <div style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Atlas Modules <ArrowRight size={13} />
                </div>
              </Link>
            </Card>

            <Card hoverable className="ea-card">
              <Link href="/student/subjects" style={{ display: 'block', textDecoration: 'none' }}>
                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>PILLAR 02</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  STUDY · Academic Hub
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  Faculty notes, unit-wise slides, lab manuals, and assignments delivered directly to your section without searching WhatsApp or Google Drive.
                </p>
                <div style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Browse Course Materials <ArrowRight size={13} />
                </div>
              </Link>
            </Card>

            <Card hoverable className="ea-card">
              <Link href="/student/practice" style={{ display: 'block', textDecoration: 'none' }}>
                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>PILLAR 03</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  PRACTICE · Targeted Quizzes
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  Test your mastery with topic-specific questions, instant conceptual explanations, timer tracking, and breakdown of strong vs weak areas.
                </p>
                <div style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Start Practice Quiz <ArrowRight size={13} />
                </div>
              </Link>
            </Card>

            <Card hoverable className="ea-card">
              <Link href="/student/papers" style={{ display: 'block', textDecoration: 'none' }}>
                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>PILLAR 04</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  PREPARE · Past Paper Intelligence
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  Analyze recurring examination topics, review the most repeated semester questions, and link directly into targeted revision.
                </p>
                <div style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Exam Trends <ArrowRight size={13} />
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section
        style={{
          padding: '80px 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
        }}
      >
        <div className="ea-container-narrow">
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
            Start Learning Differently.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Enter your academic context and experience engineering concepts the way they were meant to be understood.
          </p>

          <Link href="/student/setup">
            <Button variant="primary" size="lg">
              Set Up Your Workspace <ArrowRight size={18} />
            </Button>
          </Link>
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
            <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/faculty/login" style={{ color: 'var(--text-secondary)' }}>Faculty Portal</Link>
            <Link href="/admin/login" style={{ color: 'var(--text-secondary)' }}>Admin Control</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
