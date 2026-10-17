'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { FacultyAssignment } from '@/lib/types';
import { Button } from '@/components/ui';
import { CheckSquare, ArrowLeft } from 'lucide-react';

export default function FacultyNewAssignmentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState(1);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submissionMethod, setSubmissionMethod] = useState('Submit handwritten solutions in class on Friday, 10:30 AM.');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch('/api/faculty/assignments');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setClasses(json.data);
        setSelectedClassId(json.data[0].id);
      }
    }
    loadClasses();

    // Default deadline to 7 days from now
    const d = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    setDeadline(d.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    if (!currentClass) return;

    setSubmitting(true);
    setError(null);

    try {
      let fileUrl = '/uploads/sample_assignment_problem_sheet.pdf';
      let fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`;

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
          title,
          description,
          unit,
          deadline: new Date(deadline).toISOString(),
          fileUrl,
          fileName,
          submissionMethod,
          subjectId: currentClass.subjectId,
          sectionId: currentClass.sectionId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to create assignment.');

      router.push('/faculty/assignments');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container-narrow" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <Link
          href="/faculty/assignments"
          style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}
        >
          ← Back to Assignments
        </Link>

        <div style={{ marginBottom: '24px' }}>
          <h1 className="text-page-title">Create Class Assignment</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Specify problem statements, deadlines, and submission instructions for your students.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="ea-card">
          <div>
            <label className="form-label">Teaching Class Allocation</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.sectionName} · {cls.subjectName} ({cls.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Assignment Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DBMS Assignment 03"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Unit Number</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <option key={u} value={u}>Unit {u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Description & Questions</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="State the assignment instructions, problem numbers, or criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Submission Deadline</label>
              <input
                type="datetime-local"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Submission Method</label>
              <input
                type="text"
                className="form-input"
                value={submissionMethod}
                onChange={(e) => setSubmissionMethod(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Assigned to: <strong style={{ color: 'var(--accent-hover)' }}>{selectedClass?.sectionName}</strong> · {selectedClass?.subjectName}.
          </div>

          <div>
            <label className="form-label">Attach Problem Sheet / PDF (Optional)</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Link href="/faculty/assignments">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Assignment'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
