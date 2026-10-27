'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AtlasTopic, Branch } from '@/lib/types';
import { Card, Badge, Button, AtlasAmbientBackground, AtlasEmptyState } from '@/components/ui';
import { fetchWithFastCache, getCachedData } from '@/lib/api-cache';
import {
  Compass,
  ArrowRight,
  Layers,
  Cpu,
  Search,
  Sparkles,
  BookOpen,
  ChevronRight,
  Check,
  X,
  Filter,
} from 'lucide-react';

const LEARNING_MODES = [
  { id: 'ALL', label: 'All Modes' },
  { id: 'INTERACTIVE', label: 'Interactive Lab' },
  { id: 'STANDARD_CONTENT', label: 'Standard Theory' },
  { id: 'SIMULATION', label: 'Simulation' },
  { id: 'VISUAL_EXPLANATION', label: 'Visual Explanation' },
];

export default function AtlasCatalogPage() {
  const cachedTopics = getCachedData<any>('/api/atlas');
  const cachedStructure = getCachedData<any>('/api/academic/structure');

  const [topics, setTopics] = useState<AtlasTopic[]>(() => cachedTopics?.data || []);
  const [branches, setBranches] = useState<Branch[]>(() => cachedStructure?.data?.branches || []);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedLearningType, setSelectedLearningType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeFilterSheet, setActiveFilterSheet] = useState<'dept' | 'mode' | 'subject' | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !cachedTopics?.data);

  useEffect(() => {
    async function loadData() {
      try {
        const [tJson, bJson] = await Promise.all([
          fetchWithFastCache<any>('/api/atlas'),
          fetchWithFastCache<any>('/api/academic/structure'),
        ]);
        if (tJson?.success) setTopics(tJson.data);
        if (bJson?.success && bJson.data?.branches) setBranches(bJson.data.branches);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute available departments dynamically from both topics and branches
  const branchCodes = branches.map((b) => b.code);
  const topicDepts = topics.map((t) => t.department || '').filter(Boolean);
  const availableDepts = ['ALL', ...Array.from(new Set([...branchCodes, ...topicDepts]))];

  // Compute unique subjects dynamically based on active department filter
  const subjects = [
    'ALL',
    ...Array.from(
      new Set(
        topics
          .filter((t) => selectedDept === 'ALL' || t.department === selectedDept)
          .map((t) => t.subjectName || '')
          .filter(Boolean)
      )
    ),
  ];

  const filteredTopics = topics.filter((t) => {
    if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
    if (selectedSubject !== 'ALL' && t.subjectName !== selectedSubject) return false;
    if (selectedLearningType !== 'ALL' && (t.learningType || 'INTERACTIVE') !== selectedLearningType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const codeMatch = t.classroomCode?.toLowerCase().includes(q);
      const titleMatch = t.title.toLowerCase().includes(q);
      const conceptMatch = t.concept?.toLowerCase().includes(q);
      const deptMatch = t.department?.toLowerCase().includes(q);
      const subMatch = t.subjectName?.toLowerCase().includes(q);
      if (!codeMatch && !titleMatch && !conceptMatch && !deptMatch && !subMatch) return false;
    }
    return true;
  });

  return (
    <main
      className="mobile-nav-pad"
      style={{
        flex: 1,
        padding: '24px clamp(16px, 2.5vw, 32px) 80px',
        maxWidth: '1440px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
        {/* Header Hero with Ambient System (Medium Intensity + Orbital Motif) */}
        <div
          className="atlas-page-header"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-1)',
            padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
            marginBottom: '24px',
            boxSizing: 'border-box',
          }}
        >
          <AtlasAmbientBackground
            intensity="medium"
            contained
            showGrid
            showShapes
            showGlow
            showOrbital
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
            <div className="tech-coordinate" style={{ marginBottom: '6px' }}>
              <Compass size={14} /> CORE PRODUCT DIFFERENTIATOR
            </div>
            <h1 className="text-page-title" style={{ margin: '0 0 6px' }}>
              Interactive Engineering Atlas
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              Extensible multi-department engineering catalog. Step through mechanisms, manipulate parameters, observe outcomes, and master complex engineering concepts through data-driven visual engines.
            </p>
          </div>
        </div>

        {/* Global Filter & Search Bar */}
        <div
          className="atlas-filter-wrapper"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: ' clamp(14px, 2vw, 20px)',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Search Input Row (Shared Mobile & Desktop) */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1, position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search concepts, topics, or code (e.g. CPU Scheduling)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                Clear
              </button>
            )}
          </div>

          {/* Desktop Filter Pills (Hidden on Mobile) */}
          <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Department Pills */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', minWidth: '55px' }}>
                BRANCH:
              </span>
              {availableDepts.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setSelectedSubject('ALL');
                  }}
                  className={`btn btn-sm ${selectedDept === dept ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {dept === 'ALL' ? 'All Departments' : dept}
                </button>
              ))}
            </div>

            {/* Learning Type Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', minWidth: '55px' }}>
                MODE:
              </span>
              {LEARNING_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedLearningType(mode.id)}
                  className={`btn btn-sm ${selectedLearningType === mode.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Subject Pills (when subject filter has items) */}
            {subjects.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', minWidth: '55px' }}>
                  SUBJECT:
                </span>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`btn btn-sm ${selectedSubject === sub ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {sub === 'ALL' ? 'All Subjects' : sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Filter Controls (Compact Mobile-First Presentation) */}
          <div className="mobile-only" style={{ display: 'none', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--surface-container-low, #0F141D)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '4px 12px',
              }}
            >
              {/* Department Row */}
              <button
                type="button"
                onClick={() => setActiveFilterSheet('dept')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Department
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: selectedDept !== 'ALL' ? 'var(--primary, #6366F1)' : 'var(--text-muted)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {selectedDept === 'ALL' ? 'All Departments' : selectedDept}
                  <ChevronRight size={15} color="var(--text-muted)" />
                </span>
              </button>

              {/* Mode Row */}
              <button
                type="button"
                onClick={() => setActiveFilterSheet('mode')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: subjects.length > 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Mode
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: selectedLearningType !== 'ALL' ? 'var(--primary, #6366F1)' : 'var(--text-muted)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {LEARNING_MODES.find((m) => m.id === selectedLearningType)?.label || 'All Modes'}
                  <ChevronRight size={15} color="var(--text-muted)" />
                </span>
              </button>

              {/* Subject Row */}
              {subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveFilterSheet('subject')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Subject
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: selectedSubject !== 'ALL' ? 'var(--primary, #6366F1)' : 'var(--text-muted)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedSubject === 'ALL' ? 'All Subjects' : selectedSubject}
                    <ChevronRight size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </span>
                </button>
              )}
            </div>

            {/* Active Filter Clear Prompt (Mobile) */}
            {(selectedDept !== 'ALL' || selectedLearningType !== 'ALL' || selectedSubject !== 'ALL') && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDept('ALL');
                    setSelectedLearningType('ALL');
                    setSelectedSubject('ALL');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent, #6366F1)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '2px 4px',
                  }}
                >
                  Reset Active Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Atlas Modules Grid */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="tech-coordinate" style={{ color: 'var(--text-muted)' }}>
            AVAILABLE CURRICULUM MODULES ({filteredTopics.length})
          </span>
        </div>

        {filteredTopics.length === 0 ? (
          <AtlasEmptyState
            icon={<Compass size={24} />}
            coordinate="// NO MATCHING MODULES"
            title="No Atlas Modules Match Your Filters"
            description="No active curriculum modules matched the selected branch, mode, or keyword parameters."
            actionText="Reset All Filters"
            onAction={() => {
              setSelectedDept('ALL');
              setSelectedLearningType('ALL');
              setSelectedSubject('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '16px',
            }}
          >
            {filteredTopics.map((topic) => {
              const isStandard = topic.learningType === 'STANDARD_CONTENT' || !topic.visualizationType;
              return (
                <Card key={topic.id} hoverable className="ea-card">
                  <Link href={`/student/atlas/${topic.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {topic.department && (
                          <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                            {topic.department}
                          </span>
                        )}
                        <span className="badge badge-default" style={{ fontSize: '10px' }}>
                          UNIT {topic.unit}
                        </span>
                        {topic.classroomCode && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              padding: '2px 6px',
                              background: 'var(--surface-2)',
                              border: '1px solid var(--border)',
                              borderRadius: '4px',
                              color: 'var(--accent-hover)',
                            }}
                          >
                            {topic.classroomCode}
                          </span>
                        )}
                      </div>
                      <span className="tech-coordinate">{topic.estimatedTime}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {topic.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {topic.overview}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isStandard ? <BookOpen size={13} color="var(--text-muted)" /> : <Sparkles size={13} color="var(--accent-hover)" />}
                        <span style={{ textTransform: 'capitalize' }}>
                          {topic.learningType ? topic.learningType.toLowerCase().replace('_', ' ') : 'Interactive'}
                        </span>
                      </span>
                      <span style={{ color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        {isStandard ? 'Open Study Guide' : 'Enter Simulation'} <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        {/* Mobile Filter Bottom Sheet Dialog */}
        {activeFilterSheet && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setActiveFilterSheet(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--surface-1)',
                borderTop: '1px solid var(--border)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                padding: '20px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
                maxHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {activeFilterSheet === 'dept' && 'Filter by Department'}
                  {activeFilterSheet === 'mode' && 'Filter by Learning Mode'}
                  {activeFilterSheet === 'subject' && 'Filter by Subject'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveFilterSheet(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Options Scrollable List */}
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeFilterSheet === 'dept' &&
                  availableDepts.map((dept) => {
                    const isSelected = selectedDept === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setSelectedDept(dept);
                          setSelectedSubject('ALL');
                          setActiveFilterSheet(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--surface-container-high, rgba(99, 102, 241, 0.12))' : 'transparent',
                          border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                          color: isSelected ? 'var(--primary, #6366F1)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minHeight: '44px',
                        }}
                      >
                        <span>{dept === 'ALL' ? 'All Departments' : dept}</span>
                        {isSelected && <Check size={18} color="var(--primary, #6366F1)" />}
                      </button>
                    );
                  })}

                {activeFilterSheet === 'mode' &&
                  LEARNING_MODES.map((mode) => {
                    const isSelected = selectedLearningType === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setSelectedLearningType(mode.id);
                          setActiveFilterSheet(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--surface-container-high, rgba(99, 102, 241, 0.12))' : 'transparent',
                          border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                          color: isSelected ? 'var(--primary, #6366F1)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minHeight: '44px',
                        }}
                      >
                        <span>{mode.label}</span>
                        {isSelected && <Check size={18} color="var(--primary, #6366F1)" />}
                      </button>
                    );
                  })}

                {activeFilterSheet === 'subject' &&
                  subjects.map((sub) => {
                    const isSelected = selectedSubject === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setSelectedSubject(sub);
                          setActiveFilterSheet(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--surface-container-high, rgba(99, 102, 241, 0.12))' : 'transparent',
                          border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                          color: isSelected ? 'var(--primary, #6366F1)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minHeight: '44px',
                        }}
                      >
                        <span>{sub === 'ALL' ? 'All Subjects' : sub}</span>
                        {isSelected && <Check size={18} color="var(--primary, #6366F1)" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>
    );
}
