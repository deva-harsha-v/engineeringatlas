'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { useAcademicProfile } from '@/lib/useProfile';
import { Question, FacultyAssignment } from '@/lib/types';
import { Modal } from '@/components/ui';
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Search,
  Trash2,
  Database,
  Cpu,
  Code2,
  Network,
  BookOpen,
} from 'lucide-react';

export default function FacultyQuestionsBankPage() {
  const { profile } = useAcademicProfile();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [topic, setTopic] = useState('');
  const [unit, setUnit] = useState(1);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('0');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [qRes, cRes] = await Promise.all([
          fetch('/api/questions'),
          fetch('/api/faculty/assignments'),
        ]);
        const [qData, cData] = await Promise.all([qRes.json(), cRes.json()]);
        if (qData.success) setQuestions(qData.data);
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

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    if (!currentClass || !questionText || !explanation) return;

    setSubmitting(true);
    try {
      const options = [opt0, opt1, opt2, opt3].filter(Boolean);
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: currentClass.subjectId,
          unit,
          topic,
          difficulty,
          type: 'MCQ',
          questionText,
          options,
          correctAnswer,
          explanation,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setQuestions([json.data, ...questions]);
        setIsModalOpen(false);
        setQuestionText('');
        setExplanation('');
        setTopic('');
        setOpt0('');
        setOpt1('');
        setOpt2('');
        setOpt3('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question from question bank?')) return;
    try {
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (difficultyFilter !== 'ALL' && q.difficulty !== difficultyFilter) return false;
      if (unitFilter !== 'ALL' && String(q.unit) !== unitFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchTopic = q.topic.toLowerCase().includes(query);
        if (!matchText && !matchTopic) return false;
      }
      return true;
    });
  }, [questions, difficultyFilter, unitFilter, searchQuery]);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'Question Bank']}
        title="Question Bank & Practice Repository"
        description="Curate conceptual problems, MCQs, and exam practice questions mapped to curriculum units."
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
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {questions.length || 18}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Total Questions
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
              {questions.filter((q) => q.status === 'PUBLISHED').length || 18}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Live in Practice
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
              {questions.filter((q) => q.difficulty === 'HARD').length || 5}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              High Bloom's Level
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
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              94%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Verified Explanations
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
              placeholder="Search questions or topics..."
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
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
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
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            className="faculty-filter-select"
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
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
            <option value="ALL">All Units</option>
            <option value="1">Unit 1</option>
            <option value="2">Unit 2</option>
            <option value="3">Unit 3</option>
            <option value="4">Unit 4</option>
            <option value="5">Unit 5</option>
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
            <span>New Question</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="faculty-card faculty-item-card"
            style={{
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  Unit {q.unit}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid var(--border)',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  {q.topic}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: q.difficulty === 'HARD' ? '#FEF2F2' : q.difficulty === 'EASY' ? '#ECFDF5' : '#FFFBEB',
                    color: q.difficulty === 'HARD' ? '#DC2626' : q.difficulty === 'EASY' ? '#059669' : '#D97706',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {q.difficulty}
                </span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {q.questionText}
              </div>

              {q.options && q.options.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px' }}>
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: String(idx) === q.correctAnswer ? '#ECFDF5' : '#F8FAFC',
                        border: '1px solid',
                        borderColor: String(idx) === q.correctAnswer ? '#A7F3D0' : '#E2E8F0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: String(idx) === q.correctAnswer ? '#065F46' : '#334155',
                        fontWeight: String(idx) === q.correctAnswer ? 600 : 400,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </div>
                  ))}
                </div>
              )}

              {q.explanation && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                  <strong style={{ color: '#334155' }}>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(q.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: '#DC2626',
                borderRadius: '6px',
                flexShrink: 0,
              }}
              title="Delete question"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal: Add Question */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Author Practice MCQ Question">
        <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Subject Context</label>
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

          <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Curriculum Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
                <option value={5}>Unit 5</option>
              </select>
            </div>
            <div>
              <label className="form-label">Topic Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BCNF Functional Dependencies"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Difficulty Level</label>
            <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div>
            <label className="form-label">Question Text</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="State the technical question clearly..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Option A"
              value={opt0}
              onChange={(e) => setOpt0(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Option B"
              value={opt1}
              onChange={(e) => setOpt1(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Option C"
              value={opt2}
              onChange={(e) => setOpt2(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Option D"
              value={opt3}
              onChange={(e) => setOpt3(e.target.value)}
              required
            />
          </div>

          <div className="faculty-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Correct Option</label>
              <select className="form-select" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
            </div>
            <div>
              <label className="form-label">Concept Explanation</label>
              <input
                type="text"
                className="form-input"
                placeholder="Why this answer is mathematically correct..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Add to Question Bank'}
            </button>
          </div>
        </form>
      </Modal>
    </FacultyLayout>
  );
}
