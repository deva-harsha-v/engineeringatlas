'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PaperCard } from '@/components/academic';
import { QuestionPaper, Subject } from '@/lib/types';
import { EmptyState } from '@/components/ui';

export default function SubjectPapersPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch(`/api/papers?subjectId=${subjectId}`),
          fetch(`/api/subjects/${subjectId}`),
        ]);
        const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
        if (pData.success) setPapers(pData.data);
        if (sData.success) setSubject(sData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subjectId]);

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
        <h1 className="text-page-title">{subject?.name || 'Subject'} Question Papers</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Previous end semester exams, internal mid-terms, and faculty model papers.
        </p>
      </div>

      {papers.length === 0 ? (
        <EmptyState
          title="No Papers Uploaded Yet"
          description="No question papers have been archived for this subject yet."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {papers.map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>
      )}
    </main>
  );
}
