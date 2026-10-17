'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { FacultyAssignment } from '@/lib/types';
import { Button } from '@/components/ui';
import { Upload, ArrowLeft } from 'lucide-react';

export default function NewMaterialPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
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
        setSelectedClassId(json.data[0].id);
      }
    }
    loadClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    if (!currentClass) return;

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
          subjectId: currentClass.subjectId,
          sectionId: currentClass.sectionId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to upload.');

      router.push('/faculty/materials');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error uploading material.');
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
          href="/faculty/materials"
          style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}
        >
          ← Back to Materials
        </Link>

        <div style={{ marginBottom: '24px' }}>
          <h1 className="text-page-title">Upload Study Material</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Publish lecture notes, slides, lab manuals, or references to your assigned student sections.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="ea-card">
          {/* Class Selector */}
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
              <label className="form-label">Material Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="NOTES">Lecture Notes (PDF)</option>
                <option value="PPT">Presentation Slides (PPT/PPTX)</option>
                <option value="LAB_MANUAL">Lab Manual (PDF)</option>
                <option value="REFERENCE">Reference Book / Document</option>
              </select>
            </div>
            <div>
              <label className="form-label">Curriculum Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <option key={u} value={u}>Unit {u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Material Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CPU Scheduling & Algorithm Analysis Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Description / Topics Covered</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Detailed notes covering FCFS, SJF, Round Robin, and Priority scheduling algorithms with numerical solved examples."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Academic Context Indicator (Derived from faculty assignment) */}
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
            Academic Context: <strong style={{ color: 'var(--accent-hover)' }}>{selectedClass?.sectionName}</strong> · {selectedClass?.subjectName} · {selectedClass?.semesterName || 'VII Semester'}.
          </div>

          <div>
            <label className="form-label">Select File (PDF, PPT, PPTX, DOCX, XLSX)</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Link href="/faculty/materials">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Material'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
