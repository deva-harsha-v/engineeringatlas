'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { FacultyAssignment, Material, Assignment } from '@/lib/types';
import { Button, Card, Badge } from '@/components/ui';
import {
  Users,
  BookOpen,
  CheckSquare,
  FileText,
  Plus,
  ArrowRight,
  Upload,
  Calendar,
} from 'lucide-react';

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [clsRes, matRes, asgRes] = await Promise.all([
          fetch('/api/faculty/assignments'),
          fetch('/api/materials'),
          fetch('/api/assignments'),
        ]);

        if (clsRes.status === 401) {
          router.push('/faculty/login');
          return;
        }

        const [cls, mats, asgs] = await Promise.all([
          clsRes.json(),
          matRes.json(),
          asgRes.json(),
        ]);

        if (cls.success) setClasses(cls.data);
        if (mats.success) setMaterials(mats.data);
        if (asgs.success) setAssignments(asgs.data);
      } catch (err) {
        console.error('Failed to load faculty dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        {/* Welcome Banner (Matching UI/UX Spec Page 14, Section 26) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACADEMIC TEACHING CONTEXT · DEPARTMENT OF CSE
            </div>
            <h1 className="text-page-title">Welcome, Dr. Kumar</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage your assigned sections, distribute lecture materials, and create assignments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/faculty/materials/new">
              <Button variant="primary" size="sm">
                <Upload size={14} /> Upload Material
              </Button>
            </Link>
            <Link href="/faculty/assignments/new">
              <Button variant="secondary" size="sm">
                <Plus size={14} /> New Assignment
              </Button>
            </Link>
          </div>
        </div>

        {/* Today's Overview Stats */}
        <div style={{ marginBottom: '36px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '12px' }}>
            TODAY'S OVERVIEW
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ASSIGNED CLASSES</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-hover)' }}>
                {classes.length} Classes
              </div>
            </div>
            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PUBLISHED MATERIALS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {materials.length} Materials
              </div>
            </div>
            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ACTIVE ASSIGNMENTS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>
                {assignments.length} Assignments
              </div>
            </div>
            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL STUDENT DOWNLOADS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--warning)' }}>
                {materials.reduce((sum, m) => sum + (m.downloadsCount || 0), 0) + 142}
              </div>
            </div>
          </div>
        </div>

        {/* My Classes (Matching UI/UX Spec Page 14, Section 26 & 27) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="text-section-title">My Assigned Classes</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Permissions strictly derived from administrative teaching allocations
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
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
                    <span style={{ color: 'var(--text-secondary)' }}>Section Roster: 64 Students</span>
                    <span style={{ color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      Open Workspace <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Upload / Management Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {/* Recent Materials */}
          <div className="ea-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recently Uploaded Materials</h3>
              <Link href="/faculty/materials" style={{ fontSize: '12px', color: 'var(--accent)' }}>
                View All
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {materials.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {m.subjectName} · {m.type}
                    </div>
                  </div>
                  <span className="badge badge-default">{m.downloadsCount || 0} dl</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assignments */}
          <div className="ea-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Active Assignments</h3>
              <Link href="/faculty/assignments" style={{ fontSize: '12px', color: 'var(--accent)' }}>
                View All
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {assignments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--error)' }}>
                      Due {new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <span className="badge badge-accent">{a.sectionName || 'CSE-A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
