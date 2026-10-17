'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AuthUser } from '@/lib/types';
import { Button, Badge, Card, Modal } from '@/components/ui';
import { Users, Plus, Mail, Building, UserCheck } from 'lucide-react';

export default function AdminFacultyDirectoryPage() {
  const [facultyList, setFacultyList] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/faculty');
        const json = await res.json();
        if (json.success) setFacultyList(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
              ACADEMIC STAFF REGISTRY
            </div>
            <h1 className="text-page-title">Faculty Directory</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage teaching credentials, department affiliations, and account standing.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Add Faculty Member
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {facultyList.map((f) => (
            <Card key={f.id} className="ea-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.designation}</div>
                </div>
                <span className="badge badge-success">ACTIVE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--accent)" /> {f.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} color="var(--text-muted)" /> {f.department || 'CSE'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Faculty Account">
        <form onSubmit={handleCreateFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Full Name & Title</label>
            <input type="text" className="form-input" placeholder="e.g. Dr. P. Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="form-label">Institutional Email</label>
            <input type="email" className="form-input" placeholder="e.g. dr.kumar@svec.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="form-label">Initial Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Department</label>
              <input type="text" className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Designation</label>
              <input type="text" className="form-input" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
