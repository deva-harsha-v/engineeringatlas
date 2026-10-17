'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Code2, GitFork, ArrowDown, FileCode, CheckCircle2 } from 'lucide-react';

export function CompilerPipelineVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const stages = [
    {
      name: 'Source Code Input',
      badge: 'PHASE 0',
      data: 'position = initial + rate * 60;',
      description: 'Raw character stream input entered by the programmer in a high-level language.',
    },
    {
      name: 'Lexical Analysis (Scanner)',
      badge: 'PHASE 1',
      data: '<id, 1> <=> <id, 2> <+> <id, 3> <*> <int, 60> <;>',
      description: 'Groups characters into meaningful lexemes and emits token stream. Strips comments and whitespace.',
      details: [
        'position -> Token(ID, "position")',
        '= -> Token(ASSIGN, "=")',
        'initial -> Token(ID, "initial")',
        '+ -> Token(PLUS, "+")',
        'rate -> Token(ID, "rate")',
        '* -> Token(MULT, "*")',
        '60 -> Token(NUM, 60)',
      ],
    },
    {
      name: 'Syntax Analysis (Parser)',
      badge: 'PHASE 2',
      data: 'Abstract Syntax Tree (AST)',
      description: 'Verifies syntactic structure against Context-Free Grammar (CFG) and builds the AST hierarchy.',
      ast: {
        op: '=',
        left: 'position',
        right: {
          op: '+',
          left: 'initial',
          right: {
            op: '*',
            left: 'rate',
            right: '60',
          },
        },
      },
    },
    {
      name: 'Semantic Analysis',
      badge: 'PHASE 3',
      data: 'Type Coercion & Symbol Table Verified',
      description: 'Checks semantic consistency (type compatibility, scope, array indices). Injects implicit float conversion for 60.',
      details: [
        'Symbol Table: position (float), initial (float), rate (float)',
        'Type Check: inttofloat(60) inserted to match float multiplication (*)',
      ],
    },
    {
      name: 'Intermediate Code Generation',
      badge: 'PHASE 4',
      data: 'Three-Address Code (TAC / Quadruples)',
      description: 'Generates machine-independent intermediate representation where instructions have at most three addresses.',
      code: [
        't1 = inttofloat(60)',
        't2 = rate * t1',
        't3 = initial + t2',
        'position = t3',
      ],
    },
    {
      name: 'Code Optimization',
      badge: 'PHASE 5',
      data: 'Peephole & Constant Folding Optimization',
      description: 'Transforms intermediate code to run faster and use less memory while preserving program semantics.',
      code: [
        't1 = rate * 60.0    // Constant converted at compile-time',
        'position = initial + t1',
      ],
    },
    {
      name: 'Target Code Generation',
      badge: 'PHASE 6',
      data: 'Target Machine Assembly Code',
      description: 'Maps variables to physical CPU registers and emits relocatable machine assembly instructions.',
      code: [
        'LDF  R2, rate        // Load rate into floating-point register R2',
        'MULF R2, #60.0       // Multiply R2 by 60.0',
        'LDF  R1, initial     // Load initial into R1',
        'ADDF R1, R2          // Add R2 to R1',
        'STF  position, R1    // Store result into position memory address',
      ],
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= stages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, stages.length]);

  const active = stages[currentStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pipeline Stages Navigation Stepper */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '12px 16px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          scrollbarWidth: 'none',
        }}
      >
        {stages.map((stage, idx) => {
          const isSelected = idx === currentStep;
          const isPast = idx < currentStep;

          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--accent)' : isPast ? 'var(--surface-3)' : 'transparent',
                color: isSelected ? '#FFFFFF' : isPast ? 'var(--text-secondary)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--accent-hover)' : 'var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{stage.badge}</span>
              <span className="desktop-only">{stage.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Canvas: Phase Transformation View */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="tech-coordinate">
            COMPILER PIPELINE ENGINE · {active.name.toUpperCase()}
          </div>
          <span className="badge badge-accent">{active.badge}</span>
        </div>

        {/* Phase Output Display Box */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {active.code && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {active.code.map((line, lIdx) => (
                <div key={lIdx} style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '16px' }}>0{lIdx + 1}</span>
                  <span style={{ color: line.startsWith('//') ? 'var(--text-muted)' : 'var(--accent-hover)' }}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          )}

          {active.details && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {active.details.map((d, dIdx) => (
                <div key={dIdx} style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  → <span style={{ color: 'var(--accent-hover)' }}>{d}</span>
                </div>
              ))}
            </div>
          )}

          {active.ast && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <svg width="280" height="160" viewBox="0 0 280 160">
                {/* Node = */}
                <circle cx="140" cy="25" r="18" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="2" />
                <text x="140" y="30" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">=</text>

                {/* Left Branch */}
                <line x1="130" y1="40" x2="70" y2="75" stroke="var(--border)" strokeWidth="2" />
                <rect x="35" y="70" width="70" height="26" rx="4" fill="var(--surface-2)" stroke="var(--border)" />
                <text x="70" y="87" textAnchor="middle" fill="var(--accent-hover)" fontSize="11">position</text>

                {/* Right Branch (+) */}
                <line x1="150" y1="40" x2="200" y2="75" stroke="var(--border)" strokeWidth="2" />
                <circle cx="200" cy="75" r="16" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="2" />
                <text x="200" y="80" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="bold">+</text>

                {/* Sub branches of + */}
                <line x1="190" y1="90" x2="160" y2="125" stroke="var(--border)" strokeWidth="2" />
                <rect x="130" y="120" width="60" height="24" rx="4" fill="var(--surface-2)" stroke="var(--border)" />
                <text x="160" y="136" textAnchor="middle" fill="var(--accent-hover)" fontSize="11">initial</text>

                <line x1="210" y1="90" x2="240" y2="125" stroke="var(--border)" strokeWidth="2" />
                <circle cx="240" cy="125" r="14" fill="var(--surface-3)" stroke="var(--accent)" strokeWidth="2" />
                <text x="240" y="130" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">*</text>
              </svg>
            </div>
          )}

          {!active.code && !active.details && !active.ast && (
            <div style={{ fontSize: '16px', color: 'var(--accent-hover)', fontWeight: 600 }}>
              {active.data}
            </div>
          )}
        </div>
      </div>

      {/* Narrative Card */}
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <CheckCircle2 size={16} color="var(--accent-hover)" />
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {active.name}
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {active.description}
        </p>
      </div>

      {/* Control Bar */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        onStepBackward={() => setCurrentStep((s) => Math.max(0, s - 1))}
        onStepForward={() => setCurrentStep((s) => Math.min(stages.length - 1, s + 1))}
        currentStep={currentStep + 1}
        totalSteps={stages.length}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={`Phase: ${active.name}`}
      />
    </div>
  );
}
