'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { QuizRunner } from '@/components/practice/QuizRunner';
import { Question, Subject } from '@/lib/types';
import { EmptyState } from '@/components/ui';

export default function ActivePracticeRunnerPage() {
  const params = useParams();
  const practiceId = params.practiceId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const [qRes, sRes] = await Promise.all([
          fetch(`/api/questions?subjectId=${practiceId}`),
          fetch(`/api/subjects/${practiceId}`),
        ]);
        const [qData, sData] = await Promise.all([qRes.json(), sRes.json()]);
        if (qData.success) setQuestions(qData.data);
        if (sData.success) setSubject(sData.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (practiceId) loadQuiz();
  }, [practiceId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/student/practice"
            style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
          >
            ← Back to Practice Hub
          </Link>
          <h1 className="text-page-title">{subject?.name || 'Practice'} Assessment</h1>
        </div>

        {loading ? (
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: '240px', borderRadius: 'var(--radius-lg)' }} />
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            title="No Questions Available"
            description="There are currently no practice questions available for this module."
          />
        ) : (
          <QuizRunner
            subjectName={subject?.name || 'Subject'}
            questions={questions}
          />
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
