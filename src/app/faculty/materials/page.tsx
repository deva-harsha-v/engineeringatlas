'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { Material } from '@/lib/types';
import { Button, Badge, EmptyState } from '@/components/ui';
import { Upload, Trash2, ExternalLink, Download } from 'lucide-react';

export default function FacultyMaterialsListPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACADEMIC HUB REPOSITORY
            </div>
            <h1 className="text-page-title">Course Study Materials</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Materials currently published to your sections in the student portal.
            </p>
          </div>

          <Link href="/faculty/materials/new">
            <Button variant="primary" size="sm">
              <Upload size={14} /> Upload New Material
            </Button>
          </Link>
        </div>

        {materials.length === 0 ? (
          <EmptyState
            title="No Materials Published"
            description="You haven't uploaded any study notes or slides yet."
            actionText="Upload First Material"
            onAction={() => window.location.href = '/faculty/materials/new'}
          />
        ) : (
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Title</th>
                  <th style={{ padding: '12px 16px' }}>Subject & Section</th>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px' }}>Downloads</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.fileName}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>{m.subjectName}</div>
                      <span className="badge badge-accent" style={{ fontSize: '10px' }}>{m.sectionName || 'All Sections'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-default">{m.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                      {m.downloadsCount || 0}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
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
        )}
      </main>
    </div>
  );
}
