'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { Button, Badge } from '@/components/ui';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft, Clock, Award } from 'lucide-react';

interface QuizRunnerProps {
  subjectName: string;
  topicTitle?: string;
  questions: Question[];
  onFinish?: (score: number) => void;
}

export function QuizRunner({ subjectName, topicTitle, questions, onFinish }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, startTime]);

  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        No questions available for this module yet.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const isAnswered = submittedQuestions[currentIndex];

  const handleSelectOption = (idxStr: string) => {
    if (isAnswered) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: idxStr });
  };

  const handleCheckAnswer = () => {
    if (selected === undefined) return;
    setSubmittedQuestions({ ...submittedQuestions, [currentIndex]: true });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      if (onFinish) {
        let correctCount = 0;
        questions.forEach((q, idx) => {
          if (selectedAnswers[idx] === q.correctAnswer) correctCount++;
        });
        const pct = Math.round((correctCount / questions.length) * 100);
        onFinish(pct);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setIsCompleted(false);
  };

  // Results calculation
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswer) correctCount++;
  });
  const incorrectCount = questions.length - correctCount;
  const scorePct = Math.round((correctCount / questions.length) * 100);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  if (isCompleted) {
    return (
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 28px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--accent-subtle)', borderRadius: '50%', marginBottom: '16px' }}>
          <Award size={42} color="var(--accent-hover)" />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Your Result</h2>
        <div style={{ fontSize: '56px', fontWeight: 800, color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)' }}>
          {scorePct}%
        </div>

        {/* Score Breakdown (Matching UI/UX Spec Page 12, Section 23) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            margin: '28px 0',
            textAlign: 'center',
          }}
        >
          <div className="ea-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CORRECT</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>{correctCount}</div>
          </div>
          <div className="ea-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INCORRECT</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--error)' }}>{incorrectCount}</div>
          </div>
          <div className="ea-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TIME</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {timeFormatted}
            </div>
          </div>
        </div>

        {/* Topics Performance Breakdown */}
        <div
          style={{
            textAlign: 'left',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '28px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', marginBottom: '8px' }}>
              Strong Topics
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              ✓ Scheduling Algorithms<br />
              ✓ Context Switching
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--warning)', marginBottom: '8px' }}>
              Needs Revision
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              ! Deadlock Avoidance<br />
              ! Virtual Memory Paging
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Button variant="secondary" onClick={handleRestart}>
            <RotateCcw size={15} /> Practice Again
          </Button>
          <Button variant="primary" onClick={handleRestart}>
            Review Mistakes
          </Button>
        </div>
      </div>
    );
  }

  const options: string[] = Array.isArray(currentQ.options)
    ? currentQ.options
    : typeof currentQ.options === 'string'
    ? JSON.parse(currentQ.options)
    : [];

  const isCorrect = selected === currentQ.correctAnswer;

  return (
    <div
      style={{
        maxWidth: '740px',
        margin: '0 auto',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(16px, 3.5vw, 28px)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="tech-coordinate" style={{ fontSize: '12px' }}>
            {subjectName.toUpperCase()} · {topicTitle || currentQ.topic}
          </span>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Question {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {questions.length < 10 ? `0${questions.length}` : questions.length}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={13} /> {timeFormatted}
          </span>
          <Badge variant={currentQ.difficulty === 'HARD' ? 'error' : currentQ.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
            {currentQ.difficulty}
          </Badge>
        </div>
      </div>

      {/* Question Text */}
      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '24px' }}>
        {currentQ.questionText}
      </div>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {options.map((optText, optIdx) => {
          const optKey = optIdx.toString();
          const isThisSelected = selected === optKey;
          const isThisAnswerCorrect = currentQ.correctAnswer === optKey;

          let optionStyle = {
            padding: '14px 18px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            cursor: isAnswered ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            transition: 'all 0.15s ease',
          };

          if (isAnswered) {
            if (isThisAnswerCorrect) {
              optionStyle = {
                ...optionStyle,
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid var(--success)',
              };
            } else if (isThisSelected && !isThisAnswerCorrect) {
              optionStyle = {
                ...optionStyle,
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid var(--error)',
              };
            }
          } else if (isThisSelected) {
            optionStyle = {
              ...optionStyle,
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent)',
            };
          }

          return (
            <div
              key={optIdx}
              onClick={() => handleSelectOption(optKey)}
              style={optionStyle}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${isThisSelected ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isThisSelected && (
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </div>
              <span style={{ color: 'var(--text-primary)' }}>{optText}</span>
            </div>
          );
        })}
      </div>

      {/* Answer Explanation Box (After Answering) */}
      {isAnswered && (
        <div
          style={{
            background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {isCorrect ? (
              <>
                <CheckCircle2 size={16} color="var(--success)" />
                <span style={{ fontWeight: 600, color: 'var(--success)', fontSize: '14px' }}>Correct!</span>
              </>
            ) : (
              <>
                <XCircle size={16} color="var(--error)" />
                <span style={{ fontWeight: 600, color: 'var(--error)', fontSize: '14px' }}>Incorrect</span>
              </>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Navigation & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '18px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={14} /> Previous
        </Button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!isAnswered ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCheckAnswer}
              disabled={selected === undefined}
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleNext}>
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
