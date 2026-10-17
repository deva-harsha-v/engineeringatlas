'use client';

import React, { useState, useEffect } from 'react';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { Announcement, FacultyAssignment } from '@/lib/types';
import { Button, Badge, Modal, EmptyState } from '@/components/ui';
import { AnnouncementCard } from '@/components/academic';
import { Plus, Bell } from 'lucide-react';

export default function FacultyAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              CLASSROOM BROADCASTS
            </div>
            <h1 className="text-page-title">Announcements & Notices</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Broadcast urgent notifications, mid-term updates, and assignment clarifications to your students.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Post Announcement
          </Button>
        </div>

        {announcements.length === 0 ? (
          <EmptyState
            title="No Announcements Active"
            description="Post notices directly to your students' Academic Feed."
            actionText="Post Notice"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Class Announcement">
        <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Target Class Section</label>
            <select className="form-select" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.sectionName} · {cls.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Priority Level</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              <option value="NORMAL">Normal Priority</option>
              <option value="HIGH">High Priority (Urgent Badge)</option>
              <option value="LOW">Low Priority (Informational)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Operating Systems Mid-Term Syllabus & Problem Set"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Message Content</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="State the notice clearly..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Broadcasting...' : 'Broadcast Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
