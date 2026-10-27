'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Activity, AlertTriangle, CheckCircle2, Sliders, Info, Radio } from 'lucide-react';

interface WaveformConfig {
  defaultInputFreq?: number;
  defaultSamplingRate?: number;
  signalType?: string;
}

export function WaveformSamplingVisualizer({ configuration }: { configuration?: WaveformConfig } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation Parameters
  const [signalFreq, setSignalFreq] = useState<number>(configuration?.defaultInputFreq || 3); // Hz
  const [sampleFreq, setSampleFreq] = useState<number>(configuration?.defaultSamplingRate || 8); // Hz
  const [includeHarmonic, setIncludeHarmonic] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [timeOffset, setTimeOffset] = useState<number>(0);

  // Nyquist calculations
  const maxFreq = includeHarmonic ? signalFreq * 2 : signalFreq;
  const nyquistRate = 2 * maxFreq;
  const isAliasing = sampleFreq < nyquistRate;
  const apparentFreq = isAliasing ? Math.abs(sampleFreq - signalFreq) : signalFreq;

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTimeOffset((prev) => (prev + dt * speed * 0.4) % 100);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawWaveforms(ctx, canvas.width, canvas.height, timeOffset);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed, signalFreq, sampleFreq, includeHarmonic, timeOffset]);

  const drawWaveforms = (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => {
    ctx.clearRect(0, 0, width, height);

    const midY = height / 2;
    const amplitude = height * 0.35;
    const timeSpan = 2.0; // 2 seconds visible on screen

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // Horizontal centerline
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Vertical time grid (every 0.25s)
    const pixelsPerSec = width / timeSpan;
    for (let t = 0; t <= timeSpan; t += 0.25) {
      const x = t * pixelsPerSec;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 2. Draw Continuous Analog Signal (Blue)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const t = (x / width) * timeSpan + offset;
      let yVal = Math.sin(2 * Math.PI * signalFreq * t);
      if (includeHarmonic) {
        yVal = 0.7 * yVal + 0.3 * Math.sin(2 * Math.PI * signalFreq * 2 * t);
      }
      const y = midY - yVal * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw Discrete Samples (Vertical Stems and Glowing Dots)
    const samplePeriod = 1 / sampleFreq;
    const numSamples = Math.floor(timeSpan / samplePeriod);

    for (let i = 0; i <= numSamples; i++) {
      const tSample = i * samplePeriod;
      const x = (tSample / timeSpan) * width;
      const t = tSample + offset;

      let yVal = Math.sin(2 * Math.PI * signalFreq * t);
      if (includeHarmonic) {
        yVal = 0.7 * yVal + 0.3 * Math.sin(2 * Math.PI * signalFreq * 2 * t);
      }
      const y = midY - yVal * amplitude;

      // Vertical stem
      ctx.strokeStyle = isAliasing ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(x, midY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sample marker circle
      ctx.fillStyle = isAliasing ? '#EF4444' : '#10B981';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 4. Draw Reconstructed Signal (Amber / Orange Dashed Line)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const t = (x / width) * timeSpan + offset;
      // Reconstructed frequency reflects aliasing foldback if sampled below Nyquist
      const effFreq = apparentFreq;
      const yVal = Math.sin(2 * Math.PI * effFreq * t);
      const y = midY - yVal * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Visualizer Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div className="tech-coordinate" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} /> ECE LABORATORY · SIGNAL PROCESSING ENGINE
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>
            Nyquist-Shannon Sampling & Aliasing Visualizer
          </h2>
        </div>

        {/* Dynamic Criterion Badge */}
        <div>
          {isAliasing ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--error)',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <AlertTriangle size={15} /> ALIASING OCCURRING ({apparentFreq} Hz Apparent)
            </div>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--success)',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <CheckCircle2 size={15} /> PERFECT RECONSTRUCTION (fs ≥ 2fmax)
            </div>
          )}
        </div>
      </div>

      {/* Canvas Display */}
      <div
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <canvas ref={canvasRef} width={800} height={280} style={{ width: '100%', height: '280px', display: 'block' }} />

        {/* Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(8, 11, 18, 0.85)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#38BDF8', display: 'inline-block' }} />
            <span style={{ color: '#38BDF8' }}>Analog x(t)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isAliasing ? '#EF4444' : '#10B981', display: 'inline-block' }} />
            <span style={{ color: isAliasing ? '#EF4444' : '#10B981' }}>Samples x[n]</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '2px', borderTop: '2px dashed #F59E0B', display: 'inline-block' }} />
            <span style={{ color: '#F59E0B' }}>Reconstructed x̂(t)</span>
          </div>
        </div>
      </div>

      {/* Parameter Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              INPUT SIGNAL FREQ (fin)
            </label>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-hover)' }}>
              {signalFreq} Hz
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={signalFreq}
            onChange={(e) => setSignalFreq(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {[2, 3, 5, 8].map((f) => (
              <button
                key={f}
                onClick={() => setSignalFreq(f)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                {f}Hz
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              SAMPLING FREQ (fs)
            </label>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: isAliasing ? 'var(--error)' : 'var(--success)' }}>
              {sampleFreq} Hz (Ts = {(1 / sampleFreq).toFixed(3)}s)
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={sampleFreq}
            onChange={(e) => setSampleFreq(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: isAliasing ? 'var(--error)' : 'var(--success)' }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {[4, 6, 8, 12, 20].map((f) => (
              <button
                key={f}
                onClick={() => setSampleFreq(f)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                {f}Hz
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">HARMONIC SUPERPOSITION</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={includeHarmonic}
              onChange={(e) => setIncludeHarmonic(e.target.checked)}
            />
            <span>Add 2nd Harmonic (f2 = {signalFreq * 2} Hz)</span>
          </label>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Nyquist Rate = 2 × fmax = {nyquistRate} Hz
          </div>
        </div>
      </div>

      {/* Atlas Playback Controls */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying((prev) => !prev)}
        onReset={() => {
          setTimeOffset(0);
          setIsPlaying(false);
        }}
        onStepForward={() => setTimeOffset((prev) => prev + 0.05)}
        onStepBackward={() => setTimeOffset((prev) => Math.max(0, prev - 0.05))}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={Math.round(timeOffset * 20)}
        totalSteps={100}
      />
    </div>
  );
}
