'use client';

import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';

interface AtlasControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  statusText?: string;
}

export function AtlasControls({
  isPlaying,
  onPlayToggle,
  onReset,
  onStepForward,
  onStepBackward,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  statusText,
}: AtlasControlsProps) {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Playback Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onPlayToggle}
          className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          style={{ minWidth: '96px' }}
        >
          {isPlaying ? (
            <>
              <Pause size={14} /> Pause
            </>
          ) : (
            <>
              <Play size={14} /> Play
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          title="Reset simulation to initial state"
        >
          <RotateCcw size={14} /> Reset
        </button>

        {onStepBackward && (
          <button
            onClick={onStepBackward}
            disabled={currentStep <= 1 || isPlaying}
            className="btn btn-secondary btn-sm"
            title="Step Backward"
            style={{ opacity: currentStep <= 1 || isPlaying ? 0.4 : 1 }}
          >
            <ChevronLeft size={14} />
          </button>
        )}

        {onStepForward && (
          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps || isPlaying}
            className="btn btn-secondary btn-sm"
            title="Step Forward"
            style={{ opacity: currentStep >= totalSteps || isPlaying ? 0.4 : 1 }}
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Speed Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Gauge size={13} /> SPEED:
        </span>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{
            accentColor: 'var(--accent)',
            cursor: 'pointer',
            width: '100px',
          }}
        />
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            minWidth: '32px',
          }}
        >
          {speed}x
        </span>
      </div>

      {/* Step Counter Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {statusText && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--accent-hover)',
              fontFamily: 'var(--font-mono)',
              maxWidth: '260px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {statusText}
          </span>
        )}
        <div
          style={{
            padding: '4px 10px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
          }}
        >
          STEP <span style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>{pad(currentStep)}</span> / {pad(totalSteps)}
        </div>
      </div>
    </div>
  );
}
