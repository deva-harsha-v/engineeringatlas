'use client';

import React, { useState, useEffect } from 'react';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { Question, FacultyAssignment } from '@/lib/types';
import { Button, Badge, Modal, EmptyState } from '@/components/ui';
import { Plus, CheckSquare, Trash2, HelpCircle } from 'lucide-react';

export default function FacultyQuestionsBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ASSESSMENT REPOSITORY
            </div>
            <h1 className="text-page-title">Question Bank & Practice Items</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Curated multiple-choice and conceptual practice questions for student quizzes.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Add Practice Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            title="Question Bank Empty"
            description="Add conceptual MCQs with step explanations for student self-testing."
            actionText="Add Question"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions.map((q) => (
              <div key={q.id} className="ea-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-accent">{q.subjectName}</span>
                    <span className="badge badge-default">UNIT {q.unit}</span>
                    <span className="tech-coordinate">{q.topic}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(q.id)} style={{ color: 'var(--error)' }}>
                    <Trash2 size={13} />
                  </Button>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {q.questionText}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: 'var(--success)' }}>Explanation: </strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Practice Question">
        <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Subject</label>
            <select className="form-select" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.subjectName} ({cls.subjectCode})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((u) => <option key={u} value={u}>Unit {u}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Topic</label>
              <input type="text" className="form-input" placeholder="e.g. CPU Scheduling" value={topic} onChange={(e) => setTopic(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Question Text</label>
            <textarea className="form-textarea" rows={2} placeholder="State the question clearly..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="form-label">Options (Select radio for correct answer)</label>
            {[
              { val: opt0, set: setOpt0, idx: '0' },
              { val: opt1, set: setOpt1, idx: '1' },
              { val: opt2, set: setOpt2, idx: '2' },
              { val: opt3, set: setOpt3, idx: '3' },
            ].map((opt) => (
              <div key={opt.idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="radio"
                  name="correctOpt"
                  checked={correctAnswer === opt.idx}
                  onChange={() => setCorrectAnswer(opt.idx)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Option ${Number(opt.idx) + 1}`}
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="form-label">Detailed Conceptual Explanation</label>
            <textarea className="form-textarea" rows={3} placeholder="Explain why the selected option is correct and why other options fail..." value={explanation} onChange={(e) => setExplanation(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save to Question Bank'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
