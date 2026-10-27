'use client';

import React, { useState, useEffect } from 'react';
import { SubjectCard } from '@/components/academic';
import { Subject } from '@/lib/types';
import { RippleLoader, AtlasAmbientBackground } from '@/components/ui';
import { useAcademicProfile } from '@/lib/useProfile';
import { fetchWithFastCache, getCachedData } from '@/lib/api-cache';

export default function SubjectsDirectoryPage() {
  const { profile } = useAcademicProfile();

  const branchId =
    profile?.branch === 'ECE'
      ? 'branch-ece'
      : profile?.branch === 'EEE'
      ? 'branch-eee'
      : profile?.branch === 'MECH'
      ? 'branch-mech'
      : profile?.branch === 'CIVIL'
      ? 'branch-civil'
      : 'branch-cse';

  const cacheKey = `/api/subjects?branchId=${branchId}`;
  const initialCache = getCachedData<any>(cacheKey);

  const [subjects, setSubjects] = useState<Subject[]>(() => initialCache?.data || []);
  const [loading, setLoading] = useState<boolean>(() => !initialCache?.data);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const json = await fetchWithFastCache<any>(cacheKey);
        if (json?.success) {
          setSubjects(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, [cacheKey]);

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
      {/* Syllabus Header Hero with Ambient Layer */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface-1)',
          padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
          marginBottom: '24px',
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
            ACADEMIC HUB · {profile.branch} {profile.semesterName}
          </div>
          <h1 className="text-page-title" style={{ margin: '0 0 6px' }}>Syllabus Subjects</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Complete engineering workspaces with units, notes, practice, papers, and interactive Atlas modules.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '64px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RippleLoader size="md" message="Loading Syllabus Subjects..." subMessage="Fetching Cohort Curriculum" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {subjects.map((sub) => (
            <SubjectCard key={sub.id} subject={sub} />
          ))}
        </div>
      )}
    </main>
  );
}
