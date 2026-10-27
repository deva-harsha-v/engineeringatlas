'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AtlasViewer } from '@/components/atlas/AtlasViewer';
import { AtlasTopic } from '@/lib/types';
import { Button, Badge, Card, EmptyState, RippleLoader } from '@/components/ui';
import { useRevisionDesk } from '@/lib/useRevisionDesk';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Bookmark,
  Printer,
  Target,
  Trophy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const CHALLENGES_MAP: Record<
  string,
  Array<{
    id: string;
    title: string;
    goal: string;
    scenario: string;
    instructions: string[];
    whyImportant: string;
  }>
> = {
  'avl-tree': [
    {
      id: 'avl-c1',
      title: 'Cause an RL (Right-Left) Double Rotation',
      goal: 'Trigger a balance factor of -2 with a positive right child (+1) to force double rotation.',
      scenario: 'Insert keys [10, 30, 20] sequentially. Notice how after inserting 20, node 10 has balance -2 and child 30 has balance +1.',
      instructions: [
        'Open the Simulation tab.',
        'Insert 10, then insert 30, then insert 20.',
        'Observe the right rotation on subtree 30, followed by left rotation on root 10.',
        'Confirm that node 20 becomes the new balanced root.',
      ],
      whyImportant: 'RL and LR double rotations are the #1 source of mark deductions in Data Structures university exams.',
    },
    {
      id: 'avl-c2',
      title: 'Maintain Balance Across 7 Insertions',
      goal: 'Construct a 3-level AVL tree with height <= 3 using numbers [50, 25, 75, 10, 30, 60, 80].',
      scenario: 'Insert a balanced series of numbers and observe automatic tree rebalancing keeping maximum height minimal.',
      instructions: [
        'Insert nodes one by one.',
        'Check the Balance Factor readout on every node after each step.',
        'Verify that every node balance factor remains strictly in {-1, 0, +1}.',
      ],
      whyImportant: 'Standard 10-mark examination question asking to construct AVL tree from an integer array.',
    },
  ],
  'cpu-scheduling': [
    {
      id: 'cpu-c1',
      title: 'Trigger the Convoy Effect in FCFS',
      goal: 'Demonstrate how a single CPU-bound process severely penalizes average waiting time for I/O-bound jobs.',
      scenario: 'Configure Process P1 with burst 24ms at arrival 0, followed by P2 (3ms at t=1) and P3 (3ms at t=2).',
      instructions: [
        'Switch to FCFS (First-Come, First-Served) algorithm.',
        'Run the simulation and observe the Gantt Chart.',
        'Record the Average Waiting Time: Notice how P2 and P3 wait over 20ms just for a 3ms execution!',
      ],
      whyImportant: 'Core justification for Preemptive Scheduling in Operating System design theory.',
    },
    {
      id: 'cpu-c2',
      title: 'Round Robin Quantum Sensitivity Test',
      goal: 'Examine the trade-off between small quantum (high overhead) vs large quantum (approaches FCFS).',
      scenario: 'Run Round Robin with Time Quantum q=2 vs q=15 on identical 4 processes.',
      instructions: [
        'Select Round Robin in the scheduler.',
        'Set Time Quantum to 2 and run simulation to observe frequent context switches.',
        'Now change Time Quantum to 20 and compare the turnaround time and Gantt chart.',
      ],
      whyImportant: 'University exams frequently ask for comparison tables between small vs large quantum sizes.',
    },
  ],
  'deadlock': [
    {
      id: 'dead-c1',
      title: 'Construct a Resource Allocation Cycle',
      goal: 'Induce a Circular Wait condition between 2 processes and 2 resource types.',
      scenario: 'Allocate Resource R1 to Process P1 while P1 requests R2. Simultaneously allocate R2 to P2 while P2 requests R1.',
      instructions: [
        'Open the Deadlock Graph simulation canvas.',
        'Set up allocation edge P1 -> R1, and request edge P1 -> R2.',
        'Set up allocation edge P2 -> R2, and request edge P2 -> R1.',
        'Observe the circular dependency detection highlighting the deadlock state.',
      ],
      whyImportant: 'Coffman condition verification: Circular wait is mandatory for deadlock occurrence.',
    },
  ],
  'paging-replacement': [
    {
      id: 'page-c1',
      title: "Observe Belady's Anomaly with FIFO",
      goal: 'Verify counter-intuitive behavior where increasing allocated page frames increases page faults.',
      scenario: 'Reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5. Compare 3 frames vs 4 frames in FIFO.',
      instructions: [
        'Select FIFO page replacement policy.',
        'Run with 3 frames: count total page faults (9 faults).',
        'Increase frames to 4 and run same string: observe faults increase to 10!',
      ],
      whyImportant: "Belady's Anomaly is a staple 5-mark conceptual question in OS exams.",
    },
  ],
};

export default function AtlasTopicLaboratoryPage() {
  const params = useParams();
  const slug = params.topicSlug as string;
  const { toggleBookmark, isBookmarked } = useRevisionDesk();

  const [topic, setTopic] = useState<AtlasTopic | null>(null);
  const [allTopics, setAllTopics] = useState<AtlasTopic[]>([]);
  const [activeStage, setActiveStage] = useState<'UNDERSTAND' | 'INTERACT' | 'CHALLENGE' | 'PRACTICE' | 'REVIEW'>('UNDERSTAND');
  const [solvedChallenges, setSolvedChallenges] = useState<Record<string, boolean>>({});
  const [topicQuestions, setTopicQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isMastered, setIsMastered] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImmersive, setIsImmersive] = useState(false);

  // Keyboard shortcut: Escape exits immersive mode
  useEffect(() => {
    if (isImmersive) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsImmersive(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isImmersive]);

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, allRes] = await Promise.all([
          fetch(`/api/atlas/${slug}`),
          fetch('/api/atlas'),
        ]);
        const [tData, allData] = await Promise.all([tRes.json(), allRes.json()]);
        if (tData.success && tData.data) {
          setTopic(tData.data);
          // Fetch questions for this topic
          const qRes = await fetch(`/api/questions?subjectId=${tData.data.subjectId}&topic=${encodeURIComponent(tData.data.topic)}`);
          const qData = await qRes.json();
          if (qData.success && qData.data.length > 0) {
            setTopicQuestions(qData.data);
          } else {
            // Fallback to any subject questions
            const fallbackRes = await fetch(`/api/questions?subjectId=${tData.data.subjectId}`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success) {
              setTopicQuestions(fallbackData.data.slice(0, 3));
            }
          }
        }
        if (allData.success) setAllTopics(allData.data);

        // Load mastery and challenges state from localStorage
        if (typeof window !== 'undefined') {
          const mastered = localStorage.getItem(`ea_mastered_${slug}`);
          if (mastered === 'true') setIsMastered(true);

          const cData = localStorage.getItem(`ea_challenges_${slug}`);
          if (cData) {
            try {
              setSolvedChallenges(JSON.parse(cData));
            } catch (err) {}
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug]);

  const toggleSolveChallenge = (challengeId: string) => {
    const next = { ...solvedChallenges, [challengeId]: !solvedChallenges[challengeId] };
    setSolvedChallenges(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ea_challenges_${slug}`, JSON.stringify(next));
    }
  };

  const handleToggleMastery = () => {
    const nextState = !isMastered;
    setIsMastered(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ea_mastered_${slug}`, String(nextState));
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, padding: '72px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RippleLoader size="lg" message="Loading Interactive Atlas Simulation..." subMessage="Initializing Visual Mechanics" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div style={{ flex: 1, padding: '64px 16px' }}>
        <EmptyState
          title="Atlas Module Not Found"
          description="The requested simulation module slug does not exist."
        />
      </div>
    );
  }

  let learningObjectives: string[] = [];
  if (Array.isArray(topic.learningObjectives)) {
    learningObjectives = topic.learningObjectives;
  } else if (typeof topic.learningObjectives === 'string') {
    try {
      learningObjectives = JSON.parse(topic.learningObjectives);
    } catch {
      learningObjectives = [];
    }
  }

  const isStandard = topic.learningType === 'STANDARD_CONTENT' || !topic.visualizationType;
  const isSimulation = topic.learningType === 'SIMULATION';
  const isVisual = topic.learningType === 'VISUAL_EXPLANATION';

  const stages: Array<{ id: 'UNDERSTAND' | 'INTERACT' | 'CHALLENGE' | 'PRACTICE' | 'REVIEW'; label: string; step: string; icon: any; summary: string }> = isStandard
    ? [
        { id: 'UNDERSTAND', step: '01', label: 'Understand', icon: BookOpen, summary: 'Theory & Core Principles' },
        { id: 'PRACTICE', step: '02', label: 'Practice', icon: CheckSquare, summary: 'Instant Self-Test' },
        { id: 'REVIEW', step: '03', label: 'Review', icon: CheckCircle2, summary: 'Traps & Revision' },
      ]
    : [
        { id: 'UNDERSTAND', step: '01', label: isSimulation ? 'Concept' : 'Understand', icon: BookOpen, summary: 'Principles & Intuition' },
        { id: 'INTERACT', step: '02', label: isSimulation ? 'Simulation' : isVisual ? 'Explore' : 'Interact', icon: Compass, summary: 'Interactive Instrument' },
        { id: 'CHALLENGE', step: '03', label: 'Challenges', icon: Target, summary: 'Guided Problem Goals' },
        { id: 'PRACTICE', step: '04', label: 'Practice', icon: CheckSquare, summary: 'Instant Self-Test' },
        { id: 'REVIEW', step: '05', label: 'Review', icon: CheckCircle2, summary: 'Traps & Revision' },
      ];

  const currentChallenges = CHALLENGES_MAP[slug] || [
    {
      id: `${slug}-c1`,
      title: 'Boundary Value & Parameter Invariance',
      goal: 'Manipulate simulation inputs to test maximal capacity and boundary constraints.',
      scenario: 'Observe state transitions and identify the mathematical threshold where behavior diverges or saturates.',
      instructions: [
        'Open the simulation canvas and reset parameters to baseline.',
        'Increase key variable values systematically step by step.',
        'Observe how output values scale and verify against theoretical big-O time bounds.',
      ],
      whyImportant: 'Standard university theoretical proof requirement for end-semester examinations.',
    },
    {
      id: `${slug}-c2`,
      title: 'Optimal Parameter Synthesis',
      goal: 'Identify the parameter combination that minimizes latency and resource overhead.',
      scenario: 'Test multiple configuration combinations to discover optimal throughput for this model.',
      instructions: [
        'Reset instrument to initial default state.',
        'Formulate hypothesis before triggering execution.',
        'Record final metrics and verify results against textbook formulas.',
      ],
      whyImportant: 'Frequently asked 10-mark design & analysis question in B.Tech university papers.',
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">

      {/* Top Academic Breadcrumb & Metadata Strip (Stitch 1) */}
      <section
        style={{
          width: '100%',
          backgroundColor: 'var(--surface-container-low)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 16px',
        }}
      >
        <div className="ea-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, maxWidth: '100%' }}>
            <Breadcrumbs
              items={[
                { label: topic.subjectName || 'Operating Systems', href: `/student/subjects/${topic.subjectId}` },
                { label: `Unit ${topic.unit}`, href: `/student/subjects/${topic.subjectId}` },
                { label: topic.title, active: true },
              ]}
            />
            <span
              className="desktop-only"
              style={{
                marginLeft: '6px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-container)',
                color: 'var(--tertiary)',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}
            >
              CORE SYLLABUS • UNIT {topic.unit}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-indicator" />
              <span style={{ color: 'var(--text-primary)' }}>CLOCK: 10.4 ms</span>
            </div>
            <span style={{ color: 'var(--border)' }}>·</span>
            {topic.classroomCode ? (
              <span style={{ color: 'var(--text-secondary)' }}>ID: {topic.classroomCode}</span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>ID: CS-301-SIM-04</span>
            )}
          </div>
        </div>
      </section>

      <div className="ea-container" style={{ flex: 1, padding: '24px 16px 64px' }}>
        <div style={{ display: 'flex', gap: '28px' }}>
          {/* Desktop Fixed Atlas Sidebar (Stitch 1 Column 1) */}
          <aside
            className="desktop-only"
            style={{
              width: '280px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: 'fit-content',
              position: 'sticky',
              top: '84px',
            }}
          >
            {/* Curriculum Context Card */}
            <div
              style={{
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--secondary)', textTransform: 'uppercase' }}>
                  Branch Track
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--tertiary)', backgroundColor: 'var(--surface-container-high)', padding: '2px 6px', borderRadius: '4px' }}>
                  R21 REGULATION
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {topic.subjectName || 'Computer Science & Engineering'}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Semester VII • Advanced Core Laboratory System
              </p>
            </div>

            {/* Syllabus Accordion Nav */}
            <nav
              style={{
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Course Architecture
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {allTopics.map((item) => {
                  const isActive = item.slug === slug;
                  return (
                    <Link
                      key={item.id}
                      href={`/student/atlas/${item.slug}`}
                      style={{
                        padding: '8px 10px',
                        fontSize: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'var(--surface-container-high)' : 'transparent',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 600 : 400,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                      {item.visualizationType && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '1px 4px', borderRadius: '3px', backgroundColor: isActive ? 'rgba(192, 193, 255, 0.2)' : 'var(--surface-container-low)', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                          SIM
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Atlas Lab Telemetry Card */}
            <div
              style={{
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Lab Environment
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Kernel Emulation</span>
                <span style={{ color: 'var(--tertiary)' }}>POSIX v4.19</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Memory Allocation</span>
                <span style={{ color: 'var(--text-primary)' }}>Virtual 64-Bit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Engine Hook</span>
                <span style={{ color: 'var(--secondary)' }}>{topic.visualizationType || 'THEORY_CORE'}</span>
              </div>
              <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-indicator" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  Atlas WebAssembly Runner Active
                </span>
              </div>
            </div>

            {/* Syllabus Companion Reference Note */}
            <div
              style={{
                backgroundColor: 'rgba(29, 32, 39, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <BookOpen size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Silberschatz Galvin 10th Ed.
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Read Unit {topic.unit} chapters before semester review test.
                </div>
              </div>
            </div>
          </aside>

          {/* Main Laboratory Content */}
          <main style={{ flex: 1, minWidth: 0 }}>

            {/* Title & Short Explanation with Bookmark & Print actions */}
            <div style={{ marginBottom: '20px' }}>
              <div className="atlas-topic-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: '1 1 auto' }}>
                  <h1 className="text-page-title" style={{ margin: 0 }}>{topic.title}</h1>
                  <span className="badge badge-accent">UNIT {topic.unit}</span>
                  <span className="badge badge-default" style={{ textTransform: 'capitalize' }}>
                    {topic.learningType ? topic.learningType.toLowerCase().replace('_', ' ') : 'interactive'}
                  </span>
                  <span className="badge badge-default">{topic.estimatedTime}</span>
                  {isMastered && <span className="badge badge-success">✓ MASTERED</span>}
                </div>

                <div className="atlas-topic-actions">
                  <button
                    type="button"
                    onClick={() => toggleBookmark({
                      id: slug,
                      type: 'TOPIC',
                      title: topic.title,
                      subtitle: `${topic.subjectName || 'Atlas Module'} • Unit ${topic.unit}`,
                      url: `/student/atlas/${slug}`,
                      unit: topic.unit,
                    })}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: isBookmarked(slug) ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                    title={isBookmarked(slug) ? 'Saved in Revision Desk' : 'Save for Revision'}
                  >
                    <Bookmark size={14} fill={isBookmarked(slug) ? 'currentColor' : 'none'} />
                    <span>{isBookmarked(slug) ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-ghost"
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                    title="Print 1-Page Concept Cheat Sheet"
                  >
                    <Printer size={14} />
                    <span>Print Sheet</span>
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {topic.overview}
              </p>
            </div>

            {/* Learning Progression Stepper */}
            <div
              className="atlas-stage-stepper"
              style={{
                ['--stage-count' as any]: stages.length,
              }}
            >
              {stages.map((stage) => {
                const isActive = activeStage === stage.id;
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--surface-2)' : 'transparent',
                      border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={14} color={isActive ? 'var(--accent-hover)' : 'var(--text-muted)'} />
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {stage.step}. {stage.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {stage.summary}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* STAGE 1: UNDERSTAND */}
            {activeStage === 'UNDERSTAND' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Learning Objectives */}
                {learningObjectives.length > 0 && (
                  <div
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                    }}
                  >
                    <div className="tech-coordinate" style={{ marginBottom: '10px' }}>
                      LEARNING OBJECTIVES
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {learningObjectives.map((obj, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={16} color="var(--accent-hover)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concept In-Depth */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Concept In-Depth
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {topic.concept}
                  </p>
                </div>

                {/* Why It Matters */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Why It Matters in Real Engineering
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {topic.whyItMatters}
                  </p>
                </div>

                {/* Real-World Concrete Example */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Concrete Numerical Example
                  </h3>
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      borderLeft: '3px solid var(--accent)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {topic.example}
                  </div>
                </div>

                {/* Detailed Technical Content (for Standard Content / Theory Topics) */}
                {topic.content && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                      Detailed Technical Syllabus Content
                    </h3>
                    <div
                      style={{
                        background: 'var(--surface-1)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {topic.content}
                    </div>
                  </div>
                )}

                {/* Progression CTA */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  {isStandard ? (
                    <Button variant="primary" size="lg" onClick={() => setActiveStage('PRACTICE')}>
                      Next Stage: Practice Quiz <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button variant="primary" size="lg" onClick={() => setActiveStage('INTERACT')}>
                      Next Stage: {isSimulation ? 'Simulation Engine' : isVisual ? 'Visual Diagram' : 'Interactive Laboratory'} <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 2: INTERACT (Simulation Engine) */}
            {activeStage === 'INTERACT' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div className="tech-coordinate">
                      SIMULATION CANVAS
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsImmersive(true)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        minHeight: '36px',
                      }}
                      title="Expand to Fullscreen Immersive Mode (Hides navigation for maximum workspace)"
                    >
                      <Maximize2 size={13} color="var(--accent)" />
                      <span>Immersive Mode</span>
                    </button>
                  </div>
                  <AtlasViewer topic={topic} />
                </div>

                {/* Immersive Fullscreen Mode Overlay */}
                {isImmersive && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Atlas Immersive Visualizer Lab"
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 2500,
                      backgroundColor: 'var(--background)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflowY: 'auto',
                      padding: 'calc(12px + env(safe-area-inset-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px))',
                    }}
                  >
                    {/* Immersive Header Bar with clear Back / Exit control */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--border)',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-accent">IMMERSIVE LAB</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {topic.title}
                          </div>
                          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {topic.subjectName} · Unit {topic.unit}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsImmersive(false)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          fontWeight: 600,
                          fontSize: '12px',
                          minHeight: '44px',
                          cursor: 'pointer',
                        }}
                      >
                        <Minimize2 size={15} color="var(--accent)" />
                        <span>Exit Immersive Lab</span>
                      </button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <AtlasViewer topic={topic} />
                    </div>
                  </div>
                )}

                {/* Step-by-Step Breakdown */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Algorithm Execution & State Transitions
                  </h3>
                  <div
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {(topic.howItWorks || '').split('\n').filter(Boolean).map((line, idx) => (
                      <div key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progression CTAs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Button variant="ghost" size="md" onClick={() => setActiveStage('UNDERSTAND')}>
                    ← Back to Concept
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => setActiveStage(isStandard ? 'PRACTICE' : 'CHALLENGE')}>
                    Next Stage: {isStandard ? 'Practice Quiz' : 'Challenge Goals'} <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE: CHALLENGE (Guided Problem Goals) */}
            {activeStage === 'CHALLENGE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
                      PRACTICAL EXPERIMENT LAB
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Atlas Challenge Mode — Guided Problem Goals
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                      Solve concrete academic problems by manipulating the interactive instrument towards precise target states.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Completed: {Object.values(solvedChallenges).filter(Boolean).length} / {currentChallenges.length}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {currentChallenges.map((challenge, idx) => {
                    const isSolved = !!solvedChallenges[challenge.id];
                    return (
                      <div
                        key={challenge.id}
                        className="ea-card"
                        style={{
                          padding: '20px',
                          border: isSolved ? '1px solid var(--success)' : '1px solid var(--border)',
                          backgroundColor: isSolved ? 'rgba(34, 197, 94, 0.04)' : 'var(--surface-1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isSolved ? 'var(--success)' : 'var(--surface-container-high)',
                                color: isSolved ? '#fff' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '12px',
                                fontFamily: 'var(--font-mono)',
                                flexShrink: 0,
                              }}
                            >
                              {isSolved ? <Check size={14} /> : idx + 1}
                            </div>
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                                {challenge.title}
                              </h4>
                              <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '2px', fontWeight: 500 }}>
                                Target Goal: {challenge.goal}
                              </div>
                            </div>
                          </div>

                          <span
                            className="badge"
                            style={{
                              backgroundColor: isSolved ? 'rgba(34, 197, 94, 0.15)' : 'var(--surface-container-high)',
                              color: isSolved ? 'var(--success)' : 'var(--text-muted)',
                              border: isSolved ? '1px solid var(--success)' : '1px solid var(--border)',
                              fontSize: '10px',
                            }}
                          >
                            {isSolved ? 'GOAL ACHIEVED' : 'PENDING'}
                          </span>
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                          {challenge.scenario}
                        </p>

                        <div
                          style={{
                            backgroundColor: 'var(--surface-2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px 14px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Action Steps:
                          </div>
                          <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                            {challenge.instructions.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            💡 {challenge.whyImportant}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setActiveStage('INTERACT')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Compass size={13} /> Open Visualizer
                            </Button>
                            <Button
                              variant={isSolved ? 'ghost' : 'primary'}
                              size="sm"
                              onClick={() => toggleSolveChallenge(challenge.id)}
                            >
                              {isSolved ? 'Mark Incomplete' : 'Mark as Solved ✓'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progression CTAs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Button variant="ghost" size="md" onClick={() => setActiveStage('INTERACT')}>
                    ← Back to Visualizer
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => setActiveStage('PRACTICE')}>
                    Next Stage: Practice Quiz <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE 3: PRACTICE (Instant Self-Test) */}
            {activeStage === 'PRACTICE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Topic Knowledge Check
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Answer questions curated for {topic.topic} to verify mechanical understanding.
                    </p>
                  </div>
                  <Link href={`/student/practice/${topic.subjectId}`}>
                    <Button variant="secondary" size="sm">
                      Open Full Question Bank <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>

                {topicQuestions.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', background: 'var(--surface-1)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No practice questions available for this unit yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {topicQuestions.map((q, qIndex) => {
                      let options: string[] = [];
                      if (Array.isArray(q.options)) {
                        options = q.options;
                      } else if (typeof q.options === 'string') {
                        try {
                          options = JSON.parse(q.options);
                        } catch {
                          options = [];
                        }
                      }
                      const selected = selectedAnswers[q.id];
                      const isSubmitted = submittedAnswers[q.id];
                      const correct = String(q.correctAnswer);
                      const isCorrect = selected === correct;

                      return (
                        <div
                          key={q.id}
                          style={{
                            background: 'var(--surface-1)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span className="badge badge-default">Q{qIndex + 1}</span>
                            <span className="badge badge-accent">{q.difficulty}</span>
                            <span className="tech-coordinate">REPEAT COUNT: {q.repeatCount || 1}</span>
                          </div>

                          <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
                            {q.questionText}
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {options.map((opt, optIndex) => {
                              const optVal = String(optIndex);
                              const isSelected = selected === optVal;
                              let borderStyle = '1px solid var(--border)';
                              let bgStyle = 'var(--surface-2)';

                              if (isSubmitted) {
                                if (optVal === correct) {
                                  borderStyle = '1px solid var(--success)';
                                  bgStyle = 'rgba(34, 197, 94, 0.1)';
                                } else if (isSelected && !isCorrect) {
                                  borderStyle = '1px solid var(--error)';
                                  bgStyle = 'rgba(239, 68, 68, 0.1)';
                                }
                              } else if (isSelected) {
                                borderStyle = '1px solid var(--accent)';
                                bgStyle = 'var(--surface-3)';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  disabled={isSubmitted}
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optVal }))}
                                  style={{
                                    textAlign: 'left',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: bgStyle,
                                    border: borderStyle,
                                    cursor: isSubmitted ? 'default' : 'pointer',
                                    color: 'var(--text-primary)',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                >
                                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', minWidth: '20px' }}>
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {!isSubmitted ? (
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={selected === undefined}
                              onClick={() => setSubmittedAnswers((prev) => ({ ...prev, [q.id]: true }))}
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <div
                              style={{
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                border: isCorrect ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                              }}
                            >
                              <div style={{ fontWeight: 600, fontSize: '13px', color: isCorrect ? 'var(--success)' : 'var(--error)', marginBottom: '4px' }}>
                                {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Progression CTAs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Button variant="ghost" size="md" onClick={() => setActiveStage(isStandard ? 'UNDERSTAND' : 'INTERACT')}>
                    ← Back to {isStandard ? 'Concept' : 'Simulation'}
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => setActiveStage('REVIEW')}>
                    Next Stage: Exam Review & Mastery <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE 4: REVIEW (Traps, Pitfalls & Mastery) */}
            {activeStage === 'REVIEW' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Common Mistakes */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--error)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} /> Common Examination Mistakes & Pitfalls
                  </h3>
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {(topic.commonMistakes || '').split('\n').filter(Boolean).map((m, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        • {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Revision Card */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lightbulb size={18} /> High-Yield Revision Summary
                  </h3>
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.06)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {(topic.quickRevision || '').split('\n').filter(Boolean).map((r, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topic Mastery Toggle Card */}
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {isMastered ? '✓ Module Marked as Mastered' : 'Complete Topic Progression'}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Marking as mastered saves progress to your local browser profile.
                    </p>
                  </div>

                  <Button
                    variant={isMastered ? 'secondary' : 'primary'}
                    size="md"
                    onClick={handleToggleMastery}
                  >
                    {isMastered ? 'Unmark Topic' : 'Mark Topic as Mastered'}
                  </Button>
                </div>

                {/* Progression CTAs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Button variant="ghost" size="md" onClick={() => setActiveStage('PRACTICE')}>
                    ← Back to Practice
                  </Button>
                  <Link href="/student/atlas">
                    <Button variant="secondary" size="md">
                      Return to Atlas Catalog <Compass size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Connected Academic Knowledge Graph Links (Requirement 27) */}
            <div
              style={{
                marginTop: '36px',
                padding: '20px',
                backgroundColor: 'var(--surface-container-low)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="tech-coordinate" style={{ margin: 0 }}>
                  CONNECTED ACADEMIC RESOURCES // KNOWLEDGE GRAPH
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  UNIT {topic.unit}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <Link
                  href={`/student/subjects/${topic.subjectId}/materials`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--secondary)', fontWeight: 600 }}>
                      FACULTY NOTES & SLIDES
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {topic.subjectName} Course Handouts
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Unit {topic.unit} verified study resources →
                    </div>
                  </div>
                </Link>

                <Link
                  href={`/student/practice/${topic.subjectId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: 600 }}>
                      PRACTICE TEST ENGINE
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {topic.topic} Question Bank
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Timed MCQ drills with detailed steps →
                    </div>
                  </div>
                </Link>

                <Link
                  href="/student/papers"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
                      PAST PAPER INTELLIGENCE
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                      SVEC Exam Paper Archives
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      High-frequency repeated questions →
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* PRINT-ONLY 1-PAGE REVISION CHEAT SHEET (Triggered by window.print()) */}
            <div className="print-only" style={{ padding: '24px 0', borderTop: '2px solid #000', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#000' }}>
                    {topic.title} — 1-Page Concept Revision Sheet
                  </h1>
                  <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>
                    SVEC B.Tech Engineering Atlas • {topic.subjectName || 'Engineering Companion'} • Unit {topic.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'monospace' }}>
                  <div>Code: {topic.classroomCode || 'ATLAS-REF'}</div>
                  <div>Exam Ready Revision</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px', color: '#000' }}>
                    1. Core Pedagogical Overview
                  </h4>
                  <p style={{ fontSize: '11px', lineHeight: 1.5, margin: 0, color: '#222' }}>
                    {topic.overview}
                  </p>
                </div>

                <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px', color: '#000' }}>
                    2. Learning Objectives & Exam Targets
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: 1.5, color: '#222' }}>
                    {learningObjectives.map((obj: string, i: number) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px', color: '#000' }}>
                  3. Step-by-Step Algorithm & Mathematical Formulation
                </h4>
                <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#222', whiteSpace: 'pre-line' }}>
                  {topic.howItWorks}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px', color: '#b91c1c' }}>
                    4. Common Exam Pitfalls & Traps
                  </h4>
                  <div style={{ fontSize: '11px', lineHeight: 1.5, color: '#222' }}>
                    {topic.commonPitfalls ? (
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {topic.commonPitfalls.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    ) : (
                      topic.commonMistakes || 'Pay careful attention to edge cases, boundary invariants, and off-by-one indices.'
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px', color: '#15803d' }}>
                    5. High-Yield Revision Summary
                  </h4>
                  <div style={{ fontSize: '11px', lineHeight: 1.5, color: '#222' }}>
                    {topic.revisionChecklist ? (
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {topic.revisionChecklist.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      topic.quickRevision || 'Memorize state transition constraints, recurrence equations, and asymptotic limits.'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
