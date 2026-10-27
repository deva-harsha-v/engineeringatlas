'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MaterialCard } from '@/components/academic';
import { Material, Subject } from '@/lib/types';
import { EmptyState } from '@/components/ui';

export default function SubjectMaterialsPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mRes, sRes] = await Promise.all([
          fetch(`/api/materials?subjectId=${subjectId}`),
          fetch(`/api/subjects/${subjectId}`),
        ]);
        const [mData, sData] = await Promise.all([mRes.json(), sRes.json()]);
        if (mData.success) setMaterials(mData.data);
        if (sData.success) setSubject(sData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subjectId]);

  const filtered = filter === 'ALL' ? materials : materials.filter((m) => m.type === filter);

  return (
    <main
      className="mobile-nav-pad"
      style={{
        flex: 1,
        padding: '24px clamp(16px, 2.5vw, 32px) 80px',
        maxWidth: '1440px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <a
          href={`/student/subjects/${subjectId}`}
          style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
        >
          ← Back to {subject?.name || 'Subject Workspace'}
        </a>
        <h1 className="text-page-title">{subject?.name || 'Subject'} Materials</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Faculty notes, presentations, lab manuals, and supplementary files.
        </p>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['ALL', 'NOTES', 'PPT', 'LAB_MANUAL', 'REFERENCE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f === 'ALL' ? 'All' : f === 'LAB_MANUAL' ? 'Lab Manuals' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Materials in this Category"
          description="No files have been published under this filter."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {filtered.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      )}
    </main>
  );
}
