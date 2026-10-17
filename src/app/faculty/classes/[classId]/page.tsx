'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FacultyNav } from '@/components/layout/FacultyNav';
import { FacultyAssignment, Material, Assignment, QuestionPaper, Announcement } from '@/lib/types';
import { Button, Badge, Card, EmptyState, Modal } from '@/components/ui';
import { MaterialCard, AssignmentCard, PaperCard, AnnouncementCard } from '@/components/academic';
import { Upload, Plus, FileText, CheckSquare, Bell, ArrowLeft, Users } from 'lucide-react';

export default function FacultyClassWorkspacePage() {
  const params = useParams();
  const classId = params.classId as string;
  const router = useRouter();

  const [classInfo, setClassInfo] = useState<FacultyAssignment | null>(null);
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'ASSIGNMENTS' | 'PAPERS' | 'QUESTIONS' | 'ANNOUNCEMENTS'>('MATERIALS');
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
          const [mRes, aRes, pRes, annRes] = await Promise.all([
            fetch(`/api/materials?subjectId=${found.subjectId}`),
            fetch(`/api/assignments?subjectId=${found.subjectId}&sectionId=${found.sectionId}`),
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
          fileUrl,
          fileName,
          fileSize,
          mimeType,
          subjectId: classInfo.subjectId,
          sectionId: classInfo.sectionId,
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <FacultyNav />
        <div className="ea-container" style={{ padding: '64px 16px', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '240px', maxWidth: '800px', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FacultyNav />

      <main className="ea-container" style={{ flex: 1, padding: '32px 16px 64px' }}>
        {/* Header (Matching UI/UX Spec Page 14, Section 27) */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/faculty"
            style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
          >
            ← Back to Faculty Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="text-page-title">{classInfo?.subjectName || 'Class Workspace'}</h1>
                <span className="badge badge-accent">{classInfo?.sectionName}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{classInfo?.subjectCode}</span>
                <span>·</span>
                <span>{classInfo?.semesterName || 'VII Semester'}</span>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-hover)' }}>
                  <Users size={14} /> Students: 64
                </span>
              </div>
            </div>

            <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)}>
              <Upload size={14} /> Upload Material
            </Button>
          </div>
        </div>

        {/* Workspace Tabs (Matching UI/UX Spec Page 14, Section 27) */}
        <div className="tabs-container" style={{ marginBottom: '28px' }}>
          <button
            className={`tab-item ${activeTab === 'MATERIALS' ? 'active' : ''}`}
            onClick={() => setActiveTab('MATERIALS')}
          >
            Materials ({materials.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'ASSIGNMENTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ASSIGNMENTS')}
          >
            Assignments ({assignments.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'PAPERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('PAPERS')}
          >
            Question Papers ({papers.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'ANNOUNCEMENTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
          >
            Announcements ({announcements.length})
          </button>
        </div>

        {/* Tab 1: Materials */}
        {activeTab === 'MATERIALS' && (
          <div>
            {materials.length === 0 ? (
              <EmptyState
                title="No Materials Uploaded"
                description="Upload lecture notes, slides, or manuals for this class."
                actionText="Upload Material"
                onAction={() => setIsUploadOpen(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {materials.map((m) => (
                  <MaterialCard key={m.id} material={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Assignments */}
        {activeTab === 'ASSIGNMENTS' && (
          <div>
            {assignments.length === 0 ? (
              <EmptyState
                title="No Assignments Created"
                description="Create problem sheets or tutorials for this class."
                actionText="Create Assignment"
                onAction={() => router.push('/faculty/assignments/new')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {assignments.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Papers */}
        {activeTab === 'PAPERS' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {papers.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Announcements */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        )}
      </main>

      {/* Upload Material Modal (Matching UI/UX Spec Page 15, Section 28) */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Academic Material">
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Material Type</label>
            <select
              className="form-select"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
            >
              <option value="NOTES">Lecture Notes</option>
              <option value="PPT">Presentation Slides (PPT/PPTX)</option>
              <option value="LAB_MANUAL">Lab Manual</option>
              <option value="REFERENCE">Reference Material</option>
            </select>
          </div>

          <div>
            <label className="form-label">Unit</label>
            <select
              className="form-select"
              value={uploadUnit}
              onChange={(e) => setUploadUnit(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((u) => (
                <option key={u} value={u}>Unit {u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Material Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CPU Scheduling Notes"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              required
            />
          </div>

          {/* Automatic Academic Context Notice (Derived from faculty assignment) */}
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Visible to: <strong style={{ color: 'var(--accent-hover)' }}>{classInfo?.sectionName}</strong> · {classInfo?.subjectName} (Automatically populated from your teaching assignment).
          </div>

          <div>
            <label className="form-label">Select File (PDF, PPT, DOC, XLS up to 50MB)</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Publishing...' : 'Publish Material'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
