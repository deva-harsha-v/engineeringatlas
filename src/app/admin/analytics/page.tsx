'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, Badge } from '@/components/ui';
import { BarChart3, TrendingUp, Users, Download, Compass, CheckSquare } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success) setStats(json.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '4px' }}>
            <BarChart3 size={14} /> INSTITUTIONAL ACADEMIC TELEMETRY
          </div>
          <h1 className="text-page-title">Institutional Analytics</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Anonymous aggregated metrics on student learning engagement, high-traffic Atlas topics, and repository downloads.
          </p>
        </div>

        {/* Aggregate KPI Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div className="ea-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ACTIVE STUDENT REACH</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-hover)', fontFamily: 'var(--font-mono)' }}>
              2,481
            </div>
            <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>CSE Sections A & B</div>
          </div>

          <div className="ea-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ATLAS SIMULATIONS LAUNCHED</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              4,821
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>+34% over prior term</div>
          </div>

          <div className="ea-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PRACTICE DRILLS SOLVED</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              8,320
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Average score: 78.4%</div>
          </div>

          <div className="ea-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>STUDY MATERIAL DOWNLOADS</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
              1,492
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Direct PDF & slide grabs</div>
          </div>
        </div>

        {/* Ranking Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
          <div className="ea-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} color="var(--accent-hover)" /> Top Ranked Atlas Modules by Engagement
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'AVL Tree & Rotations', views: 1850, pct: 100 },
                { title: 'Sorting Algorithms (QuickSort/MergeSort)', views: 1620, pct: 87 },
                { title: 'CPU Scheduling Simulator', views: 1420, pct: 76 },
                { title: 'TCP 3-Way Handshake & Connection State', views: 1340, pct: 72 },
                { title: 'DBMS Normalization & B+ Tree', views: 1280, pct: 69 },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 500 }}>{item.title}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)' }}>{item.views}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--accent)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ea-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} color="var(--success)" /> Most Downloaded Study Notes & Handouts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Compiler Design Lab Manual & Lex/Yacc Tutorials', count: 164 },
                { title: 'CPU Scheduling & Process Synchronization Notes', count: 142 },
                { title: 'Database Systems - Unit 4 Transactions Notes', count: 115 },
                { title: 'OS Deadlocks & Memory Management PPT', count: 98 },
                { title: 'Computer Networks - Transport Layer Protocols PPT', count: 87 },
              ].map((m, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '13px' }}>0{idx + 1}. {m.title}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>{m.count} dl</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
