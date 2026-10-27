'use client';

import React, { useState } from 'react';
import { Database, Search, ArrowRight, Layers, Table, CheckCircle2 } from 'lucide-react';
import { AtlasControls } from '../AtlasControls';

export function NormalizationVisualizer() {
  const [viewMode, setViewMode] = useState<'NORMALIZATION' | 'BPLUS_TREE'>('NORMALIZATION');
  const [activeNF, setActiveNF] = useState<number>(3); // 1, 2, 3
  const [bTreeKey, setBTreeKey] = useState<number>(25);
  const [bTreeStep, setBTreeStep] = useState<number>(0);

  const normalizationSteps = [
    {
      level: '1NF',
      title: 'First Normal Form (1NF)',
      rule: 'Eliminate repeating groups & ensure every column contains only atomic (indivisible) values.',
      tables: [
        {
          name: 'STUDENT_COURSES (1NF)',
          columns: ['StudentID', 'CourseID', 'StudentName', 'CourseName', 'Instructor', 'DeptID', 'DeptHead'],
          rows: [
            ['101', 'CS701', 'Arun Kumar', 'Operating Systems', 'Dr. Kumar', 'D01', 'Dr. Rao'],
            ['101', 'CS702', 'Arun Kumar', 'DBMS', 'Prof. Sunitha', 'D01', 'Dr. Rao'],
            ['102', 'CS701', 'Bhavana R', 'Operating Systems', 'Dr. Kumar', 'D01', 'Dr. Rao'],
          ],
          anomaly: 'High Redundancy: StudentName and DeptHead are duplicated for every enrolled course.',
        },
      ],
    },
    {
      level: '2NF',
      title: 'Second Normal Form (2NF)',
      rule: 'Must be in 1NF and have NO Partial Dependencies (no non-prime attribute may depend on part of composite key {StudentID, CourseID}).',
      tables: [
        {
          name: 'STUDENTS (2NF)',
          columns: ['StudentID', 'StudentName', 'DeptID', 'DeptHead'],
          rows: [
            ['101', 'Arun Kumar', 'D01', 'Dr. Rao'],
            ['102', 'Bhavana R', 'D01', 'Dr. Rao'],
          ],
        },
        {
          name: 'ENROLLMENTS (2NF)',
          columns: ['StudentID', 'CourseID', 'Grade'],
          rows: [
            ['101', 'CS701', 'A'],
            ['101', 'CS702', 'A+'],
            ['102', 'CS701', 'B+'],
          ],
        },
        {
          name: 'COURSES (2NF)',
          columns: ['CourseID', 'CourseName', 'Instructor'],
          rows: [
            ['CS701', 'Operating Systems', 'Dr. Kumar'],
            ['CS702', 'DBMS', 'Prof. Sunitha'],
          ],
        },
      ],
      anomaly: 'Transitive Dependency remaining: StudentID -> DeptID -> DeptHead in STUDENTS table.',
    },
    {
      level: '3NF',
      title: 'Third Normal Form (3NF)',
      rule: 'Must be in 2NF and have NO Transitive Dependencies (non-prime attributes must depend directly on candidate keys only).',
      tables: [
        {
          name: 'STUDENTS (3NF)',
          columns: ['StudentID', 'StudentName', 'DeptID'],
          rows: [
            ['101', 'Arun Kumar', 'D01'],
            ['102', 'Bhavana R', 'D01'],
          ],
        },
        {
          name: 'DEPARTMENTS (3NF)',
          columns: ['DeptID', 'DeptHead'],
          rows: [['D01', 'Dr. Rao']],
        },
        {
          name: 'COURSES (3NF)',
          columns: ['CourseID', 'CourseName', 'Instructor'],
          rows: [
            ['CS701', 'Operating Systems', 'Dr. Kumar'],
            ['CS702', 'DBMS', 'Prof. Sunitha'],
          ],
        },
        {
          name: 'ENROLLMENTS (3NF)',
          columns: ['StudentID', 'CourseID', 'Grade'],
          rows: [
            ['101', 'CS701', 'A'],
            ['101', 'CS702', 'A+'],
            ['102', 'CS701', 'B+'],
          ],
        },
      ],
      anomaly: 'Zero Insertion, Update, or Deletion anomalies! Fully normalized relational schema.',
    },
  ];

  const currentNF = normalizationSteps[activeNF - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mode Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          background: 'var(--surface-2)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setViewMode('NORMALIZATION')}
          className={`btn btn-sm ${viewMode === 'NORMALIZATION' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: '1 1 auto', minHeight: '36px', justifyContent: 'center' }}
        >
          <Table size={14} /> Relational Normalization (1NF → 3NF)
        </button>
        <button
          onClick={() => setViewMode('BPLUS_TREE')}
          className={`btn btn-sm ${viewMode === 'BPLUS_TREE' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: '1 1 auto', minHeight: '36px', justifyContent: 'center' }}
        >
          <Database size={14} /> B+ Tree Indexing Engine
        </button>
      </div>

      {viewMode === 'NORMALIZATION' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Normal Form Level Selector */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              STAGE:
            </span>
            {[1, 2, 3].map((nf) => (
              <button
                key={nf}
                onClick={() => setActiveNF(nf)}
                className={`btn btn-sm ${activeNF === nf ? 'btn-primary' : 'btn-secondary'}`}
              >
                {nf}NF
              </button>
            ))}
          </div>

          {/* Canvas Box */}
          <div
            className="tech-grid-bg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div className="tech-coordinate">{currentNF.title.toUpperCase()}</div>
              <span className="badge badge-accent">{currentNF.level} SCHEMA</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <strong>Rule: </strong> {currentNF.rule}
            </p>

            {/* Tables Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {currentNF.tables.map((tbl, tIdx) => (
                <div
                  key={tIdx}
                  style={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: 'var(--accent-hover)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {tbl.name}
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          {tbl.columns.map((c, cIdx) => (
                            <th key={cIdx} style={{ padding: '6px 8px' }}>
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            {row.map((val, vIdx) => (
                              <td key={vIdx} style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Anomaly Analysis Footer */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: activeNF === 3 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${activeNF === 3 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: activeNF === 3 ? 'var(--success)' : 'var(--warning)',
              }}
            >
              {currentNF.anomaly}
            </div>
          </div>
        </div>
      ) : (
        /* B+ Tree Indexing Interactive Canvas */
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
            <div className="tech-coordinate">B+ TREE ROOT-TO-LEAF SEARCH PATH</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TARGET KEY:</span>
              <span className="badge badge-accent">KEY: {bTreeKey}</span>
            </div>
          </div>

          {/* SVG B+ Tree Representation */}
          <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '16px 0', width: '100%', maxWidth: '100%' }}>
            <svg width="100%" height="auto" viewBox="0 0 500 200" style={{ maxWidth: '500px', minWidth: '260px' }}>
              {/* Root Node [ 30 ] */}
              <rect x="200" y="20" width="100" height="34" rx="4" fill="var(--surface-1)" stroke="var(--accent)" strokeWidth="2" />
              <text x="250" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">Key: 30</text>

              {/* Branch lines */}
              <line x1="220" y1="54" x2="120" y2="100" stroke="var(--border)" strokeWidth="2" />
              <line x1="280" y1="54" x2="380" y2="100" stroke="var(--border)" strokeWidth="2" />

              {/* Left Child [ 15 | 25 ] (Visited since 25 < 30) */}
              <rect
                x="70"
                y="100"
                width="100"
                height="34"
                rx="4"
                fill="var(--surface-2)"
                stroke="#22C55E"
                strokeWidth="2"
              />
              <text x="120" y="122" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="bold">
                [ 15 | 25 ]
              </text>

              {/* Right Child [ 45 | 60 ] */}
              <rect x="330" y="100" width="100" height="34" rx="4" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="380" y="122" textAnchor="middle" fill="var(--text-muted)" fontSize="13">
                [ 45 | 60 ]
              </text>

              {/* Leaf Nodes */}
              <line x1="120" y1="134" x2="120" y2="160" stroke="#22C55E" strokeWidth="2" />
              <rect x="50" y="160" width="140" height="30" rx="4" fill="var(--surface-3)" stroke="#22C55E" strokeWidth="2" />
              <text x="120" y="180" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                Leaf Page (Records 15, 25)
              </text>
            </svg>
          </div>

          <div
            style={{
              padding: '12px 16px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            <CheckCircle2 size={16} color="var(--success)" style={{ display: 'inline', marginRight: '6px' }} />
            Search for Key <strong>{bTreeKey}</strong>: Root inspection shows 25 &lt; 30, following left pointer to intermediate page [15 | 25], directly locating leaf page record in <strong>O(log n) disk I/O operations</strong> instead of scanning thousands of table blocks!
          </div>
        </div>
      )}
    </div>
  );
}
