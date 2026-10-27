'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Subject } from '@/lib/types';
import { Card, Button, AtlasAmbientBackground } from '@/components/ui';
import { fetchWithFastCache, getCachedData } from '@/lib/api-cache';
import { CheckSquare, ArrowRight, Zap, Target } from 'lucide-react';

export default function StudentPracticeHubPage() {
  const cachedSubjects = getCachedData<any>('/api/subjects');
  const [subjects, setSubjects] = useState<Subject[]>(() => cachedSubjects?.data || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedSubjects?.data);

  useEffect(() => {
    async function load() {
      try {
        const json = await fetchWithFastCache<any>('/api/subjects');
        if (json?.success) setSubjects(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      {/* Practice Header Hero with Ambient Layer */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface-1)',
          padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
          marginBottom: '28px',
          boxSizing: 'border-box',
        }}
      >
        <AtlasAmbientBackground
          intensity="subtle"
          contained
          showGrid
          showShapes
          showGlow
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            <CheckSquare size={14} /> FOCUSED ASSESSMENT ENGINE
          </div>
          <h1 className="text-page-title" style={{ margin: '0 0 6px' }}>Practice & Revision</h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: 0 }}>
            Master theoretical concepts through high-yield questions with instantaneous explanation feedback.
          </p>
        </div>
      </div>

      {/* Quick Practice Modes */}
      <div style={{ marginBottom: '40px' }}>
        <div className="tech-coordinate" style={{ marginBottom: '14px' }}>
          PRACTICE MODES
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '16px',
          }}
        >
          <Card className="ea-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} color="var(--accent-hover)" />
              <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Quick Practice Drill</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              5 rapid-fire questions covering core engineering fundamentals. 5 minute timer.
            </p>
            <Link href="/student/practice/sub-os">
              <Button variant="primary" size="sm">
                Start Quick Drill (5 min) <ArrowRight size={13} />
              </Button>
            </Link>
          </Card>

          <Card className="ea-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Target size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '17px', fontWeight: 600 }}>High-Yield Exam Questions</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Questions with highest repeat frequency across previous semester papers.
            </p>
            <Link href="/student/practice/sub-os">
              <Button variant="secondary" size="sm">
                Practice Top Repeated <ArrowRight size={13} />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Subject Quizzes */}
      <div>
        <div className="tech-coordinate" style={{ marginBottom: '14px' }}>
          SUBJECT COMPREHENSIVE QUIZZES
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '160px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '16px',
            }}
          >
            {subjects.map((sub) => (
              <Card key={sub.id} hoverable className="ea-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-accent">{sub.code}</span>
                  <span className="tech-coordinate">{sub.questionsCount || 10} QUESTIONS</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {sub.name} Quiz
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {sub.description || 'Full subject practice quiz with unit coverage.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Difficulty: Mixed</span>
                  <Link href={`/student/practice/${sub.id}`}>
                    <Button variant="secondary" size="sm">
                      Start Quiz <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
