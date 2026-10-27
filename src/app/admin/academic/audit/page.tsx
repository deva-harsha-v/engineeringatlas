'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button, Badge, Card } from '@/components/ui';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileText,
  HelpCircle,
  Compass,
  ArrowRight,
  Filter,
  Download,
  Users,
} from 'lucide-react';

interface UnitDetail {
  unit: number;
  hasNotes: boolean;
  notesCount: number;
  hasQuestions: boolean;
  questionsCount: number;
  hasAtlas: boolean;
  atlasCount: number;
  isHealthy: boolean;
}

interface SubjectAudit {
  subjectId: string;
  code: string;
  name: string;
  branchName: string;
  branchCode: string;
  unitsCount: number;
  unitsWithNotes: number;
  unitsWithQuestions: number;
  unitsWithAtlas: number;
  papersCount: number;
  notesCoverage: number;
  questionsCoverage: number;
  overallCoverage: number;
  status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  missingUnitsNotes: number[];
  missingUnitsQuestions: number[];
  unitsDetail: UnitDetail[];
}

interface AuditData {
  summary: {
    totalSubjects: number;
    averageCoverage: number;
    optimalCount: number;
    attentionCount: number;
    criticalCount: number;
  };
  subjects: SubjectAudit[];
}

export default function SyllabusCoverageAuditPage() {
  const router = useRouter();
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'CSE' | 'ECE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'ATTENTION' | 'OPTIMAL'>('ALL');

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await fetch('/api/admin/audit');
        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load syllabus audit:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [router]);

  const filteredSubjects = (data?.subjects || []).filter(sub => {
    if (branchFilter !== 'ALL' && sub.branchCode !== branchFilter) return false;
    if (statusFilter !== 'ALL' && sub.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--tertiary)" />
              INSTITUTIONAL SYLLABUS COVERAGE & EXAMINATION READINESS AUDIT
            </div>
            <h1 className="text-page-title">Syllabus Coverage Audit</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '720px' }}>
              Mathematical verification of curriculum completeness before mid-term and semester examinations. Detects neglected units lacking lecture notes, practice drills, or question papers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/admin/academic">
              <Button variant="secondary" size="sm">
                Hierarchy Manager
              </Button>
            </Link>
            <Link href="/admin/faculty/assignments">
              <Button variant="primary" size="sm">
                <Users size={14} /> Assign Faculty
              </Button>
            </Link>
          </div>
        </div>

        {/* High-level KPI Scorecards */}
        {data && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div className="ea-card">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                OVERALL CURRICULUM HEALTH
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: data.summary.averageCoverage >= 75 ? 'var(--tertiary)' : 'var(--warning)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {data.summary.averageCoverage}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Average readiness across {data.summary.totalSubjects} subjects
              </div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                OPTIMAL COVERAGE (≥80%)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--tertiary)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {data.summary.optimalCount}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Sufficient notes & practice drills
              </div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ATTENTION REQUIRED (50–79%)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--warning)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {data.summary.attentionCount}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Partial unit gaps identified
              </div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CRITICAL DEFICITS (&lt;50%)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: data.summary.criticalCount > 0 ? 'var(--error)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {data.summary.criticalCount}
              </div>
              <div style={{ fontSize: '12px', color: data.summary.criticalCount > 0 ? 'var(--error)' : 'var(--text-secondary)' }}>
                Urgent faculty assignment needed
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '14px 18px',
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>BRANCH:</span>
            {(['ALL', 'CSE', 'ECE'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBranchFilter(b)}
                className={`btn btn-sm ${branchFilter === b ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
              >
                {b === 'ALL' ? 'All Branches' : b}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS:</span>
            {(['ALL', 'CRITICAL', 'ATTENTION', 'OPTIMAL'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
              >
                {s === 'ALL' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Audit Grid */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Calculating syllabus coverage metrics...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="ea-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No subjects match the selected filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredSubjects.map(sub => {
              const statusColor =
                sub.status === 'OPTIMAL'
                  ? 'var(--tertiary)'
                  : sub.status === 'ATTENTION'
                  ? 'var(--warning)'
                  : 'var(--error)';

              return (
                <div
                  key={sub.subjectId}
                  className="ea-card"
                  style={{
                    borderLeft: `4px solid ${statusColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-accent">{sub.code}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.branchName}</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {sub.name}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: statusColor }}>
                          {sub.overallCoverage}%
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {sub.status === 'OPTIMAL' ? 'Optimal Coverage' : sub.status === 'ATTENTION' ? 'Needs Attention' : 'Critical Deficit'}
                        </div>
                      </div>

                      <Link href={`/admin/faculty/assignments?subjectId=${sub.subjectId}`}>
                        <Button variant="secondary" size="sm">
                          Manage Faculty
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Coverage Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Notes: {sub.unitsWithNotes}/{sub.unitsCount} Units</span>
                      <span>Questions: {sub.unitsWithQuestions}/{sub.unitsCount} Units</span>
                      <span>Papers: {sub.papersCount} Available</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--surface-2)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${sub.overallCoverage}%`,
                          backgroundColor: statusColor,
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Unit-by-Unit Status Breakdown Matrix */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Unit Breakdown Matrix:
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${sub.unitsCount}, minmax(0, 1fr))`,
                        gap: '8px',
                      }}
                    >
                      {sub.unitsDetail.map(u => (
                        <div
                          key={u.unit}
                          style={{
                            backgroundColor: u.isHealthy
                              ? 'rgba(74, 225, 118, 0.08)'
                              : u.hasNotes || u.hasQuestions
                              ? 'rgba(245, 158, 11, 0.08)'
                              : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${
                              u.isHealthy
                                ? 'rgba(74, 225, 118, 0.3)'
                                : u.hasNotes || u.hasQuestions
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'rgba(239, 68, 68, 0.3)'
                            }`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 8px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Unit {u.unit}
                          </div>
                          <div style={{ fontSize: '10px', color: u.hasNotes ? 'var(--tertiary)' : 'var(--error)' }}>
                            {u.hasNotes ? `✓ Notes (${u.notesCount})` : '✕ No Notes'}
                          </div>
                          <div style={{ fontSize: '10px', color: u.hasQuestions ? 'var(--tertiary)' : 'var(--warning)', marginTop: '2px' }}>
                            {u.hasQuestions ? `✓ Drills (${u.questionsCount})` : '✕ No Drills'}
                          </div>
                          {u.hasAtlas && (
                            <div style={{ fontSize: '9px', color: 'var(--accent)', marginTop: '2px', fontWeight: 600 }}>
                              ✦ Atlas Simulation
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Units Warnings */}
                  {(sub.missingUnitsNotes.length > 0 || sub.missingUnitsQuestions.length > 0) && (
                    <div
                      style={{
                        backgroundColor: 'var(--surface-container-lowest)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                      }}
                    >
                      <AlertTriangle size={14} color="var(--warning)" />
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Action items for faculty:{' '}
                        {sub.missingUnitsNotes.length > 0 && (
                          <span style={{ color: 'var(--error)', marginRight: '8px' }}>
                            Missing notes for Unit(s): {sub.missingUnitsNotes.join(', ')}
                          </span>
                        )}
                        {sub.missingUnitsQuestions.length > 0 && (
                          <span style={{ color: 'var(--warning)' }}>
                            Missing practice questions for Unit(s): {sub.missingUnitsQuestions.join(', ')}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
