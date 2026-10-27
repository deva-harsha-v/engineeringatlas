'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Play,
  Timer,
  CheckCircle2,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  FileText,
  BookOpen,
  Bookmark,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAcademicProfile } from '@/lib/useProfile';
import { useRevisionDesk } from '@/lib/useRevisionDesk';
import { Subject, AtlasTopic, Assignment, QuestionPaper } from '@/lib/types';
import { RevisionDeskModal } from '@/components/academic/RevisionDeskModal';
import { AcademicSelectorModal } from '@/components/academic/AcademicSelectorModal';
import { RippleLoader, AtlasAmbientBackground } from '@/components/ui';
import { fetchWithFastCache, getCachedData } from '@/lib/api-cache';

export default function StudentHomePage() {
  const router = useRouter();
  const { profile, isLoaded } = useAcademicProfile();
  const { count: revisionCount } = useRevisionDesk();

  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);

  const branchMap: Record<string, string> = {
    CSE: 'branch-cse',
    ECE: 'branch-ece',
    EEE: 'branch-eee',
    CIVIL: 'branch-civil',
    MECH: 'branch-mech',
  };
  const branchCode = profile?.branch?.toUpperCase() || 'CSE';
  const branchId = branchMap[branchCode] || `branch-${branchCode.toLowerCase()}`;
  const sectionId = profile?.sectionId || 'sec-csea';

  const subKey = `/api/subjects?branchId=${branchId}`;
  const atlasKey = '/api/atlas';
  const asgKey = `/api/assignments?sectionId=${sectionId}`;
  const papKey = '/api/papers';

  const cachedSubs = getCachedData<any>(subKey);
  const cachedAtlas = getCachedData<any>(atlasKey);
  const cachedAsgs = getCachedData<any>(asgKey);
  const cachedPaps = getCachedData<any>(papKey);

  const [subjects, setSubjects] = useState<Subject[]>(() => cachedSubs?.data || []);
  const [atlasTopics, setAtlasTopics] = useState<AtlasTopic[]>(() => cachedAtlas?.data || []);
  const [assignments, setAssignments] = useState<Assignment[]>(() => cachedAsgs?.data || []);
  const [papers, setPapers] = useState<QuestionPaper[]>(() => cachedPaps?.data || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedSubs?.data);

  useEffect(() => {
    async function loadData() {
      try {
        const [subs, atlas, asgs, paps] = await Promise.all([
          fetchWithFastCache<any>(subKey),
          fetchWithFastCache<any>(atlasKey),
          fetchWithFastCache<any>(asgKey),
          fetchWithFastCache<any>(papKey),
        ]);

        if (subs?.success) setSubjects(subs.data);
        if (atlas?.success) setAtlasTopics(atlas.data);
        if (asgs?.success) setAssignments(asgs.data);
        if (paps?.success) setPapers(paps.data);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadData();
    }
  }, [profile, isLoaded, subKey, atlasKey, asgKey, papKey]);

  const studentName = profile.studentName || 'Aspirant';
  const branchName = profile.branch || 'CSE';
  const yearName = profile.yearName || 'IV Year';
  const semesterName = profile.semesterName || 'VII Semester';
  const sectionName = profile.section || 'CSE-A';

  if (!isLoaded && !cachedSubs?.data) {
    return (
      <div style={{ flex: 1, padding: '80px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RippleLoader size="md" message="Loading Student Dashboard..." subMessage="Personalizing Workspace" />
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Content Container */}
      <main
        className="mobile-nav-pad"
        style={{
          flex: 1,
          padding: '20px clamp(16px, 2.5vw, 32px) 80px',
          maxWidth: '1440px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
          {/* ========================================================================= */}
          {/* HERO / WELCOME SECTION (Layer 1 Engineering + Layer 3 Organic)            */}
          {/* ========================================================================= */}
          <section className="student-hero-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background System (Source of truth: Faculty Login) */}
            <AtlasAmbientBackground
              intensity="subtle"
              contained
              showGrid
              showShapes
              showGlow
            />

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              {/* Left: Session Tag & Greeting */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(22, 163, 74, 0.12)',
                      color: 'var(--success, #16A34A)',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#16A34A',
                      }}
                    />
                    SESSION ACTIVE // SEMESTER VII
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--text-muted, #64748B)',
                    }}
                  >
                    Cycle 2024-2025
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(24px, 2.8vw, 30px)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    margin: '0 0 6px',
                    lineHeight: 1.2,
                  }}
                >
                  Good morning,{' '}
                  <span suppressHydrationWarning style={{ color: 'var(--accent, #4F46E5)' }}>{studentName}</span>
                </h1>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                  <div>Continue where you left off</div>
                  <div
                    suppressHydrationWarning
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11.5px',
                      color: 'var(--text-muted, #64748B)',
                      marginTop: '2px',
                    }}
                  >
                    {branchName} • {yearName} • {semesterName} • {sectionName}
                  </div>
                </div>
              </div>

              {/* Right: Working Action Buttons */}
              <div className="student-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/student/atlas/cpu-scheduling" style={{ textDecoration: 'none' }} className="student-hero-primary-link">
                  <button
                    type="button"
                    className="student-hero-primary-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--primary, #4F46E5)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(79, 70, 229, 0.30)',
                      transition: 'background-color 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary, #4F46E5)')}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Launch CPU Simulator</span>
                  </button>
                </Link>

                <Link href="/student/practice" style={{ textDecoration: 'none' }} className="desktop-only">
                  <button
                    type="button"
                    className="student-secondary-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--surface-container-low, #151C29)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '9px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <Timer size={15} color="var(--text-secondary)" />
                    <span>Daily Prep Quiz</span>
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 1: CONTINUE LEARNING (2-Column Cards)                            */}
          {/* ========================================================================= */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--secondary, #0284C7)" />
                <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Continue Learning
                </h2>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--text-muted, #64748B)',
                  letterSpacing: '0.04em',
                }}
              >
                2 SIMULATIONS IN FLIGHT
              </span>
            </div>

            <div
              className="student-two-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                gap: '16px',
              }}
            >
              {/* Card 1: CPU Scheduling */}
              <div className="student-dashboard-card">
                {/* Top Badge & Unit */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10.5px',
                      color: '#2563EB',
                      backgroundColor: 'rgba(37, 99, 235, 0.10)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      border: '1px solid rgba(37, 99, 235, 0.20)',
                    }}
                  >
                    OPERATING SYSTEMS • CS301
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--text-muted, #64748B)',
                    }}
                  >
                    Unit 2 // Core
                  </span>
                </div>

                {/* Title & Percent */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      CPU Scheduling
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--tertiary, #16A34A)',
                      }}
                    >
                      68% Complete
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="student-progress-track" style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        width: '68%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #4F46E5 0%, #38BDF8 100%)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>

                {/* Sub-Box: Active Topic & Next Milestone */}
                <div className="student-milestone-box">
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10px',
                        color: 'var(--text-muted, #64748B)',
                        marginBottom: '2px',
                      }}
                    >
                      Active Topic:
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Multi-Level Feedback Queues
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10px',
                        color: 'var(--text-muted, #64748B)',
                        marginBottom: '2px',
                      }}
                    >
                      Next Milestone:
                    </span>
                    <Link
                      href="/student/practice"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#2563EB',
                        textDecoration: 'none',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Round Robin Practice
                    </Link>
                  </div>
                </div>

                {/* Card Footer: Status & Continue Action */}
                <div
                  className="student-continue-card-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="var(--tertiary, #16A34A)" />
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748B)' }}>
                      Interactive Simulation Verified
                    </span>
                  </div>

                  <Link href="/student/atlas/cpu-scheduling" style={{ textDecoration: 'none' }} className="student-continue-btn-link">
                    <button
                      type="button"
                      className="student-continue-action-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--primary, #4F46E5)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <span>Continue to Atlas</span>
                      <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Card 2: Database Normalization */}
              <div className="student-dashboard-card">
                {/* Top Badge & Unit */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10.5px',
                      color: '#4F46E5',
                      backgroundColor: 'rgba(79, 70, 229, 0.10)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      border: '1px solid rgba(79, 70, 229, 0.20)',
                    }}
                  >
                    DATABASE SYSTEMS • CS302
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--text-muted, #64748B)',
                    }}
                  >
                    Unit 3 // Relational
                  </span>
                </div>

                {/* Title & Percent */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Database Normalization
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--tertiary, #16A34A)',
                      }}
                    >
                      42% Complete
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="student-progress-track" style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        width: '42%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #0284C7 0%, #16A34A 100%)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>

                {/* Sub-Box: Active Topic & Next Milestone */}
                <div className="student-milestone-box">
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10px',
                        color: 'var(--text-muted, #64748B)',
                        marginBottom: '2px',
                      }}
                    >
                      Active Topic:
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      BCNF vs 3NF Decomposition
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10px',
                        color: 'var(--text-muted, #64748B)',
                        marginBottom: '2px',
                      }}
                    >
                      Next Milestone:
                    </span>
                    <Link
                      href="/student/subjects/sub-dbms"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#2563EB',
                        textDecoration: 'none',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Lossless Join Proofs
                    </Link>
                  </div>
                </div>

                {/* Card Footer: Status & Resume Action */}
                <div
                  className="student-continue-card-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={15} color="var(--text-muted, #64748B)" />
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748B)' }}>
                      Relational Dependency Graph
                    </span>
                  </div>

                  <Link href="/student/atlas/dbms-normalization" style={{ textDecoration: 'none' }} className="student-continue-btn-link">
                    <button
                      type="button"
                      className="student-secondary-btn student-continue-action-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--surface-container-low, #151C29)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      <span>Resume</span>
                      <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: ACADEMIC PROGRESS + UPCOMING DEADLINES (2-Column Cards)       */}
          {/* ========================================================================= */}
          <section
            className="student-two-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '16px',
            }}
          >
            {/* Left Card: Your Academic Progress */}
            <div className="student-dashboard-card">
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        color: 'var(--tertiary, #16A34A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUp size={14} />
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Your Academic Progress
                    </h2>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10.5px',
                      color: 'var(--text-muted, #64748B)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    SEMESTER OVERVIEW
                  </span>
                </div>

                {/* Big Progress Bar Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div className="student-progress-track" style={{ flex: 1, height: '7px' }}>
                    <div
                      style={{
                        width: '68%',
                        height: '100%',
                        backgroundColor: 'var(--tertiary, #16A34A)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--tertiary, #16A34A)',
                      flexShrink: 0,
                    }}
                  >
                    68% Complete
                  </span>
                </div>
              </div>

              {/* 4 Metric Stats Columns */}
              <div className="student-metric-grid">
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {subjects.length > 0 ? `${subjects.length}/${subjects.length}` : '6/6'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '3px' }}>
                    Subjects
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {atlasTopics.length > 0 ? atlasTopics.length : '42'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '3px' }}>
                    Topics Covered
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>
                    18
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '3px' }}>
                    Practice Quizzes
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {papers.length > 0 ? papers.length : '3'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '3px' }}>
                    Papers Solved
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Upcoming Deadlines */}
            <div className="student-dashboard-card">
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--error, #EF4444)" />
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Upcoming Deadlines
                    </h2>
                  </div>
                  <Link
                    href="/student/subjects"
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: '#2563EB',
                      textDecoration: 'none',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    VIEW ALL →
                  </Link>
                </div>

                {/* Deadlines List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Deadline 1: DBMS Assignment 2 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: 'var(--error, #EF4444)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={15} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          DBMS Assignment 2
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                          Submit via portal
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10.5px',
                        color: 'var(--error, #DC2626)',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      2 days left
                    </span>
                  </div>

                  {/* Deadline 2: Operating Systems Quiz */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(37, 99, 235, 0.12)',
                          color: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Timer size={15} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Operating Systems Quiz
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                          CPU Scheduling & Synchronization
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10.5px',
                        color: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      4 days left
                    </span>
                  </div>

                  {/* Deadline 3: Previous Year Paper Review */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          color: '#D97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={15} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Previous Year Paper Review
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                          2023 Question Paper
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10.5px',
                        color: 'var(--text-secondary, #475569)',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      6 days left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: QUICK ACTIONS + RECENT ACTIVITY (2-Column Cards)               */}
          {/* ========================================================================= */}
          <section
            className="student-two-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '16px',
            }}
          >
            {/* Left Card: Quick Actions */}
            <div className="student-dashboard-card">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={17} color="#D97706" />
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Quick Actions
                </h2>
              </div>

              {/* 4 Interactive Quick Action Buttons (2x2 Grid) */}
              <div className="student-quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {/* 1. Revision Desk */}
                <button
                  type="button"
                  onClick={() => setIsRevisionOpen(true)}
                  className="student-action-tile"
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(79, 70, 229, 0.12)',
                      color: 'var(--accent, #4F46E5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bookmark size={15} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Revision Desk</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
                      {revisionCount > 0 ? `${revisionCount} bookmarked` : 'Empty'}
                    </div>
                  </div>
                </button>

                {/* 2. Question Papers */}
                <Link href="/student/papers" style={{ textDecoration: 'none' }}>
                  <div className="student-action-tile">
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(2, 132, 199, 0.12)',
                        color: 'var(--secondary, #0284C7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={15} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Question Papers</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
                        Exam Archive
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 3. Subjects Catalog */}
                <Link href="/student/subjects" style={{ textDecoration: 'none' }}>
                  <div className="student-action-tile">
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        color: 'var(--tertiary, #16A34A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen size={15} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Subject Hub</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
                        All 6 Courses
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 4. Switch Cohort Context */}
                <button
                  type="button"
                  onClick={() => setIsAcademicModalOpen(true)}
                  className="student-action-tile"
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(217, 119, 6, 0.12)',
                      color: 'var(--warning, #D97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Layers size={15} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Academic Context</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
                      {sectionName}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Card: Recent Activity */}
            <div className="student-dashboard-card">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={17} color="#2563EB" />
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Recent Activity
                  </h2>
                </div>
                <Link
                  href="/student/atlas"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    color: '#2563EB',
                    textDecoration: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  VIEW ALL →
                </Link>
              </div>

              {/* Activity Timeline List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Activity 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--tertiary, #16A34A)',
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Completed AVL Tree Rotation Simulation
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                      Data Structures • 2 hours ago
                    </div>
                  </div>
                </div>

                {/* Activity 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Preemptive Round Robin Lab Verified
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                      Operating Systems • Yesterday
                    </div>
                  </div>
                </div>

                {/* Activity 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent, #4F46E5)',
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Reviewed 2024 End-Sem DBMS Question Paper
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                      Examination Archive • 2 days ago
                    </div>
                  </div>
                </div>

                {/* Activity 4 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--warning, #D97706)',
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Submitted Concurrency Semaphores Assignment
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '1px' }}>
                      Operating Systems • 3 days ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Modals */}
        <RevisionDeskModal isOpen={isRevisionOpen} onClose={() => setIsRevisionOpen(false)} />
        <AcademicSelectorModal isOpen={isAcademicModalOpen} onClose={() => setIsAcademicModalOpen(false)} />
      </>
    );
}
