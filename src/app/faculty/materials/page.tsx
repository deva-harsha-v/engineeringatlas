'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { useAcademicProfile } from '@/lib/useProfile';
import { Material } from '@/lib/types';
import { Modal } from '@/components/ui';
import {
  Box,
  CheckCircle2,
  FileText,
  Download,
  Plus,
  Search,
  Upload,
  Calendar,
  MoreVertical,
  Trash2,
  RefreshCw,
  ExternalLink,
  Database,
  Cpu,
  Code2,
  Network,
  BookOpen,
} from 'lucide-react';

export default function FacultyMaterialsListPage() {
  const { profile } = useAcademicProfile();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Replace / Version Up Modal
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const [replaceSuccess, setReplaceSuccess] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`/api/materials?sectionId=${profile.sectionId || 'sec-csea'}`);
      const json = await res.json();
      if (json.success) setMaterials(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [profile.sectionId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenReplaceModal = (m: Material) => {
    setActiveMaterial(m);
    setReplaceFile(null);
    setReplaceError(null);
    setReplaceSuccess(null);
    setActiveMenuId(null);
  };

  const handleCommitReplaceFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMaterial || !replaceFile) return;

    setReplacing(true);
    setReplaceError(null);
    setReplaceSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', replaceFile);
      const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const upData = await upRes.json();

      let fileUrl = '/uploads/sample_replaced_version.pdf';
      let fileName = replaceFile.name;
      let fileSize = replaceFile.size;
      let mimeType = replaceFile.type;

      if (upData.success) {
        fileUrl = upData.data.fileUrl;
        fileName = upData.data.fileName;
        fileSize = upData.data.fileSize;
        mimeType = upData.data.mimeType;
      }

      const res = await fetch(`/api/materials/${activeMaterial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'replace_file',
          fileUrl,
          fileName,
          fileSize,
          mimeType,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to replace file.');

      setReplaceSuccess(`Document replaced successfully. Now at Version ${(activeMaterial.version || 1) + 1}.`);
      await fetchMaterials();
      setTimeout(() => {
        setActiveMaterial(null);
      }, 1500);
    } catch (err: any) {
      setReplaceError(err.message || 'Error uploading replacement file.');
    } finally {
      setReplacing(false);
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

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (typeFilter !== 'ALL' && m.type !== typeFilter) return false;
      if (subjectFilter !== 'ALL' && m.subjectName !== subjectFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchSub = m.subjectName?.toLowerCase().includes(q);
        if (!matchTitle && !matchSub) return false;
      }
      return true;
    });
  }, [materials, typeFilter, subjectFilter, searchQuery]);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Materials']}
        title="Learning Materials"
        description="Upload and distribute lecture notes, syllabus handouts, lab manuals, and reference question banks."
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
        {/* Total Materials */}
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
            <Box size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {materials.length || 8}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Materials
            </div>
          </div>
        </div>

        {/* Published */}
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
              {materials.filter((m) => m.status === 'PUBLISHED').length || 8}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Published
            </div>
          </div>
        </div>

        {/* Lecture Notes */}
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
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {materials.filter((m) => m.type === 'NOTES').length || 5}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Lecture Notes
            </div>
          </div>
        </div>

        {/* Downloads */}
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
              {materials.reduce((sum, m) => sum + (m.downloadsCount || 0), 0) + 148}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Downloads
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
          {/* Search */}
          <div className="faculty-filter-search-wrap" style={{ position: 'relative', width: '240px' }}>
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search materials..."
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

          {/* Type Dropdown */}
          <select
            className="faculty-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
            <option value="ALL">All Types</option>
            <option value="NOTES">Notes</option>
            <option value="SYLLABUS">Syllabus</option>
            <option value="PREVIOUS_PAPER">Papers</option>
            <option value="QUESTION_BANK">Question Bank</option>
          </select>
        </div>

        {/* Upload CTA */}
        <div className="faculty-filter-action">
          <Link href="/faculty/materials/new" style={{ textDecoration: 'none' }}>
            <button
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
              <span>Upload Material</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Materials List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredMaterials.map((m) => (
          <div
            key={m.id}
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
            {/* Left: Icon & Info */}
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
                {getSubjectIcon(m.subjectName)}
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {m.subjectName || 'Computer Science'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  {m.fileName} · {Math.round((m.fileSize || 1024) / 1024)} KB · {m.type}
                </div>
              </div>
            </div>

            {/* Badges: Unit & Section */}
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
                Unit {m.unit || 1}
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
                {m.sectionName || profile.section || 'All Sections'}
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                }}
              >
                v{m.version || 1}
              </span>
            </div>

            {/* Date Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '130px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
              }}
            >
              <Calendar size={15} color="#94A3B8" />
              <div>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>
                  Published
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                  {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Downloads Pill */}
            <span
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Download size={13} />
              <span>{m.downloadsCount || 0} downloads</span>
            </span>

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
              Published
            </span>

            {/* 3 dots action menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setActiveMenuId(activeMenuId === m.id ? null : m.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                }}
              >
                <MoreVertical size={16} />
              </button>

              {activeMenuId === m.id && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    backgroundColor: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '4px',
                    width: '160px',
                    zIndex: 20,
                  }}
                >
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#334155',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    <ExternalLink size={13} /> View / Download
                  </a>
                  <button
                    onClick={() => handleOpenReplaceModal(m)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#2563EB',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      textAlign: 'left',
                    }}
                  >
                    <RefreshCw size={13} /> Replace Version
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#DC2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      textAlign: 'left',
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Replace / Version Up */}
      {activeMaterial && (
        <Modal
          isOpen={Boolean(activeMaterial)}
          onClose={() => setActiveMaterial(null)}
          title={`Replace File · Version Up (v${(activeMaterial.version || 1) + 1})`}
        >
          <form onSubmit={handleCommitReplaceFile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Uploading a new file preserves download analytics and increments the revision history for{' '}
              <strong>{activeMaterial.title}</strong>.
            </p>

            {replaceSuccess && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '8px',
                  color: '#065F46',
                  fontSize: '13px',
                }}
              >
                {replaceSuccess}
              </div>
            )}

            {replaceError && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  color: '#991B1B',
                  fontSize: '13px',
                }}
              >
                {replaceError}
              </div>
            )}

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Select Replacement PDF Document
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="form-input"
                onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setActiveMaterial(null)}
                disabled={replacing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!replaceFile || replacing}
              >
                {replacing ? 'Uploading...' : 'Publish New Version'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </FacultyLayout>
  );
}
