'use client';

import React from 'react';
import { AtlasTopic } from '@/lib/types';
import { VisualizationRenderer } from './VisualizationRenderer';

interface AtlasViewerProps {
  topic: AtlasTopic;
}

/**
 * AtlasViewer component
 * Resolves the visual engine dynamically via VisualizationRenderer factory
 * without hardcoding to individual slugs.
 */
export function AtlasViewer({ topic }: AtlasViewerProps) {
  return (
    <VisualizationRenderer
      type={topic.visualizationType}
      configuration={topic.configuration}
      topic={topic}
    />
  );
}
