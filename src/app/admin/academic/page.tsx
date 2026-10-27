'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button, Badge, Card, Modal } from '@/components/ui';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  FolderPlus,
  Sparkles,
} from 'lucide-react';

export default function AcademicStructureManagerPage() {
  const [structure, setStructure] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<{
    type: string;
    id: string;
    name: string;
    branchId?: string;
    semesterId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [targetSemesterId, setTargetSemesterId] = useState('');
  const [targetBranchId, setTargetBranchId] = useState('');
  const [sectionName, setSectionName] = useState('');

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [unitsCount, setUnitsCount] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchStructure = async () => {
    try {
      const res = await fetch('/api/academic/structure');
      const json = await res.json();
      if (json.success) {
        setStructure(json.data);
        if (!selectedNode && json.data.branches?.[0]) {
          setSelectedNode({
            type: 'BRANCH',
            id: json.data.branches[0].id,
            name: json.data.branches[0].name,
            branchId: json.data.branches[0].id,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructure();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Branch creation
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !branchCode.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/academic/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_BRANCH',
          name: branchName.trim(),
          code: branchCode.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddBranchOpen(false);
        setBranchName('');
        setBranchCode('');
        showToast(json.message || 'Branch created successfully');
        await fetchStructure();
      } else {
        alert(json.error || 'Failed to create branch');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Section creation
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim() || !targetSemesterId) {
      alert('Please enter a section name and select a semester');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/academic/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SECTION',
          name: sectionName.trim(),
          semesterId: targetSemesterId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddSectionOpen(false);
        setSectionName('');
        showToast(json.message || 'Section created successfully');
        await fetchStructure();
      } else {
        alert(json.error || 'Failed to create section');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Subject creation
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const branchId = selectedNode?.branchId || structure?.branches?.[0]?.id;
    const semesterId = selectedNode?.semesterId || structure?.branches?.[0]?.years?.[0]?.semesters?.[0]?.id || 'sem-7';

    setSubmitting(true);
    try {
      const res = await fetch('/api/academic/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SUBJECT',
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
        showToast(json.message || 'Subject created successfully');
        await fetchStructure();
      } else {
        alert(json.error || 'Failed to create subject');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handlers
  const handleDeleteNode = async (type: string, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${type.toLowerCase()} "${name}"?`)) return;

    try {
      let action = '';
      if (type === 'SECTION') action = 'DELETE_SECTION';
      else if (type === 'BRANCH') action = 'DELETE_BRANCH';
      else if (type === 'SUBJECT') action = 'DELETE_SUBJECT';
      else return;

      const res = await fetch('/api/academic/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`${type} deleted successfully`);
        setSelectedNode(null);
        await fetchStructure();
      } else {
        alert(json.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openAddSectionForSemester = (semId: string, bId: string) => {
    setTargetSemesterId(semId);
    setTargetBranchId(bId);
    setIsAddSectionOpen(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {notification && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              color: '#059669',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            {notification}
          </div>
        )}

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
              INSTITUTIONAL CURRICULUM & SECTION ARCHITECTURE
            </div>
            <h1 className="text-page-title">Academic Structure Manager</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage Branches (CSE, ECE, EEE, MECH), Semesters, and Semester-specific Sections (e.g. Sem VI: CSE-A, CSE-B; Sem VII: CSE-A, CSE-B, CSE-C).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" size="sm" onClick={() => setIsAddBranchOpen(true)}>
              <Building size={14} /> Add Branch
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (structure?.branches?.[0]?.years?.[0]?.semesters?.[0]?.id) {
                  setTargetBranchId(structure.branches[0].id);
                  setTargetSemesterId(structure.branches[0].years[0].semesters[0].id);
                }
                setIsAddSectionOpen(true);
              }}
            >
              <Users size={14} /> Add Section
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsAddSubjectOpen(true)}>
              <Plus size={14} /> Add Subject
            </Button>
          </div>
        </div>

        {/* Visual Hierarchy Tree Explorer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* Left: Tree Viewer */}
          <div className="ea-card" style={{ background: 'var(--surface-1)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '10px',
              }}
            >
              <div className="tech-coordinate" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> ACADEMIC HIERARCHY TREE
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {structure?.branches?.length || 0} Branches Active
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading curriculum hierarchy...
              </div>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 2 }}>
                {/* Institution Root */}
                <div
                  onClick={() =>
                    setSelectedNode({
                      type: 'INSTITUTION',
                      id: structure?.institution?.id,
                      name: structure?.institution?.name || 'SVEC',
                    })
                  }
                  style={{
                    cursor: 'pointer',
                    color: selectedNode?.type === 'INSTITUTION' ? 'var(--accent-hover)' : 'var(--text-primary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  <span>🏢 {structure?.institution?.name || 'Sri Vasavi Engineering College (SVEC)'}</span>
                </div>

                {/* Branches */}
                {structure?.branches?.map((branch: any) => (
                  <div key={branch.id} style={{ marginLeft: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: selectedNode?.id === branch.id ? 'var(--surface-2)' : 'transparent',
                      }}
                    >
                      <div
                        onClick={() =>
                          setSelectedNode({
                            type: 'BRANCH',
                            id: branch.id,
                            name: `${branch.name} (${branch.code})`,
                            branchId: branch.id,
                          })
                        }
                        style={{
                          cursor: 'pointer',
                          color: selectedNode?.id === branch.id ? 'var(--accent-hover)' : 'var(--text-primary)',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>📁 {branch.name}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                          {branch.code}
                        </span>
                      </div>

                      <button
                        title="Delete branch"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode('BRANCH', branch.id, branch.name);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Academic Years */}
                    {branch.years?.map((year: any) => (
                      <div key={year.id} style={{ marginLeft: '20px' }}>
                        <div
                          onClick={() =>
                            setSelectedNode({
                              type: 'YEAR',
                              id: year.id,
                              name: `${year.name} - ${branch.code}`,
                              branchId: branch.id,
                            })
                          }
                          style={{
                            cursor: 'pointer',
                            color: selectedNode?.id === year.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>📅 {year.name}</span>
                        </div>

                        {/* Semesters */}
                        {year.semesters?.map((sem: any) => (
                          <div key={sem.id} style={{ marginLeft: '22px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                backgroundColor: selectedNode?.id === sem.id ? 'var(--surface-2)' : 'transparent',
                              }}
                            >
                              <div
                                onClick={() =>
                                  setSelectedNode({
                                    type: 'SEMESTER',
                                    id: sem.id,
                                    name: `${sem.name} (${branch.code})`,
                                    branchId: branch.id,
                                    semesterId: sem.id,
                                  })
                                }
                                style={{
                                  cursor: 'pointer',
                                  color: selectedNode?.id === sem.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                <span>🎓 {sem.name}</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                  ({sem.sections?.length || 0} secs · {sem.subjects?.length || 0} subs)
                                </span>
                              </div>

                              <button
                                title={`Add section to ${sem.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAddSectionForSemester(sem.id, branch.id);
                                }}
                                style={{
                                  background: 'var(--surface-2)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--accent-hover)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '10px',
                                  padding: '1px 6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                }}
                              >
                                <Plus size={10} /> Section
                              </button>
                            </div>

                            {/* Sections in this semester */}
                            <div style={{ marginLeft: '20px', borderLeft: '1px dashed var(--border)', paddingLeft: '8px' }}>
                              {sem.sections?.length > 0 ? (
                                sem.sections.map((sec: any) => (
                                  <div
                                    key={sec.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '1px 4px',
                                    }}
                                  >
                                    <div
                                      onClick={() =>
                                        setSelectedNode({
                                          type: 'SECTION',
                                          id: sec.id,
                                          name: `Section ${sec.name} (${branch.code} ${sem.name})`,
                                          branchId: branch.id,
                                          semesterId: sem.id,
                                        })
                                      }
                                      style={{
                                        cursor: 'pointer',
                                        color: selectedNode?.id === sec.id ? 'var(--accent-hover)' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                      }}
                                    >
                                      <span>👥 Section {sec.name}</span>
                                    </div>
                                    <button
                                      title="Delete section"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNode('SECTION', sec.id, sec.name);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  No sections yet (click + Section)
                                </div>
                              )}

                              {/* Subjects in this semester */}
                              {sem.subjects?.map((sub: any) => (
                                <div
                                  key={sub.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1px 4px',
                                  }}
                                >
                                  <div
                                    onClick={() =>
                                      setSelectedNode({
                                        type: 'SUBJECT',
                                        id: sub.id,
                                        name: `${sub.code} - ${sub.name}`,
                                        branchId: branch.id,
                                        semesterId: sem.id,
                                      })
                                    }
                                    style={{
                                      cursor: 'pointer',
                                      color: selectedNode?.id === sub.id ? 'var(--accent-hover)' : 'var(--accent)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '12px',
                                    }}
                                  >
                                    <span>📖 {sub.code}: {sub.name}</span>
                                  </div>
                                  <button
                                    title="Delete subject"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNode('SUBJECT', sub.id, sub.name);
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--text-muted)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Selected Node Details Inspector */}
          <div className="ea-card" style={{ background: 'var(--surface-1)' }}>
            <div className="tech-coordinate" style={{ marginBottom: '16px' }}>
              NODE INSPECTOR & SECTION MANAGEMENT
            </div>

            {selectedNode ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-accent">{selectedNode.type}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {selectedNode.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Node ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedNode.id}</span>
                </p>

                <div
                  style={{
                    background: 'var(--surface-2)',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Semester Section Isolation Rules
                  </div>
                  <ul
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      paddingLeft: '16px',
                      lineHeight: 1.6,
                    }}
                  >
                    <li>
                      Sections created for this semester are only available when a student chooses this semester.
                    </li>
                    <li>
                      Faculty assignments and student assignments are strictly scoped to the selected section.
                    </li>
                    <li>
                      A student in <strong>CSE-B</strong> will not see assignments or materials published exclusively to <strong>CSE-A</strong>.
                    </li>
                  </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedNode.type === 'SEMESTER' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openAddSectionForSemester(selectedNode.id, selectedNode.branchId || '')}
                    >
                      <Plus size={14} /> Add Section to this Semester
                    </Button>
                  )}

                  <Button variant="secondary" size="sm" onClick={() => setIsAddSubjectOpen(true)}>
                    <Plus size={14} /> Add Subject to this Context
                  </Button>

                  {(selectedNode.type === 'SECTION' || selectedNode.type === 'BRANCH' || selectedNode.type === 'SUBJECT') && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteNode(selectedNode.type, selectedNode.id, selectedNode.name)}
                    >
                      <Trash2 size={14} /> Delete this {selectedNode.type.toLowerCase()}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Select any node from the tree to view properties, manage semester sections, or configure subjects.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal: Add Branch */}
      <Modal isOpen={isAddBranchOpen} onClose={() => setIsAddBranchOpen(false)} title="Create Academic Branch">
        <form onSubmit={handleCreateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Branch Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mechanical Engineering"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Branch Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. MECH"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              required
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              4 Academic Years and 8 Semesters will be automatically provisioned for this branch.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsAddBranchOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Section */}
      <Modal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)} title="Create Semester Section">
        <form onSubmit={handleCreateSection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Target Branch</label>
            <select
              className="form-select"
              value={targetBranchId}
              onChange={(e) => {
                setTargetBranchId(e.target.value);
                const b = structure?.branches?.find((x: any) => x.id === e.target.value);
                if (b?.years?.[0]?.semesters?.[0]) {
                  setTargetSemesterId(b.years[0].semesters[0].id);
                }
              }}
            >
              {structure?.branches?.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Assign to Semester</label>
            <select
              className="form-select"
              value={targetSemesterId}
              onChange={(e) => setTargetSemesterId(e.target.value)}
              required
            >
              {(() => {
                const targetBranch = structure?.branches?.find(
                  (b: any) => b.id === targetBranchId || (!targetBranchId && b.id === structure.branches[0]?.id)
                );
                if (!targetBranch) return null;
                const sortedYears = [...(targetBranch.years || [])].sort((a, b) => a.yearNumber - b.yearNumber);
                return sortedYears.flatMap((y: any) => {
                  const sortedSemesters = [...(y.semesters || [])].sort((a, b) => a.semNumber - b.semNumber);
                  return sortedSemesters.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {y.name} - {s.name}
                    </option>
                  ));
                });
              })()}
            </select>
          </div>

          <div>
            <label className="form-label">Section Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CSE-C"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              required
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              This section will strictly belong to this semester. Students in other semesters will not see it.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Section'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Subject */}
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
            <Button type="button" variant="ghost" onClick={() => setIsAddSubjectOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
