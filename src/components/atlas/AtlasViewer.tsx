'use client';

import React from 'react';
import { AVLTreeVisualizer } from './visualizations/AVLTreeVisualizer';
import { CPUSchedulingVisualizer } from './visualizations/CPUSchedulingVisualizer';
import { DeadlockVisualizer } from './visualizations/DeadlockVisualizer';
import { PagingVisualizer } from './visualizations/PagingVisualizer';
import { TCPHandshakeVisualizer } from './visualizations/TCPHandshakeVisualizer';
import { CompilerPipelineVisualizer } from './visualizations/CompilerPipelineVisualizer';
import { NormalizationVisualizer } from './visualizations/NormalizationVisualizer';
import { SortingVisualizer } from './visualizations/SortingVisualizer';
import { AtlasTopic } from '@/lib/types';

interface AtlasViewerProps {
  topic: AtlasTopic;
}

export function AtlasViewer({ topic }: AtlasViewerProps) {
  switch (topic.slug) {
    case 'cpu-scheduling':
      return <CPUSchedulingVisualizer />;
    case 'avl-tree':
      return <AVLTreeVisualizer />;
    case 'deadlock':
      return <DeadlockVisualizer />;
    case 'paging-replacement':
      return <PagingVisualizer />;
    case 'tcp-handshake':
      return <TCPHandshakeVisualizer />;
    case 'compiler-pipeline':
      return <CompilerPipelineVisualizer />;
    case 'dbms-normalization':
      return <NormalizationVisualizer />;
    case 'sorting-algorithms':
      return <SortingVisualizer />;
    default:
      // Generic fallback
      return <CPUSchedulingVisualizer />;
  }
}
