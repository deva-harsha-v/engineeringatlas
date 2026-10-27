'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Layers, GitBranch, ArrowLeftRight } from 'lucide-react';

interface ProcessItem {
  id: string;
  burst: number;
  priority: number;
  color: string;
  className: string;
}

interface ScheduleBlock {
  id: string;
  start: number;
  end: number;
  color: string;
  burst: number;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { id: 'P1', burst: 6, priority: 3, color: '#2563EB', className: 'p-p1' },
  { id: 'P2', burst: 3, priority: 1, color: '#059669', className: 'p-p2' },
  { id: 'P3', burst: 8, priority: 4, color: '#7C3AED', className: 'p-p3' },
  { id: 'P4', burst: 4, priority: 2, color: '#D97706', className: 'p-p4' },
];

export function HeroSimulator() {
  const [activeTab, setActiveTab] = useState<'cpu' | 'avl' | 'tcp' | 'paging'>('cpu');
  const [fps, setFps] = useState<number>(60);

  // ----------------------------------------------------
  // Realtime FPS Counter
  // ----------------------------------------------------
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ----------------------------------------------------
  // CPU Simulator State
  // ----------------------------------------------------
  const [cpuAlgo, setCpuAlgo] = useState<'FCFS' | 'SJF' | 'PRIORITY' | 'RR'>('FCFS');
  const [cpuStepIndex, setCpuStepIndex] = useState<number>(0);

  const getTimeline = (algo: 'FCFS' | 'SJF' | 'PRIORITY' | 'RR') => {
    const procs = JSON.parse(JSON.stringify(INITIAL_PROCESSES));
    const timeline: ScheduleBlock[] = [];
    let cur = 0;

    if (algo === 'FCFS') {
      procs.forEach((p: ProcessItem) => {
        timeline.push({ id: p.id, start: cur, end: cur + p.burst, color: p.color, burst: p.burst });
        cur += p.burst;
      });
    } else if (algo === 'SJF') {
      procs.sort((a: ProcessItem, b: ProcessItem) => a.burst - b.burst);
      procs.forEach((p: ProcessItem) => {
        timeline.push({ id: p.id, start: cur, end: cur + p.burst, color: p.color, burst: p.burst });
        cur += p.burst;
      });
    } else if (algo === 'PRIORITY') {
      procs.sort((a: ProcessItem, b: ProcessItem) => a.priority - b.priority);
      procs.forEach((p: ProcessItem) => {
        timeline.push({ id: p.id, start: cur, end: cur + p.burst, color: p.color, burst: p.burst });
        cur += p.burst;
      });
    } else if (algo === 'RR') {
      const q = 2;
      const queue = procs.map((p: ProcessItem) => ({ ...p, remaining: p.burst }));
      while (queue.some((p: { remaining: number }) => p.remaining > 0)) {
        for (const p of queue) {
          if (p.remaining > 0) {
            const chunk = Math.min(p.remaining, q);
            timeline.push({ id: p.id, start: cur, end: cur + chunk, color: p.color, burst: chunk });
            cur += chunk;
            p.remaining -= chunk;
          }
        }
      }
    }
    return timeline;
  };

  const timeline = getTimeline(cpuAlgo);
  const totalCpuTime = timeline.length > 0 ? timeline[timeline.length - 1].end : 21;
  const currentTask = cpuStepIndex > 0 ? timeline[Math.min(cpuStepIndex - 1, timeline.length - 1)] : null;

  const getAvgWait = (algo: string) => {
    switch (algo) {
      case 'SJF':
        return '4.50 ms';
      case 'PRIORITY':
        return '5.25 ms';
      case 'RR':
        return '6.75 ms';
      case 'FCFS':
      default:
        return '7.25 ms';
    }
  };

  // ----------------------------------------------------
  // AVL Tree State
  // ----------------------------------------------------
  const [avlRotation, setAvlRotation] = useState<'initial' | 'left' | 'right'>('initial');

  const getNodePos = (id: number) => {
    if (avlRotation === 'initial') {
      if (id === 50) return { x: 400, y: 50 };
      if (id === 30) return { x: 260, y: 130 };
      if (id === 70) return { x: 540, y: 130 };
      if (id === 20) return { x: 190, y: 220 };
      if (id === 40) return { x: 330, y: 220 };
      if (id === 60) return { x: 470, y: 220 };
      if (id === 80) return { x: 610, y: 220 };
    } else if (avlRotation === 'left') {
      // 70 is root, 50 goes left
      if (id === 70) return { x: 400, y: 50 };
      if (id === 50) return { x: 260, y: 130 };
      if (id === 80) return { x: 540, y: 130 };
      if (id === 30) return { x: 190, y: 220 };
      if (id === 60) return { x: 330, y: 220 };
      if (id === 20) return { x: 140, y: 290 };
      if (id === 40) return { x: 240, y: 290 };
    } else if (avlRotation === 'right') {
      // 30 is root, 50 goes right
      if (id === 30) return { x: 400, y: 50 };
      if (id === 20) return { x: 260, y: 130 };
      if (id === 50) return { x: 540, y: 130 };
      if (id === 40) return { x: 470, y: 220 };
      if (id === 70) return { x: 610, y: 220 };
      if (id === 60) return { x: 560, y: 290 };
      if (id === 80) return { x: 660, y: 290 };
    }
    return { x: 400, y: 50 };
  };

  // ----------------------------------------------------
  // TCP Handshake State
  // ----------------------------------------------------
  const [tcpStep, setTcpStep] = useState<number>(0);
  const [tcpPacket, setTcpPacket] = useState<{
    visible: boolean;
    label: string;
    top: string;
    left: string;
  }>({ visible: false, label: '', top: '120px', left: '20%' });

  const runTcpStep = () => {
    if (tcpStep === 0) {
      // Step 1: SYN from Client to Server
      setTcpPacket({ visible: true, label: 'SYN [Seq=100]', top: '120px', left: '20%' });
      setTcpStep(1);
      setTimeout(() => {
        setTcpPacket({ visible: true, label: 'SYN [Seq=100]', top: '150px', left: '80%' });
      }, 50);
    } else if (tcpStep === 1) {
      // Step 2: SYN+ACK from Server to Client
      setTcpPacket({ visible: true, label: 'SYN + ACK [Seq=300, Ack=101]', top: '170px', left: '80%' });
      setTcpStep(2);
      setTimeout(() => {
        setTcpPacket({ visible: true, label: 'SYN + ACK [Seq=300, Ack=101]', top: '210px', left: '20%' });
      }, 50);
    } else if (tcpStep === 2) {
      // Step 3: Final ACK from Client to Server
      setTcpPacket({ visible: true, label: 'ACK [Ack=301]', top: '230px', left: '20%' });
      setTcpStep(3);
      setTimeout(() => {
        setTcpPacket({ visible: true, label: 'ACK [Ack=301]', top: '260px', left: '80%' });
      }, 50);
      setTimeout(() => {
        setTcpPacket((prev) => ({ ...prev, visible: false }));
      }, 1300);
    }
  };

  const resetTcp = () => {
    setTcpStep(0);
    setTcpPacket({ visible: false, label: '', top: '120px', left: '20%' });
  };

  // ----------------------------------------------------
  // Paging & Memory State
  // ----------------------------------------------------
  const [activeVirtualPage, setActiveVirtualPage] = useState<number>(0);
  const PAGE_MAPPINGS: Record<number, number> = { 0: 2, 1: 0, 2: 3, 3: 1 };

  return (
    <div id="simulator" className="hero-simulator-wrapper">
      <div className="simulator-card">
        {/* Simulator Control Ribbon */}
        <div className="sim-header">
          <div className="sim-indicator">
            <span className="live-dot" />
            <span className="sim-badge-label">Live Atlas Simulator</span>
            <span className="sim-fps">{fps} FPS · REALTIME</span>
          </div>

          {/* Switchable Interactive Concept Tabs */}
          <div className="sim-tabs-nav" role="tablist">
            <button
              type="button"
              className={`sim-tab-btn ${activeTab === 'cpu' ? 'active' : ''}`}
              onClick={() => setActiveTab('cpu')}
              role="tab"
              aria-selected={activeTab === 'cpu'}
            >
              <Cpu size={14} />
              <span>CPU Scheduling</span>
            </button>

            <button
              type="button"
              className={`sim-tab-btn ${activeTab === 'avl' ? 'active' : ''}`}
              onClick={() => setActiveTab('avl')}
              role="tab"
              aria-selected={activeTab === 'avl'}
            >
              <GitBranch size={14} />
              <span>AVL Tree</span>
            </button>

            <button
              type="button"
              className={`sim-tab-btn ${activeTab === 'tcp' ? 'active' : ''}`}
              onClick={() => setActiveTab('tcp')}
              role="tab"
              aria-selected={activeTab === 'tcp'}
            >
              <ArrowLeftRight size={14} />
              <span>TCP 3-Way Handshake</span>
            </button>

            <button
              type="button"
              className={`sim-tab-btn ${activeTab === 'paging' ? 'active' : ''}`}
              onClick={() => setActiveTab('paging')}
              role="tab"
              aria-selected={activeTab === 'paging'}
            >
              <Layers size={14} />
              <span>Paging & Memory</span>
            </button>
          </div>
        </div>

        {/* Viewport Screen */}
        <div className="sim-viewport">
          {/* 1. CPU SCHEDULING PANE */}
          {activeTab === 'cpu' && (
            <div className="sim-pane active">
              <div className="sched-container">
                <div className="sched-control-bar">
                  <div className="sched-algo-buttons">
                    {(['FCFS', 'SJF', 'PRIORITY', 'RR'] as const).map((algo) => (
                      <button
                        key={algo}
                        type="button"
                        className={`sched-btn ${cpuAlgo === algo ? 'active' : ''}`}
                        onClick={() => {
                          setCpuAlgo(algo);
                          setCpuStepIndex(0);
                        }}
                      >
                        {algo === 'RR' ? 'Round Robin (q=2)' : algo === 'SJF' ? 'SJF (Shortest First)' : algo}
                      </button>
                    ))}
                  </div>

                  <div className="sched-sim-actions">
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => setCpuStepIndex((prev) => Math.min(prev + 1, timeline.length))}
                      disabled={cpuStepIndex >= timeline.length}
                    >
                      Step →
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => setCpuStepIndex(0)}
                    >
                      Reset
                    </button>
                    <Link
                      href="/student/atlas/cpu-scheduling"
                      className="action-icon-btn"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      Full Lab <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <div className="sched-pipeline">
                  <div className="pipeline-stage">
                    <div className="stage-title">
                      <span className="stage-title-primary">Ready Queue (Active FIFO)</span>
                      <span className="stage-title-metric">4 Processes</span>
                    </div>
                    <div className="queue-lane">
                      {INITIAL_PROCESSES.map((p) => {
                        const isCurrent = currentTask?.id === p.id;
                        return (
                          <div
                            key={p.id}
                            className={`process-pill ${p.className}`}
                            style={{
                              transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                              boxShadow: isCurrent ? '0 0 12px rgba(255,255,255,0.7)' : 'none',
                            }}
                          >
                            {p.id} ({p.burst}ms)
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pipeline-arrow" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="cpu-core-box">
                    <span className="cpu-active-target">
                      {currentTask ? `EXECUTING ${currentTask.id}` : 'CORE 0 IDLE'}
                    </span>
                    <span className="cpu-metric">
                      {currentTask
                        ? `Time: ${currentTask.start}ms → ${currentTask.end}ms (Burst: ${currentTask.burst}ms)`
                        : 'Ready to schedule · Tick: 0ms'}
                    </span>
                  </div>
                </div>

                <div className="gantt-section">
                  <div className="stage-title">
                    <span className="stage-title-primary">Dynamic Gantt Timeline Execution</span>
                    <span className="stage-title-metric">Avg Waiting Time: {getAvgWait(cpuAlgo)}</span>
                  </div>
                  <div className="gantt-track-card">
                    <div className="gantt-bars-container">
                      {timeline.slice(0, cpuStepIndex).map((block, idx) => {
                        const span = block.end - block.start;
                        const widthPct = (span / totalCpuTime) * 100;
                        return (
                          <div
                            key={`${block.id}-${idx}`}
                            className="gantt-block"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: block.color,
                            }}
                            title={`${block.id}: ${block.start}ms to ${block.end}ms`}
                          >
                            {block.id}
                          </div>
                        );
                      })}
                    </div>
                    <div className="gantt-time-scale">
                      <span>0ms</span>
                      <span>5ms</span>
                      <span>10ms</span>
                      <span>15ms</span>
                      <span>{totalCpuTime}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. AVL TREE PANE */}
          {activeTab === 'avl' && (
            <div className="sim-pane active">
              <div className="avl-container">
                <div className="avl-toolbar">
                  <div className="avl-info-ribbon">
                    <span>Balanced BST Property: <strong>|Height(L) - Height(R)| ≤ 1</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => setAvlRotation('left')}
                    >
                      Trigger Left Rotation (LL)
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => setAvlRotation('right')}
                    >
                      Trigger Right Rotation (RR)
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => setAvlRotation('initial')}
                    >
                      Rebalance Tree
                    </button>
                    <Link
                      href="/student/atlas/avl-tree"
                      className="action-icon-btn"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      Full Lab <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <div className="avl-canvas-area">
                  <svg className="avl-svg-tree" viewBox="0 0 800 320">
                    {/* Connecting Branches */}
                    <g id="treeBranches">
                      <line
                        x1={getNodePos(50).x}
                        y1={getNodePos(50).y}
                        x2={getNodePos(30).x}
                        y2={getNodePos(30).y}
                        className="avl-branch"
                      />
                      <line
                        x1={getNodePos(50).x}
                        y1={getNodePos(50).y}
                        x2={getNodePos(70).x}
                        y2={getNodePos(70).y}
                        className="avl-branch"
                      />
                      <line
                        x1={getNodePos(30).x}
                        y1={getNodePos(30).y}
                        x2={getNodePos(20).x}
                        y2={getNodePos(20).y}
                        className="avl-branch"
                      />
                      <line
                        x1={getNodePos(30).x}
                        y1={getNodePos(30).y}
                        x2={getNodePos(40).x}
                        y2={getNodePos(40).y}
                        className="avl-branch"
                      />
                      <line
                        x1={getNodePos(70).x}
                        y1={getNodePos(70).y}
                        x2={getNodePos(60).x}
                        y2={getNodePos(60).y}
                        className="avl-branch"
                      />
                      <line
                        x1={getNodePos(70).x}
                        y1={getNodePos(70).y}
                        x2={getNodePos(80).x}
                        y2={getNodePos(80).y}
                        className="avl-branch"
                      />
                    </g>

                    {/* Nodes */}
                    {[
                      { val: 50, r: 22, color: '#4F46E5' },
                      { val: 30, r: 20, color: '#2563EB' },
                      { val: 70, r: 20, color: '#2563EB' },
                      { val: 20, r: 18, color: '#7C3AED' },
                      { val: 40, r: 18, color: '#7C3AED' },
                      { val: 60, r: 18, color: '#7C3AED' },
                      { val: 80, r: 18, color: '#7C3AED' },
                    ].map((node) => {
                      const pos = getNodePos(node.val);
                      return (
                        <g
                          key={node.val}
                          className="avl-node-item"
                          transform={`translate(${pos.x}, ${pos.y})`}
                          style={{ transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                        >
                          <circle r={node.r} fill={node.color} className="avl-node-circle" />
                          <text className="avl-node-text">{node.val}</text>
                          <text y={-node.r - 6} className="avl-balance-badge" textAnchor="middle">
                            BF: 0
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 3. TCP 3-WAY HANDSHAKE PANE */}
          {activeTab === 'tcp' && (
            <div className="sim-pane active">
              <div className="tcp-container">
                <div className="sched-control-bar">
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {tcpStep === 0 && 'Connection State: READY · Client ready to send initial SYN request'}
                    {tcpStep === 1 && '1/3: Client sending SYN (Seq=100) to request channel synchronization'}
                    {tcpStep === 2 && '2/3: Server acknowledged SYN. Sending SYN + ACK (Seq=300, Ack=101)'}
                    {tcpStep === 3 && '3/3: Full Duplex Sockets ESTABLISHED · Bidirectional channel open'}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={runTcpStep}
                      disabled={tcpStep >= 3}
                    >
                      {tcpStep === 0 && 'Send SYN Packet →'}
                      {tcpStep === 1 && 'Send SYN + ACK ←'}
                      {tcpStep === 2 && 'Send Final ACK →'}
                      {tcpStep === 3 && 'Connection Active ✓'}
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={resetTcp}
                    >
                      Reset Flow
                    </button>
                    <Link
                      href="/student/atlas/tcp-handshake"
                      className="action-icon-btn"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      Full Lab <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <div className="tcp-viewport-canvas">
                  {/* Client Host */}
                  <div className="tcp-host-column">
                    <div className="tcp-host-card">
                      <div className="host-name">CLIENT (Browser)</div>
                      <div className="host-ip">192.168.1.104</div>
                      <div
                        className={`tcp-state-badge ${tcpStep >= 2 ? 'established' : ''}`}
                      >
                        {tcpStep === 0 ? 'CLOSED' : tcpStep === 1 ? 'SYN_SENT' : 'ESTABLISHED'}
                      </div>
                    </div>
                    <div className="tcp-timeline-line" />
                  </div>

                  {/* Traveling Packet Indicator */}
                  {tcpPacket.visible && (
                    <div
                      className="tcp-flight-packet"
                      style={{
                        top: tcpPacket.top,
                        left: tcpPacket.left,
                      }}
                    >
                      {tcpPacket.label}
                    </div>
                  )}

                  {/* Server Host */}
                  <div className="tcp-host-column">
                    <div className="tcp-host-card">
                      <div className="host-name">SERVER (Apache)</div>
                      <div className="host-ip">203.0.113.45</div>
                      <div
                        className={`tcp-state-badge ${tcpStep >= 3 ? 'established' : ''}`}
                      >
                        {tcpStep === 0 ? 'LISTEN' : tcpStep === 1 ? 'SYN_RCVD' : 'ESTABLISHED'}
                      </div>
                    </div>
                    <div className="tcp-timeline-line" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PAGING & VIRTUAL MEMORY PANE */}
          {activeTab === 'paging' && (
            <div className="sim-pane active">
              <div className="sched-control-bar" style={{ marginBottom: '14px' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Virtual Page {activeVirtualPage} mapped by MMU to Physical Frame {PAGE_MAPPINGS[activeVirtualPage]} (RAM Translated)
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="action-icon-btn"
                    onClick={() => setActiveVirtualPage((prev) => (prev + 1) % 4)}
                  >
                    Cycle Virtual Address (0x{activeVirtualPage}000)
                  </button>
                  <Link
                    href="/student/atlas/paging-replacement"
                    className="action-icon-btn"
                    style={{ color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    Full Lab <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="paging-container">
                {/* Virtual Page Table */}
                <div className="memory-box">
                  <div className="memory-box-title">Process Page Table (Virtual Pages)</div>
                  <div className="page-table-grid">
                    {[0, 1, 2, 3].map((page) => (
                      <div
                        key={page}
                        className={`pt-row ${activeVirtualPage === page ? 'active' : ''}`}
                        onClick={() => setActiveVirtualPage(page)}
                      >
                        <span>Page {page} (0x{page}000)</span>
                        <span className="font-mono" style={{ color: 'var(--indigo)' }}>
                          Frame {PAGE_MAPPINGS[page]} →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MMU Bus Arrow */}
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--indigo)' }} aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Physical Memory Frames */}
                <div className="memory-box">
                  <div className="memory-box-title">Physical RAM (Frames)</div>
                  <div className="frames-stack">
                    {[0, 1, 2, 3].map((frame) => {
                      const isHighlighted = PAGE_MAPPINGS[activeVirtualPage] === frame;
                      const pageContained = Object.entries(PAGE_MAPPINGS).find(([, f]) => f === frame)?.[0];
                      return (
                        <div
                          key={frame}
                          className={`frame-slot ${isHighlighted ? 'highlighted' : ''}`}
                        >
                          <span>Frame {frame}</span>
                          <span className="font-mono" style={{ color: isHighlighted ? 'var(--indigo)' : 'var(--emerald)' }}>
                            [ Page {pageContained} Data ]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
