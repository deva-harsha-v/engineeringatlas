'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Calendar,
  User,
  ExternalLink,
  Clock,
  Compass,
  CheckSquare,
  AlertCircle,
  FileCode,
  BookOpen,
  Square,
} from 'lucide-react';
import { Subject, Material, Assignment, QuestionPaper, Announcement } from '@/lib/types';
import { Badge, Card, Button } from '@/components/ui';

// 1. SubjectCard
export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card hoverable className="ea-card">
      <Link href={`/student/subjects/${subject.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span className="badge badge-accent">{subject.code}</span>
          <span className="tech-coordinate" style={{ fontSize: '11px' }}>
            {subject.unitsCount} UNITS
          </span>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {subject.name}
        </h3>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {subject.description || 'Core engineering syllabus module.'}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px 14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            <Compass size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{subject.atlasCount || 0}</span>
            <span>Atlas</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            <FileText size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{subject.materialsCount || 0}</span>
            <span>Notes</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            <CheckSquare size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{subject.questionsCount || 0}</span>
            <span>Practice</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

// 2. MaterialCard (Matching UI/UX Spec Page 11, Section 20)
export function MaterialCard({ material }: { material: Material }) {
  const getFileBadge = (type: string, ext: string) => {
    switch (type) {
      case 'NOTES':
        return <Badge variant="accent">PDF · NOTES</Badge>;
      case 'PPT':
        return <Badge variant="warning">PPTX · SLIDES</Badge>;
      case 'LAB_MANUAL':
        return <Badge variant="success">LAB MANUAL</Badge>;
      default:
        return <Badge variant="default">{ext.toUpperCase() || 'FILE'}</Badge>;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleDownload = async () => {
    try {
      await fetch(`/api/materials/${material.id}/download`, { method: 'POST' });
    } catch (e) {
      // ignore
    }
    window.open(material.fileUrl, '_blank');
  };

  return (
    <Card className="ea-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div>
          {getFileBadge(material.type, material.fileName.split('.').pop() || 'pdf')}
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
            {material.title}
          </h4>
        </div>
      </div>

      {material.description && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
          {material.description}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{material.facultyName || 'Faculty'}</span>
          <span>·</span>
          <span>{formatBytes(material.fileSize)}</span>
          {material.downloadsCount > 0 && (
            <>
              <span>·</span>
              <span>{material.downloadsCount} downloads</span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={() => window.open(material.fileUrl, '_blank')}>
            <ExternalLink size={13} /> View
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            <Download size={13} /> Download
          </Button>
        </div>
      </div>
    </Card>
  );
}

// 3. AssignmentCard (Matching UI/UX Spec Page 11, Section 21)
export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDone(localStorage.getItem(`ea_asg_done_${assignment.id}`) === 'true');
    }
  }, [assignment.id]);

  const toggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isDone;
    setIsDone(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ea_asg_done_${assignment.id}`, String(nextState));
      window.dispatchEvent(new Event('ea-asg-updated'));
    }
  };

  const deadlineDate = new Date(assignment.deadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 3600));
  const diffDays = Math.ceil(diffHours / 24);

  let urgencyBadge;
  if (isDone) {
    urgencyBadge = (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success, #10b981)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
        Completed
      </span>
    );
  } else if (diffHours < 0) {
    urgencyBadge = (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: 'rgba(239, 68, 68, 0.12)', color: 'var(--error, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
        Overdue
      </span>
    );
  } else if (diffHours <= 24) {
    urgencyBadge = (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning, #f59e0b)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        Due Today
      </span>
    );
  } else if (diffHours <= 48) {
    urgencyBadge = (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning, #f59e0b)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        Due Tomorrow
      </span>
    );
  } else {
    urgencyBadge = <Badge variant="default">{diffDays} Days Remaining</Badge>;
  }

  return (
    <Card className="ea-card" style={{ opacity: isDone ? 0.72 : 1, transition: 'all 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <button
            onClick={toggleDone}
            aria-label={isDone ? 'Mark as incomplete' : 'Mark as completed'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isDone ? 'var(--success, #10b981)' : 'var(--text-muted)',
              padding: '2px 0 0 0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
          <div>
            <span className="badge badge-accent">UNIT {assignment.unit || 1}</span>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '8px',
                textDecoration: isDone ? 'line-through' : 'none',
              }}
            >
              {assignment.title}
            </h4>
          </div>
        </div>
        {urgencyBadge}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5, paddingLeft: '28px' }}>
        {assignment.description}
      </p>

      <div
        style={{
          background: 'var(--surface-2)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          marginBottom: '14px',
          borderLeft: '2px solid var(--accent)',
          marginLeft: '28px',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>Submission Method: </span>
        <span style={{ color: 'var(--text-primary)' }}>{assignment.submissionMethod}</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          paddingLeft: '28px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} /> Due: {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>

        {assignment.fileUrl && (
          <Button variant="secondary" size="sm" onClick={() => window.open(assignment.fileUrl, '_blank')}>
            <Download size={13} /> View Questions
          </Button>
        )}
      </div>
    </Card>
  );
}

// 4. PaperCard
export function PaperCard({ paper }: { paper: QuestionPaper }) {
  const getExamLabel = (type: string) => {
    switch (type) {
      case 'END_SEMESTER':
        return 'End Semester Examination';
      case 'INTERNAL_1':
        return 'Internal Exam 1 (Mid 1)';
      case 'INTERNAL_2':
        return 'Internal Exam 2 (Mid 2)';
      case 'MODEL_PAPER':
        return 'Model Practice Paper';
      default:
        return 'Question Paper';
    }
  };

  return (
    <Card className="ea-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
        <div>
          <span className="badge badge-accent">{paper.academicYear} ACADEMIC YEAR</span>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
            {paper.title}
          </h4>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {getExamLabel(paper.examType)} · {paper.subjectName}
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={() => window.open(paper.fileUrl, '_blank')}>
          <Download size={13} /> Download PDF
        </Button>
      </div>
    </Card>
  );
}

// 5. AnnouncementCard
export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const isHigh = announcement.priority === 'HIGH';
  return (
    <Card className="ea-card" style={{ borderLeft: isHigh ? '3px solid var(--accent)' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHigh && <Badge variant="accent">IMPORTANT NOTICE</Badge>}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {announcement.subjectName || 'Department Announcement'}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {new Date(announcement.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {announcement.title}
      </h4>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {announcement.content}
      </p>

      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
        Posted by {announcement.authorName || 'Academic Office'}
      </div>
    </Card>
  );
}
