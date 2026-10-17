'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { Plus, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AVLNode {
  key: number;
  height: number;
  bf: number;
  left?: AVLNode;
  right?: AVLNode;
  isNew?: boolean;
  isUnbalanced?: boolean;
}

interface StepLog {
  title: string;
  description: string;
  tree: AVLNode | null;
  rotation?: string;
  imbalanceNode?: number;
}

export function AVLTreeVisualizer() {
  const [inputValue, setInputValue] = useState<string>('15');
  const [steps, setSteps] = useState<StepLog[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Helper height and BF calculation
  const getHeight = (node?: AVLNode): number => (node ? node.height : 0);
  const getBF = (node?: AVLNode): number => (node ? getHeight(node.left) - getHeight(node.right) : 0);

  const updateHeightAndBF = (node: AVLNode): AVLNode => {
    const leftH = getHeight(node.left);
    const rightH = getHeight(node.right);
    const height = Math.max(leftH, rightH) + 1;
    const bf = leftH - rightH;
    return { ...node, height, bf };
  };

  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left!;
    const T2 = x.right;
    const newY = updateHeightAndBF({ ...y, left: T2, isUnbalanced: false });
    const newX = updateHeightAndBF({ ...x, right: newY, isUnbalanced: false });
    return newX;
  };

  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right!;
    const T2 = y.left;
    const newX = updateHeightAndBF({ ...x, right: T2, isUnbalanced: false });
    const newY = updateHeightAndBF({ ...y, left: newX, isUnbalanced: false });
    return newY;
  };

  // Build predefined demonstration steps for "Insert 30 -> 20 -> 10"
  const loadScenario = (type: 'LL' | 'RR' | 'LR' | 'RL') => {
    setIsPlaying(false);
    const newSteps: StepLog[] = [];

    if (type === 'LL') {
      // 30 -> 20 -> 10 => LL Imbalance on 30 -> Single Right Rotation
      const s1: AVLNode = { key: 30, height: 1, bf: 0 };
      newSteps.push({
        title: 'Insert 30 (Initial Root)',
        description: '30 is inserted as the root. Height = 1, Balance Factor = 0. Tree is perfectly balanced.',
        tree: s1,
      });

      const s2: AVLNode = {
        key: 30,
        height: 2,
        bf: 1,
        left: { key: 20, height: 1, bf: 0 },
      };
      newSteps.push({
        title: 'Insert 20 (Left of 30)',
        description: '20 < 30, so 20 is placed on the left. Height of 30 becomes 2. BF(30) = +1. Still within valid range {-1, 0, 1}.',
        tree: s2,
      });

      const s3: AVLNode = {
        key: 30,
        height: 3,
        bf: 2,
        isUnbalanced: true,
        left: {
          key: 20,
          height: 2,
          bf: 1,
          left: { key: 10, height: 1, bf: 0, isNew: true },
        },
      };
      newSteps.push({
        title: 'Insert 10 (Left of 20) -> Imbalance Detected!',
        description: '10 < 20, so 10 is placed on the left. BF(30) = Height(Left:2) - Height(Right:0) = +2! Condition |BF| <= 1 is violated on node 30.',
        tree: s3,
        imbalanceNode: 30,
      });

      newSteps.push({
        title: 'Identify Case: Left-Left (LL)',
        description: 'Node 10 was inserted into the LEFT subtree of the LEFT child (20) of the critical node (30). This is a Left-Left (LL) case.',
        tree: s3,
        rotation: 'Right Rotation on 30',
        imbalanceNode: 30,
      });

      const s4: AVLNode = {
        key: 20,
        height: 2,
        bf: 0,
        left: { key: 10, height: 1, bf: 0 },
        right: { key: 30, height: 1, bf: 0 },
      };
      newSteps.push({
        title: 'Perform Single Right Rotation -> Balanced!',
        description: 'Right rotation brings node 20 up to the root, making 10 its left child and 30 its right child. All balance factors return to 0!',
        tree: s4,
      });
    } else if (type === 'LR') {
      // 30 -> 10 -> 20 => Left-Right Imbalance
      const s1: AVLNode = { key: 30, height: 1, bf: 0 };
      newSteps.push({
        title: 'Insert 30 (Root)',
        description: 'Root created with key 30. BF = 0.',
        tree: s1,
      });

      const s2: AVLNode = {
        key: 30,
        height: 2,
        bf: 1,
        left: { key: 10, height: 1, bf: 0 },
      };
      newSteps.push({
        title: 'Insert 10',
        description: '10 placed as left child of 30. BF(30) = +1.',
        tree: s2,
      });

      const s3: AVLNode = {
        key: 30,
        height: 3,
        bf: 2,
        isUnbalanced: true,
        left: {
          key: 10,
          height: 2,
          bf: -1,
          right: { key: 20, height: 1, bf: 0, isNew: true },
        },
      };
      newSteps.push({
        title: 'Insert 20 -> Left-Right (LR) Imbalance!',
        description: '20 is inserted as the RIGHT child of 10. BF(30) = +2, BF(10) = -1. This requires a double rotation: Left rotate 10, then Right rotate 30.',
        tree: s3,
        imbalanceNode: 30,
      });

      const s4: AVLNode = {
        key: 30,
        height: 3,
        bf: 2,
        isUnbalanced: true,
        left: {
          key: 20,
          height: 2,
          bf: 1,
          left: { key: 10, height: 1, bf: 0 },
        },
      };
      newSteps.push({
        title: 'Step 1: Left Rotate Child (Node 10)',
        description: 'Left rotation transforms the Left-Right shape into a standard Left-Left shape with 20 in the middle.',
        tree: s4,
        rotation: 'Left Rotation on 10',
        imbalanceNode: 30,
      });

      const s5: AVLNode = {
        key: 20,
        height: 2,
        bf: 0,
        left: { key: 10, height: 1, bf: 0 },
        right: { key: 30, height: 1, bf: 0 },
      };
      newSteps.push({
        title: 'Step 2: Right Rotate Root (Node 30) -> Restored!',
        description: 'Right rotation on 30 makes 20 the balanced root. Both subtrees now have height 1. Tree is restored to O(log n) efficiency!',
        tree: s5,
      });
    } else {
      // Default LL
      loadScenario('LL');
      return;
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    loadScenario('LL');
  }, []);

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const activeStep = steps[currentStepIndex] || steps[0];

  // SVG Tree layout calculation
  const renderSVGTree = (node: AVLNode | null | undefined, x: number, y: number, spread: number) => {
    if (!node) return null;

    const leftX = x - spread;
    const leftY = y + 70;
    const rightX = x + spread;
    const rightY = y + 70;

    const isUnbalanced = node.isUnbalanced || Math.abs(node.bf) > 1;

    return (
      <g key={`${node.key}-${x}-${y}`}>
        {/* Branch Lines */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={leftY}
            stroke={isUnbalanced ? '#EF4444' : '#6366F1'}
            strokeWidth={2}
            strokeDasharray={node.left.isNew ? '4 4' : undefined}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={rightY}
            stroke={isUnbalanced ? '#EF4444' : '#6366F1'}
            strokeWidth={2}
            strokeDasharray={node.right.isNew ? '4 4' : undefined}
          />
        )}

        {/* Child recursive calls */}
        {renderSVGTree(node.left, leftX, leftY, spread * 0.55)}
        {renderSVGTree(node.right, rightX, rightY, spread * 0.55)}

        {/* Node Circle */}
        <circle
          cx={x}
          cy={y}
          r={24}
          fill={isUnbalanced ? '#3B1518' : node.isNew ? '#152E20' : '#151C29'}
          stroke={isUnbalanced ? '#EF4444' : node.isNew ? '#22C55E' : '#6366F1'}
          strokeWidth={isUnbalanced ? 3 : 2}
        />

        {/* Key Label */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="#F8FAFC"
          fontSize={15}
          fontWeight={700}
          fontFamily="var(--font-mono)"
        >
          {node.key}
        </text>

        {/* Balance Factor Badge */}
        <rect
          x={x + 16}
          y={y - 24}
          width={40}
          height={18}
          rx={4}
          fill={isUnbalanced ? '#EF4444' : '#1E293B'}
          stroke={isUnbalanced ? '#FCA5A5' : '#334155'}
          strokeWidth={1}
        />
        <text
          x={x + 36}
          y={y - 11}
          textAnchor="middle"
          fill={isUnbalanced ? '#FFFFFF' : '#A8B1C2'}
          fontSize={10}
          fontFamily="var(--font-mono)"
          fontWeight={600}
        >
          BF:{node.bf > 0 ? `+${node.bf}` : node.bf}
        </text>

        {/* Height Sub-label */}
        <text
          x={x}
          y={y + 38}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={11}
          fontFamily="var(--font-mono)"
        >
          h={node.height}
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Preset Scenario Selector */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--surface-2)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Rotational Scenarios:
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => loadScenario('LL')}>
            Left-Left (LL) Single Right
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => loadScenario('LR')}>
            Left-Right (LR) Double Rotation
          </button>
        </div>
      </div>

      {/* SVG Tree Canvas (Matching UI spec: Laboratory Canvas with Subtle Coordinates) */}
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          height: '360px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="tech-grid-bg"
      >
        {/* Canvas Corner Coordinate Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <span>ENGINE: SVG_AVL_TREE</span>
          <span>COORDINATES: X=360, Y=240</span>
        </div>

        {/* Live Legend */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            background: 'rgba(17, 23, 34, 0.8)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span style={{ color: '#22C55E' }}>● BF in {'{-1, 0, +1}'} (Balanced)</span>
          <span style={{ color: '#EF4444' }}>● |BF| &gt; 1 (Unbalanced)</span>
        </div>

        <svg width="100%" height="100%" viewBox="0 0 600 320" style={{ overflow: 'visible' }}>
          {renderSVGTree(activeStep?.tree, 300, 50, 140)}
        </svg>
      </div>

      {/* Step Explanation Card (Design for Learning, Not Decoration) */}
      <div
        style={{
          background: activeStep?.imbalanceNode ? 'rgba(239, 68, 68, 0.08)' : 'var(--surface-1)',
          border: `1px solid ${activeStep?.imbalanceNode ? 'rgba(239, 68, 68, 0.4)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          {activeStep?.imbalanceNode ? (
            <AlertTriangle size={18} color="var(--error)" />
          ) : (
            <CheckCircle2 size={18} color="var(--success)" />
          )}
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {activeStep?.title}
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {activeStep?.description}
        </p>
      </div>

      {/* Controls Bar */}
      <AtlasControls
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
        onStepBackward={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
        onStepForward={() => setCurrentStepIndex((p) => Math.min(steps.length - 1, p + 1))}
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
        statusText={activeStep?.rotation || 'AVL Tree Balancer'}
      />
    </div>
  );
}
