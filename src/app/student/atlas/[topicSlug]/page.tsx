'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { AtlasViewer } from '@/components/atlas/AtlasViewer';
import { AtlasTopic } from '@/lib/types';
import { Button, Badge, Card, EmptyState } from '@/components/ui';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  CheckSquare,
  ChevronRight,
} from 'lucide-react';

export default function AtlasTopicLaboratoryPage() {
  const params = useParams();
  const slug = params.topicSlug as string;

  const [topic, setTopic] = useState<AtlasTopic | null>(null);
  const [allTopics, setAllTopics] = useState<AtlasTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, allRes] = await Promise.all([
          fetch(`/api/atlas/${slug}`),
          fetch('/api/atlas'),
        ]);
        const [tData, allData] = await Promise.all([tRes.json(), allRes.json()]);
        if (tData.success) setTopic(tData.data);
        if (allData.success) setAllTopics(allData.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StudentNav />
        <div className="ea-container" style={{ padding: '64px 16px', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '40px', width: '320px', margin: '0 auto 16px' }} />
          <div className="skeleton" style={{ height: '360px', maxWidth: '900px', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StudentNav />
        <div className="ea-container" style={{ padding: '64px 16px' }}>
          <EmptyState
            title="Atlas Module Not Found"
            description="The requested simulation module slug does not exist."
          />
        </div>
      </div>
    );
  }

  const learningObjectives: string[] = Array.isArray(topic.learningObjectives)
    ? topic.learningObjectives
    : typeof topic.learningObjectives === 'string'
    ? JSON.parse(topic.learningObjectives)
    : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <div className="ea-container" style={{ flex: 1, padding: '24px 16px 64px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Desktop Fixed Atlas Sidebar (Matching UI/UX Spec Page 10, Section 18) */}
          <aside
            className="desktop-only"
            style={{
              width: '260px',
              flexShrink: 0,
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 16px',
              height: 'fit-content',
              position: 'sticky',
              top: '84px',
            }}
          >
            <div className="tech-coordinate" style={{ marginBottom: '10px' }}>
              ATLAS CURRICULUM
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              {topic.subjectName?.toUpperCase() || 'ENGINEERING ATLAS'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {allTopics.map((item) => {
                const isActive = item.slug === slug;
                return (
                  <Link
                    key={item.id}
                    href={`/student/atlas/${item.slug}`}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--surface-2)' : 'transparent',
                      color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{item.title}</span>
                    {isActive && <ChevronRight size={14} color="var(--accent)" />}
                  </Link>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <Link
                href={`/student/practice/${topic.subjectId}`}
                style={{
                  fontSize: '12px',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckSquare size={14} /> Practice Topic Questions
              </Link>
            </div>
          </aside>

          {/* Main Laboratory Content (Matching UI/UX Spec Page 10, Section 17) */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Breadcrumb */}
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Link href="/student/subjects" style={{ color: 'var(--text-secondary)' }}>
                {topic.subjectName?.toUpperCase() || 'SUBJECT'}
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--accent-hover)' }}>ATLAS LABORATORY</span>
            </div>

            {/* Title & Short Explanation */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 className="text-page-title">{topic.title}</h1>
                <span className="badge badge-accent">UNIT {topic.unit}</span>
                <span className="badge badge-default">{topic.estimatedTime}</span>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {topic.overview}
              </p>
            </div>

            {/* PRIMARY COMPONENT: Interactive Visualization Canvas */}
            <div style={{ marginBottom: '36px' }}>
              <AtlasViewer topic={topic} />
            </div>

            {/* Why It Matters */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Why It Matters
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {topic.whyItMatters}
              </p>
            </div>

            {/* Concept Explanation */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Concept In-Depth
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {topic.concept}
              </p>
            </div>

            {/* How It Works (Step-by-step breakdown) */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                How It Works Step-by-Step
              </h3>
              <div
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {topic.howItWorks.split('\n').map((line, idx) => (
                  <div key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Example */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Concrete Numerical Example
              </h3>
              <div
                style={{
                  background: 'var(--surface-2)',
                  borderLeft: '3px solid var(--accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                }}
              >
                {topic.example}
              </div>
            </div>

            {/* Common Mistakes */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--error)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Common Examination Mistakes
              </h3>
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {topic.commonMistakes.split('\n').map((m, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    • {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Revision Card */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={18} /> Quick Exam Revision Summary
              </h3>
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.06)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {topic.quickRevision.split('\n').map((r, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct CTA: Close the loop -> Atlas to Practice */}
            <div
              style={{
                padding: '24px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Test your understanding of {topic.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Attempt questions specifically curated for this topic with step explanations.
                </p>
              </div>

              <Link href={`/student/practice/${topic.subjectId}`}>
                <Button variant="primary" size="md">
                  <CheckSquare size={16} /> Open Topic Practice Quiz
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>

      <StudentBottomNav />
    </div>
  );
}
