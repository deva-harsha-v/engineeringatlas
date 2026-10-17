'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { FacultyAssignment } from '@/lib/types';
import { Card, Button, Badge } from '@/components/ui';
import { Users, ArrowRight } from 'lucide-react';

export default function FacultyClassesListPage() {
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/faculty/assignments');
        const json = await res.json();
        if (json.success) setClasses(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            <Users size={14} /> MY TEACHING ASSIGNMENTS
          </div>
          <h1 className="text-page-title">Assigned Classes</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Classes assigned to you by the department head. You have full publishing authority within these contexts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {classes.map((cls) => (
            <Card key={cls.id} hoverable className="ea-card">
              <Link href={`/faculty/classes/${cls.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-accent">{cls.sectionName}</span>
                  <span className="tech-coordinate">{cls.academicYear}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {cls.subjectName}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {cls.subjectCode} · {cls.semesterName || 'VII Semester'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Section Size: 64 Students</span>
                  <span style={{ color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    Open Workspace <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
