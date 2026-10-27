'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { useFacultyClass } from '@/lib/useFacultyClass';
import { Assignment } from '@/lib/types';
import {
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  MoreVertical,
  Database,
  Cpu,
  Code2,
  Network,
  Users,
  ArrowRight,
  Trash2,
  FileEdit,
  Send,
  AlertCircle,
} from 'lucide-react';

function FacultyAssignmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'UPCOMING' | 'PUBLISHED' | 'DRAFTS' | 'PAST' | null;

  const { activeClass, classes } = useFacultyClass();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Exact 4 Tabs Requested: [ Upcoming ] [ Published ] [ Drafts ] [ Past ]
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PUBLISHED' | 'DRAFTS' | 'PAST'>(initialTab || 'UPCOMING');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      // Fetch all assignments for this faculty (both draft and published)
      const res = await fetch('/api/assignments?status=ALL');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAssignments(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [activeClass]);

  // Handle draft publishing directly
  const handlePublishDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });
      const json = await res.json();
      if (json.success) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'PUBLISHED' } : a))
        );
        setActiveTab('PUBLISHED');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle draft deletion
  const handleDeleteDraft = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAssignments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Format relative time: e.g. "2 hours ago"
  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Filtered lists
  const now = new Date();

  const drafts = useMemo(() => {
    return assignments.filter((a) => a.status === 'DRAFT');
  }, [assignments]);

  const published = useMemo(() => {
    return assignments.filter((a) => a.status === 'PUBLISHED');
  }, [assignments]);

  const upcoming = useMemo(() => {
    return published.filter((a) => new Date(a.deadline) >= now);
  }, [published, now]);

  const past = useMemo(() => {
    return published.filter((a) => new Date(a.deadline) < now);
  }, [published, now]);

  // Get current active tab list
  const currentList = useMemo(() => {
    let list: Assignment[] = [];
    if (activeTab === 'UPCOMING') list = upcoming;
    else if (activeTab === 'PUBLISHED') list = published;
    else if (activeTab === 'DRAFTS') list = drafts;
    else if (activeTab === 'PAST') list = past;

    // Filter by subject
    if (selectedSubject !== 'ALL') {
      list = list.filter(
        (a) => a.subjectId === selectedSubject || a.subjectName?.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          (a.subjectName && a.subjectName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeTab, upcoming, published, drafts, past, selectedSubject, searchQuery]);

  const getSubjectIcon = (name?: string) => {
    const text = (name || '').toLowerCase();
    if (text.includes('dbms') || text.includes('data')) return <Database size={20} color="#2563EB" />;
    if (text.includes('network') || text.includes('cn')) return <Network size={20} color="#059669" />;
    if (text.includes('system') || text.includes('os')) return <Cpu size={20} color="#7C3AED" />;
    if (text.includes('compiler')) return <Code2 size={20} color="#EA580C" />;
    return <FileText size={20} color="#2563EB" />;
  };

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Assignments']}
        title="Coursework Assignments"
        description="Author, schedule, and distribute coursework tasks. Manage incomplete drafts and monitor publication lifecycles."
        action={
          <Link href="/faculty/assignments/new" style={{ textDecoration: 'none' }}>
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Plus size={16} />
              <span>Create Assignment</span>
            </button>
          </Link>
        }
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
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {published.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Published Tasks
            </div>
          </div>
        </div>

        {/* Drafts Card */}
        <div
          className="faculty-card"
          onClick={() => setActiveTab('DRAFTS')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            border: activeTab === 'DRAFTS' ? '2px solid #F59E0B' : undefined,
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {drafts.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Saved Drafts
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {upcoming.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Upcoming Deadlines
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
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {past.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Past Deadlines
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div
        className="faculty-card faculty-filter-card"
        style={{
          padding: '12px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Exact 4 Tabs: [ Upcoming ] [ Published ] [ Drafts ] [ Past ] */}
        <div className="faculty-tabs-container" style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'UPCOMING', label: 'Upcoming', count: upcoming.length },
            { id: 'PUBLISHED', label: 'Published', count: published.length },
            { id: 'DRAFTS', label: 'Drafts', count: drafts.length },
            { id: 'PAST', label: 'Past', count: past.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(100, 116, 139, 0.12)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Subject Filter */}
        <div className="faculty-filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          <div className="faculty-filter-search-wrap" style={{ position: 'relative', width: '220px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search assignments..."
              className="faculty-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '34px',
                paddingLeft: '32px',
                paddingRight: '12px',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          <select
            className="form-select faculty-filter-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              height: '34px',
              padding: '0 12px',
              fontSize: '12px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-1)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="ALL">All Subjects</option>
            {classes.map((c) => (
              <option key={c.subjectId} value={c.subjectId}>
                {c.subjectName} ({c.sectionName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ASSIGNMENTS LIST */}
      {activeTab === 'DRAFTS' ? (
        /* DRAFTS VIEW matching exact format in prompt */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            DRAFTS ({currentList.length})
          </div>

          {currentList.length === 0 ? (
            <div
              className="faculty-card"
              style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}
            >
              <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                No assignment drafts found.
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                All assignments are either published or you haven't saved any drafts yet.
              </div>
            </div>
          ) : (
            currentList.map((draft) => (
              <div
                key={draft.id}
                className="faculty-card faculty-item-card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '18px',
                  borderLeft: '4px solid #F59E0B',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  {/* Subject Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.25)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#2563EB',
                      }}
                    >
                      {draft.subjectCode || (draft.subjectName?.includes('Network') ? 'CN' : 'DBMS')}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {draft.sectionName || 'CSE-A'} · VII Semester
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {draft.title}
                  </h3>

                  {/* Relative edit time */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Clock size={13} />
                    <span>Last edited {formatTimeAgo(draft.updatedAt || draft.createdAt)}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ color: '#D97706', fontWeight: 600 }}>Draft · Hidden from students</span>
                  </div>
                </div>

                {/* Actions: [Continue Editing →] and [•••] */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <Link
                    href={`/faculty/assignments/new?draftId=${draft.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '12px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Continue Editing</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>

                  {/* Dropdown Options */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === draft.id ? null : draft.id)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="More actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuId === draft.id && (
                      <div
                        className="faculty-card"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 'calc(100% + 4px)',
                          width: '180px',
                          padding: '6px',
                          zIndex: 50,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <button
                          onClick={() => {
                            handlePublishDraft(draft.id);
                            setActiveMenuId(null);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 10px',
                            fontSize: '12px',
                            color: '#10B981',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            textAlign: 'left',
                          }}
                        >
                          <Send size={14} />
                          <span>Publish Directly</span>
                        </button>

                        <button
                          onClick={() => {
                            handleDeleteDraft(draft.id);
                            setActiveMenuId(null);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 10px',
                            fontSize: '12px',
                            color: '#DC2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            textAlign: 'left',
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete Draft</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* UPCOMING / PUBLISHED / PAST VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentList.length === 0 ? (
            <div
              className="faculty-card"
              style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}
            >
              <FileText size={36} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                No assignments found in this category.
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Use the "Create Assignment" button to author and publish coursework.
              </div>
            </div>
          ) : (
            currentList.map((asg) => {
              const dueDate = new Date(asg.deadline);
              const formattedDate = dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={asg.id}
                  className="faculty-card faculty-item-card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', minWidth: 0, flex: 1 }}>
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
                      {getSubjectIcon(asg.subjectName)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            border: '1px solid rgba(37, 99, 235, 0.25)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#2563EB',
                          }}
                        >
                          {asg.subjectCode || (asg.subjectName?.includes('Network') ? 'CN' : 'DBMS')}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {asg.sectionName || 'CSE-A'} · VII Semester
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#059669',
                            textTransform: 'uppercase',
                          }}
                        >
                          PUBLISHED
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: '0 0 6px 0',
                        }}
                      >
                        {asg.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {asg.description}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Due Date & Delete action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                    <div
                      style={{
                        textAlign: 'right',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--surface-2, #F8FAFC)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        DUE DATE
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {formattedDate}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDraft(asg.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                      }}
                      title="Delete assignment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </FacultyLayout>
  );
}

export default function FacultyAssignmentsPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading assignments...
        </div>
      }
    >
      <FacultyAssignmentsContent />
    </React.Suspense>
  );
}
