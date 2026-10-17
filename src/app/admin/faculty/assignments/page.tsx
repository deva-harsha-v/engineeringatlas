'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { FacultyAssignment, Subject, AuthUser } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { UserCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function FacultyAssignmentsManagerPage() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [facultyList, setFacultyList] = useState<AuthUser[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSection, setSelectedSection] = useState('sec-csea');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
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
          if (fData.data.length > 0) setSelectedFacultyId(fData.data[0].id);
        }
        if (sData.success) {
          setSubjects(sData.data);
          if (sData.data.length > 0) setSelectedSubjectId(sData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACCESS CONTROL & PERMISSION MATRIX
            </div>
            <h1 className="text-page-title">Faculty Teaching Assignments</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Assign faculty members to specific subject sections. Write permissions are automatically derived from this matrix.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Assign Faculty
          </Button>
        </div>

        {/* Assignments Table (Matching UI/UX Spec Page 17, Section 33) */}
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
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Faculty to Class Context">
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Faculty Member</label>
            <select className="form-select" value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)}>
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Subject</label>
            <select className="form-select" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Target Section</label>
            <select className="form-select" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="sec-csea">CSE-A (Section A)</option>
              <option value="sec-cseb">CSE-B (Section B)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Assign Faculty'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
