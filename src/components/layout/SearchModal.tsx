'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/router';
import { useRouter } from 'next/navigation';
import { Search, Compass, BookOpen, FileText, CheckCircle, ArrowRight, X } from 'lucide-react';
import { AtlasTopic, Material, QuestionPaper, Question, Subject } from '@/lib/types';

interface SearchResults {
  subjects: Subject[];
  atlasTopics: AtlasTopic[];
  materials: Material[];
  papers: QuestionPaper[];
  questions: Question[];
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open if closed
          const btn = document.getElementById('search-trigger-btn');
          btn?.click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const hasResults =
    results &&
    (results.atlasTopics.length > 0 ||
      results.materials.length > 0 ||
      results.papers.length > 0 ||
      results.questions.length > 0 ||
      results.subjects.length > 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 7, 13, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 16px 24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--surface-2)',
          }}
        >
          <Search size={20} color="var(--accent-hover)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search concepts, subjects, papers, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              width: '100%',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          )}
          <span
            style={{
              padding: '2px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Search Content */}
        <div style={{ maxHeight: '480px', overflowY: 'auto', padding: '16px' }}>
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Searching Engineering Atlas...
            </div>
          )}

          {!loading && !query && (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Type keywords like <span style={{ color: 'var(--accent-hover)' }}>"deadlock"</span>, <span style={{ color: 'var(--accent-hover)' }}>"cpu scheduling"</span>, or <span style={{ color: 'var(--accent-hover)' }}>"normalization"</span>
              </p>
            </div>
          )}

          {!loading && query && !hasResults && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for "{query}".
            </div>
          )}

          {!loading && results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Atlas Topics */}
              {results.atlasTopics.length > 0 && (
                <div>
                  <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
                    <Compass size={14} /> ATLAS TOPICS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.atlasTopics.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigateTo(`/student/atlas/${item.slug}`)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {item.subjectName || 'Engineering Atlas'} · {item.topic}
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--accent)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {results.subjects.length > 0 && (
                <div>
                  <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
                    <BookOpen size={14} /> SUBJECTS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.subjects.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => navigateTo(`/student/subjects/${sub.id}`)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <span className="badge badge-accent" style={{ marginRight: '8px' }}>{sub.code}</span>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{sub.name}</span>
                        </div>
                        <ArrowRight size={16} color="var(--accent)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {results.materials.length > 0 && (
                <div>
                  <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
                    <FileText size={14} /> MATERIALS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.materials.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => navigateTo(`/student/subjects/${m.subjectId}/materials`)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '13px' }}>{m.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {m.type} · {m.facultyName}
                          </div>
                        </div>
                        <span className="badge badge-default">{m.fileName.split('.').pop()?.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Questions */}
              {results.questions.length > 0 && (
                <div>
                  <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
                    <CheckCircle size={14} /> PRACTICE QUESTIONS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => navigateTo(`/student/practice/${q.subjectId}`)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-2)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{q.questionText}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Topic: {q.topic} · {q.difficulty}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
