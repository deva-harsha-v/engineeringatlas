'use client';

import React from 'react';
import { VisualizationType, AtlasTopic } from '@/lib/types';
import { resolveEngineConfig } from '@/lib/atlas/visualization-registry';

import dynamic from 'next/dynamic';
import { AlertCircle } from 'lucide-react';

const EngineSkeleton = () => (
  <div style={{ padding: '20px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
    <div className="skeleton" style={{ height: '360px', width: '100%', borderRadius: 'var(--radius-md)' }} />
  </div>
);

// Dynamically split visualizer engines
const AVLTreeVisualizer = dynamic(() => import('./visualizations/AVLTreeVisualizer').then((m) => m.AVLTreeVisualizer), { loading: EngineSkeleton });
const CPUSchedulingVisualizer = dynamic(() => import('./visualizations/CPUSchedulingVisualizer').then((m) => m.CPUSchedulingVisualizer), { loading: EngineSkeleton });
const DeadlockVisualizer = dynamic(() => import('./visualizations/DeadlockVisualizer').then((m) => m.DeadlockVisualizer), { loading: EngineSkeleton });
const PagingVisualizer = dynamic(() => import('./visualizations/PagingVisualizer').then((m) => m.PagingVisualizer), { loading: EngineSkeleton });
const TCPHandshakeVisualizer = dynamic(() => import('./visualizations/TCPHandshakeVisualizer').then((m) => m.TCPHandshakeVisualizer), { loading: EngineSkeleton });
const CompilerPipelineVisualizer = dynamic(() => import('./visualizations/CompilerPipelineVisualizer').then((m) => m.CompilerPipelineVisualizer), { loading: EngineSkeleton });
const NormalizationVisualizer = dynamic(() => import('./visualizations/NormalizationVisualizer').then((m) => m.NormalizationVisualizer), { loading: EngineSkeleton });
const SortingVisualizer = dynamic(() => import('./visualizations/SortingVisualizer').then((m) => m.SortingVisualizer), { loading: EngineSkeleton });
const WaveformSamplingVisualizer = dynamic(() => import('./visualizations/WaveformSamplingVisualizer').then((m) => m.WaveformSamplingVisualizer), { loading: EngineSkeleton });
const CircuitVisualizer = dynamic(() => import('./visualizations/CircuitVisualizer').then((m) => m.CircuitVisualizer), { loading: EngineSkeleton });

interface VisualizationRendererProps {
  type?: VisualizationType | string | null;
  configuration?: Record<string, any>;
  topic?: AtlasTopic;
}

const REGISTRY: Record<string, React.ComponentType<{ configuration?: any; topic?: AtlasTopic }>> = {
  TREE_VISUALIZER: AVLTreeVisualizer as any,
  PROCESS_SCHEDULER: CPUSchedulingVisualizer as any,
  DEADLOCK_GRAPH: DeadlockVisualizer as any,
  PAGE_REPLACEMENT: PagingVisualizer as any,
  PACKET_FLOW: TCPHandshakeVisualizer as any,
  PIPELINE_VISUALIZER: CompilerPipelineVisualizer as any,
  NORMALIZATION_ENGINE: NormalizationVisualizer as any,
  SORTING_VISUALIZER: SortingVisualizer as any,
  WAVEFORM_VISUALIZER: WaveformSamplingVisualizer as any,
  CIRCUIT_VISUALIZER: CircuitVisualizer as any,
};

export function VisualizationRenderer({ type, configuration, topic }: VisualizationRendererProps) {
  if (!type) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          background: 'var(--surface-1)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <AlertCircle size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
        <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Standard Theoretical Syllabus Topic
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          This topic is structured as pure concept explanation, formulas, and examination practice questions. No simulation engine required.
        </p>
      </div>
    );
  }

  const EngineComponent = REGISTRY[type];

  if (!EngineComponent) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          background: 'var(--surface-1)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border)',
        }}
      >
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Visualization engine <code>{type}</code> is registered but undergoing maintenance.
        </p>
      </div>
    );
  }

  const resolvedConfig = resolveEngineConfig(type as VisualizationType, configuration);

  return <EngineComponent configuration={resolvedConfig} topic={topic} />;
}
