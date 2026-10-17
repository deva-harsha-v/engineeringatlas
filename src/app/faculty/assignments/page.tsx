'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { Assignment } from '@/lib/types';
import { Button, Badge, EmptyState } from '@/components/ui';
import { Plus, Trash2, Clock, Download } from 'lucide-react';

export default function FacultyAssignmentsListPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/assignments');
        const json = await res.json();
        if (json.success) setAssignments(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      setAssignments(assignments.filter((a) => a.id !== id));
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
              COURSEWORK MANAGEMENT
            </div>
            <h1 className="text-page-title">Class Assignments</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Assignments published to your sections with deadlines and instructions.
            </p>
          </div>

          <Link href="/faculty/assignments/new">
            <Button variant="primary" size="sm">
              <Plus size={14} /> Create Assignment
            </Button>
          </Link>
        </div>

        {assignments.length === 0 ? (
          <EmptyState
            title="No Assignments Published"
            description="You haven't created any assignments for your classes yet."
            actionText="Create First Assignment"
            onAction={() => window.location.href = '/faculty/assignments/new'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="ea-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-accent">{asg.subjectName}</span>
                    <span className="badge badge-default">{asg.sectionName || 'CSE-A'}</span>
                    <span className="badge badge-default">UNIT {asg.unit || 1}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {asg.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {asg.description}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} /> Due: {new Date(asg.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {asg.fileUrl && (
                    <Button variant="secondary" size="sm" onClick={() => window.open(asg.fileUrl, '_blank')}>
                      <Download size={13} /> Sheet
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(asg.id)} style={{ color: 'var(--error)' }}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
