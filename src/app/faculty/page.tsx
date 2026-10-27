'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyAssignment, Material, Assignment } from '@/lib/types';
import { useFacultyClass } from '@/lib/useFacultyClass';
import {
  Users,
  Box,
  FileCheck,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  Database,
  Network,
  Cpu,
  Code2,
  FileText,
  Megaphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function FacultyDashboardPage() {
  const router = useRouter();
  const { classes, selectClass } = useFacultyClass();
  const [user, setUser] = useState<{ name: string; department?: string } | null>(null);
  const [draftAssignments, setDraftAssignments] = useState<Assignment[]>([]);
  const [draftMaterials, setDraftMaterials] = useState<Material[]>([]);
  const [draftAnnouncements, setDraftAnnouncements] = useState<any[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [meRes, asgRes, matRes, annRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/assignments?status=ALL'),
          fetch('/api/materials'),
          fetch('/api/announcements'),
        ]);

        if (meRes.status === 401) {
          router.push('/faculty/login');
          return;
        }

        const [meData, asgData, matData, annData] = await Promise.all([
          meRes.json(),
          asgRes.json(),
          matRes.json(),
          annRes.json(),
        ]);

        if (meData.success && meData.user) setUser(meData.user);

        // Process assignments
        if (asgData.success && Array.isArray(asgData.data)) {
          const drafts = asgData.data.filter((a: Assignment) => a.status === 'DRAFT');
          const published = asgData.data.filter((a: Assignment) => a.status === 'PUBLISHED');
          setDraftAssignments(drafts);
          setUpcomingAssignments(published);
        }

        // Process materials
        if (matData.success && Array.isArray(matData.data)) {
          const drafts = matData.data.filter((m: Material) => m.status === 'DRAFT');
          setDraftMaterials(drafts);
        }

        // Process announcements
        if (annData.success && Array.isArray(annData.data)) {
          const drafts = annData.data.filter((a: any) => a.status === 'DRAFT');
          setDraftAnnouncements(drafts);
        }
      } catch (err) {
        console.error('Failed to load faculty dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [router]);

  const handleOpenClass = (cls: FacultyAssignment) => {
    selectClass(cls);
    router.push(`/faculty/classes/${cls.id}`);
  };

  const getSubjectIcon = (name?: string, code?: string) => {
    const text = `${name || ''} ${code || ''}`.toLowerCase();
    if (text.includes('dbms') || text.includes('data')) return <Database size={20} color="#2563EB" />;
    if (text.includes('network') || text.includes('cn')) return <Network size={20} color="#059669" />;
    if (text.includes('os') || text.includes('system')) return <Cpu size={20} color="#7C3AED" />;
    if (text.includes('compiler')) return <Code2 size={20} color="#EA580C" />;
    return <BookOpen size={20} color="#2563EB" />;
  };

  const displayName = user?.name ? user.name.replace(/^Prof\.\s*|^Dr\.\s*/, '') : 'Kumar';

  return (
    <FacultyLayout>
      {/* 1. Header (No academic-context selector in the header) */}
      <div style={{ marginBottom: 'clamp(20px, 4vw, 32px)' }}>
        <h1
          style={{
            fontSize: 'clamp(22px, 4.5vw, 28px)',
            fontWeight: 800,
            color: 'var(--text-primary, #0F172A)',
            letterSpacing: '-0.5px',
            margin: '0 0 6px 0',
          }}
        >
          {getGreeting()}, Dr. {displayName}
        </h1>
        <p
          style={{
            fontSize: 'clamp(13px, 2.5vw, 15px)',
            color: 'var(--text-secondary, #64748B)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Here’s what’s happening across your classes today.
        </p>
      </div>

      {/* 2. Primary Section: MY CLASSES */}
      <section style={{ marginBottom: '36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary, #0F172A)',
                letterSpacing: '-0.3px',
                margin: 0,
              }}
            >
              My Classes
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #64748B)', margin: '2px 0 0 0' }}>
              Each card represents one active faculty teaching allocation.
            </p>
          </div>
          <Link
            href="/faculty/classes"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#2563EB',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Classes Grid */}
        <div
          className="faculty-classes-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
          }}
        >
          {classes.map((cls) => {
            const studentsCount = cls.studentsCount || (cls.sectionName?.includes('B') ? 52 : cls.sectionName?.includes('6') ? 45 : 48);
            return (
              <div
                key={cls.id}
                className="faculty-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '190px',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Top Badge & Academic Year */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#2563EB',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {cls.sectionName || 'CSE-A'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary, #94A3B8)', fontWeight: 500 }}>
                      {cls.academicYear || '2026-2027'}
                    </span>
                  </div>

                  {/* Subject Icon & Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
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
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'var(--text-primary, #0F172A)',
                          margin: '0 0 3px 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {cls.subjectName || 'Database Management Systems'}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', fontWeight: 500 }}>
                        {cls.subjectCode || 'CS702'} · {cls.semesterName || 'VII Semester'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Students Roster + Open Class Action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border, #E2E8F0)',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: 'var(--text-secondary, #64748B)',
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
                      gap: '4px',
                      transition: 'gap 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.gap = '8px')}
                    onMouseLeave={(e) => (e.currentTarget.style.gap = '4px')}
                  >
                    <span>Open Class</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid: 3. Needs Attention & 4. Upcoming Assignments */}
      <div
        className="faculty-dashboard-dual-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {/* SECTION 2: Needs Attention (Drafts, Unpublished items only; NO submissions/grading) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                }}
              />
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #0F172A)',
                  margin: 0,
                }}
              >
                Needs Attention
              </h2>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#D97706',
              }}
            >
              {draftAssignments.length + draftMaterials.length + draftAnnouncements.length} Action Items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Draft Assignment Card */}
            {draftAssignments.length > 0 ? (
              draftAssignments.map((draft) => (
                <div
                  key={draft.id}
                  className="faculty-card"
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderLeft: '4px solid #F59E0B',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#B45309',
                          textTransform: 'uppercase',
                        }}
                      >
                        Draft Assignment
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary, #94A3B8)' }}>
                        {draft.sectionName || 'CSE-A'} · {draft.subjectName || 'DBMS'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary, #0F172A)',
                        marginBottom: '4px',
                      }}
                    >
                      {draft.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                      Incomplete draft saved — not yet visible to students.
                    </div>
                  </div>

                  <Link
                    href={`/faculty/assignments/new?draftId=${draft.id}`}
                    style={{
                      flexShrink: 0,
                      padding: '7px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: '#2563EB',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>Continue Editing</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))
            ) : null}

            {/* Unpublished Material Card */}
            {draftMaterials.map((mat) => (
              <div
                key={mat.id}
                className="faculty-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderLeft: '4px solid #6366F1',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: '#4F46E5',
                        textTransform: 'uppercase',
                      }}
                    >
                      Unpublished Material
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary, #94A3B8)' }}>
                      {mat.sectionName || 'CSE-A'} · Unit {mat.unit || 4}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary, #0F172A)',
                      marginBottom: '4px',
                    }}
                  >
                    {mat.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                    Notes prepared but not released to section students.
                  </div>
                </div>

                <Link
                  href="/faculty/materials"
                  style={{
                    flexShrink: 0,
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    color: '#4F46E5',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>Publish</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}

            {/* Draft Announcement */}
            {draftAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="faculty-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderLeft: '4px solid #0EA5E9',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(14, 165, 233, 0.15)',
                        color: '#0284C7',
                        textTransform: 'uppercase',
                      }}
                    >
                      Draft Announcement
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary, #94A3B8)' }}>
                      {ann.sectionName || 'CSE-A'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary, #0F172A)',
                      marginBottom: '4px',
                    }}
                  >
                    {ann.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                    Lab announcement ready for release.
                  </div>
                </div>

                <Link
                  href="/faculty/announcements"
                  style={{
                    flexShrink: 0,
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    color: '#0284C7',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>Review</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}

            {draftAssignments.length === 0 && draftMaterials.length === 0 && draftAnnouncements.length === 0 && (
              <div
                className="faculty-card"
                style={{
                  padding: '28px',
                  textAlign: 'center',
                  color: 'var(--text-secondary, #64748B)',
                }}
              >
                <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
                  All caught up!
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  No draft assignments, unpublished materials, or pending faculty tasks.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Upcoming (Scheduled/Published assignments with due dates) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#2563EB" />
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #0F172A)',
                  margin: 0,
                }}
              >
                Upcoming Deadlines
              </h2>
            </div>
            <Link
              href="/faculty/assignments"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563EB',
                textDecoration: 'none',
              }}
            >
              Assignments Tab →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingAssignments.slice(0, 3).map((asg) => {
              const dueDate = new Date(asg.deadline);
              const formattedDate = dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={asg.id}
                  className="faculty-card"
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          color: '#2563EB',
                        }}
                      >
                        {asg.subjectCode || (asg.subjectName?.includes('Network') ? 'CN' : 'DBMS')}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                        {asg.sectionName || 'CSE-A'} · VII Semester
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary, #0F172A)',
                        marginBottom: '2px',
                      }}
                    >
                      {asg.title}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      flexShrink: 0,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#DC2626', textTransform: 'uppercase' }}>
                      DUE
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626' }}>
                      {formattedDate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: Recent Activity (Concise faculty actions only) */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={17} color="var(--text-secondary, #64748B)" />
            <h2
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-primary, #0F172A)',
                margin: 0,
              }}
            >
              Recent Faculty Activity
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}>Past 48 Hours</span>
        </div>

        <div className="faculty-card" style={{ padding: '8px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Activity 1: Assignment published */}
            <div
              style={{
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border, #E2E8F0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                  }}
                >
                  <FileCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Assignment published: <span style={{ fontWeight: 500 }}>Assignment 03 · Normalization & BCNF</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    CSE-A · Database Management Systems
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>2 hours ago</span>
            </div>

            {/* Activity 2: Material uploaded */}
            <div
              style={{
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border, #E2E8F0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                  }}
                >
                  <Box size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Material uploaded: <span style={{ fontWeight: 500 }}>Unit 3 Normalization & Multi-Valued Dependencies.pdf</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    CSE-A · Database Management Systems
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Yesterday, 4:30 PM</span>
            </div>

            {/* Activity 3: Question Paper added */}
            <div
              style={{
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border, #E2E8F0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7C3AED',
                  }}
                >
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Question paper added: <span style={{ fontWeight: 500 }}>2025 Mid-Term Question Paper</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    CSE-B · Computer Networks
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>2 days ago</span>
            </div>

            {/* Activity 4: Announcement published */}
            <div
              style={{
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EA580C',
                  }}
                >
                  <Megaphone size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Announcement published: <span style={{ fontWeight: 500 }}>Lab Exam Guidelines & Evaluation Rubric</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    CSE-A · Database Management Systems
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>3 days ago</span>
            </div>
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}
