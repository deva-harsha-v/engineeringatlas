'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button, Badge, Card } from '@/components/ui';
import {
  Users,
  BookOpen,
  Compass,
  FileText,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/analytics');
        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {/* Header (Matching UI/UX Spec Page 16, Section 31) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              INSTITUTION CONTROL CENTER · SRI VASAVI ENGINEERING COLLEGE
            </div>
            <h1 className="text-page-title">Institution Overview</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Real-time academic ecosystem telemetry, curriculum structure, and faculty management.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/admin/academic">
              <Button variant="primary" size="sm">
                <Layers size={14} /> Structure Manager
              </Button>
            </Link>
            <Link href="/admin/faculty/assignments">
              <Button variant="secondary" size="sm">
                <Users size={14} /> Assign Faculty
              </Button>
            </Link>
          </div>
        </div>

        {/* 6 Key Institution Metrics (Matching UI/UX Spec Page 16, Section 31) */}
        <div style={{ marginBottom: '36px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '12px' }}>
            KEY REPOSITORY METRICS
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>STUDENTS ACCESSING</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)' }}>
                {stats?.studentsAccessing?.toLocaleString() || '2,481'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>Active this semester</div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>FACULTY MEMBERS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                87
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Across all departments</div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CURRICULUM SUBJECTS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                142
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Syllabus indexed</div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ATLAS MODULES</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)' }}>
                {stats?.atlasTopicsCount || 86}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>Interactive simulations</div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>COURSE MATERIALS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                3,241
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Notes & slides stored</div>
            </div>

            <div className="ea-card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>QUESTION PAPERS</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
                416
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Indexed & trend analyzed</div>
            </div>
          </div>
        </div>

        {/* Content Activity Telemetry (Matching UI/UX Spec Page 16, Section 31) */}
        <div style={{ marginBottom: '40px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '12px' }}>
            CONTENT ACTIVITY & ENGAGEMENT
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="ea-card" style={{ background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MATERIALS UPLOADED</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                142
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Past 30 days</div>
            </div>

            <div className="ea-card" style={{ background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ASSIGNMENTS ACTIVE</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                34
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Across 8 sections</div>
            </div>

            <div className="ea-card" style={{ background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ATLAS SIMULATION VIEWS</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                4,821
              </div>
              <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px' }}>+28% this semester</div>
            </div>

            <div className="ea-card" style={{ background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PRACTICE ATTEMPTS</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                8,320
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>MCQs & Quizzes solved</div>
            </div>
          </div>
        </div>

        {/* Most Popular Modules & Downloads */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div className="ea-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Most Viewed Atlas Modules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'AVL Tree Rotations', views: 1850, slug: 'avl-tree' },
                { title: 'Sorting Algorithms (QuickSort/MergeSort)', views: 1620, slug: 'sorting-algorithms' },
                { title: 'CPU Scheduling Simulator', views: 1420, slug: 'cpu-scheduling' },
                { title: 'TCP 3-Way Handshake & Teardown', views: 1340, slug: 'tcp-handshake' },
                { title: 'DBMS Normalization & B+ Tree', views: 1280, slug: 'dbms-normalization' },
              ].map((m, idx) => (
                <div key={m.slug} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>0{idx + 1}. {m.title}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)' }}>{m.views} views</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ea-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Fast Administration Shortcuts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/admin/academic" style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Academic Structure Tree (Branches & Sections)</span>
                <ArrowRight size={14} color="var(--accent)" />
              </Link>
              <Link href="/admin/faculty/assignments" style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Teaching Allocation Matrix (Subject + Section)</span>
                <ArrowRight size={14} color="var(--accent)" />
              </Link>
              <Link href="/admin/content" style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Materials & Assignments Moderation Center</span>
                <ArrowRight size={14} color="var(--accent)" />
              </Link>
              <Link href="/admin/atlas" style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Atlas Interactive Curriculum Editor</span>
                <ArrowRight size={14} color="var(--accent)" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
