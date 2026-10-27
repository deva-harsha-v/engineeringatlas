'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { FacultyAssignment } from '@/lib/types';
import { useFacultyClass } from '@/lib/useFacultyClass';
import {
  Users,
  ArrowRight,
  BookOpen,
  Calendar,
  Database,
  Cpu,
  Code2,
  Network,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function FacultyClassesListPage() {
  const router = useRouter();
  const { classes, selectClass, loading } = useFacultyClass();

  const handleOpenClass = (cls: FacultyAssignment) => {
    selectClass(cls);
    router.push(`/faculty/classes/${cls.id}`);
  };

  const getSubjectIcon = (name?: string, code?: string) => {
    const text = `${name || ''} ${code || ''}`.toLowerCase();
    if (text.includes('dbms') || text.includes('data')) return <Database size={22} color="#2563EB" />;
    if (text.includes('network') || text.includes('cn')) return <Network size={22} color="#059669" />;
    if (text.includes('os') || text.includes('system')) return <Cpu size={22} color="#7C3AED" />;
    if (text.includes('compiler')) return <Code2 size={22} color="#EA580C" />;
    return <BookOpen size={22} color="#2563EB" />;
  };

  const totalStudents = classes.reduce((acc, c) => acc + (c.studentsCount || 48), 0);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'My Classes']}
        title="My Classes"
        description="Each card represents a Faculty Assignment (Faculty + Branch + Semester + Section + Subject). Opening a class scopes coursework resources to that class."
      />

      {/* 4 Stat Metric Cards */}
      <div
        className="faculty-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {classes.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Faculty Assignments
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalStudents || 145}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Enrolled Students
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7C3AED',
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {classes.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Distinct Subjects
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(234, 88, 12, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EA580C',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              2026-2027
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Academic Session
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid - Matching exact spec and media_1792662505645_cd01c8da.png */}
      <div
        className="faculty-classes-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {classes.map((cls) => {
          const studentsCount = cls.studentsCount || (cls.sectionName?.includes('B') ? 52 : cls.sectionName?.includes('6') ? 45 : 48);
          return (
            <div
              key={cls.id}
              className="faculty-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '210px',
              }}
            >
              <div>
                {/* Header row: Section Pill & Year */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#2563EB',
                      letterSpacing: '0.4px',
                    }}
                  >
                    {cls.sectionName}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {cls.academicYear || '2026-2027'}
                  </span>
                </div>

                {/* Subject Details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getSubjectIcon(cls.subjectName, cls.subjectCode)}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 4px 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {cls.subjectName}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {cls.subjectCode || 'CS702'} · {cls.semesterName || 'VII Semester'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Student count + Open Class button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  marginTop: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  <Users size={15} style={{ opacity: 0.7 }} />
                  <span>{studentsCount} Students</span>
                </div>

                <button
                  onClick={() => handleOpenClass(cls)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'gap 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '8px')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '5px')}
                >
                  <span>Open Class</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </FacultyLayout>
  );
}
