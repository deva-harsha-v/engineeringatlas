'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuizRunner } from '@/components/practice/QuizRunner';
import { Question, Subject } from '@/lib/types';
import { EmptyState, RippleLoader } from '@/components/ui';

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
        <Link
          href="/student/practice"
          style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
        >
          ← Back to Practice Hub
        </Link>
        <h1 className="text-page-title">{subject?.name || 'Practice'} Assessment</h1>
      </div>

      {loading ? (
        <div style={{ padding: '64px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RippleLoader size="md" message="Loading Practice Assessment..." subMessage="Preparing Concept Questions" />
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
  );
}
