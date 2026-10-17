'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { ShieldCheck, AlertOctagon, Check, Play, RotateCcw } from 'lucide-react';

interface BankerProcess {
  id: string; // P0, P1, P2, P3, P4
  alloc: [number, number, number]; // [A, B, C]
  max: [number, number, number];
  need: [number, number, number];
  finished: boolean;
}

const INITIAL_PROCESSES: BankerProcess[] = [
  { id: 'P0', alloc: [0, 1, 0], max: [7, 5, 3], need: [7, 4, 3], finished: false },
  { id: 'P1', alloc: [2, 0, 0], max: [3, 2, 2], need: [1, 2, 2], finished: false },
  { id: 'P2', alloc: [3, 0, 2], max: [9, 0, 2], need: [6, 0, 0], finished: false },
  { id: 'P3', alloc: [2, 1, 1], max: [2, 2, 2], need: [0, 1, 1], finished: false },
  { id: 'P4', alloc: [0, 0, 2], max: [4, 3, 3], need: [4, 3, 1], finished: false },
];

const INITIAL_AVAILABLE: [number, number, number] = [3, 3, 2];

export function DeadlockVisualizer() {
  const [processes, setProcesses] = useState<BankerProcess[]>(INITIAL_PROCESSES);
  const [available, setAvailable] = useState<[number, number, number]>(INITIAL_AVAILABLE);
  const [safeSequence, setSafeSequence] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [stepLogs, setStepLogs] = useState<Array<{ text: string; procId?: string; isSafe?: boolean }>>([]);

  // Compute full Banker's algorithm safe sequence
  useEffect(() => {
    const pList = processes.map((p) => ({ ...p }));
    let avail: [number, number, number] = [...INITIAL_AVAILABLE];
    const seq: string[] = [];
    const logs: Array<{ text: string; procId?: string; isSafe?: boolean }> = [];

    logs.push({
      text: `Initial System State: Available Resources = [A:${avail[0]}, B:${avail[1]}, C:${avail[2]}]. Need Matrix calculated (Need = Max - Allocation).`,
    });

    let count = 0;
    const n = pList.length;

    while (count < n) {
      let found = false;
      for (let i = 0; i < n; i++) {
        const p = pList[i];
        if (!p.finished) {
          // Check if Need <= Available
          if (p.need[0] <= avail[0] && p.need[1] <= avail[1] && p.need[2] <= avail[2]) {
            avail = [avail[0] + p.alloc[0], avail[1] + p.alloc[1], avail[2] + p.alloc[2]];
            p.finished = true;
            seq.push(p.id);
            count++;
            found = true;
            logs.push({
              text: `${p.id} can execute! Need [${p.need.join(',')}] <= Available. Process completes, releases [${p.alloc.join(',')}]. New Available = [${avail.join(',')}].`,
              procId: p.id,
              isSafe: true,
            });
            break;
          }
        }
      }

      if (!found) {
        logs.push({
          text: 'Deadlock / Unsafe State Detected! No remaining process can satisfy its resource request with currently available units.',
          isSafe: false,
        });
        break;
      }
    }

    if (count === n) {
      logs.push({
        text: `System is in a SAFE STATE! Safe execution order: <${seq.join(' → ')}> guarantees no deadlock.`,
        isSafe: true,
      });
    }

    setSafeSequence(seq);
    setStepLogs(logs);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= stepLogs.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, stepLogs.length]);

  const activeLog = stepLogs[currentStep] || stepLogs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Visual Resource Allocation Graph / Matrix Canvas */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="tech-coordinate">
            BANKER'S ALGORITHM ENGINE · RESOURCE ALLOCATION MATRIX
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              AVAILABLE VECTOR:
            </span>
            <span className="badge badge-accent">
              A:{available[0]} B:{available[1]} C:{available[2]}
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Process</th>
                <th style={{ padding: '8px' }}>Allocation [A B C]</th>
                <th style={{ padding: '8px' }}>Max Demand [A B C]</th>
                <th style={{ padding: '8px' }}>Need = Max - Alloc</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, idx) => {
                const executedInCurrentStep = safeSequence.slice(0, currentStep).includes(p.id);
                const isCurrentActive = activeLog?.procId === p.id;

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isCurrentActive
                        ? 'rgba(99, 102, 241, 0.15)'
                        : executedInCurrentStep
                        ? 'rgba(34, 197, 94, 0.05)'
                        : 'transparent',
                    }}
                  >
                    <td style={{ padding: '8px', textAlign: 'left', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {p.id}
                    </td>
                    <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>[{p.alloc.join(', ')}]</td>
                    <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>[{p.max.join(', ')}]</td>
                    <td
                      style={{
                        padding: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: 'var(--accent-hover)',
                      }}
                    >
                      [{p.need.join(', ')}]
                    </td>
                    <td style={{ padding: '8px' }}>
                      {executedInCurrentStep ? (
                        <span className="badge badge-success">Completed</span>
                      ) : isCurrentActive ? (
                        <span className="badge badge-accent">Executing</span>
                      ) : (
                        <span className="badge badge-default">Waiting</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Safe Sequence Banner */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--success)" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Identified Safe Sequence:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {safeSequence.map((pid, idx) => {
              const isPassed = safeSequence.slice(0, currentStep).includes(pid);
              return (
                <React.Fragment key={pid}>
                  <div
                    style={{
                      padding: '4px 10px',
                      background: isPassed ? 'var(--success)' : 'var(--surface-3)',
                      color: isPassed ? '#FFFFFF' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '13px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {pid}
                  </div>
                  {idx < safeSequence.length - 1 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Explanation Card */}
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-accent">STEP {currentStep + 1} OF {stepLogs.length}</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {activeLog?.text}
        </p>
      </div>

      {/* Control Bar */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        onStepBackward={() => setCurrentStep((s) => Math.max(0, s - 1))}
        onStepForward={() => setCurrentStep((s) => Math.min(stepLogs.length - 1, s + 1))}
        currentStep={currentStep + 1}
        totalSteps={stepLogs.length}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={activeLog?.procId ? `Process ${activeLog.procId} Granted` : 'Banker State Analysis'}
      />
    </div>
  );
}
