'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AtlasTopic, Subject, Branch, VisualizationType, LearningType } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { getRegisteredEngines, VisualizationEngineDescriptor } from '@/lib/atlas/visualization-registry';
import { VisualizationRenderer } from '@/components/atlas/VisualizationRenderer';
import {
  Compass,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export default function AdminAtlasCurriculumPage() {
  const [topics, setTopics] = useState<AtlasTopic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterMode, setFilterMode] = useState('ALL');

  // Topic Creation / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // Form Fields
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unit, setUnit] = useState(1);
  const [topicName, setTopicName] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [classroomCode, setClassroomCode] = useState('');
  const [learningType, setLearningType] = useState<LearningType>('INTERACTIVE');
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('PROCESS_SCHEDULER');
  const [customConfig, setCustomConfig] = useState<Record<string, any>>({});
  const [overview, setOverview] = useState('');
  const [concept, setConcept] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [howItWorks, setHowItWorks] = useState('');
  const [example, setExample] = useState('');
  const [commonMistakes, setCommonMistakes] = useState('');
  const [quickRevision, setQuickRevision] = useState('');
  const [content, setContent] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Understand fundamental system abstraction and mechanics',
    'Explore edge cases and parameter state transitions',
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live Interactive Preview Modal in Studio
  const [previewTopic, setPreviewTopic] = useState<AtlasTopic | null>(null);

  const registeredEngines = getRegisteredEngines();

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes, strRes] = await Promise.all([
          fetch('/api/atlas'),
          fetch('/api/subjects'),
          fetch('/api/academic/structure'),
        ]);
        const [tData, sData, strData] = await Promise.all([tRes.json(), sRes.json(), strRes.json()]);
        if (tData.success) setTopics(tData.data);
        if (sData.success) setSubjects(sData.data);
        if (strData.success && strData.data?.branches) {
          setBranches(strData.data.branches);
          if (strData.data.branches.length > 0) {
            setSelectedBranchId(strData.data.branches[0].id);
          }
        }
        if (sData.success && sData.data.length > 0) {
          setSubjectId(sData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update filtered subjects when selected branch changes
  const branchSubjects = subjects.filter(
    (s) => !selectedBranchId || s.branchId === selectedBranchId
  );

  // Auto-generate slug and default classroom code
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingTopicId) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      setSlug(generatedSlug);
      const activeBranch = branches.find((b) => b.id === selectedBranchId);
      const prefix = activeBranch ? activeBranch.code : 'ENG';
      const shortCode = val.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
      setClassroomCode(`${prefix}-${shortCode || 'MOD'}-01`);
    }
  };

  // Sync default engine config when visualizationType changes
  const handleEngineChange = (type: VisualizationType) => {
    setVisualizationType(type);
    const engine = registeredEngines.find((e) => e.id === type);
    if (engine) {
      setCustomConfig(engine.defaultConfiguration);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTopicId(null);
    setTitle('');
    setSlug('');
    setTopicName('');
    setClassroomCode('');
    setLearningType('INTERACTIVE');
    setVisualizationType('PROCESS_SCHEDULER');
    setOverview('');
    setConcept('Core theoretical mechanics and operational definitions.');
    setWhyItMatters('Required foundational engineering abstraction for curriculum mastery.');
    setHowItWorks('1. Initialize state.\n2. Execute algorithm.\n3. Transition parameters.\n4. Complete cycle.');
    setExample('Standard numerical and analytical case study.');
    setCommonMistakes('Overlooking edge cases and boundary conditions.');
    setQuickRevision('Key high-yield takeaways and examination summary.');
    setContent('');
    const engine = registeredEngines.find((e) => e.id === 'PROCESS_SCHEDULER');
    setCustomConfig(engine?.defaultConfiguration || {});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !subjectId) return;

    setSubmitting(true);
    try {
      const activeBranch = branches.find((b) => b.id === selectedBranchId);
      const selectedSub = subjects.find((s) => s.id === subjectId);
      const deptCode = activeBranch?.code || selectedSub?.code?.slice(0, 2) || 'COMMON';

      const payload = {
        title,
        slug,
        subjectId,
        department: deptCode,
        departmentId: selectedBranchId,
        classroomCode: classroomCode || `${deptCode}-MOD-01`,
        unit: Number(unit) || 1,
        topic: topicName || title,
        learningType,
        visualizationType: learningType === 'STANDARD_CONTENT' ? null : visualizationType,
        configuration: customConfig,
        content,
        overview,
        concept,
        whyItMatters,
        howItWorks,
        example,
        commonMistakes,
        quickRevision,
        learningObjectives,
        difficulty: 'MEDIUM',
        estimatedTime: '15 mins',
        status: 'PUBLISHED',
      };

      let res;
      if (editingTopicId) {
        res = await fetch(`/api/atlas/${slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/atlas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (json.success) {
        if (editingTopicId) {
          setTopics(topics.map((t) => (t.id === editingTopicId ? json.data : t)));
        } else {
          setTopics([...topics, json.data]);
        }
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slugToDelete: string) => {
    if (!confirm('Permanently delete this topic from the curriculum?')) return;
    try {
      await fetch(`/api/atlas/${slugToDelete}`, { method: 'DELETE' });
      setTopics(topics.filter((t) => t.slug !== slugToDelete));
    } catch (e) {
      console.error(e);
    }
  };

  // Analytics Computation
  const totalTopics = topics.length;
  const totalViews = topics.reduce((sum, t) => sum + (t.viewCount || 0), 0);
  const deptCounts: Record<string, number> = {};
  const engineCounts: Record<string, number> = {};
  const modeCounts: Record<string, number> = {};

  topics.forEach((t) => {
    const d = t.department || 'OTHER';
    deptCounts[d] = (deptCounts[d] || 0) + 1;

    const m = t.learningType || 'INTERACTIVE';
    modeCounts[m] = (modeCounts[m] || 0) + 1;

    if (t.visualizationType) {
      engineCounts[t.visualizationType] = (engineCounts[t.visualizationType] || 0) + 1;
    }
  });

  const filteredTopics = topics.filter((t) => {
    if (filterDept !== 'ALL' && t.department !== filterDept) return false;
    if (filterMode !== 'ALL' && (t.learningType || 'INTERACTIVE') !== filterMode) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              CONTENT-DRIVEN VISUAL CURRICULUM ARCHITECTURE
            </div>
            <h1 className="text-page-title">Atlas Curriculum Studio</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Author, configure, and publish visual learning modules across all engineering departments without code changes.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
            <Plus size={14} /> Author Atlas Topic
          </Button>
        </div>

        {/* Analytics KPI Metric Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '14px',
            marginBottom: '28px',
          }}
        >
          <div className="ea-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL ATLAS TOPICS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalTopics}
            </div>
          </div>
          <div className="ea-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEPARTMENTS ACTIVE</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-hover)' }}>
              {Object.keys(deptCounts).length} Branches
            </div>
          </div>
          <div className="ea-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INTERACTIVE ENGINES</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
              {registeredEngines.length} Registered
            </div>
          </div>
          <div className="ea-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>STANDARD THEORY TOPICS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#A855F7' }}>
              {modeCounts['STANDARD_CONTENT'] || 0}
            </div>
          </div>
          <div className="ea-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL STUDENT VIEWS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)' }}>
              {totalViews} Views
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DEPT:</span>
            {['ALL', ...Array.from(new Set(topics.map((t) => t.department).filter(Boolean)))].map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept!)}
                className={`btn btn-sm ${filterDept === dept ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                {dept}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MODE:</span>
            {['ALL', 'INTERACTIVE', 'STANDARD_CONTENT', 'SIMULATION', 'VISUAL_EXPLANATION'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`btn btn-sm ${filterMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                {mode === 'ALL' ? 'All Modes' : mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Curriculum Table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Topic & Classroom Code</th>
                <th style={{ padding: '12px 16px' }}>Branch & Subject</th>
                <th style={{ padding: '12px 16px' }}>Learning Mode</th>
                <th style={{ padding: '12px 16px' }}>Visualization Engine</th>
                <th style={{ padding: '12px 16px' }}>Views</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((t) => {
                const isStandard = t.learningType === 'STANDARD_CONTENT' || !t.visualizationType;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.title}</div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          slug: {t.slug}
                        </span>
                        {t.classroomCode && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontFamily: 'var(--font-mono)',
                              padding: '1px 5px',
                              background: 'var(--surface-2)',
                              borderRadius: '3px',
                              color: 'var(--accent-hover)',
                            }}
                          >
                            {t.classroomCode}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                          {t.department || 'CSE'}
                        </span>
                        <span>{t.subjectName}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>UNIT {t.unit}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-default" style={{ fontSize: '10px' }}>
                        {t.learningType ? t.learningType.replace('_', ' ') : 'INTERACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {isStandard ? (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>— Theory Topic —</span>
                      ) : (
                        <span className="badge badge-accent" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                          {t.visualizationType}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                      {t.viewCount || 0}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewTopic(t)}
                          title="Interactive Studio Preview"
                        >
                          <Eye size={13} />
                        </Button>
                        <Link href={`/student/atlas/${t.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" title="Open student laboratory page">
                            Open <ArrowRight size={12} />
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(t.slug)}
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Authoring & Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopicId ? 'Edit Atlas Topic' : 'Author New Atlas Curriculum Topic'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Branch & Subject Cascading Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Department / Branch</label>
              <select
                className="form-select"
                value={selectedBranchId}
                onChange={(e) => {
                  setSelectedBranchId(e.target.value);
                  const matchingSubs = subjects.filter((s) => s.branchId === e.target.value);
                  if (matchingSubs.length > 0) setSubjectId(matchingSubs[0].id);
                }}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Subject</label>
              <select className="form-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {branchSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title, Unit, and Topic Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Topic Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AC Circuits & RLC Resonance"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Curriculum Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <option key={u} value={u}>
                    Unit {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ac-circuits"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Classroom Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. EE-CIRC-01"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Learning Classification & Visualization Type Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Learning Mode (Section 15)</label>
              <select
                className="form-select"
                value={learningType}
                onChange={(e) => setLearningType(e.target.value as LearningType)}
              >
                <option value="INTERACTIVE">INTERACTIVE (Interactive Laboratory)</option>
                <option value="STANDARD_CONTENT">STANDARD_CONTENT (Standard Syllabus Theory)</option>
                <option value="SIMULATION">SIMULATION (Physics/Engine Simulation)</option>
                <option value="VISUAL_EXPLANATION">VISUAL_EXPLANATION (Diagrammatic Flow)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Visualization Engine (Section 3 & 9)</label>
              <select
                className="form-select"
                value={visualizationType}
                disabled={learningType === 'STANDARD_CONTENT'}
                onChange={(e) => handleEngineChange(e.target.value as VisualizationType)}
              >
                {registeredEngines.map((engine) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Configuration Controls (Section 6) */}
          {learningType !== 'STANDARD_CONTENT' && (
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
              }}
            >
              <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
                VISUALIZATION ENGINE CONFIGURATION [DATA-DRIVEN]
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Custom parameters configured here are passed directly to the reusable engine renderer without code changes.
              </p>
              <textarea
                className="form-textarea"
                rows={4}
                value={JSON.stringify(customConfig, null, 2)}
                onChange={(e) => {
                  try {
                    setCustomConfig(JSON.parse(e.target.value));
                  } catch (err) {
                    // Allow typing
                  }
                }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
              />
            </div>
          )}

          {/* Standard Theoretical Content (when standard topic) */}
          {learningType === 'STANDARD_CONTENT' && (
            <div>
              <label className="form-label">Structured Syllabus Notes / Formulations</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Structured academic formulas, definitions, and derivations..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          )}

          {/* Overview & Core Pedagogical Fields */}
          <div>
            <label className="form-label">Overview & Intuition</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Concise 1-2 sentence intuition of what students learn..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Concept In-Depth</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Why It Matters in Engineering</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Publish to Atlas'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Interactive In-Studio Preview Modal */}
      {previewTopic && (
        <Modal
          isOpen={!!previewTopic}
          onClose={() => setPreviewTopic(null)}
          title={`Studio Preview: ${previewTopic.title} (${previewTopic.classroomCode})`}
        >
          <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-accent">{previewTopic.department}</span>
              <span className="badge badge-default">UNIT {previewTopic.unit}</span>
              <span className="badge badge-default">{previewTopic.learningType}</span>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {previewTopic.overview}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <VisualizationRenderer
                type={previewTopic.visualizationType}
                configuration={previewTopic.configuration}
                topic={previewTopic}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setPreviewTopic(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
