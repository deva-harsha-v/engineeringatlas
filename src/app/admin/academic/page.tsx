'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { Layers, ChevronRight, ChevronDown, Plus, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';

export default function AcademicStructureManagerPage() {
  const [structure, setStructure] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<{ type: string; id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // New Subject Modal
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [unitsCount, setUnitsCount] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/academic/structure');
        const json = await res.json();
        if (json.success) {
          setStructure(json.data);
          if (json.data.branches?.[0]) {
            setSelectedNode({
              type: 'BRANCH',
              id: json.data.branches[0].id,
              name: json.data.branches[0].name,
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!structure?.branches?.[0]) return;
    const branchId = structure.branches[0].id;
    const semesterId = structure.branches[0].years?.[0]?.semesters?.[0]?.id || 'sem-7';

    setSubmitting(true);
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subjectName,
          code: subjectCode,
          branchId,
          semesterId,
          unitsCount,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddSubjectOpen(false);
        setSubjectName('');
        setSubjectCode('');
        // Reload structure
        const refresh = await fetch('/api/academic/structure');
        const refreshed = await refresh.json();
        setStructure(refreshed.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              INSTITUTIONAL CURRICULUM ARCHITECTURE
            </div>
            <h1 className="text-page-title">Academic Structure Manager</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Hierarchical organization of Institution → Branch → Academic Year → Semester → Section → Subject.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsAddSubjectOpen(true)}>
            <Plus size={14} /> Add Curriculum Subject
          </Button>
        </div>

        {/* Visual Hierarchy Tree Explorer (Matching UI/UX Spec Page 17, Section 32) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left: Tree Viewer */}
          <div className="ea-card" style={{ background: 'var(--surface-1)' }}>
            <div className="tech-coordinate" style={{ marginBottom: '16px' }}>
              <Layers size={14} /> ACADEMIC HIERARCHY TREE
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.8 }}>
              {/* Institution Root */}
              <div
                onClick={() => setSelectedNode({ type: 'INSTITUTION', id: structure?.institution?.id, name: structure?.institution?.name || 'SVEC' })}
                style={{
                  cursor: 'pointer',
                  color: selectedNode?.type === 'INSTITUTION' ? 'var(--accent-hover)' : 'var(--text-primary)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🏢 {structure?.institution?.name || 'Sri Vasavi Engineering College (SVEC)'}</span>
              </div>

              {/* Branches */}
              {structure?.branches?.map((branch: any) => (
                <div key={branch.id} style={{ marginLeft: '18px' }}>
                  <div
                    onClick={() => setSelectedNode({ type: 'BRANCH', id: branch.id, name: branch.name })}
                    style={{
                      cursor: 'pointer',
                      color: selectedNode?.id === branch.id ? 'var(--accent-hover)' : 'var(--text-primary)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>└── 📁 {branch.name} ({branch.code})</span>
                  </div>

                  {/* Academic Years */}
                  {branch.years?.map((year: any) => (
                    <div key={year.id} style={{ marginLeft: '24px' }}>
                      <div
                        onClick={() => setSelectedNode({ type: 'YEAR', id: year.id, name: `${year.name} (${branch.code})` })}
                        style={{
                          cursor: 'pointer',
                          color: selectedNode?.id === year.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>├── 📅 {year.name}</span>
                      </div>

                      {/* Semesters */}
                      {year.semesters?.map((sem: any) => (
                        <div key={sem.id} style={{ marginLeft: '24px' }}>
                          <div
                            onClick={() => setSelectedNode({ type: 'SEMESTER', id: sem.id, name: sem.name })}
                            style={{
                              cursor: 'pointer',
                              color: selectedNode?.id === sem.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                            }}
                          >
                            <span>├── 🎓 {sem.name}</span>
                          </div>

                          {/* Sections */}
                          {sem.sections?.map((sec: any) => (
                            <div key={sec.id} style={{ marginLeft: '24px' }}>
                              <div
                                onClick={() => setSelectedNode({ type: 'SECTION', id: sec.id, name: `Section ${sec.name}` })}
                                style={{
                                  cursor: 'pointer',
                                  color: selectedNode?.id === sec.id ? 'var(--accent-hover)' : 'var(--text-muted)',
                                }}
                              >
                                <span>├── 👥 {sec.name}</span>
                              </div>
                            </div>
                          ))}

                          {/* Subjects in this Semester */}
                          {sem.subjects?.map((sub: any) => (
                            <div key={sub.id} style={{ marginLeft: '24px' }}>
                              <div
                                onClick={() => setSelectedNode({ type: 'SUBJECT', id: sub.id, name: `${sub.code} - ${sub.name}` })}
                                style={{
                                  cursor: 'pointer',
                                  color: selectedNode?.id === sub.id ? 'var(--accent-hover)' : 'var(--accent)',
                                }}
                              >
                                <span>└── 📖 {sub.code}: {sub.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Node Details Inspector */}
          <div className="ea-card" style={{ background: 'var(--surface-1)' }}>
            <div className="tech-coordinate" style={{ marginBottom: '16px' }}>
              NODE INSPECTOR & CURATION
            </div>

            {selectedNode ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-accent">{selectedNode.type}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {selectedNode.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Selected institutional node ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedNode.id}</span>
                </p>

                <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Node Governance Rules</div>
                  <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: 1.6 }}>
                    <li>Visibility automatically cascades down to student profiles selecting this branch/semester.</li>
                    <li>Faculty allocated to subjects under this node automatically receive write permissions.</li>
                    <li>Full-text search indexing updates immediately on modification.</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="sm" onClick={() => setIsAddSubjectOpen(true)}>
                    <Plus size={14} /> Add Subject to this Context
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Select any node from the tree to view properties and assign subjects.
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} title="Add Curriculum Subject">
        <form onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Subject Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Operating Systems"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Subject Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS701"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Curriculum Units</label>
              <select className="form-select" value={unitsCount} onChange={(e) => setUnitsCount(Number(e.target.value))}>
                <option value={5}>5 Units</option>
                <option value={6}>6 Units</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsAddSubjectOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
