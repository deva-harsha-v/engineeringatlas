'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui';
import { useAcademicProfile } from '@/lib/useProfile';
import { Check, Layers } from 'lucide-react';

export function AcademicSelectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, updateProfile } = useAcademicProfile();
  const [branch, setBranch] = useState(profile.branch);
  const [year, setYear] = useState(profile.year);
  const [semester, setSemester] = useState(profile.semester);
  const [section, setSection] = useState(profile.section);

  const handleSave = () => {
    updateProfile({
      branch,
      branchName: branch === 'CSE' ? 'Computer Science & Engineering' : branch,
      year,
      yearName: `${['I', 'II', 'III', 'IV'][year - 1] || year} Year`,
      semester,
      semesterName: `${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][semester - 1] || semester} Semester`,
      section,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Academic Workspace Context">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Your selected academic context personalizes materials, subject rosters, assignment deadlines, and paper trends.
        </p>

        {/* Branch */}
        <div>
          <label className="form-label">Branch</label>
          <select
            className="form-select"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="CSE">Computer Science & Engineering (CSE)</option>
            <option value="ECE">Electronics & Communication Engineering (ECE)</option>
            <option value="EEE">Electrical & Electronics Engineering (EEE)</option>
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
            <option value="CSE-A">Section A (CSE-A)</option>
            <option value="CSE-B">Section B (CSE-B)</option>
            <option value="CSE-C">Section C (CSE-C)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} /> Save Workspace
          </button>
        </div>
      </div>
    </Modal>
  );
}
