'use client';

import React, { useState, useEffect } from 'react';
import { PaperCard } from '@/components/academic';
import { PastPaperIntelligence } from '@/components/academic/PastPaperIntelligence';
import { QuestionPaper } from '@/lib/types';
import { RippleLoader, AtlasAmbientBackground } from '@/components/ui';
import { fetchWithFastCache, getCachedData } from '@/lib/api-cache';
import { FileText } from 'lucide-react';

export default function StudentPapersArchivePage() {
  const cachedPapers = getCachedData<any>('/api/papers');
  const cachedIntel = getCachedData<any>('/api/papers/intelligence/sub-os');

  const [papers, setPapers] = useState<QuestionPaper[]>(() => cachedPapers?.data || []);
  const [intelligence, setIntelligence] = useState<any>(() => cachedIntel?.data || null);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(() => !cachedPapers?.data);

  useEffect(() => {
    async function load() {
      try {
        const [pData, iData] = await Promise.all([
          fetchWithFastCache<any>('/api/papers'),
          fetchWithFastCache<any>('/api/papers/intelligence/sub-os'),
        ]);
        if (pData?.success) setPapers(pData.data);
        if (iData?.success) setIntelligence(iData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const years = ['ALL', '2026', '2025', '2024'];
  const filteredPapers = selectedYear === 'ALL' ? papers : papers.filter((p) => p.academicYear === selectedYear);

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
      {/* Papers Header Hero with Ambient Layer */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface-1)',
          padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
          marginBottom: '28px',
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
            <FileText size={14} /> EXAMINATION ARCHIVE & INTELLIGENCE
          </div>
          <h1 className="text-page-title" style={{ margin: '0 0 6px' }}>Previous Question Papers</h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: 0 }}>
            Authentic end-semester question papers, mid-term examinations, and model papers with topic recurrence analysis.
          </p>
        </div>
      </div>

      {/* Intelligence Component First (Matching UI/UX Spec Page 13, Section 25 & Stitch 3) */}
      <div style={{ marginBottom: '40px' }}>
        <PastPaperIntelligence
          subjectName="Department of Computer Science & Engineering"
          topicFrequency={intelligence?.topicFrequency}
          repeatedQuestions={intelligence?.repeatedQuestions}
        />
      </div>

      {/* Year Filter Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="text-section-title">Archived Papers</h2>

        <div style={{ display: 'flex', gap: '6px' }}>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`btn btn-sm ${selectedYear === yr ? 'btn-primary' : 'btn-secondary'}`}
            >
              {yr === 'ALL' ? 'All Years' : `${yr} Series`}
            </button>
          ))}
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div style={{ padding: '48px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RippleLoader size="md" message="Loading Examination Papers..." subMessage="Indexing SVEC Archive" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </main>
  );
}
