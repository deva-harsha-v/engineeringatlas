'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { useAcademicProfile } from '@/lib/useProfile';
import { QuestionPaper, FacultyAssignment } from '@/lib/types';
import { Modal } from '@/components/ui';
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
  Upload,
  Calendar,
  MoreVertical,
  Trash2,
  ExternalLink,
  BookOpen,
  Database,
  Cpu,
  Code2,
  Network,
} from 'lucide-react';

export default function FacultyPapersPage() {
  const { profile } = useAcademicProfile();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question paper?')) return;
    try {
      setPapers(papers.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const getSubjectIcon = (name?: string) => {
    const t = (name || '').toLowerCase();
    if (t.includes('data') || t.includes('dbms')) return <Database size={20} color="#2563EB" />;
    if (t.includes('system') || t.includes('os')) return <Cpu size={20} color="#2563EB" />;
    if (t.includes('compiler')) return <Code2 size={20} color="#2563EB" />;
    if (t.includes('network')) return <Network size={20} color="#2563EB" />;
    return <BookOpen size={20} color="#2563EB" />;
  };

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      if (examTypeFilter !== 'ALL' && p.examType !== examTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSub = p.subjectName?.toLowerCase().includes(q);
        if (!matchTitle && !matchSub) return false;
      }
      return true;
    });
  }, [papers, examTypeFilter, searchQuery]);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Question Papers']}
        title="Question Papers & Examination Archives"
        description="Official mid-term, semester-end, and supplementary past question papers archive."
      />

      {/* 4 Stat Metric Cards */}
      <div
        className="faculty-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {papers.length || 6}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Papers
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {papers.filter((p) => p.examType === 'END_SEMESTER').length || 4}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              End Semester Exams
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {papers.filter((p) => p.examType === 'INTERNAL_1' || p.examType === 'INTERNAL_2').length || 2}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Mid-Term Question Sets
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}
          >
            <Download size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              320+
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Student Revisions
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div
        className="faculty-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '14px',
        }}
      >
        <div className="faculty-filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div className="faculty-filter-search-wrap" style={{ position: 'relative', width: '260px' }}>
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search question papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                paddingLeft: '34px',
                paddingRight: '12px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <select
            className="faculty-filter-select"
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            style={{
              height: '38px',
              padding: '0 12px',
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Exam Types</option>
            <option value="END_SEMESTER">End Semester</option>
            <option value="INTERNAL_1">Mid Term 1 (Internal 1)</option>
            <option value="INTERNAL_2">Mid Term 2 (Internal 2)</option>
            <option value="MODEL_PAPER">Model Paper</option>
            <option value="SUPPLEMENTARY">Supplementary</option>
          </select>
        </div>

        <div className="faculty-filter-action">
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              height: '38px',
              padding: '0 16px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
              width: '100%',
            }}
          >
            <Plus size={16} />
            <span>Add Question Paper</span>
          </button>
        </div>
      </div>

      {/* Papers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPapers.map((p) => (
          <div
            key={p.id}
            className="faculty-card faculty-item-card"
            style={{
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
          >
            {/* Left: Icon & Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {getSubjectIcon(p.subjectName)}
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {p.subjectName || 'Engineering Examination'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Academic Year: {p.academicYear} · {p.fileName || 'question_paper.pdf'}
                </div>
              </div>
            </div>

            {/* Badges: Exam Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {p.examType.replace('_', ' ')}
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid var(--border)',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                Year {p.academicYear}
              </span>
            </div>

            {/* Published Status Badge */}
            <span
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Archived
            </span>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a
                href={p.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Download size={13} />
                <span>Download</span>
              </a>

              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: '#DC2626',
                  borderRadius: '6px',
                }}
                title="Delete Paper"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Paper */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Examination Question Paper">
        <form onSubmit={handleUploadPaper} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Subject & Section Context</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subjectName} ({c.sectionName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Paper Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. November 2025 Regular End Semester Examination"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Exam Type</label>
              <select className="form-select" value={examType} onChange={(e) => setExamType(e.target.value as any)}>
                <option value="END_SEMESTER">End Semester</option>
                <option value="INTERNAL_1">Mid Term 1 (Internal 1)</option>
                <option value="INTERNAL_2">Mid Term 2 (Internal 2)</option>
                <option value="MODEL_PAPER">Model Paper</option>
                <option value="SUPPLEMENTARY">Supplementary</option>
              </select>
            </div>
            <div>
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="2026"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Question Paper PDF File</label>
            <input
              type="file"
              accept=".pdf"
              className="form-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Archiving...' : 'Archive Question Paper'}
            </button>
          </div>
        </form>
      </Modal>
    </FacultyLayout>
  );
}
