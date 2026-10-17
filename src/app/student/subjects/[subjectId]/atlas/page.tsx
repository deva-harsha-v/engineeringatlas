'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { AtlasTopic, Subject } from '@/lib/types';
import { EmptyState, Card } from '@/components/ui';
import { ArrowRight, Compass } from 'lucide-react';

export default function SubjectAtlasPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [topics, setTopics] = useState<AtlasTopic[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch(`/api/atlas?subjectId=${subjectId}`),
          fetch(`/api/subjects/${subjectId}`),
        ]);
        const [tData, sData] = await Promise.all([tRes.json(), sRes.json()]);
        if (tData.success) setTopics(tData.data);
        if (sData.success) setSubject(sData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subjectId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />
      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '24px' }}>
          <a
            href={`/student/subjects/${subjectId}`}
            style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
          >
            ← Back to {subject?.name || 'Subject Workspace'}
          </a>
          <h1 className="text-page-title">{subject?.name || 'Subject'} Atlas Modules</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Interactive educational modules with step-by-step simulations.
          </p>
        </div>

        {topics.length === 0 ? (
          <EmptyState
            title="No Atlas Modules for this Subject"
            description="Our engineering team is actively building visualizations for this syllabus."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {topics.map((t) => (
              <Card key={t.id} hoverable className="ea-card">
                <Link href={`/student/atlas/${t.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-accent">UNIT {t.unit}</span>
                    <span className="tech-coordinate">{t.estimatedTime}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {t.overview}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Difficulty: {t.difficulty}</span>
                    <span style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Simulation <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
      <StudentBottomNav />
    </div>
  );
}
