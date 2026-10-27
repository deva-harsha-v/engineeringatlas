'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AuthUser } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { Users, Plus, Mail, Building, UserCheck, UploadCloud, AlertCircle, CheckCircle, FileText, Key } from 'lucide-react';

interface PreviewRow {
  row: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  initialPassword?: string;
  mustChangePassword?: boolean;
}

interface RowError {
  row: number;
  email?: string;
  error: string;
}

export default function AdminFacultyDirectoryPage() {
  const [facultyList, setFacultyList] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Single Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [submitting, setSubmitting] = useState(false);

  // Bulk Import Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('password123');
  const [validating, setValidating] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  const fetchFaculty = async () => {
    try {
      const res = await fetch('/api/faculty');
      const json = await res.json();
      if (json.success) setFacultyList(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, department, designation }),
      });
      const json = await res.json();
      if (json.success) {
        setFacultyList([...facultyList, json.data]);
        setIsModalOpen(false);
        setName('');
        setEmail('');
      } else {
        alert(json.error || 'Failed to create faculty member');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateCsv = async () => {
    if (!csvContent.trim()) return;
    setValidating(true);
    setRowErrors([]);
    setPreviewRows([]);
    setImportSuccessMessage(null);

    try {
      const res = await fetch('/api/faculty/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv: csvContent,
          defaultPassword,
          validateOnly: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewRows(data.preview || []);
        setRowErrors(data.errors || []);
      } else {
        alert(data.error || 'Validation failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error validating CSV');
    } finally {
      setValidating(false);
    }
  };

  const handleCommitBulk = async () => {
    if (previewRows.length === 0) return;
    setCommitting(true);
    setImportSuccessMessage(null);

    try {
      const res = await fetch('/api/faculty/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv: csvContent,
          defaultPassword,
          validateOnly: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImportSuccessMessage(
          `Successfully provisioned ${data.createdCount} faculty accounts with enforced first-login password reset.`
        );
        setPreviewRows([]);
        setRowErrors(data.errors || []);
        fetchFaculty();
      } else {
        alert(data.error || 'Commit failed');
      }
    } catch (err: any) {
      alert(err.message || 'Commit error');
    } finally {
      setCommitting(false);
    }
  };

  const loadSampleTemplate = () => {
    const sample = `Name, Email, Department, Designation, InitialPassword
Dr. V. Srinivasa Rao, srinivasa.cse@svec.edu, Computer Science & Engineering, Associate Professor, password123
Prof. M. Kalyani, kalyani.ece@svec.edu, Electronics & Communication Engineering, Assistant Professor, password123
Dr. T. Satyanarayana, satya.eee@svec.edu, Electrical & Electronics Engineering, Professor, password123`;
    setCsvContent(sample);
  };

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.department && f.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACADEMIC STAFF REGISTRY
            </div>
            <h1 className="text-page-title">Faculty Directory</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage teaching credentials, department affiliations, bulk onboarding, and security standing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsBulkModalOpen(true);
                setPreviewRows([]);
                setRowErrors([]);
                setImportSuccessMessage(null);
              }}
            >
              <UploadCloud size={14} /> Bulk Import (CSV)
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} /> Add Faculty Member
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search faculty by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
          {filteredFaculty.map((f) => (
            <Card key={f.id} className="ea-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.designation}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {f.mustChangePassword && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'rgba(234, 179, 8, 0.15)',
                        color: 'var(--warning)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        fontSize: '10px',
                      }}
                      title="Enforced password update on first login"
                    >
                      PWD RESET
                    </span>
                  )}
                  <span className="badge badge-success">ACTIVE</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--accent)" /> {f.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} color="var(--text-muted)" /> {f.department || 'CSE'}
                </div>
              </div>
            </Card>
          ))}
          {filteredFaculty.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No faculty records match your query.
            </div>
          )}
        </div>
      </main>

      {/* Single Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Faculty Account">
        <form onSubmit={handleCreateFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Full Name & Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. P. Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Institutional Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. dr.kumar@svec.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Initial Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-input"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Faculty Import Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Faculty Account Provisioning"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Paste CSV data containing faculty credentials. All provisioned accounts enforce a password change on first login.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" style={{ margin: 0 }}>CSV Content</label>
            <button
              type="button"
              onClick={loadSampleTemplate}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FileText size={12} /> Load Sample Template
            </button>
          </div>

          <textarea
            className="form-input"
            rows={5}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Name, Email, Department, Designation, InitialPassword"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>
              Default Temp Password:
            </label>
            <input
              type="text"
              className="form-input"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
              style={{ maxWidth: '180px', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleValidateCsv}
              disabled={validating || !csvContent.trim()}
            >
              {validating ? 'Validating...' : 'Validate & Preview'}
            </Button>
            {previewRows.length > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCommitBulk}
                disabled={committing}
              >
                {committing ? 'Importing...' : `Commit Import (${previewRows.length} Accounts)`}
              </Button>
            )}
          </div>

          {importSuccessMessage && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle size={16} />
              <span>{importSuccessMessage}</span>
            </div>
          )}

          {rowErrors.length > 0 && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--error)',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} /> Validation Warnings / Errors ({rowErrors.length})
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {rowErrors.map((err, i) => (
                  <li key={i}>
                    Row {err.row}: {err.error} {err.email && `(${err.email})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {previewRows.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Valid Accounts Preview ({previewRows.length})
              </div>
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Dept</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r) => (
                      <tr key={r.row} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '6px 8px' }}>{r.row}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)' }}>{r.email}</td>
                        <td style={{ padding: '6px 8px' }}>{r.department}</td>
                        <td style={{ padding: '6px 8px' }}>
                          <span className="badge badge-success" style={{ fontSize: '9px' }}>
                            VALID
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
