'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { FacultyAssignment, Subject, AuthUser } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { UserCheck, Plus, Trash2, CheckCircle2, UploadCloud, AlertCircle, FileText } from 'lucide-react';

interface PreviewAssignmentRow {
  rowIndex: number;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  sectionId: string;
  sectionName: string;
  academicYear: string;
}

interface RowError {
  row: number;
  entry: string;
  error: string;
}

export default function FacultyAssignmentsManagerPage() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [facultyList, setFacultyList] = useState<AuthUser[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Single Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSection, setSelectedSection] = useState('sec-csea');
  const [submitting, setSubmitting] = useState(false);

  // Bulk Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [validating, setValidating] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewRows, setPreviewRows] = useState<PreviewAssignmentRow[]>([]);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [aRes, fRes, sRes] = await Promise.all([
        fetch('/api/faculty/assignments'),
        fetch('/api/faculty'),
        fetch('/api/subjects'),
      ]);

      const [aData, fData, sData] = await Promise.all([aRes.json(), fRes.json(), sRes.json()]);
      if (aData.success) setAssignments(aData.data);
      if (fData.success) {
        setFacultyList(fData.data);
        if (fData.data.length > 0 && !selectedFacultyId) setSelectedFacultyId(fData.data[0].id);
      }
      if (sData.success) {
        setSubjects(sData.data);
        if (sData.data.length > 0 && !selectedSubjectId) setSelectedSubjectId(sData.data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyId || !selectedSubjectId || !selectedSection) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/faculty/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: selectedFacultyId,
          subjectId: selectedSubjectId,
          sectionId: selectedSection,
          academicYear: '2026-2027',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        const refresh = await fetch('/api/faculty/assignments');
        const refreshed = await refresh.json();
        setAssignments(refreshed.data);
      } else {
        alert(json.error || 'Failed to create assignment');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this teaching assignment?')) return;
    try {
      await fetch(`/api/faculty/assignments?id=${id}`, { method: 'DELETE' });
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleValidateCsv = async () => {
    if (!csvContent.trim()) return;
    setValidating(true);
    setRowErrors([]);
    setPreviewRows([]);
    setBulkSuccessMsg(null);

    try {
      const res = await fetch('/api/faculty/assignments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv: csvContent,
          validateOnly: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewRows(data.preview || []);
        setRowErrors(data.errors || []);
      } else {
        alert(data.error || 'Validation error');
      }
    } catch (err: any) {
      alert(err.message || 'Validation request failed');
    } finally {
      setValidating(false);
    }
  };

  const handleCommitBulk = async () => {
    if (previewRows.length === 0) return;
    setCommitting(true);
    setBulkSuccessMsg(null);

    try {
      const res = await fetch('/api/faculty/assignments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv: csvContent,
          validateOnly: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBulkSuccessMsg(`Successfully committed ${data.createdCount} teaching assignments.`);
        setPreviewRows([]);
        setRowErrors(data.errors || []);
        loadData();
      } else {
        alert(data.error || 'Commit failed');
      }
    } catch (err: any) {
      alert(err.message || 'Commit request failed');
    } finally {
      setCommitting(false);
    }
  };

  const loadSampleAssignments = () => {
    const sample = `Faculty Email, Subject Code, Section, Academic Year
dr.kumar@svec.edu, CS701, CSE-A, 2026-2027
dr.kumar@svec.edu, CS701, CSE-B, 2026-2027
prof.rajesh@svec.edu, CS701, CSE-B, 2026-2027
dr.anitha@svec.edu, EC701, ECE-A, 2026-2027`;
    setCsvContent(sample);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACCESS CONTROL & PERMISSION MATRIX
            </div>
            <h1 className="text-page-title">Faculty Teaching Assignments</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Assign faculty members to specific subject sections. Write permissions and section material isolation are automatically derived from this matrix.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsBulkModalOpen(true);
                setPreviewRows([]);
                setRowErrors([]);
                setBulkSuccessMsg(null);
              }}
            >
              <UploadCloud size={14} /> Bulk Import (CSV)
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} /> Assign Faculty
            </Button>
          </div>
        </div>

        {/* Assignments Table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Faculty Member</th>
                <th style={{ padding: '12px 16px' }}>Teaching Subject</th>
                <th style={{ padding: '12px 16px' }}>Assigned Section</th>
                <th style={{ padding: '12px 16px' }}>Academic Year</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {a.facultyName}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{a.subjectName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.subjectCode}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-accent">{a.sectionName || 'CSE-A'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                    {a.academicYear}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(a.id)} style={{ color: 'var(--error)' }}>
                      <Trash2 size={13} /> Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No faculty assignments configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Single Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Faculty to Class Section">
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Select Faculty Member</label>
            <select
              className="form-input"
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              required
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.department || 'CSE'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Select Subject</label>
            <select
              className="form-input"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Class Section</label>
            <select
              className="form-input"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required
            >
              <option value="sec-csea">CSE-A (Section A)</option>
              <option value="sec-cseb">CSE-B (Section B)</option>
              <option value="sec-ecea">ECE-A (Section A)</option>
              <option value="sec-eceb">ECE-B (Section B)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Assignments Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Faculty Teaching Assignments"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Paste CSV data containing faculty teaching assignments. Matches faculty by email/ID, subjects by code/ID, and sections by name/ID.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" style={{ margin: 0 }}>CSV Content</label>
            <button
              type="button"
              onClick={loadSampleAssignments}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FileText size={12} /> Load Sample Template
            </button>
          </div>

          <textarea
            className="form-input"
            rows={5}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Faculty Email, Subject Code, Section, Academic Year"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleValidateCsv}
              disabled={validating || !csvContent.trim()}
            >
              {validating ? 'Validating...' : 'Validate & Preview'}
            </Button>
            {previewRows.length > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCommitBulk}
                disabled={committing}
              >
                {committing ? 'Importing...' : `Commit Assignments (${previewRows.length})`}
              </Button>
            )}
          </div>

          {bulkSuccessMsg && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{bulkSuccessMsg}</span>
            </div>
          )}

          {rowErrors.length > 0 && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--error)',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} /> Assignment Conflicts / Errors ({rowErrors.length})
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {rowErrors.map((err, i) => (
                  <li key={i}>
                    Row {err.row} ({err.entry}): {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {previewRows.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Validated Assignments Preview ({previewRows.length})
              </div>
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Faculty</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Subject</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Section</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r) => (
                      <tr key={r.rowIndex} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '6px 8px' }}>{r.rowIndex}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 600 }}>{r.facultyName}</td>
                        <td style={{ padding: '6px 8px' }}>{r.subjectCode} ({r.subjectName})</td>
                        <td style={{ padding: '6px 8px' }}>
                          <span className="badge badge-accent" style={{ fontSize: '9px' }}>
                            {r.sectionName}
                          </span>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <span className="badge badge-success" style={{ fontSize: '9px' }}>
                            READY
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
