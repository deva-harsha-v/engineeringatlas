'use client';

import React, { useState, useEffect } from 'react';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { QuestionPaper, FacultyAssignment } from '@/lib/types';
import { Button, Badge, Modal, EmptyState } from '@/components/ui';
import { PaperCard } from '@/components/academic';
import { Plus, Upload, Trash2 } from 'lucide-react';

export default function FacultyPapersPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');
  const [examType, setExamType] = useState('END_SEMESTER');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch('/api/papers'),
          fetch('/api/faculty/assignments'),
        ]);
        const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
        if (pData.success) setPapers(pData.data);
        if (cData.success && cData.data.length > 0) {
          setClasses(cData.data);
          setSelectedClassId(cData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    if (!currentClass || !title) return;

    setUploading(true);
    try {
      let fileUrl = '/uploads/sample_question_paper.pdf';
      let fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`;
      let fileSize = file ? file.size : 1500000;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const upData = await upRes.json();
        if (upData.success) {
          fileUrl = upData.data.fileUrl;
          fileName = upData.data.fileName;
          fileSize = upData.data.fileSize;
        }
      }

      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          academicYear,
          examType,
          fileUrl,
          fileName,
          fileSize,
          subjectId: currentClass.subjectId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPapers([json.data, ...papers]);
        setIsModalOpen(false);
        setTitle('');
        setFile(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              EXAMINATION PAPERS ARCHIVE
            </div>
            <h1 className="text-page-title">Question Papers & Model Tests</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Upload end semester papers, internals, and model practice papers for exam preparation.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Upload Question Paper
          </Button>
        </div>

        {papers.length === 0 ? (
          <EmptyState
            title="No Question Papers Uploaded"
            description="Archive previous exam papers to feed the Past Paper Intelligence engine."
            actionText="Upload Paper"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {papers.map((p) => (
              <PaperCard key={p.id} paper={p} />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Question Paper">
        <form onSubmit={handleUploadPaper} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subjectName} ({cls.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Academic Year</label>
              <select className="form-select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                <option value="2026">2026 Examination Series</option>
                <option value="2025">2025 Examination Series</option>
                <option value="2024">2024 Examination Series</option>
              </select>
            </div>
            <div>
              <label className="form-label">Examination Type</label>
              <select className="form-select" value={examType} onChange={(e) => setExamType(e.target.value)}>
                <option value="END_SEMESTER">End Semester Examination</option>
                <option value="INTERNAL_1">Internal Mid 1</option>
                <option value="INTERNAL_2">Internal Mid 2</option>
                <option value="MODEL_PAPER">Model Practice Paper</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Paper Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 2026 Operating Systems End Semester Paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Select Paper PDF</label>
            <input
              type="file"
              className="form-input"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Publish Paper'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
