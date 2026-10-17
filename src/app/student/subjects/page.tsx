'use client';

import React, { useState, useEffect } from 'react';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { SubjectCard } from '@/components/academic';
import { Subject } from '@/lib/types';
import { BookOpen } from 'lucide-react';
import { useAcademicProfile } from '@/lib/useProfile';

export default function SubjectsDirectoryPage() {
  const { profile } = useAcademicProfile();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/subjects');
        const json = await res.json();
        if (json.success) {
          setSubjects(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            ACADEMIC HUB · {profile.branch} {profile.semesterName}
          </div>
          <h1 className="text-page-title">Syllabus Subjects</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Complete engineering workspaces with units, notes, practice, papers, and interactive Atlas modules.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {subjects.map((sub) => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
