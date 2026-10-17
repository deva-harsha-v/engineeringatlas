'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, TrendingUp, Sparkles, ArrowRight, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui';

interface TopicFreq {
  topic: string;
  frequency: number;
  slug?: string;
}

interface RepeatedQuestion {
  id: string;
  questionText: string;
  repeatCount: number;
  topic: string;
}

interface PastPaperIntelligenceProps {
  subjectName: string;
  topicFrequency: TopicFreq[];
  repeatedQuestions: RepeatedQuestion[];
}

export function PastPaperIntelligence({
  subjectName,
  topicFrequency,
  repeatedQuestions,
}: PastPaperIntelligenceProps) {
  const maxFreq = Math.max(...topicFrequency.map((t) => t.frequency), 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
            <TrendingUp size={14} /> PAST PAPER INTELLIGENCE ENGINE
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{subjectName} — Examination Trend Analysis</h3>
        </div>
        <span className="badge badge-accent">SYNTHESIZED FROM 2022-2026 PAPERS</span>
      </div>

      {/* Topic Frequency Bars */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Topic Frequency Across Previous & Model Examinations
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {topicFrequency.map((item, idx) => {
            const widthPct = Math.round((item.frequency / maxFreq) * 100);

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.topic}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)', fontWeight: 600 }}>
                      {item.frequency} Questions
                    </span>
                    {item.slug && (
                      <Link
                        href={`/student/atlas/${item.slug}`}
                        style={{
                          fontSize: '11px',
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        Study Atlas <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Technical Frequency Bar */}
                <div
                  style={{
                    height: '14px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${widthPct}%`,
                      background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Repeated Questions */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Most Repeated High-Yield Examination Questions
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {repeatedQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              style={{
                padding: '12px 16px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  0{idx + 1}.
                </span>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {q.questionText}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Topic: {q.topic}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span className="badge badge-warning">Asked {q.repeatCount} times</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Callout: Close the loop -> Past Papers -> Atlas -> Practice */}
      {topicFrequency[0]?.slug && (
        <div
          style={{
            padding: '16px',
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ready for the #1 highest-yield topic?
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Master {topicFrequency[0].topic} interactively on the Engineering Atlas.
            </div>
          </div>

          <Link href={`/student/atlas/${topicFrequency[0].slug}`}>
            <Button variant="primary" size="sm">
              <Compass size={14} /> Study {topicFrequency[0].topic}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
