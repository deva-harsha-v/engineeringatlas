'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Play, Pause, RotateCcw, Plus, Trash2, Cpu, CheckCircle } from 'lucide-react';

interface Process {
  id: string; // "P1", "P2"
  arrival: number;
  burst: number;
  priority: number;
  color: string;
}

interface GanttBlock {
  processId: string;
  start: number;
  end: number;
  color: string;
}

interface ProcessMetrics {
  id: string;
  completion: number;
  turnaround: number;
  waiting: number;
  response: number;
}

const DEFAULT_PROCESSES: Process[] = [
  { id: 'P1', arrival: 0, burst: 5, priority: 2, color: '#6366F1' },
  { id: 'P2', arrival: 1, burst: 3, priority: 1, color: '#38BDF8' },
  { id: 'P3', arrival: 2, burst: 8, priority: 3, color: '#22C55E' },
  { id: 'P4', arrival: 3, burst: 6, priority: 2, color: '#F59E0B' },
];

export function CPUSchedulingVisualizer() {
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES);
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SJF' | 'RR' | 'PRIORITY'>('RR');
  const [quantum, setQuantum] = useState<number>(3);

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Computed Gantt schedule
  const [ganttSchedule, setGanttSchedule] = useState<GanttBlock[]>([]);
  const [metrics, setMetrics] = useState<ProcessMetrics[]>([]);
  const [totalSimulationTime, setTotalSimulationTime] = useState<number>(22);

  // Calculate schedule based on algorithm
  useEffect(() => {
    const procs = processes.map((p) => ({ ...p, remainingBurst: p.burst }));
    const schedule: GanttBlock[] = [];
    const metricMap: Record<string, ProcessMetrics> = {};
    const firstResponseTime: Record<string, number> = {};

    let time = 0;
    let completed = 0;
    const n = procs.length;

    if (algorithm === 'FCFS') {
      const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
      for (const p of sorted) {
        if (time < p.arrival) {
          schedule.push({ processId: 'IDLE', start: time, end: p.arrival, color: '#1E293B' });
          time = p.arrival;
        }
        firstResponseTime[p.id] = time - p.arrival;
        const start = time;
        time += p.burst;
        schedule.push({ processId: p.id, start, end: time, color: p.color });
        metricMap[p.id] = {
          id: p.id,
          completion: time,
          turnaround: time - p.arrival,
          waiting: time - p.arrival - p.burst,
          response: firstResponseTime[p.id],
        };
      }
    } else if (algorithm === 'SJF') {
      // Non-preemptive Shortest Job First
      const readyQueue: typeof procs = [];
      const remaining = [...procs];

      while (completed < n) {
        // Collect arrivals up to current time
        for (let i = remaining.length - 1; i >= 0; i--) {
          if (remaining[i].arrival <= time) {
            readyQueue.push(remaining[i]);
            remaining.splice(i, 1);
          }
        }

        if (readyQueue.length === 0) {
          if (remaining.length > 0) {
            const nextArrival = Math.min(...remaining.map((r) => r.arrival));
            schedule.push({ processId: 'IDLE', start: time, end: nextArrival, color: '#1E293B' });
            time = nextArrival;
            continue;
          } else {
            break;
          }
        }

        // Pick shortest burst
        readyQueue.sort((a, b) => a.burst - b.burst);
        const p = readyQueue.shift()!;
        firstResponseTime[p.id] = time - p.arrival;
        const start = time;
        time += p.burst;
        schedule.push({ processId: p.id, start, end: time, color: p.color });
        metricMap[p.id] = {
          id: p.id,
          completion: time,
          turnaround: time - p.arrival,
          waiting: time - p.arrival - p.burst,
          response: firstResponseTime[p.id],
        };
        completed++;
      }
    } else if (algorithm === 'RR') {
      // Round Robin
      const readyQueue: typeof procs = [];
      const remaining = [...procs].sort((a, b) => a.arrival - b.arrival);
      let i = 0;

      while (completed < n) {
        while (i < remaining.length && remaining[i].arrival <= time) {
          readyQueue.push(remaining[i]);
          i++;
        }

        if (readyQueue.length === 0) {
          if (i < remaining.length) {
            schedule.push({ processId: 'IDLE', start: time, end: remaining[i].arrival, color: '#1E293B' });
            time = remaining[i].arrival;
            continue;
          } else {
            break;
          }
        }

        const p = readyQueue.shift()!;
        if (firstResponseTime[p.id] === undefined) {
          firstResponseTime[p.id] = time - p.arrival;
        }

        const runDuration = Math.min(quantum, p.remainingBurst);
        const start = time;
        time += runDuration;
        p.remainingBurst -= runDuration;
        schedule.push({ processId: p.id, start, end: time, color: p.color });

        // Add newly arrived processes during this quantum
        while (i < remaining.length && remaining[i].arrival <= time) {
          readyQueue.push(remaining[i]);
          i++;
        }

        if (p.remainingBurst > 0) {
          readyQueue.push(p);
        } else {
          completed++;
          metricMap[p.id] = {
            id: p.id,
            completion: time,
            turnaround: time - p.arrival,
            waiting: time - p.arrival - p.burst,
            response: firstResponseTime[p.id],
          };
        }
      }
    } else if (algorithm === 'PRIORITY') {
      // Priority (lower number = higher priority)
      const readyQueue: typeof procs = [];
      const remaining = [...procs];

      while (completed < n) {
        for (let j = remaining.length - 1; j >= 0; j--) {
          if (remaining[j].arrival <= time) {
            readyQueue.push(remaining[j]);
            remaining.splice(j, 1);
          }
        }

        if (readyQueue.length === 0) {
          if (remaining.length > 0) {
            const nextArrival = Math.min(...remaining.map((r) => r.arrival));
            schedule.push({ processId: 'IDLE', start: time, end: nextArrival, color: '#1E293B' });
            time = nextArrival;
            continue;
          } else {
            break;
          }
        }

        readyQueue.sort((a, b) => a.priority - b.priority);
        const p = readyQueue.shift()!;
        firstResponseTime[p.id] = time - p.arrival;
        const start = time;
        time += p.burst;
        schedule.push({ processId: p.id, start, end: time, color: p.color });
        metricMap[p.id] = {
          id: p.id,
          completion: time,
          turnaround: time - p.arrival,
          waiting: time - p.arrival - p.burst,
          response: firstResponseTime[p.id],
        };
        completed++;
      }
    }

    setGanttSchedule(schedule);
    setTotalSimulationTime(Math.max(time, 1));
    setMetrics(Object.values(metricMap));
    setCurrentTime(0);
    setIsPlaying(false);
  }, [processes, algorithm, quantum]);

  // Simulation step timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSimulationTime) {
            setIsPlaying(false);
            return totalSimulationTime;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSimulationTime]);

  // Current executing process at currentTime
  const currentBlock = ganttSchedule.find((b) => currentTime >= b.start && currentTime < b.end);
  const activeProcessId = currentBlock?.processId;

  // Ready queue at currentTime
  const arrivedProcesses = processes.filter((p) => p.arrival <= currentTime);
  const activeReadyList = arrivedProcesses.filter((p) => {
    const isCompleted = metrics.some((m) => m.id === p.id && m.completion <= currentTime);
    return !isCompleted && p.id !== activeProcessId;
  });

  const avgWaiting =
    metrics.length > 0
      ? (metrics.reduce((acc, m) => acc + m.waiting, 0) / metrics.length).toFixed(2)
      : '0';
  const avgTurnaround =
    metrics.length > 0
      ? (metrics.reduce((acc, m) => acc + m.turnaround, 0) / metrics.length).toFixed(2)
      : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Algorithm Selector & Quantum Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--surface-2)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            ALGORITHM:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['FCFS', 'SJF', 'RR', 'PRIORITY'] as const).map((algo) => (
              <button
                key={algo}
                onClick={() => setAlgorithm(algo)}
                className={`btn btn-sm ${algorithm === algo ? 'btn-primary' : 'btn-secondary'}`}
              >
                {algo === 'RR' ? 'Round Robin' : algo}
              </button>
            ))}
          </div>
        </div>

        {algorithm === 'RR' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              TIME QUANTUM:
            </span>
            <input
              type="number"
              min={1}
              max={10}
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input"
              style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ms</span>
          </div>
        )}
      </div>

      {/* Laboratory Simulation Canvas (Process Queue + CPU + Live Gantt) */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
        }}
      >
        {/* Real-time State Monitors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Ready Queue Monitor */}
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
            }}
          >
            <div className="tech-coordinate" style={{ marginBottom: '10px' }}>
              READY QUEUE [t = {currentTime}ms]
            </div>
            <div style={{ display: 'flex', gap: '8px', minHeight: '44px', alignItems: 'center' }}>
              {activeReadyList.length === 0 ? (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Ready queue empty
                </span>
              ) : (
                activeReadyList.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--surface-3)',
                      border: `1px solid ${p.color}`,
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    {p.id}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CPU Core State */}
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
            }}
          >
            <div className="tech-coordinate" style={{ marginBottom: '10px' }}>
              <Cpu size={13} /> CPU CORE STATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeProcessId && activeProcessId !== 'IDLE' ? (
                <div
                  style={{
                    padding: '8px 18px',
                    background: currentBlock?.color || 'var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
                  RUNNING: {activeProcessId}
                </div>
              ) : (
                <div
                  style={{
                    padding: '8px 18px',
                    background: 'var(--surface-2)',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                  }}
                >
                  IDLE
                </div>
              )}
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Clock: {currentTime} / {totalSimulationTime} ms
              </span>
            </div>
          </div>
        </div>

        {/* Live Animated Gantt Chart (Matching UI/UX Spec Page 9, Section 15 & Page 11, Section 21) */}
        <div>
          <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
            EXECUTION GANTT CHART
          </div>
          <div
            style={{
              display: 'flex',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--surface-3)',
            }}
          >
            {ganttSchedule.map((block, idx) => {
              const widthPct = ((block.end - block.start) / totalSimulationTime) * 100;
              const isPastOrCurrent = block.start < currentTime;
              const isCurrentlyExecuting = currentTime >= block.start && currentTime < block.end;

              return (
                <div
                  key={idx}
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    backgroundColor: block.color,
                    opacity: isPastOrCurrent ? (isCurrentlyExecuting ? 1 : 0.85) : 0.25,
                    borderRight: '1px solid rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#FFFFFF',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {block.processId}
                </div>
              );
            })}
          </div>

          {/* Time markers bar */}
          <div style={{ display: 'flex', position: 'relative', height: '24px', marginTop: '4px' }}>
            <span style={{ position: 'absolute', left: 0, fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              0
            </span>
            {ganttSchedule.map((b, idx) => {
              const rightPct = (b.end / totalSimulationTime) * 100;
              return (
                <span
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${rightPct}%`,
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: b.end <= currentTime ? 'var(--accent-hover)' : 'var(--text-muted)',
                    fontWeight: b.end <= currentTime ? 600 : 400,
                  }}
                >
                  {b.end}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onStepBackward={() => setCurrentTime((t) => Math.max(0, t - 1))}
        onStepForward={() => setCurrentTime((t) => Math.min(totalSimulationTime, t + 1))}
        currentStep={currentTime}
        totalSteps={totalSimulationTime}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={`Current: ${activeProcessId || 'Idle'} (t = ${currentTime}ms)`}
      />

      {/* Process Metrics Table */}
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Scheduling Metrics & Calculated Latencies</h4>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            <span>
              Avg Waiting Time: <strong style={{ color: 'var(--accent-hover)' }}>{avgWaiting} ms</strong>
            </span>
            <span>
              Avg Turnaround Time: <strong style={{ color: 'var(--success)' }}>{avgTurnaround} ms</strong>
            </span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Process</th>
              <th style={{ padding: '8px' }}>Arrival Time</th>
              <th style={{ padding: '8px' }}>Burst Time</th>
              <th style={{ padding: '8px' }}>Priority</th>
              <th style={{ padding: '8px' }}>Completion Time (CT)</th>
              <th style={{ padding: '8px' }}>Turnaround Time (TAT)</th>
              <th style={{ padding: '8px' }}>Waiting Time (WT)</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => {
              const m = metrics.find((item) => item.id === p.id);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: p.color, fontFamily: 'var(--font-mono)' }}>
                    {p.id}
                  </td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>{p.arrival} ms</td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>{p.burst} ms</td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>{p.priority}</td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {m ? `${m.completion} ms` : '—'}
                  </td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {m ? `${m.turnaround} ms` : '—'}
                  </td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)' }}>
                    {m ? `${m.waiting} ms` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
