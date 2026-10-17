'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Announcement } from '@/lib/types';
import { Button, Badge, Modal, EmptyState } from '@/components/ui';
import { AnnouncementCard } from '@/components/academic';
import { Plus, Bell, Trash2 } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL' | 'LOW'>('HIGH');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/announcements');
        const json = await res.json();
        if (json.success) setAnnouncements(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, priority }),
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              CAMPUS-WIDE COMMUNICATIONS
            </div>
            <h1 className="text-page-title">Institution Announcements</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Publish institutional academic schedules, examination notifications, and administrative updates.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> New Institutional Notice
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {announcements.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Institutional Notice">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Priority</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              <option value="HIGH">High Priority (Urgent Banner)</option>
              <option value="NORMAL">Normal Priority</option>
              <option value="LOW">Informational</option>
            </select>
          </div>

          <div>
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="e.g. End-Semester Academic Schedule Released" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="form-label">Content</label>
            <textarea className="form-textarea" rows={4} placeholder="Full message text..." value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Broadcasting...' : 'Broadcast Notice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
