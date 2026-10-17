'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveStoredProfile } from '@/lib/useProfile';
import { Button } from '@/components/ui';
import { ArrowRight, Layers, CheckCircle } from 'lucide-react';

export default function StudentSetupPage() {
  const router = useRouter();

  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState(3);
  const [semester, setSemester] = useState(7);
  const [section, setSection] = useState('CSE-A');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    const branchName =
      branch === 'CSE'
        ? 'Computer Science & Engineering'
        : branch === 'ECE'
        ? 'Electronics & Communication Engineering'
        : branch;

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
      branchName,
      year,
      yearName: yearNames[year - 1] || `${year} Year`,
      semester,
      semesterName: semNames[semester - 1] || `${semester} Semester`,
      section,
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
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header (Matching UI/UX Spec Page 6, Section 10) */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="4" r="2.5" fill="#6366F1" />
              <circle cx="4" cy="20" r="2.5" fill="#6366F1" />
              <circle cx="20" cy="20" r="2.5" fill="#6366F1" />
              <line x1="12" y1="4" x2="4" y2="20" stroke="#6366F1" strokeWidth="1.8" />
              <line x1="12" y1="4" x2="20" y2="20" stroke="#6366F1" strokeWidth="1.8" />
              <line x1="6.5" y1="15" x2="17.5" y2="15" stroke="#818CF8" strokeWidth="1.8" />
            </svg>
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
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="EEE">Electrical & Electronics (EEE)</option>
              <option value="MECH">Mechanical Engineering (MECH)</option>
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
                setSemester(y * 2 - 1);
              }}
            >
              <option value={1}>I Year</option>
              <option value={2}>II Year</option>
              <option value={3}>III Year</option>
              <option value={4}>IV Year</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="form-label">Semester</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              <option value={1}>I Semester</option>
              <option value={2}>II Semester</option>
              <option value={3}>III Semester</option>
              <option value={4}>IV Semester</option>
              <option value={5}>V Semester</option>
              <option value={6}>VI Semester</option>
              <option value={7}>VII Semester</option>
              <option value={8}>VIII Semester</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="form-label">Section</label>
            <select
              className="form-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="CSE-A">CSE-A</option>
              <option value="CSE-B">CSE-B</option>
              <option value="CSE-C">CSE-C</option>
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ marginTop: '12px' }}>
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
