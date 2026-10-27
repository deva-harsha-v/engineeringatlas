'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button } from '@/components/ui';
import { useAcademicProfile } from '@/lib/useProfile';
import { Check } from 'lucide-react';

interface SectionItem {
  id: string;
  name: string;
  semesterId: string;
}

interface SemesterItem {
  id: string;
  semNumber: number;
  name: string;
  sections?: SectionItem[];
}

interface YearItem {
  id: string;
  yearNumber: number;
  name: string;
  semesters: SemesterItem[];
}

interface BranchItem {
  id: string;
  code: string;
  name: string;
  years: YearItem[];
}

const ROMAN_SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const ROMAN_YEARS = ['I', 'II', 'III', 'IV'];

export function AcademicSelectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, updateProfile } = useAcademicProfile();
  const [structure, setStructure] = useState<{ branches: BranchItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize with sanitized, academically consistent values
  const initialSem = profile.semester || 7;
  const initialYear = profile.year && profile.year === Math.ceil(initialSem / 2) ? profile.year : Math.ceil(initialSem / 2);

  const [branch, setBranch] = useState(profile.branch || 'CSE');
  const [year, setYear] = useState<number>(initialYear);
  const [semester, setSemester] = useState<number>(initialSem);
  const [sectionId, setSectionId] = useState(profile.sectionId || 'sec-csea');
  const [isSaving, setIsSaving] = useState(false);

  // Load live academic structure from backend
  useEffect(() => {
    let isMounted = true;
    async function loadStructure() {
      try {
        const res = await fetch('/api/academic/structure');
        const json = await res.json();
        if (json.success && isMounted) {
          setStructure(json.data);
        }
      } catch (err) {
        console.error('Failed to load academic structure', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStructure();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state when profile changes or modal opens, enforcing strict year-semester consistency
  useEffect(() => {
    if (isOpen) {
      const b = profile.branch || 'CSE';
      const s = profile.semester || 7;
      const y = profile.year && profile.year === Math.ceil(s / 2) ? profile.year : Math.ceil(s / 2);
      setBranch(b);
      setYear(y);
      setSemester(s);
      setSectionId(profile.sectionId || 'sec-csea');
    }
  }, [isOpen, profile]);

  // Current branch object
  const currentBranch = useMemo(() => {
    if (!structure?.branches?.length) return null;
    return structure.branches.find((b) => b.code.toUpperCase() === branch.toUpperCase()) || structure.branches[0];
  }, [structure, branch]);

  // Current year object within current branch
  const currentYearObj = useMemo(() => {
    if (!currentBranch?.years?.length) return null;
    return currentBranch.years.find((y) => y.yearNumber === year) || currentBranch.years[0] || null;
  }, [currentBranch, year]);

  // Available semesters strictly scoped to the selected Year
  const availableSemesters = useMemo(() => {
    const s1 = (year - 1) * 2 + 1;
    const s2 = (year - 1) * 2 + 2;

    if (currentYearObj?.semesters?.length) {
      return currentYearObj.semesters;
    }
    return [
      { id: `sem-${s1}`, semNumber: s1, name: `${ROMAN_SEMESTERS[s1 - 1] || s1} Semester` },
      { id: `sem-${s2}`, semNumber: s2, name: `${ROMAN_SEMESTERS[s2 - 1] || s2} Semester` },
    ];
  }, [currentYearObj, year]);

  // Current semester object (from Branch + Year + Semester)
  const currentSemester = useMemo(() => {
    if (!availableSemesters?.length) return null;
    return availableSemesters.find((s) => s.semNumber === semester) || availableSemesters[0];
  }, [availableSemesters, semester]);

  // Available sections dynamically derived from Branch + Semester
  const availableSections = useMemo(() => {
    if (currentSemester?.sections && currentSemester.sections.length > 0) {
      return currentSemester.sections;
    }
    return [
      { id: `sec-${branch.toLowerCase()}-a`, name: `${branch}-A`, semesterId: currentSemester?.id || '' },
      { id: `sec-${branch.toLowerCase()}-b`, name: `${branch}-B`, semesterId: currentSemester?.id || '' },
    ];
  }, [currentSemester, branch]);

  // Keep sectionId valid whenever availableSections changes
  useEffect(() => {
    if (availableSections.length > 0) {
      const match = availableSections.find((s) => s.id === sectionId);
      if (!match) {
        // Try to match by suffix letter (e.g. section 'A' vs 'B')
        const currentLetter = profile.section?.split('-')?.[1] || 'A';
        const sameLetter = availableSections.find((s) => s.name.endsWith(`-${currentLetter}`));
        setSectionId(sameLetter ? sameLetter.id : availableSections[0].id);
      }
    }
  }, [availableSections, sectionId, profile.section]);

  const handleBranchChange = (newBranchCode: string) => {
    setBranch(newBranchCode);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const s1 = (newYear - 1) * 2 + 1;
    const s2 = (newYear - 1) * 2 + 2;
    // If current semester is outside the new year, switch to the first semester of that year
    if (semester !== s1 && semester !== s2) {
      setSemester(s1);
    }
  };

  const handleSemesterChange = (newSemNum: number) => {
    setSemester(newSemNum);
    const computedYear = Math.ceil(newSemNum / 2);
    setYear(computedYear);
  };

  const handleSave = () => {
    setIsSaving(true);
    const selectedSec = availableSections.find((s) => s.id === sectionId) || availableSections[0];
    const semName = currentSemester?.name || `${ROMAN_SEMESTERS[semester - 1] || semester} Semester`;
    const yrName = currentYearObj?.name || `${ROMAN_YEARS[year - 1] || year} Year`;

    setTimeout(() => {
      updateProfile({
        branch: currentBranch?.code || branch,
        branchName: currentBranch?.name || `${branch} Department`,
        year,
        yearName: yrName,
        semester,
        semesterName: semName,
        section: selectedSec ? selectedSec.name : `${branch}-A`,
        sectionId: selectedSec ? selectedSec.id : `sec-${branch.toLowerCase()}-a`,
      });
      setIsSaving(false);
      onClose();
    }, 200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Academic Workspace Context">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Your selected academic context personalizes materials, subject rosters, assignment deadlines, and paper trends.
        </p>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Loading institutional academic structure...
          </div>
        ) : (
          <>
            {/* Branch */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Branch / Discipline
              </label>
              <select
                className="form-select"
                value={branch}
                onChange={(e) => handleBranchChange(e.target.value)}
              >
                {structure?.branches?.map((b) => (
                  <option key={b.id || b.code} value={b.code}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Year of Study
              </label>
              <select
                className="form-select"
                value={year}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                <option value={1}>I Year</option>
                <option value={2}>II Year</option>
                <option value={3}>III Year</option>
                <option value={4}>IV Year</option>
              </select>
            </div>

            {/* Semester - Strictly scoped to selected Year */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Semester
              </label>
              <select
                className="form-select"
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value))}
              >
                {availableSemesters.map((s) => (
                  <option key={s.semNumber} value={s.semNumber}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section - Dynamically filtered to Branch + Semester */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', margin: 0 }}>
                  Assigned Section ({branch} · Sem {semester})
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {availableSections.length} section{availableSections.length === 1 ? '' : 's'} available
                </span>
              </div>
              <select
                className="form-select"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {availableSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Assignments and class materials are strictly scoped to this section.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={onClose} disabled={isSaving} type="button">
                Cancel
              </button>
              <Button
                variant="primary"
                isLoading={isSaving}
                loadingText="Saving Workspace..."
                onClick={handleSave}
                type="button"
              >
                <Check size={16} /> Save Workspace
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
