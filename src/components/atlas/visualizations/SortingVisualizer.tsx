'use client';

import React, { useState, useEffect } from 'react';
import { AtlasControls } from '../AtlasControls';
import { BarChart2, Shuffle, CheckCircle2 } from 'lucide-react';

interface SortStep {
  array: number[];
  comparing: number[]; // indices being compared
  pivotIndex?: number;
  sortedIndices: number[];
  text: string;
}

const INITIAL_ARRAY = [45, 12, 85, 32, 89, 39, 69, 22, 58];

export function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<'QUICKSORT' | 'MERGESORT'>('QUICKSORT');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Generate steps for QuickSort (Lomuto partition)
  const generateQuickSortSteps = (initial: number[]) => {
    const list = [...initial];
    const generated: SortStep[] = [];
    const sorted: number[] = [];

    generated.push({
      array: [...list],
      comparing: [],
      sortedIndices: [],
      text: 'Initial unsorted array. Preparing to partition around pivot.',
    });

    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pivot = arr[high];
        generated.push({
          array: [...arr],
          comparing: [],
          pivotIndex: high,
          sortedIndices: [...sorted],
          text: `Selected pivot element: ${pivot} at index ${high}.`,
        });

        let i = low - 1;
        for (let j = low; j < high; j++) {
          generated.push({
            array: [...arr],
            comparing: [j, high],
            pivotIndex: high,
            sortedIndices: [...sorted],
            text: `Comparing element ${arr[j]} with pivot ${pivot}.`,
          });

          if (arr[j] < pivot) {
            i++;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            generated.push({
              array: [...arr],
              comparing: [i, j],
              pivotIndex: high,
              sortedIndices: [...sorted],
              text: `Swapped ${arr[i]} and ${arr[j]} into left partition (< pivot).`,
            });
          }
        }

        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        const pi = i + 1;
        sorted.push(pi);

        generated.push({
          array: [...arr],
          comparing: [],
          pivotIndex: pi,
          sortedIndices: [...sorted],
          text: `Placed pivot ${arr[pi]} at its final sorted position index ${pi}.`,
        });

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      } else if (low === high) {
        sorted.push(low);
      }
    };

    quickSort(list, 0, list.length - 1);

    generated.push({
      array: [...list],
      comparing: [],
      sortedIndices: Array.from({ length: list.length }, (_, i) => i),
      text: 'Sorting complete! Entire array is in non-decreasing order.',
    });

    return generated;
  };

  useEffect(() => {
    const gen = generateQuickSortSteps(INITIAL_ARRAY);
    setSteps(gen);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm]);

  // Playback timer
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
      }, 1400 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const active = steps[currentStep] || steps[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Algorithm Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <button
            onClick={() => setAlgorithm('QUICKSORT')}
            className={`btn btn-sm ${algorithm === 'QUICKSORT' ? 'btn-primary' : 'btn-secondary'}`}
          >
            QuickSort (Lomuto)
          </button>
        </div>

        <button
          onClick={() => {
            const shuffled = [...INITIAL_ARRAY].sort(() => Math.random() - 0.5);
            setSteps(generateQuickSortSteps(shuffled));
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="btn btn-secondary btn-sm"
        >
          <Shuffle size={14} /> Shuffle Array
        </button>
      </div>

      {/* Main Bar Chart Canvas */}
      <div
        className="tech-grid-bg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          height: '320px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '14px',
          padding: '30px 20px 20px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '14px', left: '16px' }} className="tech-coordinate">
          ARRAY VISUALIZER · TIME COMPLEXITY: O(N LOG N)
        </div>

        {active?.array.map((val, idx) => {
          const isPivot = active.pivotIndex === idx;
          const isComparing = active.comparing.includes(idx);
          const isSorted = active.sortedIndices.includes(idx);

          let barColor = 'var(--surface-3)';
          let borderColor = 'var(--border)';

          if (isPivot) {
            barColor = 'var(--accent)';
            borderColor = 'var(--accent-hover)';
          } else if (isComparing) {
            barColor = 'var(--warning)';
            borderColor = '#FBBF24';
          } else if (isSorted) {
            barColor = 'var(--success)';
            borderColor = '#4ADE80';
          }

          const heightPct = (val / 100) * 200;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                width: '42px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: isPivot ? 'var(--accent-hover)' : isComparing ? 'var(--warning)' : 'var(--text-secondary)',
                }}
              >
                {val}
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${heightPct}px`,
                  backgroundColor: barColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.2s ease, background-color 0.2s ease',
                }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Description */}
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {active?.text}
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
        statusText={`QuickSort Lomuto Partition`}
      />
    </div>
  );
}
