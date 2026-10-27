'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { FacultyAssignment } from '@/lib/types';
import { useFacultyClass } from '@/lib/useFacultyClass';
import { CheckSquare, ArrowLeft, Plus, Calendar, FileText, Upload, Save, Send } from 'lucide-react';

function FacultyNewAssignmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  const { classes, activeClass } = useFacultyClass();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState(1);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submissionMethod, setSubmissionMethod] = useState('Submit handwritten solutions in class on Friday, 10:30 AM.');
  const [file, setFile] = useState<File | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing draft if draftId is provided
  useEffect(() => {
    async function loadDraft() {
      if (!draftId) {
        // Set default deadline 7 days in future
        const d = new Date(Date.now() + 7 * 24 * 3600 * 1000);
        setDeadline(d.toISOString().slice(0, 16));
        return;
      }

      try {
        const res = await fetch(`/api/assignments/${draftId}`);
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setTitle(d.title || '');
          setUnit(d.unit || 1);
          setDescription(d.description || '');
          if (d.deadline) {
            setDeadline(new Date(d.deadline).toISOString().slice(0, 16));
          }
          if (d.submissionMethod) setSubmissionMethod(d.submissionMethod);
          if (d.fileName) setExistingFileName(d.fileName);
          if (d.facultyAssignmentId) setSelectedClassId(d.facultyAssignmentId);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }

    loadDraft();
  }, [draftId]);

  // Set default class if not set
  useEffect(() => {
    if (!selectedClassId && classes.length > 0) {
      if (activeClass) {
        setSelectedClassId(activeClass.id);
      } else {
        setSelectedClassId(classes[0].id);
      }
    }
  }, [classes, activeClass, selectedClassId]);

  const saveAssignment = async (publish: boolean) => {
    const currentClass = classes.find((c) => c.id === selectedClassId) || activeClass || classes[0];
    if (!currentClass) {
      setError('Please select an assigned class.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }

    if (publish && (!description.trim() || !deadline)) {
      setError('Problem statements and a submission deadline are required to publish this assignment.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let fileUrl = '/uploads/sample_assignment_problem_sheet.pdf';
      let fileName = existingFileName || (file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const upData = await upRes.json();
        if (upData.success) {
          fileUrl = upData.data.fileUrl;
          fileName = upData.data.fileName;
        }
      }

      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draftId || undefined,
          title,
          description: description || 'Draft assignment description.',
          unit: Number(unit) || 1,
          deadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
          fileUrl,
          fileName,
          submissionMethod,
          subjectId: currentClass.subjectId,
          sectionId: currentClass.sectionId,
          status: publish ? 'PUBLISHED' : 'DRAFT',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to save assignment.');

      if (publish) {
        router.push('/faculty/assignments?tab=PUBLISHED');
      } else {
        router.push('/faculty/assignments?tab=DRAFTS');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error processing assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Assignments', draftId ? 'Edit Draft' : 'New Assignment']}
        title={draftId ? 'Continue Editing Draft' : 'Author New Assignment'}
        description="Create coursework tasks, configure problem sets, and either save as an unfinished draft or publish directly to students."
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="faculty-card" style={{ padding: '28px' }}>
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#DC2626',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveAssignment(true);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Target Class Allocation */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Target Faculty Assignment / Class Section
              </label>
              <select
                className="form-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                required
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id} style={{ color: '#0F172A', background: '#FFFFFF' }}>
                    {c.sectionName} · {c.subjectName} ({c.subjectCode}) — {c.semesterName || 'VII Semester'}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Scoped strictly to students enrolled in this section.
              </div>
            </div>

            {/* Assignment Title */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Assignment Title
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Assignment 04 · Normalization & Indexing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Unit & Deadline */}
            <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Curriculum Unit
                </label>
                <select
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(Number(e.target.value))}
                  style={{
                    backgroundColor: 'var(--surface-1)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value={1}>Unit 1</option>
                  <option value={2}>Unit 2</option>
                  <option value={3}>Unit 3</option>
                  <option value={4}>Unit 4</option>
                  <option value={5}>Unit 5</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Submission Deadline
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{
                    backgroundColor: 'var(--surface-1)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Problem Statements & Instructions
              </label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Provide detailed problem questions or decompose specifications for this assignment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Submission Mode */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Submission Instructions
              </label>
              <input
                type="text"
                className="form-input"
                value={submissionMethod}
                onChange={(e) => setSubmissionMethod(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Problem Sheet File */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Attach Problem Sheet (PDF)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="form-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              {existingFileName && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Current attached sheet: {existingFileName}
                </div>
              )}
            </div>

            {/* Two Action Buttons: Save Draft & Publish Assignment */}
            <div
              className="faculty-form-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                marginTop: '12px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <Link href="/faculty/assignments" style={{ textDecoration: 'none' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* 1. Save Draft Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => saveAssignment(false)}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: 'var(--surface-2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Save size={15} color="#D97706" />
                  <span>Save Draft</span>
                </button>

                {/* 2. Publish Assignment Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontWeight: 600,
                    padding: '10px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={15} />
                  <span>{submitting ? 'Publishing...' : 'Publish Assignment'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FacultyLayout>
  );
}

export default function FacultyNewAssignmentPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading assignment editor...
        </div>
      }
    >
      <FacultyNewAssignmentContent />
    </React.Suspense>
  );
}
