'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  BookOpen,
  CheckSquare,
  FileText,
  Search,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Bell,
  Sparkles,
} from 'lucide-react';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { SearchModal } from '@/components/layout/SearchModal';
import { useAcademicProfile } from '@/lib/useProfile';
import { Subject, Material, Assignment, QuestionPaper, AtlasTopic, Announcement } from '@/lib/types';
import { Badge, Button, Card } from '@/components/ui';
import { SubjectCard, MaterialCard, AssignmentCard, PaperCard, AnnouncementCard } from '@/components/academic';

export default function StudentHomePage() {
  const router = useRouter();
  const { profile, isLoaded } = useAcademicProfile();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [atlasTopics, setAtlasTopics] = useState<AtlasTopic[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [subRes, atlasRes, matRes, asgRes, papRes, annRes] = await Promise.all([
          fetch('/api/subjects'),
          fetch('/api/atlas'),
          fetch('/api/materials'),
          fetch('/api/assignments'),
          fetch('/api/papers'),
          fetch('/api/announcements'),
        ]);

        const [subs, atlas, mats, asgs, paps, anns] = await Promise.all([
          subRes.json(),
          atlasRes.json(),
          matRes.json(),
          asgRes.json(),
          papRes.json(),
          annRes.json(),
        ]);

        if (subs.success) setSubjects(subs.data);
        if (atlas.success) setAtlasTopics(atlas.data);
        if (mats.success) setMaterials(mats.data);
        if (asgs.success) setAssignments(asgs.data);
        if (paps.success) setPapers(paps.data);
        if (anns.success) setAnnouncements(anns.data);
      } catch (err) {
        console.error('Failed to load student home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        {/* Academic Greeting Header (Matching UI/UX Spec Page 7, Section 11) */}
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            ● WORKSPACE CONTEXT: {profile.branch} · {profile.yearName} · {profile.semesterName}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Good morning, {profile.section}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {profile.branchName || 'Computer Science & Engineering'} · {profile.semesterName}
          </p>
        </div>

        {/* Global Search Bar (Matching UI/UX Spec Page 7, Section 11) */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-muted)',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Search size={18} color="var(--accent-hover)" />
              Search concepts, subjects, papers, notes...
            </span>
            <kbd
              className="desktop-only"
              style={{
                padding: '3px 8px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* The Four Core Student Action Pillars (Matching UI/UX Spec Page 26, Section 55) */}
        <div style={{ marginBottom: '40px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '12px' }}>
            WHAT DO YOU WANT TO DO?
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
            }}
          >
            <Link href="/student/atlas" style={{ textDecoration: 'none' }}>
              <Card hoverable className="ea-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Compass size={18} color="var(--accent-hover)" />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>LEARN</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Interactive concepts & visualizations
                </p>
              </Card>
            </Link>

            <Link href="/student/subjects" style={{ textDecoration: 'none' }}>
              <Card hoverable className="ea-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <BookOpen size={18} color="var(--accent-hover)" />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>STUDY</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Faculty notes, slides & resources
                </p>
              </Card>
            </Link>

            <Link href="/student/practice" style={{ textDecoration: 'none' }}>
              <Card hoverable className="ea-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckSquare size={18} color="var(--accent-hover)" />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>PRACTICE</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Targeted questions & quizzes
                </p>
              </Card>
            </Link>

            <Link href="/student/papers" style={{ textDecoration: 'none' }}>
              <Card hoverable className="ea-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileText size={18} color="var(--accent-hover)" />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>PREPARE</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Previous papers & exam intelligence
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Priority 1: Continue Learning (Matching UI/UX Spec Page 7, Section 11 & 12) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 className="text-section-title">Continue Learning</h2>
            <Link href="/student/atlas" style={{ fontSize: '13px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all Atlas modules <ArrowRight size={13} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Card 1: CPU Scheduling */}
            <Card className="ea-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span className="badge badge-accent">OPERATING SYSTEMS</span>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                    CPU Scheduling Simulator
                  </h3>
                </div>
                <span className="badge badge-success">65% COMPLETE</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                FCFS, SJF, and Round Robin Gantt chart simulation and latency calculations.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated 15 mins</span>
                <Link href="/student/atlas/cpu-scheduling">
                  <Button variant="primary" size="sm">
                    Continue <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Card 2: AVL Tree Rotations */}
            <Card className="ea-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span className="badge badge-accent">DATA STRUCTURES</span>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                    AVL Tree Rotations
                  </h3>
                </div>
                <span className="badge badge-warning">40% COMPLETE</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Balance factor calculations, LL, RR, LR, and RL self-balancing tree animations.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated 20 mins</span>
                <Link href="/student/atlas/avl-tree">
                  <Button variant="primary" size="sm">
                    Continue <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Priority 2: Academic Updates Feed (Matching UI/UX Spec Page 7, Section 11 & Page 19, Section 38) */}
        <div style={{ marginBottom: '40px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
            ACADEMIC UPDATES FEED
          </div>
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {materials.slice(0, 1).map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-success">NEW MATERIAL</span>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {m.facultyName} · {m.subjectName}
                    </span>
                  </div>
                </div>
                <Link href={`/student/subjects/${m.subjectId}/materials`}>
                  <Button variant="secondary" size="sm">View</Button>
                </Link>
              </div>
            ))}

            {assignments.slice(0, 1).map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-warning">ASSIGNMENT</span>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{a.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--error)', marginLeft: '8px' }}>
                      Due {new Date(a.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <Link href={`/student/subjects/${a.subjectId}/assignments`}>
                  <Button variant="secondary" size="sm">Details</Button>
                </Link>
              </div>
            ))}

            {papers.slice(0, 1).map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-accent">MODEL PAPER</span>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{p.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {p.academicYear} Examination Series
                    </span>
                  </div>
                </div>
                <Link href="/student/papers">
                  <Button variant="secondary" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Priority 3: Your Subjects (Matching UI/UX Spec Page 7, Section 11 & Page 19, Section 36) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 className="text-section-title">Your Subjects</h2>
            <Link href="/student/subjects" style={{ fontSize: '13px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Full Subject Directory <ArrowRight size={13} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {subjects.map((sub) => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        </div>

        {/* Priority 4: Recommended Atlas Topics */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 className="text-section-title">Recommended Atlas Modules</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                High-yield interactive concept modules for upcoming examinations
              </p>
            </div>
            <Link href="/student/atlas" style={{ fontSize: '13px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              All 8 Modules <ArrowRight size={13} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {atlasTopics.slice(0, 3).map((topic) => (
              <Card key={topic.id} hoverable className="ea-card">
                <Link href={`/student/atlas/${topic.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-accent">{topic.subjectName || 'Atlas'}</span>
                    <span className="tech-coordinate">{topic.estimatedTime}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {topic.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {topic.overview}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Launch Simulation <ArrowRight size={13} />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <StudentBottomNav />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
