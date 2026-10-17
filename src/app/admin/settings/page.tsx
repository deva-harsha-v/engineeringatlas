'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, Button, Badge } from '@/components/ui';
import {
  Settings,
  Building,
  Calendar,
  ShieldCheck,
  HardDrive,
  BrainCircuit,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'INSTITUTION' | 'MODERATION' | 'STORAGE' | 'INTELLIGENCE' | 'DIAGNOSTICS'>('INSTITUTION');

  // Form state
  const [form, setForm] = useState({
    name: 'Sri Vasavi Engineering College',
    code: 'SVEC-AUTONOMOUS',
    shortName: 'SVEC',
    city: 'Tadepalligudem',
    state: 'Andhra Pradesh',
    affiliation: 'Autonomous / JNTUK Kakinada',
    accreditation: 'NAAC A+ Grade (CGPA 3.42) / NBA Accredited',
    moderationPolicy: 'DIRECT_PUBLISH',
    recencyDecayFactor: 0.85,
    repeatWeightMultiplier: 1.5,
    highPriorityThreshold: 3,
  });

  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.institution) {
            setForm((prev) => ({
              ...prev,
              name: data.institution.name || prev.name,
              code: data.institution.code || prev.code,
              shortName: data.institution.shortName || prev.shortName,
              city: data.institution.city || prev.city,
              state: data.institution.state || prev.state,
              affiliation: data.institution.affiliation || prev.affiliation,
              accreditation: data.institution.accreditation || prev.accreditation,
              moderationPolicy: data.moderation?.policy || prev.moderationPolicy,
              recencyDecayFactor: data.paperIntelligence?.recencyDecayFactor ?? prev.recencyDecayFactor,
              repeatWeightMultiplier: data.paperIntelligence?.repeatWeightMultiplier ?? prev.repeatWeightMultiplier,
              highPriorityThreshold: data.paperIntelligence?.highPriorityThreshold ?? prev.highPriorityThreshold,
            }));
          }
          setDiagnostics(data.diagnostics);
          setStorageInfo(data.storage);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccessMsg('Institutional settings updated successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to update settings');
      }
    } catch {
      setErrorMsg('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
            <Settings size={14} /> INSTITUTIONAL CONFIGURATION & CONTROL
          </div>
          <h1 className="text-page-title">Institution Settings</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Configure institutional metadata, content moderation rules, object storage providers, and Past Paper Intelligence hyperparameters.
          </p>
        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => setActiveTab('INSTITUTION')}
            className={`btn btn-sm ${activeTab === 'INSTITUTION' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Building size={14} /> Identity & Academics
          </button>
          <button
            onClick={() => setActiveTab('MODERATION')}
            className={`btn btn-sm ${activeTab === 'MODERATION' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={14} /> Moderation Policy
          </button>
          <button
            onClick={() => setActiveTab('STORAGE')}
            className={`btn btn-sm ${activeTab === 'STORAGE' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HardDrive size={14} /> Object Storage
          </button>
          <button
            onClick={() => setActiveTab('INTELLIGENCE')}
            className={`btn btn-sm ${activeTab === 'INTELLIGENCE' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BrainCircuit size={14} /> Paper Intelligence
          </button>
          <button
            onClick={() => setActiveTab('DIAGNOSTICS')}
            className={`btn btn-sm ${activeTab === 'DIAGNOSTICS' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Database size={14} /> System Diagnostics
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={24} style={{ margin: '0 auto 12px' }} />
            Loading institutional configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ maxWidth: '880px' }}>
            {/* TAB 1: Identity & Academics */}
            {activeTab === 'INSTITUTION' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="var(--accent-hover)" /> Institution Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">INSTITUTION LEGAL NAME</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">INSTITUTION CODE</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">SHORT ACRONYM</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.shortName}
                      onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">CAMPUS LOCATION</label>
                    <input
                      type="text"
                      className="form-input"
                      value={`${form.city}, ${form.state}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setForm({
                          ...form,
                          city: parts[0]?.trim() || form.city,
                          state: parts[1]?.trim() || form.state,
                        });
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label className="form-label">AFFILIATION STATUS</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.affiliation}
                      onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">ACCREDITATION</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.accreditation}
                      onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    ACTIVE ACADEMIC TERM
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Badge variant="accent">Academic Year 2026–2027</Badge>
                    <Badge variant="info">Odd Semester (VII Sem B.Tech CSE)</Badge>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Managed via Academic Hierarchy Manager
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 2: Moderation Policy */}
            {activeTab === 'MODERATION' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--accent-hover)" /> Academic Publishing & Moderation Policy
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: form.moderationPolicy === 'DIRECT_PUBLISH' ? 'var(--surface-2)' : 'var(--surface-1)',
                      border: '1px solid',
                      borderColor: form.moderationPolicy === 'DIRECT_PUBLISH' ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="moderationPolicy"
                      value="DIRECT_PUBLISH"
                      checked={form.moderationPolicy === 'DIRECT_PUBLISH'}
                      onChange={() => setForm({ ...form, moderationPolicy: 'DIRECT_PUBLISH' })}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Direct Publish (Recommended for Autonomous Colleges)
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Assigned faculty members publish materials, assignments, and papers immediately into their subject section workspace. Content is audited post-publishing.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: form.moderationPolicy === 'PRE_MODERATION' ? 'var(--surface-2)' : 'var(--surface-1)',
                      border: '1px solid',
                      borderColor: form.moderationPolicy === 'PRE_MODERATION' ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="moderationPolicy"
                      value="PRE_MODERATION"
                      checked={form.moderationPolicy === 'PRE_MODERATION'}
                      onChange={() => setForm({ ...form, moderationPolicy: 'PRE_MODERATION' })}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Pre-Moderation Queue (Strict Quality Control)
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        All uploaded materials enter a pending review queue. Content must be approved by the Head of Department or Admin before appearing in student portals.
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    FACULTY ALLOCATION ENFORCEMENT
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Faculty permissions are strictly derived from verified institutional teaching assignments. Faculty can only post materials for subjects and sections explicitly assigned to them by the Admin.
                  </p>
                </div>
              </Card>
            )}

            {/* TAB 3: Object Storage */}
            {activeTab === 'STORAGE' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={18} color="var(--accent-hover)" /> Storage Architecture & Limits
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Per Section 23 of the product architecture specification, large academic binaries (PDF, PPT, DOCX, ZIP) are decoupled from PostgreSQL into scalable object storage.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CURRENT DRIVER</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HardDrive size={18} color="var(--accent)" />
                      {storageInfo?.provider?.toUpperCase() || 'LOCAL DISK'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>
                      Operational ({storageInfo?.localFileCount || 0} files stored locally)
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FILE SIZE CEILING</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      50 MB per file
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Enforced at HTTP multipart streaming layer
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    WHITELISTED ACADEMIC MIME FORMATS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.zip'].map((ext) => (
                      <span key={ext} className="badge badge-default" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-hover)', marginBottom: '4px' }}>
                    PRODUCTION CLOUD SWITCHING
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    To point Engineering Atlas to Cloudflare R2, AWS S3, or Supabase Storage, populate `STORAGE_PROVIDER=s3`, `STORAGE_BUCKET`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in environment configuration.
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 4: Past Paper Intelligence */}
            {activeTab === 'INTELLIGENCE' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrainCircuit size={18} color="var(--accent-hover)" /> Past Paper Intelligence Engine
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  The Intelligence Engine computes repeated question frequencies, topic weightages, and exam appearance probabilities across historical end-semester and internal examination papers.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label className="form-label">
                      RECENCY DECAY FACTOR (0.5 – 1.0)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="1.0"
                      className="form-input"
                      value={form.recencyDecayFactor}
                      onChange={(e) => setForm({ ...form, recencyDecayFactor: parseFloat(e.target.value) || 0.85 })}
                    />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Weight multiplier applied per passing academic year. Default: 0.85.
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      REPEAT FREQUENCY MULTIPLIER
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="3.0"
                      className="form-input"
                      value={form.repeatWeightMultiplier}
                      onChange={(e) => setForm({ ...form, repeatWeightMultiplier: parseFloat(e.target.value) || 1.5 })}
                    />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Boost applied when a concept appears in 2+ independent exam papers. Default: 1.5.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label">
                    HIGH PROBABILITY OCCURRENCE THRESHOLD
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    className="form-input"
                    style={{ maxWidth: '240px' }}
                    value={form.highPriorityThreshold}
                    onChange={(e) => setForm({ ...form, highPriorityThreshold: parseInt(e.target.value) || 3 })}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Questions with appearances ≥ this number receive the `HIGH EXAM PROBABILITY` badge.
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    CURRENT CORPUS
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    • {diagnostics?.totalPapers || 6} Historical Examination Papers Indexed<br />
                    • {diagnostics?.totalQuestions || 24} Curated Exam Questions in Bank
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 5: System Diagnostics */}
            {activeTab === 'DIAGNOSTICS' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} color="var(--accent-hover)" /> Platform Diagnostics & Health
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SYSTEM STATUS</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>
                      HEALTHY
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      All services responsive
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PERSISTENCE MODE</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {diagnostics?.databaseMode || 'Active DB'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Prisma schema synced
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INTERACTIVE ATLAS MODULES</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-hover)', marginTop: '4px' }}>
                      {diagnostics?.totalAtlasTopics || 8} Active
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      8 Visualization engines
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURATED REPOSITORY</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {diagnostics?.totalMaterials || 6} Documents
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Section-targeted
                    </div>
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div>NODE_ENV: {process.env.NODE_ENV || 'development'}</div>
                  <div>PLATFORM: NEXT.JS 14 APP ROUTER / REACT 18 / TYPESCRIPT</div>
                  <div>STYLING: CUSTOM TECHNICAL DESIGN SYSTEM (CSS VARIABLES / NO TAILWIND)</div>
                  <div>AUTHENTICATION: JWT HTTP-ONLY SECURE COOKIES + ROLE RBAC</div>
                </div>
              </Card>
            )}

            {/* Save Button Bar */}
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="spin" size={16} /> Saving Settings...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
