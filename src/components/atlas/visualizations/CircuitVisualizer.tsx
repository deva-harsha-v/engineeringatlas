'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Zap, Activity, Gauge, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CircuitVisualizerProps {
  configuration?: {
    circuitType?: string;
    defaultFrequency?: number;
    defaultResistance?: number;
    defaultInductance?: number;
    defaultCapacitance?: number;
  };
}

export function CircuitVisualizer({ configuration }: CircuitVisualizerProps = {}) {
  // Configurable initial parameters
  const initFreq = configuration?.defaultFrequency || 50;
  const initR = configuration?.defaultResistance || 100;
  const initL = configuration?.defaultInductance || 50; // mH
  const initC = configuration?.defaultCapacitance || 20; // µF

  const [frequency, setFrequency] = useState<number>(initFreq); // Hz
  const [resistance, setResistance] = useState<number>(initR); // Ohms
  const [inductance, setInductance] = useState<number>(initL); // mH
  const [capacitance, setCapacitance] = useState<number>(initC); // µF
  const [vRms, setVRms] = useState<number>(230); // Volts RMS

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [time, setTime] = useState<number>(0);

  const oscCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Electrical engineering computations
  const omega = 2 * Math.PI * frequency;
  const lHenries = inductance * 1e-3;
  const cFarads = capacitance * 1e-6;

  const xl = omega * lHenries; // Inductive Reactance (Ohms)
  const xc = 1 / (omega * cFarads); // Capacitive Reactance (Ohms)
  const netReactance = xl - xc;
  const impedance = Math.sqrt(resistance * resistance + netReactance * netReactance); // Z (Ohms)

  // Current
  const iRms = vRms / impedance; // Amperes
  const iPeak = iRms * Math.SQRT2;
  const vPeak = vRms * Math.SQRT2;

  // Phase angle phi in radians and degrees
  const phiRad = Math.atan2(netReactance, resistance);
  const phiDeg = (phiRad * 180) / Math.PI;

  // Resonant frequency f0 = 1 / (2 * pi * sqrt(L * C))
  const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads));
  const isAtResonance = Math.abs(frequency - resonantFreq) < 1.5;

  // Real power and power factor
  const powerFactor = Math.cos(phiRad);
  const realPower = vRms * iRms * powerFactor; // Watts

  // Animation loop
  useEffect(() => {
    let lastTs = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;
      if (isPlaying) {
        setTime((prev) => prev + dt * speed * 2);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speed]);

  // Render Oscilloscope and Schematic
  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#080B12';
    ctx.fillRect(0, 0, width, height);

    // Draw oscilloscope grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Center baseline
    const midY = height / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Scale factors
    const vScale = 0.28 * (height / 2);
    const iScale = 0.28 * (height / 2) * (150 / Math.max(1, iPeak * 20));

    // 1. Draw Voltage Waveform (Cyan: v(t) = sin(wt))
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < width; px++) {
      const tSec = time * 0.05 + (px / width) * (4 / (frequency / 25));
      const vVal = Math.sin(omega * tSec);
      const py = midY - vVal * vScale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 2. Draw Current Waveform (Emerald: i(t) = sin(wt - phi))
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < width; px++) {
      const tSec = time * 0.05 + (px / width) * (4 / (frequency / 25));
      const iVal = Math.sin(omega * tSec - phiRad);
      const py = midY - iVal * vScale * 0.85;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Legend annotations on canvas
    ctx.font = '11px monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('v(t) = V0·sin(ωt)', 16, 22);

    ctx.fillStyle = '#22C55E';
    ctx.fillText(`i(t) = I0·sin(ωt - ${phiDeg.toFixed(1)}°)`, 16, 38);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`Phase Shift: ${phiDeg > 0 ? 'Lagging' : phiDeg < 0 ? 'Leading' : 'In Phase'} (${Math.abs(phiDeg).toFixed(1)}°)`, width - 210, 22);
  }, [time, frequency, omega, phiRad, phiDeg, iPeak, vPeak]);

  const handleReset = () => {
    setFrequency(initFreq);
    setResistance(initR);
    setInductance(initL);
    setCapacitance(initC);
    setVRms(230);
    setTime(0);
  };

  const handleTuneToResonance = () => {
    setFrequency(Math.round(resonantFreq * 10) / 10);
  };

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
          >
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Series RLC AC Circuit & Phasor Laboratory
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Dynamic Impedance Z = √(R² + (X_L - X_C)²) and Phase Resonance Simulation
            </p>
          </div>
        </div>

        {/* State Notification Pill */}
        <div>
          {isAtResonance ? (
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> CIRCUIT AT ELECTRICAL RESONANCE (X_L = X_C)
            </span>
          ) : phiDeg > 0 ? (
            <span className="badge badge-accent">
              INDUCTIVE DOMINANCE (Current Lags Voltage by {phiDeg.toFixed(1)}°)
            </span>
          ) : (
            <span className="badge badge-default">
              CAPACITIVE DOMINANCE (Current Leads Voltage by {Math.abs(phiDeg).toFixed(1)}°)
            </span>
          )}
        </div>
      </div>

      {/* Primary Oscilloscope & Phasor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
        {/* Dual Oscilloscope */}
        <div
          style={{
            background: '#080B12',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="tech-coordinate" style={{ color: 'var(--text-muted)' }}>
              DUAL-TRACE AC OSCILLOSCOPE [TIME DOMAIN]
            </span>
            <span className="tech-coordinate" style={{ color: isAtResonance ? 'var(--success)' : 'var(--accent-hover)' }}>
              f = {frequency.toFixed(1)} Hz
            </span>
          </div>
          <canvas
            ref={oscCanvasRef}
            width={580}
            height={240}
            style={{ width: '100%', height: '240px', display: 'block', borderRadius: '4px' }}
          />
        </div>

        {/* Phasor & Vector Plane */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="tech-coordinate" style={{ marginBottom: '8px' }}>
              PHASOR VECTOR RELATIONSHIP
            </div>
            {/* SVG Phasor Vector Representation */}
            <svg viewBox="0 0 200 160" style={{ width: '100%', height: '140px' }}>
              <line x1="20" y1="130" x2="190" y2="130" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
              <line x1="20" y1="20" x2="20" y2="150" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />

              {/* VR vector along real axis (Horizontal: Green) */}
              <line x1="20" y1="130" x2="130" y2="130" stroke="#22C55E" strokeWidth="3" />
              <text x="135" y="134" fill="#22C55E" fontSize="10" fontFamily="monospace">I / VR</text>

              {/* Net Reactive vector (Vertical: Amber/Violet) */}
              <line
                x1="130"
                y1="130"
                x2="130"
                y2={Math.max(20, Math.min(145, 130 - (netReactance / Math.max(10, impedance)) * 75))}
                stroke={netReactance >= 0 ? '#F59E0B' : '#A855F7'}
                strokeWidth="2.5"
              />
              <text
                x="135"
                y={Math.max(25, 130 - (netReactance / Math.max(10, impedance)) * 75)}
                fill={netReactance >= 0 ? '#F59E0B' : '#A855F7'}
                fontSize="10"
                fontFamily="monospace"
              >
                {netReactance >= 0 ? 'VL - VC' : 'VC - VL'}
              </text>

              {/* Resultant Supply Voltage V (Hypotenuse: Cyan) */}
              <line
                x1="20"
                y1="130"
                x2="130"
                y2={Math.max(20, Math.min(145, 130 - (netReactance / Math.max(10, impedance)) * 75))}
                stroke="#38BDF8"
                strokeWidth="3"
              />
              <text x="65" y="70" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">V</text>

              {/* Phase angle arc */}
              <path
                d={`M 50 130 A 30 30 0 0 ${phiRad >= 0 ? 0 : 1} ${20 + 30 * Math.cos(-phiRad)} ${130 + 30 * Math.sin(-phiRad)}`}
                fill="none"
                stroke="#6366F1"
                strokeWidth="1.5"
              />
              <text x="56" y="122" fill="#6366F1" fontSize="10" fontFamily="monospace">φ={phiDeg.toFixed(1)}°</text>
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleTuneToResonance}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '11px', justifyContent: 'center' }}
            >
              Tune to Resonance (f0 = {resonantFreq.toFixed(1)} Hz)
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Laboratory Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
        }}
      >
        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL IMPEDANCE (Z)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {impedance.toFixed(1)} Ω
          </div>
        </div>

        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INDUCTIVE REACTANCE (X_L)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>
            {xl.toFixed(1)} Ω
          </div>
        </div>

        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CAPACITIVE REACTANCE (X_C)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7' }}>
            {xc.toFixed(1)} Ω
          </div>
        </div>

        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CIRCUIT CURRENT (I_RMS)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#22C55E' }}>
            {iRms.toFixed(2)} A
          </div>
        </div>

        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>POWER FACTOR (cos φ)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {powerFactor.toFixed(3)}
          </div>
        </div>

        <div className="ea-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE POWER (P)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-hover)' }}>
            {realPower.toFixed(1)} W
          </div>
        </div>
      </div>

      {/* Parameter Adjustment Sliders */}
      <div
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Frequency Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Supply Frequency (f)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)' }}>{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            step="1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>

        {/* Resistance Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Resistance (R)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)' }}>{resistance} Ω</span>
          </div>
          <input
            type="range"
            min="10"
            max="400"
            step="5"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>

        {/* Inductance Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Inductance (L)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B' }}>{inductance} mH</span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            step="2"
            value={inductance}
            onChange={(e) => setInductance(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#F59E0B' }}
          />
        </div>

        {/* Capacitance Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Capacitance (C)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}>{capacitance} µF</span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            step="1"
            value={capacitance}
            onChange={(e) => setCapacitance(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#A855F7' }}
          />
        </div>
      </div>

      {/* Animation Controls */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
        currentStep={1}
        totalSteps={1}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={`f = ${frequency} Hz | Z = ${impedance.toFixed(1)} Ω | φ = ${phiDeg.toFixed(1)}°`}
      />
    </div>
  );
}
