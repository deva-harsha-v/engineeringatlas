'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Material } from '@/lib/types';
import { Button, Badge, Card } from '@/components/ui';
import { FileText, CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';

export default function AdminContentModerationPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [moderationMode, setModerationMode] = useState<'MODEL_A' | 'MODEL_B'>('MODEL_A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/materials');
        const json = await res.json();
        if (json.success) setMaterials(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: Material['status']) => {
    try {
      await fetch(`/api/materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setMaterials(materials.map((m) => (m.id === id ? { ...m, status } : m)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this resource from the institution portal?')) return;
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACADEMIC REPOSITORY MODERATION
            </div>
            <h1 className="text-page-title">Content & Materials Moderation</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Institutional quality control, file moderation, and policy enforcement across faculty uploads.
            </p>
          </div>

          {/* Model Selector (PRD Section 35: Model A Direct vs Model B Admin Approval) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-1)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>POLICY:</span>
            <button
              onClick={() => setModerationMode('MODEL_A')}
              className={`btn btn-sm ${moderationMode === 'MODEL_A' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Model A (Direct Publish)
            </button>
            <button
              onClick={() => setModerationMode('MODEL_B')}
              className={`btn btn-sm ${moderationMode === 'MODEL_B' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Model B (Admin Approval)
            </button>
          </div>
        </div>

        {/* Materials Table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Title & Author</th>
                <th style={{ padding: '12px 16px' }}>Subject Context</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Moderation Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Author: {m.facultyName} · {m.fileName}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>{m.subjectName}</div>
                    <span className="badge badge-accent" style={{ fontSize: '10px' }}>{m.sectionName || 'All Sections'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-default">{m.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${m.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      {m.status !== 'PUBLISHED' ? (
                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(m.id, 'PUBLISHED')} style={{ color: 'var(--success)' }}>
                          <CheckCircle size={13} /> Approve
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(m.id, 'ARCHIVED')}>
                          Archive
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => window.open(m.fileUrl, '_blank')}>
                        <ExternalLink size={13} />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleDelete(m.id)} style={{ color: 'var(--error)' }}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
