'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { AtlasTopic } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';
import { Compass, ArrowRight, Layers, Cpu, Database, Network, GitBranch } from 'lucide-react';

export default function AtlasCatalogPage() {
  const [topics, setTopics] = useState<AtlasTopic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/atlas');
        const json = await res.json();
        if (json.success) setTopics(json.data);
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, []);

  const subjects = ['ALL', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Compiler Design'];

  const filteredTopics =
    selectedSubject === 'ALL'
      ? topics
      : topics.filter((t) => t.subjectName === selectedSubject);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            <Compass size={14} /> CORE PRODUCT DIFFERENTIATOR
          </div>
          <h1 className="text-page-title">Interactive Engineering Atlas</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '720px' }}>
            Step through, manipulate parameters, observe outcomes, and visually understand complex engineering concepts. Animation is not decoration — every simulation teaches a system mechanism.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`btn btn-sm ${selectedSubject === sub ? 'btn-primary' : 'btn-secondary'}`}
            >
              {sub === 'ALL' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>

        {/* Atlas Modules Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredTopics.map((topic) => (
            <Card key={topic.id} hoverable className="ea-card">
              <Link href={`/student/atlas/${topic.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge badge-accent">{topic.subjectName || 'Engineering Atlas'}</span>
                  <span className="tech-coordinate">{topic.estimatedTime}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {topic.title}
                </h3>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {topic.overview}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>Difficulty: {topic.difficulty}</span>
                  <span style={{ color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    Enter Simulation <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <StudentBottomNav />
    </div>
  );
}
