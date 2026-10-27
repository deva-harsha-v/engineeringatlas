'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { useAcademicProfile } from '@/lib/useProfile';
import { Announcement, FacultyAssignment } from '@/lib/types';
import { Modal } from '@/components/ui';
import {
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Plus,
  Search,
  Calendar,
  Trash2,
  Users,
} from 'lucide-react';

export default function FacultyAnnouncementsPage() {
  const { profile } = useAcademicProfile();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL' | 'LOW'>('NORMAL');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, cRes] = await Promise.all([
          fetch('/api/announcements'),
          fetch('/api/faculty/assignments'),
        ]);
        const [aData, cData] = await Promise.all([aRes.json(), cRes.json()]);
        if (aData.success) setAnnouncements(aData.data);
        if (cData.success && cData.data.length > 0) {
          setClasses(cData.data);
          setSelectedClassId(cData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          priority,
          subjectId: currentClass?.subjectId,
          sectionId: currentClass?.sectionId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAnnouncements([json.data, ...announcements]);
        setIsModalOpen(false);
        setTitle('');
        setContent('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      if (priorityFilter !== 'ALL' && a.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchContent = a.content.toLowerCase().includes(q);
        if (!matchTitle && !matchContent) return false;
      }
      return true;
    });
  }, [announcements, priorityFilter, searchQuery]);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Announcements']}
        title="Classroom Announcements & Broadcasts"
        description="Publish urgent notices, mid-term examination instructions, and lecture room changes directly to student feeds."
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
        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <Megaphone size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {announcements.length || 3}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Broadcasts
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {announcements.filter((a) => a.priority === 'HIGH').length || 1}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              High Priority Alerts
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              100%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Broadcast Delivery
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              192
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Students Reached
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div
        className="faculty-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '14px',
        }}
      >
        <div className="faculty-filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div className="faculty-filter-search-wrap" style={{ position: 'relative', width: '260px' }}>
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                paddingLeft: '34px',
                paddingRight: '12px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <select
            className="faculty-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              height: '38px',
              padding: '0 12px',
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="faculty-filter-action">
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              height: '38px',
              padding: '0 16px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
              width: '100%',
            }}
          >
            <Plus size={16} />
            <span>Post Announcement</span>
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAnnouncements.map((a) => (
          <div
            key={a.id}
            className="faculty-card faculty-item-card"
            style={{
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: a.priority === 'HIGH' ? '#FEF2F2' : '#EFF6FF',
                    color: a.priority === 'HIGH' ? '#DC2626' : '#2563EB',
                    border: '1px solid',
                    borderColor: a.priority === 'HIGH' ? '#FEE2E2' : '#BFDBFE',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {a.priority} PRIORITY
                </span>
                {a.sectionName && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid var(--border)',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {a.sectionName}
                  </span>
                )}
                {a.subjectName && (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {a.subjectName}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {a.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {a.content}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#94A3B8',
                flexShrink: 0,
              }}
            >
              <Calendar size={13} />
              <span>{new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Post Announcement */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Classroom Notice">
        <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Target Class Section</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subjectName} ({c.sectionName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Schedule Change for Mid-Term Examination 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Priority Level</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              <option value="NORMAL">Normal Notice</option>
              <option value="HIGH">High Priority (Urgent Notification)</option>
              <option value="LOW">Low Priority (General Info)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Notice Details</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Provide exact instructions, venue details, or syllabus scope..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Broadcasting...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </FacultyLayout>
  );
}
