'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Layers, CheckCircle, AlertCircle } from 'lucide-react';

export function PagingVisualizer() {
  const [referenceString, setReferenceString] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3]);
  const [frameCount, setFrameCount] = useState<number>(3);
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'LRU' | 'OPTIMAL'>('LRU');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  interface StepRecord {
    page: number;
    frames: (number | null)[];
    isHit: boolean;
    evicted?: number | null;
    explanation: string;
  }

  const [history, setHistory] = useState<StepRecord[]>([]);

  useEffect(() => {
    const records: StepRecord[] = [];
    const currentFrames: (number | null)[] = Array(frameCount).fill(null);
    const fifoQueue: number[] = [];
    const lastUsedMap: Record<number, number> = {};

    referenceString.forEach((page, timeIdx) => {
      const isHit = currentFrames.includes(page);
      let evicted: number | null = null;
      let exp = '';

      if (isHit) {
        exp = `Page ${page} is already in frame ${currentFrames.indexOf(page) + 1}. Page Hit! No replacement needed.`;
        if (algorithm === 'LRU') {
          lastUsedMap[page] = timeIdx;
        }
      } else {
        // Page Fault
        const emptyIndex = currentFrames.indexOf(null);
        if (emptyIndex !== -1) {
          currentFrames[emptyIndex] = page;
          if (algorithm === 'FIFO') fifoQueue.push(page);
          if (algorithm === 'LRU') lastUsedMap[page] = timeIdx;
          exp = `Page Fault! Frame ${emptyIndex + 1} was empty, so page ${page} was placed directly.`;
        } else {
          // Must evict
          let replaceIndex = 0;
          if (algorithm === 'FIFO') {
            const victim = fifoQueue.shift()!;
            evicted = victim;
            replaceIndex = currentFrames.indexOf(victim);
            fifoQueue.push(page);
            exp = `Page Fault! FIFO evicted oldest page ${victim} from frame ${replaceIndex + 1}.`;
          } else if (algorithm === 'LRU') {
            // Find least recently used page
            let minTime = Infinity;
            let victim = currentFrames[0]!;
            currentFrames.forEach((p) => {
              if (p !== null && (lastUsedMap[p] ?? -1) < minTime) {
                minTime = lastUsedMap[p] ?? -1;
                victim = p;
              }
            });
            evicted = victim;
            replaceIndex = currentFrames.indexOf(victim);
            lastUsedMap[page] = timeIdx;
            exp = `Page Fault! LRU evicted page ${victim} (least recently used) from frame ${replaceIndex + 1}.`;
          } else {
            // Optimal: find page that will not be used for longest time in future
            let farthestTime = -1;
            let victim = currentFrames[0]!;
            currentFrames.forEach((p) => {
              if (p !== null) {
                const futureIndex = referenceString.slice(timeIdx + 1).indexOf(p);
                const nextUse = futureIndex === -1 ? Infinity : futureIndex;
                if (nextUse > farthestTime) {
                  farthestTime = nextUse;
                  victim = p;
                }
              }
            });
            evicted = victim;
            replaceIndex = currentFrames.indexOf(victim);
            exp = `Page Fault! Optimal evicted page ${victim} (won't be referenced for longest duration) from frame ${replaceIndex + 1}.`;
          }
          currentFrames[replaceIndex] = page;
        }
      }

      records.push({
        page,
        frames: [...currentFrames],
        isHit,
        evicted,
        explanation: exp,
      });
    });

    setHistory(records);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [referenceString, frameCount, algorithm]);

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, history.length]);

  const activeRecord = history[currentStep] || history[0];
  const totalFaults = history.slice(0, currentStep + 1).filter((r) => !r.isHit).length;
  const totalHits = history.slice(0, currentStep + 1).filter((r) => r.isHit).length;
  const faultRatio =
    currentStep + 1 > 0 ? ((totalFaults / (currentStep + 1)) * 100).toFixed(1) : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Configuration bar */}
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
          {(['FIFO', 'LRU', 'OPTIMAL'] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`btn btn-sm ${algorithm === algo ? 'btn-primary' : 'btn-secondary'}`}
            >
              {algo}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            PHYSICAL FRAMES:
          </span>
          {[3, 4].map((f) => (
            <button
              key={f}
              onClick={() => setFrameCount(f)}
              className={`btn btn-sm ${frameCount === f ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f} Frames
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas: Memory Frame Grid */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 20px',
        }}
      >
        {/* Reference String Ribbon */}
        <div style={{ marginBottom: '24px' }}>
          <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
            PAGE REFERENCE SEQUENCE (CURRENT: PAGE {activeRecord?.page})
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {referenceString.map((val, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent
                      ? 'var(--accent)'
                      : isPast
                      ? 'var(--surface-2)'
                      : 'var(--surface-1)',
                    border: `1px solid ${isCurrent ? 'var(--accent-hover)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: isCurrent ? '#FFFFFF' : isPast ? 'var(--text-secondary)' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical Frames Grid at Current Step */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${frameCount}, 1fr)`, gap: '12px', maxWidth: '480px' }}>
          {Array.from({ length: frameCount }).map((_, fIdx) => {
            const pageInFrame = activeRecord?.frames[fIdx];
            const isJustEvicted = activeRecord?.evicted === pageInFrame;
            return (
              <div
                key={fIdx}
                style={{
                  background: 'var(--surface-1)',
                  border: `2px solid ${pageInFrame !== null && pageInFrame !== undefined ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  FRAME {fIdx + 1}
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: pageInFrame !== null && pageInFrame !== undefined ? 'var(--text-primary)' : 'var(--border)',
                  }}
                >
                  {pageInFrame !== null && pageInFrame !== undefined ? pageInFrame : '—'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status result tag */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          {activeRecord?.isHit ? (
            <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <CheckCircle size={15} /> PAGE HIT
            </span>
          ) : (
            <span className="badge badge-error" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <AlertCircle size={15} /> PAGE FAULT (MISS)
            </span>
          )}
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {activeRecord?.explanation}
          </span>
        </div>
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
        onStepForward={() => setCurrentStep((s) => Math.min(history.length - 1, s + 1))}
        currentStep={currentStep + 1}
        totalSteps={history.length}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={`Faults: ${totalFaults} | Hits: ${totalHits}`}
      />

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="ea-card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL PAGE FAULTS</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--error)' }}>{totalFaults}</div>
        </div>
        <div className="ea-card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL PAGE HITS</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>{totalHits}</div>
        </div>
        <div className="ea-card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PAGE FAULT RATIO</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-hover)' }}>{faultRatio}%</div>
        </div>
      </div>
    </div>
  );
}
