'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { FacultyPageHeader } from '@/components/layout/FacultyPageHeader';
import { FacultyAssignment, Material, Assignment, QuestionPaper, Announcement } from '@/lib/types';
import { saveStoredFacultyClassId } from '@/lib/useFacultyClass';
import { MaterialCard, AssignmentCard, PaperCard, AnnouncementCard } from '@/components/academic';
import { Modal } from '@/components/ui';
import {
  Upload,
  Plus,
  FileText,
  CheckSquare,
  Bell,
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  Database,
  Cpu,
  Code2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function FacultyClassWorkspacePage() {
  const params = useParams();
  const classId = params.classId as string;
  const router = useRouter();

  const [classInfo, setClassInfo] = useState<FacultyAssignment | null>(null);
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'ASSIGNMENTS' | 'PAPERS' | 'ANNOUNCEMENTS'>('MATERIALS');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('NOTES');
  const [uploadUnit, setUploadUnit] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const clsRes = await fetch('/api/faculty/assignments');
        if (clsRes.status === 401) {
          router.push('/faculty/login');
          return;
        }

        const clsData = await clsRes.json();
        const found = clsData.data.find((c: FacultyAssignment) => c.id === classId) || clsData.data[0];
        setClassInfo(found);

        if (found) {
          // Set as active class working context across the faculty portal!
          saveStoredFacultyClassId(found.id);

          const [mRes, aRes, pRes, annRes] = await Promise.all([
            fetch(`/api/materials?subjectId=${found.subjectId}`),
            fetch(`/api/assignments?subjectId=${found.subjectId}&sectionId=${found.sectionId}&status=ALL`),
            fetch(`/api/papers?subjectId=${found.subjectId}`),
            fetch(`/api/announcements?subjectId=${found.subjectId}`),
          ]);

          const [m, a, p, ann] = await Promise.all([
            mRes.json(),
            aRes.json(),
            pRes.json(),
            annRes.json(),
          ]);

          if (m.success) setMaterials(m.data);
          if (a.success) setAssignments(a.data);
          if (p.success) setPapers(p.data);
          if (ann.success) setAnnouncements(ann.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, router]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classInfo || !uploadTitle) return;

    setUploading(true);
    try {
      let fileUrl = '/uploads/sample_lecture_material.pdf';
      let fileName = `${uploadTitle.replace(/\s+/g, '_')}.pdf`;
      let fileSize = 2048000;
      let mimeType = 'application/pdf';

      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const upData = await upRes.json();
        if (upData.success) {
          fileUrl = upData.data.fileUrl;
          fileName = upData.data.fileName;
          fileSize = upData.data.fileSize;
          mimeType = upData.data.mimeType;
        }
      }

      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          type: uploadType,
          unit: uploadUnit,
          subjectId: classInfo.subjectId,
          sectionId: classInfo.sectionId,
          fileUrl,
          fileName,
          fileSize,
          mimeType,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMaterials([json.data, ...materials]);
        setIsUploadOpen(false);
        setUploadTitle('');
        setUploadFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const studentCount = classInfo?.studentsCount || (classInfo?.sectionName?.includes('B') ? 52 : classInfo?.sectionName?.includes('6') ? 45 : 48);

  return (
    <FacultyLayout>
      <FacultyPageHeader
        breadcrumbs={['Faculty', 'My Classes', classInfo?.subjectCode || 'Workspace']}
        title={`${classInfo?.subjectName || 'Class Workspace'} (${classInfo?.sectionName || 'Section'})`}
        description={`${classInfo?.subjectCode} · ${classInfo?.semesterName || 'VII Semester'} · Class Section Workspace & Teaching Repository`}
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
        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {studentCount}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Section Students
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {materials.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Study Materials
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7C3AED',
            }}
          >
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {assignments.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Coursework Tasks
            </div>
          </div>
        </div>

        <div className="faculty-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(234, 88, 12, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EA580C',
            }}
          >
            <Bell size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {announcements.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Class Notices
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div
        className="faculty-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          marginBottom: '24px',
          paddingBottom: '2px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div className="faculty-tabs-container" style={{ display: 'flex', gap: '8px' }}>
          {(['MATERIALS', 'ASSIGNMENTS', 'PAPERS', 'ANNOUNCEMENTS'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isActive ? '#2563EB' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>{tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: isActive ? '#2563EB' : 'var(--text-secondary)',
                  }}
                >
                  {tab === 'MATERIALS' && materials.length}
                  {tab === 'ASSIGNMENTS' && assignments.length}
                  {tab === 'PAPERS' && papers.length}
                  {tab === 'ANNOUNCEMENTS' && announcements.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="faculty-filter-action" style={{ display: 'flex', gap: '8px' }}>
          {activeTab === 'MATERIALS' && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn btn-primary btn-sm"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Upload size={14} />
              <span>Upload Material</span>
            </button>
          )}

          {activeTab === 'ASSIGNMENTS' && (
            <Link href="/faculty/assignments/new" style={{ textDecoration: 'none' }}>
              <button
                className="btn btn-primary btn-sm"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                <span>Create Assignment</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'MATERIALS' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {materials.map((mat) => (
              <MaterialCard key={mat.id} material={mat} />
            ))}
          </div>
        )}

        {activeTab === 'ASSIGNMENTS' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {assignments.map((asg) => (
              <AssignmentCard key={asg.id} assignment={asg} />
            ))}
          </div>
        )}

        {activeTab === 'PAPERS' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

        {activeTab === 'ANNOUNCEMENTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Material Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Class Material">
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>
              Material Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Unit 3 Normalization Notes"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>
                Resource Type
              </label>
              <select className="form-select" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                <option value="NOTES">Lecture Notes</option>
                <option value="PPT">Presentation Slides</option>
                <option value="LAB_MANUAL">Lab Manual</option>
                <option value="HANDOUT">Handout</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>
                Unit
              </label>
              <select className="form-select" value={uploadUnit} onChange={(e) => setUploadUnit(Number(e.target.value))}>
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
                <option value={5}>Unit 5</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>
              Select File (PDF / DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="form-input"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              {uploading ? 'Uploading...' : 'Publish to Section'}
            </button>
          </div>
        </form>
      </Modal>
    </FacultyLayout>
  );
}
