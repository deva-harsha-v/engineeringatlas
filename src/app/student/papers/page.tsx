'use client';

import React, { useState, useEffect } from 'react';
import { StudentNav } from '@/components/layout/StudentNav';
import { StudentBottomNav } from '@/components/layout/StudentBottomNav';
import { PaperCard } from '@/components/academic';
import { PastPaperIntelligence } from '@/components/academic/PastPaperIntelligence';
import { QuestionPaper, Subject } from '@/lib/types';
import { FileText, TrendingUp } from 'lucide-react';

export default function StudentPapersArchivePage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, iRes] = await Promise.all([
          fetch('/api/papers'),
          fetch('/api/papers/intelligence/sub-os'),
        ]);
        const [pData, iData] = await Promise.all([pRes.json(), iRes.json()]);
        if (pData.success) setPapers(pData.data);
        if (iData.success) setIntelligence(iData.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const years = ['ALL', '2026', '2025', '2024'];
  const filteredPapers = selectedYear === 'ALL' ? papers : papers.filter((p) => p.academicYear === selectedYear);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="mobile-nav-pad">
      <StudentNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
            <FileText size={14} /> EXAMINATION ARCHIVE & INTELLIGENCE
          </div>
          <h1 className="text-page-title">Previous Question Papers</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authentic end-semester question papers, mid-term examinations, and model papers with topic recurrence analysis.
          </p>
        </div>

        {/* Intelligence Component First (Matching UI/UX Spec Page 13, Section 25) */}
        {intelligence && (
          <div style={{ marginBottom: '40px' }}>
            <PastPaperIntelligence
              subjectName="Department of CSE"
              topicFrequency={intelligence.topicFrequency}
              repeatedQuestions={intelligence.repeatedQuestions}
            />
          </div>
        )}

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </main>

      <StudentBottomNav />
    </div>
  );
}
