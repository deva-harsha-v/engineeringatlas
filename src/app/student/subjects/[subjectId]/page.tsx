'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAcademicProfile } from '@/lib/useProfile';
import { Subject, AtlasTopic, Material, Assignment, QuestionPaper } from '@/lib/types';
import { Button, Badge, Card, EmptyState, RippleLoader, AtlasAmbientBackground } from '@/components/ui';
import { MaterialCard, AssignmentCard, PaperCard } from '@/components/academic';
import { PastPaperIntelligence } from '@/components/academic/PastPaperIntelligence';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Compass,
  FileText,
  CheckSquare,
  FileCode,
  ArrowRight,
  TrendingUp,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function SubjectWorkspacePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { profile } = useAcademicProfile();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ATLAS' | 'MATERIALS' | 'ASSIGNMENTS' | 'PRACTICE' | 'PAPERS' | 'INTELLIGENCE'>('OVERVIEW');
  const [atlasTopics, setAtlasTopics] = useState<AtlasTopic[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [sectionView, setSectionView] = useState<'MY_SECTION' | 'ALL'>('MY_SECTION');

  // Material type filter
  const [materialFilter, setMaterialFilter] = useState<'ALL' | 'NOTES' | 'PPT' | 'LAB_MANUAL' | 'REFERENCE'>('ALL');

  useEffect(() => {
    async function loadSubjectData() {
      try {
        const secId = profile?.sectionId || (profile?.section === 'CSE-B' ? 'sec-cseb' : profile?.section === 'ECE-A' ? 'sec-ecea' : profile?.section === 'ECE-B' ? 'sec-eceb' : 'sec-csea');
        const secParam = sectionView === 'MY_SECTION' ? `&sectionId=${secId}` : '';

        const [subRes, atlasRes, matRes, asgRes, papRes, intelRes] = await Promise.all([
          fetch(`/api/subjects/${subjectId}`),
          fetch(`/api/atlas?subjectId=${subjectId}`),
          fetch(`/api/materials?subjectId=${subjectId}${secParam}`),
          fetch(`/api/assignments?subjectId=${subjectId}&sectionId=${secId}`),
          fetch(`/api/papers?subjectId=${subjectId}`),
          fetch(`/api/papers/intelligence/${subjectId}`),
        ]);

        const [sub, atlas, mats, asgs, paps, intel] = await Promise.all([
          subRes.json(),
          atlasRes.json(),
          matRes.json(),
          asgRes.json(),
          papRes.json(),
          intelRes.json(),
        ]);

        if (sub.success) setSubject(sub.data);
        if (atlas.success) setAtlasTopics(atlas.data);
        if (mats.success) setMaterials(mats.data);
        if (asgs.success) setAssignments(asgs.data);
        if (paps.success) setPapers(paps.data);
        if (intel.success) setIntelligence(intel.data);
      } catch (err) {
        console.error('Error fetching subject details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) {
      loadSubjectData();
    }
  }, [subjectId, sectionView, profile]);

  if (loading) {
    return (
      <div style={{ flex: 1, padding: '72px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RippleLoader size="md" message="Loading Subject Workspace..." subMessage="Fetching Units, Practice & Materials" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ flex: 1, padding: '64px 16px' }}>
        <EmptyState
          title="Subject Not Found"
          description="The requested subject code does not exist in the curriculum."
        />
      </div>
    );
  }

  const filteredMaterials =
    materialFilter === 'ALL'
      ? materials
      : materials.filter((m) => m.type === materialFilter);

  const learningPath = [
    { num: '01', title: 'Processes & Processor Management', desc: 'Process lifecycle, PCB structures, and thread concurrency.' },
    { num: '02', title: 'CPU Scheduling Algorithms', desc: 'FCFS, SJF, Round Robin, and Priority scheduling Gantt charts.' },
    { num: '03', title: 'Synchronization & Concurrency', desc: 'Critical section problem, Semaphores, and classic IPC issues.' },
    { num: '04', title: "Deadlocks & Banker's Algorithm", desc: 'Conditions for deadlock, avoidance, and safety state detection.' },
    { num: '05', title: 'Memory Management & Paging', desc: 'Virtual memory translation, FIFO, LRU, and Optimal page replacement.' },
    { num: '06', title: 'File Systems & Storage I/O', desc: 'Directory trees, disk scheduling (SSTF, SCAN), and inodes.' },
  ];

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
        {/* Subject Header Hero with Ambient Layer (Subtle Grid + Ambient Shapes) */}
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
            <Breadcrumbs
              items={[
                { label: 'Syllabus Subjects', href: '/student/subjects' },
                { label: subject.name, active: true },
              ]}
            />
            <div className="tech-coordinate" style={{ marginTop: '10px', marginBottom: '6px' }}>
              {profile.branch} · {profile.semesterName} · {profile.section}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 className="text-page-title" style={{ margin: 0 }}>{subject.name}</h1>
              <span className="badge badge-accent">{subject.code}</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0, maxWidth: '720px' }}>
              {subject.description || 'Core engineering subject syllabus and resources.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation (Matching UI/UX Spec Page 7, Section 13) */}
        <div className="tabs-container" style={{ marginBottom: '28px' }}>
          <button
            className={`tab-item ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            Overview
          </button>
          {atlasTopics.length > 0 && (
            <button
              className={`tab-item ${activeTab === 'ATLAS' ? 'active' : ''}`}
              onClick={() => setActiveTab('ATLAS')}
            >
              Interactive Topics ({atlasTopics.length})
            </button>
          )}
          <button
            className={`tab-item ${activeTab === 'MATERIALS' ? 'active' : ''}`}
            onClick={() => setActiveTab('MATERIALS')}
          >
            Study Materials ({materials.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'ASSIGNMENTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ASSIGNMENTS')}
          >
            Assignments ({assignments.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'PRACTICE' ? 'active' : ''}`}
            onClick={() => setActiveTab('PRACTICE')}
          >
            Practice Quizzes
          </button>
          <button
            className={`tab-item ${activeTab === 'PAPERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('PAPERS')}
          >
            Question Papers ({papers.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'INTELLIGENCE' ? 'active' : ''}`}
            onClick={() => setActiveTab('INTELLIGENCE')}
          >
            Exam Intelligence
          </button>
        </div>

        {/* TAB 1: OVERVIEW (Matching UI/UX Spec Page 8, Section 14) */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Subject Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
              }}
            >
              <div className="ea-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CURRICULUM UNITS</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {subject.unitsCount} Units
                </div>
              </div>
              <div className="ea-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SYLLABUS TOPICS</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {subject.topicsCount} Topics
                </div>
              </div>
              {atlasTopics.length > 0 && (
                <div className="ea-card">
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>INTERACTIVE ATLAS</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-hover)' }}>
                    {atlasTopics.length} Modules
                  </div>
                </div>
              )}
              <div className="ea-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PRACTICE QUESTIONS</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                  {subject.questionsCount || 12} Questions
                </div>
              </div>
              <div className="ea-card">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SEMESTER PAPERS</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)' }}>
                  {papers.length} Papers
                </div>
              </div>
            </div>

            {/* Learning Path (Matching UI/UX Spec Page 8, Section 14) */}
            <div>
              <div className="tech-coordinate" style={{ marginBottom: '12px' }}>
                STRUCTURED LEARNING PATH
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {learningPath.map((item) => (
                  <div
                    key={item.num}
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span
                        style={{
                          fontSize: '16px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: 'var(--accent-hover)',
                        }}
                      >
                        {item.num}
                      </span>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('ATLAS')}
                    >
                      Explore <ArrowRight size={13} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATLAS MODULES */}
        {activeTab === 'ATLAS' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 className="text-section-title">Interactive Atlas Modules</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Interactive laboratory simulations designed for visual conceptual understanding.
                </p>
              </div>
            </div>

            {atlasTopics.length === 0 ? (
              <EmptyState
                title="No Atlas Modules for this Subject Yet"
                description="Our engineering faculty is currently drafting interactive visual modules for this subject."
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
                {atlasTopics.map((topic) => (
                  <Card key={topic.id} hoverable className="ea-card">
                    <Link href={`/student/atlas/${topic.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge badge-accent">UNIT {topic.unit}</span>
                        <span className="tech-coordinate">{topic.estimatedTime}</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {topic.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {topic.overview}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Difficulty: {topic.difficulty}</span>
                        <span style={{ fontSize: '12px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Open Simulation <ArrowRight size={13} />
                        </span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STUDY MATERIALS (Matching UI/UX Spec Page 11, Section 19 & 20) */}
        {activeTab === 'MATERIALS' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 className="text-section-title">Course Study Materials</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Faculty notes, slides, lab manuals, and reference documents.
                </p>
              </div>

              {/* Section Context Toggle & Type Filters */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-2)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setSectionView('MY_SECTION')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '3px',
                      background: sectionView === 'MY_SECTION' ? 'var(--surface-1)' : 'transparent',
                      color: sectionView === 'MY_SECTION' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: sectionView === 'MY_SECTION' ? 600 : 400,
                    }}
                  >
                    My Class ({profile.section})
                  </button>
                  <button
                    onClick={() => setSectionView('ALL')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '3px',
                      background: sectionView === 'ALL' ? 'var(--surface-1)' : 'transparent',
                      color: sectionView === 'ALL' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: sectionView === 'ALL' ? 600 : 400,
                    }}
                  >
                    All Sections
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(['ALL', 'NOTES', 'PPT', 'LAB_MANUAL', 'REFERENCE'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setMaterialFilter(f)}
                      className={`btn btn-sm ${materialFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {f === 'ALL' ? 'All' : f === 'LAB_MANUAL' ? 'Lab Manuals' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredMaterials.length === 0 ? (
              <EmptyState
                title="No Materials Published Yet"
                description="Your faculty has not published any study materials in this category yet."
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
                {filteredMaterials.map((mat) => (
                  <MaterialCard key={mat.id} material={mat} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS (Matching UI/UX Spec Page 11, Section 21) */}
        {activeTab === 'ASSIGNMENTS' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 className="text-section-title">Subject Assignments</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Track instructions, questions, and due dates specified by faculty.
                </p>
              </div>

              {/* Enrolled Section Context Indicator */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-2)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span className="badge badge-accent" style={{ fontSize: '11px', padding: '2px 6px' }}>{profile.section}</span>
                <span>Enrolled Section</span>
              </div>
            </div>

            {assignments.length === 0 ? (
              <EmptyState
                title="No Active Assignments"
                description="You are all caught up! No assignments are currently pending for this subject."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {assignments.map((asg) => (
                  <AssignmentCard key={asg.id} assignment={asg} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PRACTICE */}
        {activeTab === 'PRACTICE' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="text-section-title">Practice & Assessment</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Topic-wise quizzes and end-of-unit practice tests with instant conceptual feedback.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
              <Card className="ea-card">
                <span className="badge badge-accent" style={{ marginBottom: '10px' }}>UNIT 2 PRACTICE</span>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  CPU Scheduling & Process IPC
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  10 Questions · Multiple Choice · Covers FCFS, SJF, and Round Robin.
                </p>
                <Link href={`/student/practice/${subject.id}`}>
                  <Button variant="primary" size="sm">
                    Start Practice Quiz <ArrowRight size={13} />
                  </Button>
                </Link>
              </Card>

              <Card className="ea-card">
                <span className="badge badge-accent" style={{ marginBottom: '10px' }}>UNIT 3 PRACTICE</span>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Deadlock Detection & Avoidance
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  8 Questions · Banker's Algorithm & Resource Allocation Graphs.
                </p>
                <Link href={`/student/practice/${subject.id}`}>
                  <Button variant="primary" size="sm">
                    Start Practice Quiz <ArrowRight size={13} />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 6: QUESTION PAPERS (Matching UI/UX Spec Page 13, Section 24) */}
        {activeTab === 'PAPERS' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="text-section-title">Previous & Model Question Papers</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Official semester end examination archives and faculty-curated model practice papers.
              </p>
            </div>

            {papers.length === 0 ? (
              <EmptyState
                title="No Question Papers Uploaded"
                description="Past examination papers for this subject have not been uploaded yet."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {papers.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PAST PAPER INTELLIGENCE (Matching UI/UX Spec Page 13, Section 25) */}
        {activeTab === 'INTELLIGENCE' && (
          <div>
            {intelligence ? (
              <PastPaperIntelligence
                subjectName={subject.name}
                topicFrequency={intelligence.topicFrequency}
                repeatedQuestions={intelligence.repeatedQuestions}
              />
            ) : (
              <EmptyState
                title="Intelligence Data Unavailable"
                description="Past paper intelligence requires at least one examination series to be indexed."
              />
            )}
          </div>
        )}
      </main>
    );
}
