'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  Download,
  HelpCircle,
  X,
  Layers,
  ChevronRight,
  Award,
  Sparkles,
  MapPin,
  Mail,
} from 'lucide-react';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { HeroSimulator } from '@/components/atlas/HeroSimulator';
import { EngineeringAtlasLogo } from '@/components/branding/EngineeringAtlasLogo';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';

export default function LandingPage() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Practice section interactive demo state
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string | null>('RR');

  return (
    <div className="landing-page-root">
      {/* Floating Centered Pill Navbar (Unified 1200px Shell) */}
      <AppNavbar context="public" onOpenAboutModal={() => setIsAboutModalOpen(true)} />

      {/* Main Page Flow */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* =========================================================
            SECTION 1: HERO & LIVE INTERACTIVE ATLAS SIMULATOR
            ========================================================= */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid-2col">
              {/* Left Column: Headline, Subtext, CTAs & Feature Chips */}
              <div className="hero-content-col">
                <div className="hero-eyebrow">
                  <span className="eyebrow-dot" />
                  <span>Sri Vasavi Engineering College · B.Tech Academic Companion</span>
                </div>

                <h1 className="hero-headline">
                  <span className="hero-headline-line">Understand</span>{' '}
                  <span className="hero-headline-line">Engineering.</span>{' '}
                  <span className="gradient-text hero-headline-line">Visually.</span>
                </h1>

                <p className="hero-subtext">
                  Learn difficult concepts interactively, access curated course materials, practice questions, and prepare for examinations — without friction.
                </p>

                <div className="hero-cta-group">
                  <a href="#simulator" className="btn-landing-primary">
                    <span>Explore Interactive Atlas</span>
                    <span aria-hidden="true">→</span>
                  </a>
                  <Link href="/student/subjects" className="btn-landing-secondary">
                    Find My Subjects
                  </Link>
                </div>

                {/* Feature Metric Chips (Desktop View from Reference Image) */}
                <div className="hero-feature-chips desktop-only">
                  <div className="hero-metric-chip">
                    <BookOpen size={14} className="metric-chip-icon" />
                    <span>11 Branches</span>
                  </div>
                  <div className="hero-metric-chip">
                    <Layers size={14} className="metric-chip-icon" />
                    <span>200+ Subjects</span>
                  </div>
                  <div className="hero-metric-chip">
                    <Sparkles size={14} className="metric-chip-icon" />
                    <span>Interactive Visual Learning</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Simulator */}
              <div className="hero-simulator-col">
                <HeroSimulator />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: EXPLORE THE ATLAS (7 DISCIPLINES)
            ========================================================= */}
        <section id="explore" className="section-domains">
          <div className="container">
            <div className="section-header-compact">
              <div className="section-title-wrap">
                <h2>Explore the Atlas</h2>
                <p>Every engineering discipline visualized with interactive foundational models.</p>
              </div>
              <span className="brand-badge">7 Disciplines Connected</span>
            </div>

            <div className="domain-catalog-grid">
              {/* 1. Data Structures */}
              <Link href="/student/subjects?dept=CSE" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <line x1="120" y1="20" x2="70" y2="60" stroke="var(--border)" strokeWidth="2" />
                    <line x1="120" y1="20" x2="170" y2="60" stroke="var(--border)" strokeWidth="2" />
                    <line x1="70" y1="60" x2="45" y2="85" stroke="var(--border)" strokeWidth="1.5" />
                    <line x1="70" y1="60" x2="95" y2="85" stroke="var(--border)" strokeWidth="1.5" />
                    <circle cx="120" cy="20" r="14" fill="#4F46E5" />
                    <circle cx="70" cy="60" r="12" fill="#2563EB" />
                    <circle cx="170" cy="60" r="12" fill="#2563EB" />
                    <circle cx="45" cy="85" r="8" fill="#7C3AED" />
                    <circle cx="95" cy="85" r="8" fill="#7C3AED" />
                    <text x="120" y="24" fill="#FFF" fontSize="10" fontFamily="monospace" textAnchor="middle">50</text>
                    <text x="70" y="64" fill="#FFF" fontSize="9" fontFamily="monospace" textAnchor="middle">30</text>
                    <text x="170" y="64" fill="#FFF" fontSize="9" fontFamily="monospace" textAnchor="middle">70</text>
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">Computer Science</span>
                  <h3 className="domain-name">Data Structures</h3>
                  <p className="domain-desc">Self-balancing trees, graphs, sorting complexities, and memory pointers.</p>
                </div>
              </Link>

              {/* 2. Operating Systems */}
              <Link href="/student/subjects?dept=CSE" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <rect x="20" y="30" width="45" height="24" rx="4" fill="#2563EB" />
                    <rect x="70" y="30" width="35" height="24" rx="4" fill="#059669" />
                    <rect x="110" y="30" width="60" height="24" rx="4" fill="#7C3AED" />
                    <rect x="175" y="30" width="45" height="24" rx="4" fill="#D97706" />
                    <line x1="20" y1="70" x2="220" y2="70" stroke="var(--border)" strokeWidth="2" />
                    <text x="42" y="46" fill="#FFF" fontSize="10" fontFamily="monospace" textAnchor="middle">P1</text>
                    <text x="87" y="46" fill="#FFF" fontSize="10" fontFamily="monospace" textAnchor="middle">P2</text>
                    <text x="140" y="46" fill="#FFF" fontSize="10" fontFamily="monospace" textAnchor="middle">P3</text>
                    <text x="197" y="46" fill="#FFF" fontSize="10" fontFamily="monospace" textAnchor="middle">P4</text>
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">Core Systems</span>
                  <h3 className="domain-name">Operating Systems</h3>
                  <p className="domain-desc">Kernel processes, deadlock detection, semaphore locks, and paging tables.</p>
                </div>
              </Link>

              {/* 3. Computer Networks */}
              <Link href="/student/subjects?dept=CSE" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <rect x="25" y="35" width="30" height="30" rx="4" fill="none" stroke="#2563EB" strokeWidth="2" />
                    <rect x="185" y="35" width="30" height="30" rx="4" fill="none" stroke="#7C3AED" strokeWidth="2" />
                    <path d="M60 45 C 100 20, 140 20, 180 45" fill="none" stroke="var(--indigo)" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M180 55 C 140 80, 100 80, 60 55" fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="120" cy="30" r="5" fill="#4F46E5" />
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">Networks</span>
                  <h3 className="domain-name">Computer Networks</h3>
                  <p className="domain-desc">OSI 7 layers, packet routing protocols, congestion windows, and handshakes.</p>
                </div>
              </Link>

              {/* 4. Electronics & Communication */}
              <Link href="/student/subjects?dept=ECE" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <line x1="20" y1="50" x2="220" y2="50" stroke="var(--border)" strokeWidth="1.5" />
                    <path d="M20 50 Q 50 10, 80 50 T 140 50 T 200 50" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                    <path d="M20 50 Q 50 30, 80 50 T 140 50 T 200 50" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">ECE</span>
                  <h3 className="domain-name">Electronics & Signals</h3>
                  <p className="domain-desc">Continuous waveforms, Fourier transforms, PN diodes, and transistor gates.</p>
                </div>
              </Link>

              {/* 5. Electrical Engineering */}
              <Link href="/student/subjects?dept=EEE" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <circle cx="120" cy="50" r="36" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                    <line x1="120" y1="50" x2="150" y2="30" stroke="#4F46E5" strokeWidth="2.5" />
                    <polygon points="152,28 144,32 147,37" fill="#4F46E5" />
                    <line x1="120" y1="50" x2="100" y2="75" stroke="#059669" strokeWidth="2.5" />
                    <polygon points="98,77 101,70 106,73" fill="#059669" />
                    <circle cx="120" cy="50" r="3" fill="var(--text-primary)" />
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">EEE</span>
                  <h3 className="domain-name">Electrical Systems</h3>
                  <p className="domain-desc">AC phasor vectors, 3-phase induction balances, and power grid nodes.</p>
                </div>
              </Link>

              {/* 6. Mechanical Engineering */}
              <Link href="/student/subjects?dept=MECH" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <line x1="40" y1="85" x2="200" y2="85" stroke="var(--border)" strokeWidth="1.5" />
                    <line x1="40" y1="85" x2="40" y2="15" stroke="var(--border)" strokeWidth="1.5" />
                    <path d="M 55 35 Q 90 40 135 60 L 165 80 L 75 75 Z" fill="rgba(79, 70, 229, 0.1)" stroke="#4F46E5" strokeWidth="2" />
                    <text x="32" y="25" fontFamily="monospace" fontSize="8" fill="var(--text-muted)">P</text>
                    <text x="195" y="95" fontFamily="monospace" fontSize="8" fill="var(--text-muted)">V</text>
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">Mechanical</span>
                  <h3 className="domain-name">Thermodynamics</h3>
                  <p className="domain-desc">Pressure-Volume Carnot cycles, fluid dynamics, and stress-strain matrices.</p>
                </div>
              </Link>

              {/* 7. Civil Engineering */}
              <Link href="/student/subjects?dept=CIVIL" className="domain-card">
                <div className="domain-preview-stage">
                  <svg viewBox="0 0 240 100">
                    <line x1="40" y1="75" x2="200" y2="75" stroke="var(--border)" strokeWidth="2" />
                    <polygon points="50,75 120,30 190,75" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                    <line x1="120" y1="30" x2="120" y2="75" stroke="#7C3AED" strokeWidth="2" />
                    <line x1="85" y1="52" x2="120" y2="75" stroke="var(--teal)" strokeWidth="1.5" />
                    <line x1="155" y1="52" x2="120" y2="75" stroke="var(--teal)" strokeWidth="1.5" />
                    <circle cx="120" cy="30" r="3" fill="#D97706" />
                  </svg>
                </div>
                <div className="domain-body">
                  <span className="domain-tag">Civil</span>
                  <h3 className="domain-name">Structural Analysis</h3>
                  <p className="domain-desc">Truss deflection forces, cantilever load lines, and structural equilibrium.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: THE ENGINEERING ATLAS LOOP
            ========================================================= */}
        <section id="philosophy" className="section-loop">
          <div className="container">
            <div className="section-title-wrap" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
              <h2>The Engineering Atlas Loop</h2>
              <p>A structured continuum engineered to bridge theoretical university lectures with real operational understanding.</p>
            </div>

            <div className="loop-grid">
              <div className="loop-step-card">
                <div className="loop-badge-number">01</div>
                <span className="loop-phase-title">Phase 1 · Visualize</span>
                <h3 className="loop-heading">LEARN</h3>
                <p className="loop-desc">See the invisible mechanics. Interact with CPU bursts, tree rotations, and memory page faults directly.</p>
              </div>

              <div className="loop-step-card">
                <div className="loop-badge-number">02</div>
                <span className="loop-phase-title">Phase 2 · Curate</span>
                <h3 className="loop-heading">STUDY</h3>
                <p className="loop-desc">High-signal course notes, faculty-approved syllabi, and indexed reference architectures for B.Tech.</p>
              </div>

              <div className="loop-step-card">
                <div className="loop-badge-number">03</div>
                <span className="loop-phase-title">Phase 3 · Experiment</span>
                <h3 className="loop-heading">PRACTICE</h3>
                <p className="loop-desc">Test algorithms against edge cases, step through assembly instructions, and solve interactive questions.</p>
              </div>

              <div className="loop-step-card">
                <div className="loop-badge-number">04</div>
                <span className="loop-phase-title">Phase 4 · Excel</span>
                <h3 className="loop-heading">PREPARE</h3>
                <p className="loop-desc">Master university semester examinations and GATE with past questions mapped directly to visual models.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: ACADEMIC HUB (SECTION 9 SPEC)
            ========================================================= */}
        <section className="section-academic-hub" style={{ background: 'var(--surface-subtle)' }}>
          <div className="container">
            <div className="section-header-compact">
              <div className="section-title-wrap">
                <span className="brand-badge" style={{ marginBottom: '8px' }}>ACADEMIC HUB</span>
                <h2>Institution-Specific Course Materials</h2>
                <p>Faculty notes, unit-wise slides, assignments, and lab manuals delivered directly to your section.</p>
              </div>
              <Link href="/student/subjects" className="btn-landing-secondary" style={{ textDecoration: 'none' }}>
                Browse Academic Hub Materials <ArrowRight size={14} />
              </Link>
            </div>

            {/* Realistic Resource Interface Grid */}
            <div className="landing-hub-grid">
              {[
                {
                  code: 'CS701',
                  subject: 'Operating Systems',
                  title: 'CPU Scheduling & Process Synchronization Notes',
                  author: 'Dr. P. Kumar',
                  type: 'PDF Notes',
                  unit: 'Unit 2',
                  pages: '42 pages',
                  downloads: 428,
                },
                {
                  code: 'CS702',
                  subject: 'Database Systems',
                  title: 'Transactions & Concurrency Control (ACID & Locks)',
                  author: 'Prof. Rajesh',
                  type: 'Unit Handout',
                  unit: 'Unit 4',
                  pages: '28 pages',
                  downloads: 315,
                },
                {
                  code: 'CS703',
                  subject: 'Computer Networks',
                  title: 'Transport Layer Protocols (TCP vs UDP Slides)',
                  author: 'Dr. Anitha',
                  type: 'Presentation',
                  unit: 'Unit 3',
                  pages: '64 slides',
                  downloads: 290,
                },
                {
                  code: 'CS704',
                  subject: 'Compiler Design',
                  title: 'Compiler Design Lab Manual & Lex/Yacc Tutorials',
                  author: 'SVEC CSE Dept',
                  type: 'Lab Manual',
                  unit: 'All Units',
                  pages: '52 pages',
                  downloads: 512,
                },
              ].map((mat) => (
                <div
                  key={mat.title}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="badge badge-accent" style={{ fontSize: '10px' }}>{mat.code}</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{mat.unit}</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {mat.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {mat.author} · {mat.subject}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{mat.pages}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--indigo)' }}>
                      <Download size={12} /> {mat.downloads}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 5: PRACTICE LAYER (SECTION 10 SPEC)
            ========================================================= */}
        <section className="section-practice-engine">
          <div className="container">
            <div className="section-header-compact">
              <div className="section-title-wrap">
                <span className="brand-badge" style={{ marginBottom: '8px' }}>PRACTICE ENGINE</span>
                <h2>Targeted Conceptual Quizzes</h2>
                <p>Verify your understanding with instant step explanations and weak-area diagnosis.</p>
              </div>
              <Link href="/student/practice" className="btn-landing-secondary" style={{ textDecoration: 'none' }}>
                Start Practice Run <ArrowRight size={14} />
              </Link>
            </div>

            {/* Interactive MCQ Demonstration Box */}
            <div className="landing-practice-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="brand-badge">OPERATING SYSTEMS · CPU SCHEDULING</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--indigo)' }}>Question 1 of 10</span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px', lineHeight: 1.4 }}>
                Which CPU scheduling algorithm allocates a fixed time quantum to each ready process in cyclic order?
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: 'FCFS', text: 'FCFS (First-Come, First-Served)' },
                  { id: 'SJF', text: 'SJF (Shortest Job First)' },
                  { id: 'RR', text: 'Round Robin (RR) Scheduling' },
                  { id: 'PRIO', text: 'Priority Scheduling' },
                ].map((opt) => {
                  const isSelected = selectedPracticeOption === opt.id;
                  const isCorrect = opt.id === 'RR';

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPracticeOption(opt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: isSelected ? (isCorrect ? 'var(--emerald)' : 'var(--error)') : 'var(--border)',
                        backgroundColor: isSelected ? (isCorrect ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)') : 'var(--surface-subtle)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                        {opt.text}
                      </span>
                      {isSelected && isCorrect && <CheckCircle size={16} color="var(--emerald)" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Diagnostics */}
              {selectedPracticeOption === 'RR' && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(5, 150, 105, 0.1)',
                    border: '1px solid var(--emerald)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--emerald)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} /> Correct ✓
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Round Robin scheduling uses a predetermined time slice (quantum) to ensure fair CPU allocation without starvation. Preempted processes return to the tail of the ready queue.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(5, 150, 105, 0.2)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                    }}
                  >
                    <span>Current Practice Score: <strong>8 / 10</strong></span>
                    <span style={{ color: 'var(--emerald)' }}>Weak Area Flag: None · Exam Ready</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: PAST PAPER INTELLIGENCE (SECTION 11 SPEC)
            ========================================================= */}
        <section className="section-exam-intelligence" style={{ background: 'var(--surface-subtle)' }}>
          <div className="container">
            <div className="section-header-compact">
              <div className="section-title-wrap">
                <span className="brand-badge" style={{ marginBottom: '8px' }}>EXAM INTELLIGENCE</span>
                <h2>Past Paper Intelligence Engine</h2>
                <p>Analyze recurring university examination questions and bridge past papers into visual models.</p>
              </div>
              <Link href="/student/papers" className="btn-landing-secondary" style={{ textDecoration: 'none' }}>
                Inspect Exam Trends <ArrowRight size={14} />
              </Link>
            </div>

            <div className="landing-exam-grid">
              {/* DBMS Question Trends Chart */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    DBMS Question Trends (Last 5 Years)
                  </h3>
                  <span className="badge badge-accent" style={{ fontSize: '10px' }}>SVEC JNTUK</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { topic: 'Transactions & ACID Properties', count: 12, pct: 92, color: '#4F46E5' },
                    { topic: 'Normalization (3NF, BCNF)', count: 10, pct: 85, color: '#2563EB' },
                    { topic: 'SQL & Relational Algebra Queries', count: 9, pct: 78, color: '#0D9488' },
                    { topic: 'Indexing & B+ Tree File Structures', count: 7, pct: 60, color: '#7C3AED' },
                    { topic: 'ER Model to Relational Schema', count: 5, pct: 45, color: '#D97706' },
                  ].map((row) => (
                    <div key={row.topic}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.topic}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {row.count} questions ({row.pct}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          background: 'var(--surface-subtle)',
                          borderRadius: 'var(--radius-pill)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${row.pct}%`,
                            background: row.color,
                            borderRadius: 'var(--radius-pill)',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Preparation Pipeline Card */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Connected Preparation Pipeline
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Engineering Atlas does not simply store PDF question papers. It indexes question patterns and connects them directly into interactive learning models.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { step: '1', title: 'Past Question Papers', sub: 'Indexed across all semesters & branches' },
                      { step: '2', title: 'High-Frequency Topics', sub: 'Algorithmically detected repeated questions' },
                      { step: '3', title: 'Interactive Atlas Module', sub: 'Jump directly to the relevant visual simulator' },
                      { step: '4', title: 'Targeted Practice Quiz', sub: 'Verify your exam readiness before the test' },
                    ].map((pipe) => (
                      <div
                        key={pipe.step}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--indigo)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {pipe.step}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {pipe.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pipe.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/student/papers"
                  className="btn-companion"
                  style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
                >
                  <span>Explore Question Paper Intelligence</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 7: FINAL CALL TO ACTION (RULE 12)
            ========================================================= */}
        <section className="section-final-cta">
          <div className="container" style={{ maxWidth: '640px' }}>
            <h2 className="cta-headline">
              Start Learning Differently.
            </h2>
            <p className="cta-subtext">
              Select your academic cohort and experience engineering concepts the way they were meant to be understood.
            </p>

            <Link href="/student/home" className="btn-landing-primary">
              <span>Launch Student Companion</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* =========================================================
          SITE FOOTER (REFINED DARK COMPOSITION)
          ========================================================= */}
      <footer className="refined-site-footer">
        <div className="footer-glow-overlay" aria-hidden="true" />
        <div className="container">
          {/* Desktop 4-Column Grid (Desktop Only) */}
          <div className="footer-desktop-grid desktop-only">
            {/* Col 1: Brand & Social */}
            <div className="footer-col-brand">
              <div className="footer-brand-header">
                <EngineeringAtlasLogo size="md" variant="icon" href="/" />
                <div>
                  <div className="footer-brand-title">Engineering Atlas</div>
                  <div className="footer-brand-sub">SRI VASAVI ENGG COLLEGE</div>
                </div>
              </div>
              <p className="footer-brand-desc">
                Interactive learning, curated academic resources and practice for every engineering student.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="footer-col-nav">
              <div className="footer-col-heading">Quick Links</div>
              <ul className="footer-links-list">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAboutModalOpen(true)}
                    className="footer-link-btn"
                  >
                    About
                  </button>
                </li>
                <li>
                  <Link href="/student/home" className="footer-link">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="footer-link">
                    Faculty & Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="footer-col-nav">
              <div className="footer-col-heading">Resources</div>
              <ul className="footer-links-list">
                <li>
                  <Link href="/student/subjects" className="footer-link">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/student/atlas" className="footer-link">
                    Interactive Atlas
                  </Link>
                </li>
                <li>
                  <Link href="/student/papers" className="footer-link">
                    Previous Papers
                  </Link>
                </li>
                <li>
                  <Link href="/student/practice" className="footer-link">
                    Practice Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="footer-col-contact">
              <div className="footer-col-heading">Contact</div>
              <div className="footer-contact-items">
                <div className="footer-contact-item">
                  <MapPin size={15} className="footer-contact-icon" />
                  <span>Sri Vasavi Engineering College, Tadepalligudem, AP</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={15} className="footer-contact-icon" />
                  <a href="mailto:support@engineeringatlas.in" className="footer-link">
                    support@engineeringatlas.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Centered Layout (Mobile Only) */}
          <div className="footer-mobile-wrap mobile-only">
            {/* Brand Header */}
            <div className="footer-mobile-brand">
              <EngineeringAtlasLogo size="md" variant="icon" href="/" />
              <div className="footer-brand-title">Engineering Atlas</div>
              <div className="footer-brand-sub">SRI VASAVI ENGG COLLEGE</div>
              <p className="footer-brand-desc">
                Interactive learning, curated academic resources and practice for every engineering student.
              </p>
            </div>

            {/* Divider */}
            <div className="footer-mobile-divider" />

            {/* Navigation Links */}
            <div className="footer-mobile-links">
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(true)}
                className="footer-link-btn"
              >
                About
              </button>
              <Link href="/student/home" className="footer-link">
                Student Portal
              </Link>
              <Link href="/login" className="footer-link">
                Faculty & Admin
              </Link>
            </div>

            {/* Copyright & Location */}
            <div className="footer-mobile-bottom">
              <div className="footer-mobile-legal">
                <div>© 2026 Engineering Atlas</div>
                <div style={{ color: '#64748B', fontSize: '11px', marginTop: '3px' }}>
                  Sri Vasavi Engineering College · Tadepalligudem, AP
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Bottom Strip (Desktop Only) */}
          <div className="footer-bottom-bar desktop-only">
            <div className="footer-copyright">
              © 2026 Engineering Atlas. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          ABOUT INFO MODAL DIALOG (SECTION 12 SPEC)
          ========================================================= */}
      <div
        className={`atlas-modal ${isAboutModalOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsAboutModalOpen(false);
        }}
      >
        <div className="modal-dialog">
          <div className="modal-header">
            <h3 className="modal-title">About Engineering Atlas</h3>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsAboutModalOpen(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
          <div className="modal-body">
            <p style={{ marginBottom: '14px' }}>
              <strong>Engineering Atlas</strong> is an interactive engineering laboratory and knowledge atlas engineered specifically for B.Tech students at Sri Vasavi Engineering College (SVEC).
            </p>
            <p style={{ marginBottom: '14px' }}>
              Traditional educational systems treat engineering as static text and memorization. Engineering Atlas treats engineering as dynamic computational systems that students can see, step through, and command.
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: '0.78rem',
                color: 'var(--indigo)',
                borderLeft: '2px solid var(--indigo)',
                paddingLeft: '10px',
                margin: 0,
              }}
            >
              Architecture: 100% Client-Side Pure Standard Web · Zero Bloat · Visual First.
            </p>
          </div>
        </div>
      </div>

      {/* Adaptive Scroll To Top Utility (same as Student Portal) */}
      <ScrollToTopButton bottomOffset={0} />
    </div>
  );
}
