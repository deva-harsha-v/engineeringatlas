'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Compass,
  CheckSquare,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  BrainCircuit,
  Lightbulb,
  Bookmark,
} from 'lucide-react';
import { useRevisionDesk } from '@/lib/useRevisionDesk';

interface TopicFreq {
  topic: string;
  frequency: number;
  slug?: string;
  probability?: 'High Probability' | 'Moderate' | 'Medium Certainty' | 'Low-Medium' | 'Baseline';
  weightPct?: number;
}

interface RepeatedQuestion {
  id: string;
  questionText: string;
  repeatCount: number;
  topic: string;
  unit?: string;
  marks?: number;
  years?: string[];
  recurrencePct?: number;
  prediction?: string;
  category?: '10m' | '5m' | 'num';
  atlasSlug?: string;
  atlasModuleCode?: string;
}

interface PastPaperIntelligenceProps {
  subjectName?: string;
  topicFrequency?: TopicFreq[];
  repeatedQuestions?: RepeatedQuestion[];
}

const DEFAULT_TOPIC_FREQUENCIES: TopicFreq[] = [
  { topic: 'Transactions & Concurrency', frequency: 14, weightPct: 22, probability: 'High Probability', slug: 'dbms-normalization' },
  { topic: 'CPU Scheduling Algorithms', frequency: 12, weightPct: 18, probability: 'High Probability', slug: 'cpu-scheduling' },
  { topic: 'Normalization & Normal Forms (1NF - BCNF)', frequency: 10, weightPct: 16, probability: 'Moderate', slug: 'dbms-normalization' },
  { topic: 'Paging & Virtual Memory Architecture', frequency: 9, weightPct: 14, probability: 'Moderate', slug: 'paging-replacement' },
  { topic: 'Deadlock Detection & Banker\'s Algorithm', frequency: 7, weightPct: 11, probability: 'Medium Certainty', slug: 'deadlock' },
  { topic: 'Disk Scheduling Algorithms (SCAN, C-LOOK)', frequency: 5, weightPct: 8, probability: 'Low-Medium' },
  { topic: 'Process Synchronization & Semaphores', frequency: 4, weightPct: 6, probability: 'Baseline' },
];

const DEFAULT_REPEATED_QUESTIONS: RepeatedQuestion[] = [
  {
    id: 'rq-1',
    questionText: 'State the four necessary and sufficient conditions for Deadlock. Illustrate Banker’s Safety algorithm with a 5-process, 3-resource allocation matrix, determining if the state is safe.',
    repeatCount: 5,
    topic: 'Deadlock Detection & Banker\'s Algorithm',
    unit: 'Unit IV • Resource Allocation',
    marks: 10,
    years: ['Nov 2024', 'Dec 2023', 'May 2022', 'Dec 2021', 'Nov 2020'],
    recurrencePct: 100,
    prediction: '99.1% Repetition',
    category: '10m',
    atlasSlug: 'deadlock',
    atlasModuleCode: 'SIM-08_BANKERS_SAFE',
  },
  {
    id: 'rq-2',
    questionText: 'Explain Round Robin (RR) and Multi-Level Feedback Queue (MLFQ) scheduling with suitable Gantt chart illustration. Compare average turnaround times and waiting periods.',
    repeatCount: 4,
    topic: 'CPU Scheduling Algorithms',
    unit: 'Unit II • Process Management',
    marks: 10,
    years: ['Nov 2023', 'Dec 2022', 'May 2021', 'Nov 2020'],
    recurrencePct: 94,
    prediction: '94.2% Repetition',
    category: '10m',
    atlasSlug: 'cpu-scheduling',
    atlasModuleCode: 'SIM-04_CPU_SCHED',
  },
  {
    id: 'rq-3',
    questionText: 'Given relation R(A, B, C, D, E) with functional dependencies F = {A -> BC, CD -> E, B -> D, E -> A}. Find all candidate keys and decompose R into BCNF.',
    repeatCount: 4,
    topic: 'Normalization & Normal Forms (1NF - BCNF)',
    unit: 'Unit III • Relational Design',
    marks: 10,
    years: ['Dec 2024', 'Nov 2023', 'Dec 2022', 'May 2021'],
    recurrencePct: 92,
    prediction: '91.8% Repetition',
    category: 'num',
    atlasSlug: 'dbms-normalization',
    atlasModuleCode: 'SIM-07_NORM_GRAPH',
  },
  {
    id: 'rq-4',
    questionText: 'Differentiate between internal and external fragmentation. Explain how paging with TLB (Translation Lookaside Buffer) overcomes external fragmentation.',
    repeatCount: 3,
    topic: 'Paging & Virtual Memory Architecture',
    unit: 'Unit III • Memory Management',
    marks: 5,
    years: ['Nov 2024', 'Dec 2022', 'Dec 2020'],
    recurrencePct: 80,
    prediction: '78.5% Repetition',
    category: '5m',
    atlasSlug: 'paging-replacement',
    atlasModuleCode: 'SIM-05_PAGE_REPLACE',
  },
];

export function PastPaperIntelligence({
  subjectName = 'Department of Computer Science & Engineering',
  topicFrequency = DEFAULT_TOPIC_FREQUENCIES,
  repeatedQuestions = DEFAULT_REPEATED_QUESTIONS,
}: PastPaperIntelligenceProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '10m' | '5m' | 'num'>('all');
  const [unitScope, setUnitScope] = useState<'ALL' | 'MID_1' | 'MID_2' | 'U1' | 'U2' | 'U3' | 'U4' | 'U5'>('ALL');
  const { toggleBookmark, isBookmarked } = useRevisionDesk();

  function matchesUnit(unitStr: string | undefined, scope: string): boolean {
    if (scope === 'ALL') return true;
    if (!unitStr) return true;
    const s = unitStr.toLowerCase();
    if (scope === 'MID_1') {
      return s.includes('unit i ') || s.includes('unit 1') || s.includes('unit ii') || s.includes('unit 2') || s.includes('unit i•');
    }
    if (scope === 'MID_2') {
      return s.includes('unit iii') || s.includes('unit 3') || s.includes('unit iv') || s.includes('unit 4') || s.includes('unit v') || s.includes('unit 5');
    }
    if (scope === 'U1') return s.includes('unit i ') || s.includes('unit 1') || s.includes('unit i•');
    if (scope === 'U2') return s.includes('unit ii') || s.includes('unit 2');
    if (scope === 'U3') return s.includes('unit iii') || s.includes('unit 3');
    if (scope === 'U4') return s.includes('unit iv') || s.includes('unit 4');
    if (scope === 'U5') return s.includes('unit v') || s.includes('unit 5');
    return true;
  }

  const filteredQuestions = repeatedQuestions.filter((q) => {
    const matchesCat =
      selectedFilter === 'all' ||
      q.category === selectedFilter ||
      (selectedFilter === 'num' && q.category === 'num');
    const matchesU = matchesUnit(q.unit, unitScope);
    return matchesCat && matchesU;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* SECTION 1: TOP ANALYTICAL STRIP & FILTERS (Matching Stitch 3 Header) */}
      <div
        style={{
          backgroundColor: 'var(--surface-container-low)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--primary)',
                  backgroundColor: 'rgba(192, 193, 255, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {subjectName}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--tertiary)',
                  backgroundColor: 'rgba(74, 225, 118, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Predictive Engine v4.8
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.015em' }}>
              Past Paper Intelligence
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0, lineHeight: 1.5 }}>
              Empirical topic frequency, multi-session question recurrence likelihood, and curated Atlas simulation links derived from end-semester university examination cycles (2020–2025).
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 75px), 1fr))',
              gap: '6px',
              backgroundColor: 'var(--surface-container-lowest)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              width: '100%',
              maxWidth: '460px',
            }}
          >
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-container)', borderRadius: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Papers Scanned
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                18 Cycles
              </span>
            </div>

            <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-container)', borderRadius: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Analyzed Qs
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--secondary)' }}>
                142
              </span>
            </div>

            <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-container)', borderRadius: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                High Recurrence
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--tertiary)' }}>
                68.4%
              </span>
            </div>

            <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-container)', borderRadius: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Accuracy
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
                93.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TOP BENTO - EMPIRICAL TOPIC FREQUENCY MATRIX (Col 8) + BLUEPRINT PARITY (Col 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
        {/* Topic Frequency Matrix */}
        <div
          style={{
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Empirical Weight Distribution
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Topic Frequency Matrix
              </h3>
            </div>
            <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-container-low)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              Cumulative: <strong style={{ color: 'var(--primary)' }}>61 Items</strong>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Topics ranked by total appearances in University Examinations across 5 years, normalized against syllabus credit unit coefficients.
          </p>

          {/* Horizontal Frequency Bars List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topicFrequency.map((item, idx) => {
              const maxCount = topicFrequency[0]?.frequency || 14;
              const widthPct = Math.round((item.frequency / maxCount) * 100);
              const rankStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

              const isHigh = item.probability === 'High Probability';
              const isMod = item.probability === 'Moderate';
              const barColor = isHigh ? 'var(--secondary)' : isMod ? 'var(--accent)' : 'var(--tertiary)';

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--surface-container-low)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'var(--surface-container)', color: 'var(--text-muted)' }}>
                        {rankStr}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.topic}
                      </span>
                      {item.probability && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            backgroundColor: isHigh ? 'rgba(123, 208, 255, 0.12)' : 'rgba(192, 193, 255, 0.12)',
                            color: isHigh ? 'var(--secondary)' : 'var(--primary)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.probability}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.frequency} Questions
                      </span>
                      {item.weightPct && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'var(--surface-container-highest)', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {item.weightPct}% Weight
                        </span>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.slug && (
                          <Link href={`/student/atlas/${item.slug}`} style={{ textDecoration: 'none' }}>
                            <button
                              className="btn btn-secondary"
                              style={{
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontFamily: 'var(--font-mono)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Compass size={12} /> Atlas
                            </button>
                          </Link>
                        )}
                        <Link href="/student/practice" style={{ textDecoration: 'none' }}>
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckSquare size={12} /> Practice
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Frequency Progress Bar */}
                  <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--surface-container-lowest)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${widthPct}%`, height: '100%', backgroundColor: barColor, borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel: Exam Blueprint Parity & Professor Memo (Matching Stitch 3 Col 4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {/* Blueprint Radar Card */}
          <div
            style={{
              backgroundColor: 'var(--surface-container)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Unit Weighting Distribution
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--tertiary)', fontWeight: 600 }}>
                Live Model
              </span>
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Exam Blueprint Parity
            </h4>

            {/* Radar / Distribution Polygon SVG */}
            <div style={{ height: '150px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 240 180" style={{ width: '100%', height: '100%' }} fill="none">
                <circle cx="120" cy="90" r="75" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                <circle cx="120" cy="90" r="50" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                <circle cx="120" cy="90" r="25" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <line x1="120" y1="15" x2="120" y2="165" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 2" strokeWidth="1" />
                <line x1="45" y1="90" x2="195" y2="90" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 2" strokeWidth="1" />
                <polygon points="120,25 180,68 165,130 115,155 70,120 75,60" fill="rgba(123, 208, 255, 0.18)" stroke="#7bd0ff" strokeWidth="2" />
                <circle cx="120" cy="25" r="3.5" fill="#7bd0ff" />
                <circle cx="180" cy="68" r="3.5" fill="#7bd0ff" />
                <circle cx="165" cy="130" r="3" fill="#c0c1ff" />
                <circle cx="115" cy="155" r="3" fill="#4ae176" />
                <circle cx="70" cy="120" r="3" fill="#c0c1ff" />
                <circle cx="75" cy="60" r="3" fill="#7bd0ff" />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, right: 0, textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Coverage</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>91.4% Target</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Unit I & II</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--secondary)' }}>40% Marks</span>
              </div>
              <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Unit III & IV</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>38% Marks</span>
              </div>
            </div>
          </div>

          {/* Professor Board Memo */}
          <div
            style={{
              backgroundColor: 'var(--surface-container)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} color="var(--secondary)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                Professor Board Memo
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              &quot;Questions involving Gantt charts for preemptive Round-Robin scheduling and Deadlock resource matrices appear in over 92% of evaluated final scripts. Master numerical step notations for full credit.&quot;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
              <span>OS Faculty Committee</span>
              <span>Ref: SVEC-CS301-2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: REPEATED QUESTIONS INTELLIGENCE HUB (Matching Stitch 3 Section 2) */}
      <div
        style={{
          backgroundColor: 'var(--surface-container)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--tertiary)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recurrence Telemetry
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Repeated Questions Intelligence
            </h3>
          </div>

          {/* Filter Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--surface-container-low)', padding: '4px', borderRadius: '6px', overflowX: 'auto' }}>
            <button
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedFilter === 'all' ? 'var(--surface-container-high)' : 'transparent',
                color: selectedFilter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: selectedFilter === 'all' ? 600 : 400,
              }}
            >
              All ({repeatedQuestions.length})
            </button>
            <button
              onClick={() => setSelectedFilter('10m')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedFilter === '10m' ? 'var(--surface-container-high)' : 'transparent',
                color: selectedFilter === '10m' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: selectedFilter === '10m' ? 600 : 400,
              }}
            >
              10-Mark Long
            </button>
            <button
              onClick={() => setSelectedFilter('5m')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedFilter === '5m' ? 'var(--surface-container-high)' : 'transparent',
                color: selectedFilter === '5m' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: selectedFilter === '5m' ? 600 : 400,
              }}
            >
              5-Mark Short
            </button>
            <button
              onClick={() => setSelectedFilter('num')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedFilter === 'num' ? 'var(--surface-container-high)' : 'transparent',
                color: selectedFilter === 'num' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: selectedFilter === 'num' ? 600 : 400,
              }}
            >
              Formula & Numerical
            </button>
          </div>
        </div>

        {/* Unit-Wise Exam Scope Selector (Mid-1 = Units 1+2, Mid-2 = Units 3+4, End-Sem = All) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
            Exam Scope:
          </span>
          {[
            { id: 'ALL', label: 'Semester Scope (All Units)' },
            { id: 'MID_1', label: '🎯 Mid-1 Scope (Units 1 & 2)' },
            { id: 'MID_2', label: '🎯 Mid-2 Scope (Units 3 & 4)' },
            { id: 'U1', label: 'Unit 1' },
            { id: 'U2', label: 'Unit 2' },
            { id: 'U3', label: 'Unit 3' },
            { id: 'U4', label: 'Unit 4' },
            { id: 'U5', label: 'Unit 5' },
          ].map((scope) => (
            <button
              key={scope.id}
              type="button"
              onClick={() => setUnitScope(scope.id as any)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                border: unitScope === scope.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: unitScope === scope.id ? 'var(--surface-container-high)' : 'var(--surface-container)',
                color: unitScope === scope.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: unitScope === scope.id ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {scope.label}
            </button>
          ))}
        </div>

        {/* Question Cards Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.map((q) => (
            <article
              key={q.id}
              style={{
                backgroundColor: 'var(--surface-container-low)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, maxWidth: '800px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(74, 225, 118, 0.12)',
                        color: 'var(--tertiary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {q.recurrencePct || 90}% Recurrence ({q.repeatCount}/5 Years)
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-container)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      {q.unit || 'Core Syllabus'}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-container)', color: 'var(--secondary)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      {q.marks || 10} Marks
                    </span>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                    &quot;{q.questionText}&quot;
                  </h4>
                </div>

                {/* Appearance Frequency Box */}
                <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-container)', borderRadius: '6px', textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                    Appearance
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--tertiary)' }}>
                    {q.repeatCount} Cycles
                  </span>
                </div>
              </div>

              {/* Chronology Badges & Prediction */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(16, 19, 27, 0.6)',
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    Logged In:
                  </span>
                  {(q.years || ['Nov 2024', 'Dec 2023', 'May 2022']).map((yr, yIdx) => (
                    <span
                      key={yIdx}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--surface-container)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                      }}
                    >
                      {yr}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="var(--tertiary)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--tertiary)', fontWeight: 600 }}>
                    {q.prediction || '2025 Repetition: 95%+'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Atlas Lab Module:</span>
                  <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                    {q.atlasModuleCode || 'ATLAS_SIM'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {q.atlasSlug && (
                    <Link href={`/student/atlas/${q.atlasSlug}`} style={{ textDecoration: 'none' }}>
                      <button
                        className="btn btn-secondary"
                        style={{
                          padding: '5px 12px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Compass size={13} /> Launch Simulation
                      </button>
                    </Link>
                  )}
                    <button
                      type="button"
                      onClick={() => toggleBookmark({
                        id: q.id,
                        type: 'QUESTION',
                        title: q.questionText,
                        subtitle: `${q.unit || 'Exam Question'} • ${q.marks || 10}m • ${q.repeatCount} Cycles`,
                        url: '/student/papers',
                        unit: q.unit,
                      })}
                      className="btn btn-ghost"
                      style={{
                        padding: '5px 10px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: isBookmarked(q.id) ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                      title={isBookmarked(q.id) ? 'Saved in Revision Desk' : 'Save for Revision'}
                    >
                      <Bookmark size={13} fill={isBookmarked(q.id) ? 'currentColor' : 'none'} />
                      <span>{isBookmarked(q.id) ? 'Saved' : 'Save'}</span>
                    </button>

                    <Link href="/student/practice" style={{ textDecoration: 'none' }}>
                      <button
                        className="btn btn-primary"
                        style={{
                          padding: '5px 12px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckSquare size={13} /> Solve Practice
                      </button>
                    </Link>
                  </div>
                </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
