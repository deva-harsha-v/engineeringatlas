'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Laptop, Server, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export function TCPHandshakeVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = [
    {
      title: 'Initial State: Passive Open',
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      packet: null,
      direction: null,
      explanation: 'Server binds to a port and executes LISTEN system call. Client socket is in CLOSED state waiting to initiate connection.',
    },
    {
      title: 'Step 1: Client sends SYN',
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      packet: { flags: 'SYN', seq: 100, ack: 0, text: 'SYN (seq = 100)' },
      direction: 'right',
      explanation: 'Client initiates active open by generating an Initial Sequence Number (ISN = 100) and sending a SYN packet. Client transitions to SYN_SENT.',
    },
    {
      title: 'Step 2: Server replies SYN + ACK',
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      packet: { flags: 'SYN-ACK', seq: 300, ack: 101, text: 'SYN-ACK (seq = 300, ack = 101)' },
      direction: 'left',
      explanation: 'Server receives SYN, allocates buffers, generates its own ISN = 300, acknowledges client seq+1 (101), and transitions to SYN_RCVD.',
    },
    {
      title: 'Step 3: Client sends ACK -> ESTABLISHED',
      clientState: 'ESTABLISHED',
      serverState: 'SYN_RCVD',
      packet: { flags: 'ACK', seq: 101, ack: 301, text: 'ACK (seq = 101, ack = 301)' },
      direction: 'right',
      explanation: 'Client receives SYN-ACK and transitions to ESTABLISHED. It sends an ACK packet acknowledging server seq+1 (301).',
    },
    {
      title: 'Connection Fully ESTABLISHED',
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      packet: { flags: 'DATA', seq: 101, ack: 301, text: 'HTTP GET /index.html' },
      direction: 'right',
      explanation: 'Server receives final ACK and transitions to ESTABLISHED. Both endpoints have synchronized sequence spaces; bidirectional reliable data transfer begins.',
    },
    {
      title: 'Teardown Phase: Active Close (FIN)',
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      packet: { flags: 'FIN-ACK', seq: 150, ack: 301, text: 'FIN (seq = 150)' },
      direction: 'right',
      explanation: 'When client application closes connection, it sends a FIN segment to terminate its half of the byte stream, transitioning to FIN_WAIT_1.',
    },
    {
      title: 'Server ACK & Passive Close',
      clientState: 'TIME_WAIT',
      serverState: 'CLOSE_WAIT',
      packet: { flags: 'ACK', seq: 301, ack: 151, text: 'ACK (ack = 151)' },
      direction: 'left',
      explanation: 'Server acknowledges FIN. Client enters TIME_WAIT (2*MSL) to guarantee delayed packets in flight expire before port reuse.',
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const active = steps[currentStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Network Wire Canvas */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '36px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Client Node */}
          <div
            style={{
              width: '180px',
              background: 'var(--surface-1)',
              border: `2px solid ${active.clientState === 'ESTABLISHED' ? 'var(--success)' : 'var(--accent)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <Laptop size={28} color="var(--accent-hover)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>CLIENT (HOST A)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              192.168.1.45 : 52140
            </div>
            <div style={{ marginTop: '10px' }}>
              <span
                className={`badge ${
                  active.clientState === 'ESTABLISHED'
                    ? 'badge-success'
                    : active.clientState === 'CLOSED'
                    ? 'badge-default'
                    : 'badge-accent'
                }`}
              >
                {active.clientState}
              </span>
            </div>
          </div>

          {/* Network Channel & Packet Flight */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 24px',
            }}
          >
            {/* Wire line */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '2px',
                background: 'var(--border)',
                transform: 'translateY(-50%)',
              }}
            />

            {/* Flying Packet */}
            {active.packet && (
              <div
                style={{
                  background: active.packet.flags === 'SYN' ? '#6366F1' : active.packet.flags === 'SYN-ACK' ? '#38BDF8' : '#22C55E',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {active.direction === 'right' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{active.packet.text}</span>
              </div>
            )}
          </div>

          {/* Server Node */}
          <div
            style={{
              width: '180px',
              background: 'var(--surface-1)',
              border: `2px solid ${active.serverState === 'ESTABLISHED' ? 'var(--success)' : 'var(--accent)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <Server size={28} color="var(--accent-hover)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>SERVER (HOST B)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              203.0.113.195 : 443
            </div>
            <div style={{ marginTop: '10px' }}>
              <span
                className={`badge ${
                  active.serverState === 'ESTABLISHED'
                    ? 'badge-success'
                    : active.serverState === 'LISTEN'
                    ? 'badge-default'
                    : 'badge-accent'
                }`}
              >
                {active.serverState}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Narrative Card */}
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <CheckCircle2 size={16} color="var(--accent-hover)" />
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {active.title}
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {active.explanation}
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
        onStepForward={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
        currentStep={currentStep + 1}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={`State: ${active.clientState} ↔ ${active.serverState}`}
      />
    </div>
  );
}
