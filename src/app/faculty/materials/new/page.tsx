'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { FacultyAssignment } from '@/lib/types';
import { Upload, ArrowLeft, CheckSquare, Square, Info } from 'lucide-react';

export default function NewMaterialPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('NOTES');
  const [unit, setUnit] = useState(1);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch('/api/faculty/assignments');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setClasses(json.data);
        const firstSubjectId = json.data[0].subjectId;
        setSelectedSubjectId(firstSubjectId);
        const initialSections = json.data
          .filter((c: FacultyAssignment) => c.subjectId === firstSubjectId)
          .map((c: FacultyAssignment) => c.sectionId);
        setSelectedSectionIds(initialSections);
      }
    }
    loadClasses();
  }, []);

  const uniqueSubjects = Array.from(
    new Map(classes.map((c) => [c.subjectId, { id: c.subjectId, name: c.subjectName, code: c.subjectCode }])).values()
  );

  const availableSectionsForSubject = classes.filter((c) => c.subjectId === selectedSubjectId);

  const handleSubjectChange = (newSubId: string) => {
    setSelectedSubjectId(newSubId);
    const secs = classes.filter((c) => c.subjectId === newSubId).map((c) => c.sectionId);
    setSelectedSectionIds(secs);
  };

  const toggleSection = (sectionId: string) => {
    if (selectedSectionIds.includes(sectionId)) {
      if (selectedSectionIds.length === 1) {
        alert('Please keep at least one target section selected.');
        return;
      }
      setSelectedSectionIds(selectedSectionIds.filter((id) => id !== sectionId));
    } else {
      setSelectedSectionIds([...selectedSectionIds, sectionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || selectedSectionIds.length === 0) {
      setError('Please select at least one target section.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let fileUrl = '/uploads/sample_uploaded_note.pdf';
      let fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`;
      let fileSize = file ? file.size : 2400000;
      let mimeType = file ? file.type : 'application/pdf';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const upData = await upRes.json();
        if (upData.success) {
          fileUrl = upData.data.fileUrl;
          fileName = upData.data.fileName;
          fileSize = upData.data.fileSize;
          mimeType = upData.data.mimeType;
        }
      }

      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          unit,
          fileUrl,
          fileName,
          fileSize,
          mimeType,
          subjectId: selectedSubjectId,
          sectionIds: selectedSectionIds,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to upload material.');

      router.push('/faculty/materials');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error uploading material.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Materials', 'Upload Material']}
        title="Distribute Learning Material"
        description="Upload lecture presentations, hand-written notes, and unit question banks to assigned class sections."
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#991B1B',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Target Subject */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Subject
              </label>
              <select
                className="form-select"
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
              >
                {uniqueSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Sections Multi-select */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Target Class Sections
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableSectionsForSubject.map((sec) => {
                  const isChecked = selectedSectionIds.includes(sec.sectionId);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => toggleSection(sec.sectionId)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: isChecked ? '#2563EB' : '#E2E8F0',
                        backgroundColor: isChecked ? '#EFF6FF' : '#FFFFFF',
                        color: isChecked ? '#1D4ED8' : '#334155',
                        fontWeight: isChecked ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {isChecked ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
                      <span>Section {sec.sectionName}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Select one or both sections you are assigned to teach.
              </div>
            </div>

            {/* Material Title */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Document Title
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Unit 2 Process Synchronization & Semaphores"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Type & Unit */}
            <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                  Material Type
                </label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="NOTES">Lecture Notes</option>
                  <option value="SYLLABUS">Syllabus Handout</option>
                  <option value="PREVIOUS_PAPER">Question Paper</option>
                  <option value="QUESTION_BANK">Question Bank</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                  Curriculum Unit
                </label>
                <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                  <option value={1}>Unit 1</option>
                  <option value={2}>Unit 2</option>
                  <option value={3}>Unit 3</option>
                  <option value={4}>Unit 4</option>
                  <option value={5}>Unit 5</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Summary / Topic Coverage
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Brief summary of topics, algorithms, or formulas covered in this handout..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* PDF File */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="form-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Link href="/faculty/materials" style={{ textDecoration: 'none' }}>
                <button type="button" className="btn btn-ghost">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 600,
                  padding: '10px 20px',
                }}
              >
                {submitting ? 'Distributing...' : 'Distribute to Classes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FacultyLayout>
  );
}
