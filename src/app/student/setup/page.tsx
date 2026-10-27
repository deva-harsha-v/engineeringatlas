'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveStoredProfile } from '@/lib/useProfile';
import { Button } from '@/components/ui';
import { ArrowRight, Layers, CheckCircle } from 'lucide-react';
import { EngineeringAtlasLogo } from '@/components/branding';

const BRANCH_OPTIONS = [
  { code: 'CSE', name: 'Computer Science & Engineering', sections: [{ id: 'sec-csea', name: 'CSE-A' }, { id: 'sec-cseb', name: 'CSE-B' }] },
  { code: 'ECE', name: 'Electronics & Communication Engineering', sections: [{ id: 'sec-ecea', name: 'ECE-A' }, { id: 'sec-eceb', name: 'ECE-B' }] },
];

export default function StudentSetupPage() {
  const router = useRouter();

  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState(4);
  const [semester, setSemester] = useState(7);
  const [section, setSection] = useState('CSE-A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentBranchConfig = BRANCH_OPTIONS.find(b => b.code === branch) || BRANCH_OPTIONS[0];

  const handleBranchChange = (newBranch: string) => {
    setBranch(newBranch);
    const cfg = BRANCH_OPTIONS.find(b => b.code === newBranch);
    if (cfg && cfg.sections.length > 0) {
      setSection(cfg.sections[0].name);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedSec = currentBranchConfig.sections.find(s => s.name === section) || currentBranchConfig.sections[0];
    const yearNames = ['I Year', 'II Year', 'III Year', 'IV Year'];
    const semNames = [
      'I Semester',
      'II Semester',
      'III Semester',
      'IV Semester',
      'V Semester',
      'VI Semester',
      'VII Semester',
      'VIII Semester',
    ];

    saveStoredProfile({
      branch,
      branchName: currentBranchConfig.name,
      year,
      yearName: yearNames[year - 1] || `${year} Year`,
      semester,
      semesterName: semNames[semester - 1] || `${semester} Semester`,
      section: selectedSec ? selectedSec.name : section,
      sectionId: selectedSec ? selectedSec.id : (branch === 'ECE' ? 'sec-ecea' : 'sec-csea'),
    });

    router.push('/student/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--surface-container-low)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(24px, 5vw, 36px) clamp(16px, 4vw, 32px)',
          boxShadow: 'var(--shadow-lg)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header (Matching UI/UX Spec Page 6, Section 10) */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <EngineeringAtlasLogo size="md" variant="extended" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Set Up Your Academic Workspace
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sri Vasavi Engineering College (SVEC)
          </p>

          {/* Progress Indicator */}
          <div
            style={{
              marginTop: '18px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>Branch</span>
            <span style={{ color: 'var(--text-muted)' }}>───</span>
            <span>Year</span>
            <span style={{ color: 'var(--text-muted)' }}>───</span>
            <span>Semester</span>
            <span style={{ color: 'var(--text-muted)' }}>───</span>
            <span>Section</span>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Branch */}
          <div>
            <label className="form-label">Branch</label>
            <select
              className="form-select"
              value={branch}
              onChange={(e) => handleBranchChange(e.target.value)}
            >
              {BRANCH_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.name} ({opt.code})
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="form-label">Year of Study</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setYear(y);
                const s1 = (y - 1) * 2 + 1;
                const s2 = (y - 1) * 2 + 2;
                if (semester !== s1 && semester !== s2) {
                  setSemester(s1);
                }
              }}
            >
              <option value={1}>I Year</option>
              <option value={2}>II Year</option>
              <option value={3}>III Year</option>
              <option value={4}>IV Year</option>
            </select>
          </div>

          {/* Semester (Scoped to Year) */}
          <div>
            <label className="form-label">Semester</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              {(() => {
                const semNames = [
                  'I Semester', 'II Semester', 'III Semester', 'IV Semester',
                  'V Semester', 'VI Semester', 'VII Semester', 'VIII Semester'
                ];
                const s1 = (year - 1) * 2 + 1;
                const s2 = (year - 1) * 2 + 2;
                return [
                  <option key={s1} value={s1}>{semNames[s1 - 1]}</option>,
                  <option key={s2} value={s2}>{semNames[s2 - 1]}</option>,
                ];
              })()}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="form-label">Section (Faculty Context)</label>
            <select
              className="form-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {currentBranchConfig.sections.map((sec) => (
                <option key={sec.id} value={sec.name}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} loadingText="Initializing Workspace..." style={{ marginTop: '12px' }}>
            Continue to Workspace <ArrowRight size={16} />
          </Button>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
            Stored locally on your browser. No password or email registration required.
          </p>
        </form>
      </div>
    </div>
  );
}
