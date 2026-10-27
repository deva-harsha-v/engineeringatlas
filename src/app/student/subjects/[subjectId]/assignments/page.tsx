'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AssignmentCard } from '@/components/academic';
import { Assignment, Subject } from '@/lib/types';
import { EmptyState } from '@/components/ui';
import { useAcademicProfile } from '@/lib/useProfile';

export default function SubjectAssignmentsPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { profile } = useAcademicProfile();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const secId =
          profile?.sectionId ||
          (profile?.section === 'CSE-B'
            ? 'sec-cseb'
            : profile?.section === 'ECE-A'
            ? 'sec-ecea'
            : profile?.section === 'ECE-B'
            ? 'sec-eceb'
            : 'sec-csea');

        const [aRes, sRes] = await Promise.all([
          fetch(`/api/assignments?subjectId=${subjectId}&sectionId=${secId}`),
          fetch(`/api/subjects/${subjectId}`),
        ]);
        const [aData, sData] = await Promise.all([aRes.json(), sRes.json()]);
        if (aData.success) setAssignments(aData.data);
        if (sData.success) setSubject(sData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subjectId, profile]);

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
        <h1 className="text-page-title">{subject?.name || 'Subject'} Assignments</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Deadlines, problem sheets, and submission instructions.
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No Assignments Published Yet"
          description="Your faculty hasn't published any assignments for this subject."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assignments.map((asg) => (
            <AssignmentCard key={asg.id} assignment={asg} />
          ))}
        </div>
      )}
    </main>
  );
}
