'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AtlasTopic, Subject } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { Compass, Plus, Trash2, Edit3, ArrowRight } from 'lucide-react';

export default function AdminAtlasCurriculumPage() {
  const [topics, setTopics] = useState<AtlasTopic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unit, setUnit] = useState(1);
  const [topicName, setTopicName] = useState('');
  const [visualizationType, setVisualizationType] = useState('PROCESS_SCHEDULER');
  const [overview, setOverview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch('/api/atlas'),
          fetch('/api/subjects'),
        ]);
        const [tData, sData] = await Promise.all([tRes.json(), sRes.json()]);
        if (tData.success) setTopics(tData.data);
        if (sData.success) {
          setSubjects(sData.data);
          if (sData.data.length > 0) setSubjectId(sData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !subjectId) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          subjectId,
          unit,
          topic: topicName || title,
          visualizationType,
          overview,
          whyItMatters: 'Fundamental engineering abstraction required for curriculum proficiency.',
          concept: 'Core theoretical mechanics.',
          howItWorks: '1. Initialize state.\n2. Execute algorithm.\n3. Transition parameters.\n4. Complete cycle.',
          example: 'Standard numerical case study.',
          commonMistakes: 'Overlooking edge cases.',
          quickRevision: 'Key summary takeaway points.',
          learningObjectives: ['Understand underlying algorithms', 'Observe parameter adjustments live'],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setTopics([...topics, json.data]);
        setIsModalOpen(false);
        setTitle('');
        setSlug('');
        setOverview('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slugToDelete: string) => {
    if (!confirm('Delete this Atlas module from the curriculum?')) return;
    try {
      await fetch(`/api/atlas/${slugToDelete}`, { method: 'DELETE' });
      setTopics(topics.filter((t) => t.slug !== slugToDelete));
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
              INTERACTIVE CURRICULUM AUTHORING
            </div>
            <h1 className="text-page-title">Interactive Atlas Modules</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage visualization engines, learning objectives, and curriculum mapping.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Create Atlas Topic
          </Button>
        </div>

        {/* Modules Table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Module Title</th>
                <th style={{ padding: '12px 16px' }}>Subject & Unit</th>
                <th style={{ padding: '12px 16px' }}>Visualization Engine</th>
                <th style={{ padding: '12px 16px' }}>Views</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      slug: {t.slug}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>{t.subjectName}</div>
                    <span className="badge badge-accent" style={{ fontSize: '10px' }}>UNIT {t.unit}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-default" style={{ fontSize: '11px' }}>
                      {t.visualizationType}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                    {t.viewCount} views
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Link href={`/student/atlas/${t.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">Preview</Button>
                      </Link>
                      <Button variant="secondary" size="sm" onClick={() => handleDelete(t.slug)} style={{ color: 'var(--error)' }}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Interactive Atlas Topic">
        <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Subject</label>
            <select className="form-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Topic Title</label>
              <input type="text" className="form-input" placeholder="e.g. CPU Scheduling" value={title} onChange={(e) => {
                setTitle(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
              }} required />
            </div>
            <div>
              <label className="form-label">Unit Number</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((u) => <option key={u} value={u}>Unit {u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">URL Slug</label>
            <input type="text" className="form-input" placeholder="e.g. cpu-scheduling" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>

          <div>
            <label className="form-label">Visualization Engine Type (UI/UX Spec Section 35)</label>
            <select className="form-select" value={visualizationType} onChange={(e) => setVisualizationType(e.target.value)}>
              <option value="PROCESS_SCHEDULER">ProcessScheduler (CPU Scheduling / Gantt)</option>
              <option value="TREE_VISUALIZER">TreeVisualizer (AVL / BST / Balanced Trees)</option>
              <option value="DEADLOCK_GRAPH">DeadlockGraph (Banker's Algorithm & RAG)</option>
              <option value="PAGE_REPLACEMENT">PageReplacement (Virtual Memory & Paging)</option>
              <option value="PACKET_FLOW">PacketFlow (TCP 3-Way Handshake & Protocols)</option>
              <option value="PIPELINE_VISUALIZER">PipelineVisualizer (Compiler 6-Stage Pipeline)</option>
              <option value="NORMALIZATION_ENGINE">NormalizationEngine (DBMS 1NF-3NF & B+ Tree)</option>
              <option value="SORTING_VISUALIZER">SortingVisualizer (QuickSort & MergeSort)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Module Overview / Description</label>
            <textarea className="form-textarea" rows={3} placeholder="Explain what students will manipulate and observe..." value={overview} onChange={(e) => setOverview(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish to Atlas'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
