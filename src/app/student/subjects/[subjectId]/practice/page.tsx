'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { Question, Subject } from '@/lib/types';
import { QuizRunner } from '@/components/practice/QuizRunner';
import { EmptyState } from '@/components/ui';

export default function SubjectPracticePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [qRes, sRes] = await Promise.all([
          fetch(`/api/questions?subjectId=${subjectId}`),
          fetch(`/api/subjects/${subjectId}`),
        ]);
        const [qData, sData] = await Promise.all([qRes.json(), sRes.json()]);
        if (qData.success) setQuestions(qData.data);
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
          <h1 className="text-page-title">{subject?.name || 'Subject'} Practice Quiz</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Concept questions with instant step explanations and revision breakdown.
          </p>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            title="No Questions in this Bank"
            description="Questions are currently being compiled by the department."
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
