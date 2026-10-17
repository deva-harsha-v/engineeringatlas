'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { Subject, Question } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';
import { CheckSquare, Clock, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

export default function StudentPracticeHubPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/subjects');
        const json = await res.json();
        if (json.success) setSubjects(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            <CheckSquare size={14} /> FOCUSED ASSESSMENT ENGINE
          </div>
          <h1 className="text-page-title">Practice & Revision</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Master theoretical concepts through high-yield questions with instantaneous explanation feedback.
          </p>
        </div>

        {/* Quick Practice Modes */}
        <div style={{ marginBottom: '40px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '14px' }}>
            PRACTICE MODES
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
        </div>
      </main>

      <StudentBottomNav />
    </div>
  );
}
