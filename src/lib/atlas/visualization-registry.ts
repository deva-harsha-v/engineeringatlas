import { VisualizationType } from '@/lib/types';

export interface ConfigFieldDefinition {
  key: string;
  label: string;
  type: 'select' | 'multi-select' | 'number' | 'text' | 'boolean';
  options?: { label: string; value: any }[];
  defaultValue: any;
  description?: string;
}

export interface VisualizationEngineDescriptor {
  id: VisualizationType;
  label: string;
  description: string;
  suggestedBranches: string[];
  defaultConfiguration: Record<string, any>;
  configFields: ConfigFieldDefinition[];
}

export const VISUALIZATION_REGISTRY: Record<VisualizationType, VisualizationEngineDescriptor> = {
  TREE_VISUALIZER: {
    id: 'TREE_VISUALIZER',
    label: 'Tree Visualizer (AVL / BST / Balanced Trees)',
    description: 'Interactive node insertion, deletion, balancing rotations (LL, RR, LR, RL), and height/balance factor calculation.',
    suggestedBranches: ['CSE', 'IT', 'AI&ML', 'CSE-DS'],
    defaultConfiguration: {
      treeType: 'AVL',
      operations: ['insert', 'delete', 'search'],
      initialKeys: [30, 20, 10, 40, 50],
    },
    configFields: [
      {
        key: 'treeType',
        label: 'Tree Mode',
        type: 'select',
        options: [
          { label: 'AVL Self-Balancing Tree', value: 'AVL' },
          { label: 'Binary Search Tree (BST)', value: 'BST' },
        ],
        defaultValue: 'AVL',
      },
      {
        key: 'operations',
        label: 'Allowed Operations',
        type: 'multi-select',
        options: [
          { label: 'Insert', value: 'insert' },
          { label: 'Delete', value: 'delete' },
          { label: 'Search', value: 'search' },
        ],
        defaultValue: ['insert', 'delete', 'search'],
      },
    ],
  },

  PROCESS_SCHEDULER: {
    id: 'PROCESS_SCHEDULER',
    label: 'Process Scheduler (CPU Scheduling & Gantt Chart)',
    description: 'CPU scheduling simulator demonstrating Gantt chart timeline, waiting time, and turnaround time for FCFS, SJF, RR, Priority.',
    suggestedBranches: ['CSE', 'IT'],
    defaultConfiguration: {
      algorithms: ['FCFS', 'SJF', 'RR', 'PRIORITY'],
      defaultAlgorithm: 'RR',
      defaultQuantum: 3,
      allowProcessEditing: true,
    },
    configFields: [
      {
        key: 'defaultAlgorithm',
        label: 'Default Algorithm',
        type: 'select',
        options: [
          { label: 'Round Robin (RR)', value: 'RR' },
          { label: 'First-Come First-Served (FCFS)', value: 'FCFS' },
          { label: 'Shortest Job First (SJF)', value: 'SJF' },
          { label: 'Priority Scheduling', value: 'PRIORITY' },
        ],
        defaultValue: 'RR',
      },
      {
        key: 'defaultQuantum',
        label: 'Default Time Quantum',
        type: 'number',
        defaultValue: 3,
        description: 'Time slice for Round Robin execution (in time units)',
      },
    ],
  },

  DEADLOCK_GRAPH: {
    id: 'DEADLOCK_GRAPH',
    label: 'Deadlock & Resource Allocation Graph',
    description: "Resource Allocation Graph (RAG) cycle detection and Banker's safety state determination algorithm.",
    suggestedBranches: ['CSE', 'IT'],
    defaultConfiguration: {
      detectionMode: 'BANKER',
      initialProcesses: 4,
      initialResources: 3,
    },
    configFields: [
      {
        key: 'detectionMode',
        label: 'Analysis Mode',
        type: 'select',
        options: [
          { label: "Banker's Safety Algorithm", value: 'BANKER' },
          { label: 'Wait-For Graph Cycle Detection', value: 'CYCLE_DETECTION' },
        ],
        defaultValue: 'BANKER',
      },
    ],
  },

  PAGE_REPLACEMENT: {
    id: 'PAGE_REPLACEMENT',
    label: 'Page Replacement Simulator (Virtual Memory)',
    description: 'Virtual memory page replacement algorithms (FIFO, LRU, Optimal) tracking memory frames, hits, and page faults.',
    suggestedBranches: ['CSE', 'IT'],
    defaultConfiguration: {
      frameCount: 3,
      algorithms: ['FIFO', 'LRU', 'OPTIMAL'],
      defaultAlgorithm: 'FIFO',
    },
    configFields: [
      {
        key: 'frameCount',
        label: 'Memory Frame Capacity',
        type: 'number',
        defaultValue: 3,
        description: 'Number of physical memory frames (typically 3 to 5)',
      },
      {
        key: 'defaultAlgorithm',
        label: 'Default Algorithm',
        type: 'select',
        options: [
          { label: 'First-In First-Out (FIFO)', value: 'FIFO' },
          { label: 'Least Recently Used (LRU)', value: 'LRU' },
          { label: 'Optimal Page Replacement', value: 'OPTIMAL' },
        ],
        defaultValue: 'FIFO',
      },
    ],
  },

  PACKET_FLOW: {
    id: 'PACKET_FLOW',
    label: 'Packet Flow & Protocol Simulator (TCP Handshake)',
    description: 'Step-by-step interactive TCP 3-way connection establishment (SYN, SYN-ACK, ACK) and 4-way teardown.',
    suggestedBranches: ['CSE', 'IT', 'ECE'],
    defaultConfiguration: {
      protocol: 'TCP',
      showSequenceNumbers: true,
      allowPacketDrop: false,
    },
    configFields: [
      {
        key: 'protocol',
        label: 'Transport Protocol',
        type: 'select',
        options: [
          { label: 'TCP 3-Way Handshake & Teardown', value: 'TCP' },
          { label: 'UDP Connectionless Datagram', value: 'UDP' },
        ],
        defaultValue: 'TCP',
      },
    ],
  },

  PIPELINE_VISUALIZER: {
    id: 'PIPELINE_VISUALIZER',
    label: 'Compiler Pipeline Visualizer (6 Stages)',
    description: 'Source code translation progression through Lexical, Syntax (AST), Semantic, ICG, Optimization, and Code Generation.',
    suggestedBranches: ['CSE', 'IT'],
    defaultConfiguration: {
      initialSource: 'int x = a + b * 2;',
      stages: ['LEXICAL', 'SYNTAX', 'SEMANTIC', 'ICG', 'OPTIMIZATION', 'CODEGEN'],
    },
    configFields: [
      {
        key: 'initialSource',
        label: 'Initial Expression',
        type: 'text',
        defaultValue: 'int x = a + b * 2;',
      },
    ],
  },

  NORMALIZATION_ENGINE: {
    id: 'NORMALIZATION_ENGINE',
    label: 'DBMS Normalization & Relational Schema Engine',
    description: 'Interactive schema decomposition from 1NF to 3NF/BCNF with functional dependency analysis and B+ tree indexing.',
    suggestedBranches: ['CSE', 'IT', 'AI&ML'],
    defaultConfiguration: {
      maxNormalForm: '3NF',
      enableDecomposition: true,
    },
    configFields: [
      {
        key: 'maxNormalForm',
        label: 'Target Normal Form',
        type: 'select',
        options: [
          { label: 'Third Normal Form (3NF)', value: '3NF' },
          { label: 'Boyce-Codd Normal Form (BCNF)', value: 'BCNF' },
        ],
        defaultValue: '3NF',
      },
    ],
  },

  SORTING_VISUALIZER: {
    id: 'SORTING_VISUALIZER',
    label: 'Sorting Algorithms Race & Step Visualizer',
    description: 'Visual side-by-side comparison and step-by-step array partition/merge tracking for QuickSort, MergeSort, and BubbleSort.',
    suggestedBranches: ['CSE', 'IT', 'AI&ML'],
    defaultConfiguration: {
      algorithms: ['QUICKSORT', 'MERGESORT', 'BUBBLESORT'],
      defaultAlgorithm: 'QUICKSORT',
      arraySize: 16,
    },
    configFields: [
      {
        key: 'defaultAlgorithm',
        label: 'Initial Sorting Algorithm',
        type: 'select',
        options: [
          { label: 'QuickSort (Divide & Conquer)', value: 'QUICKSORT' },
          { label: 'MergeSort (Recursive Split)', value: 'MERGESORT' },
          { label: 'BubbleSort (Comparison)', value: 'BUBBLESORT' },
        ],
        defaultValue: 'QUICKSORT',
      },
    ],
  },

  WAVEFORM_VISUALIZER: {
    id: 'WAVEFORM_VISUALIZER',
    label: 'Waveform Sampling & Aliasing Visualizer (Nyquist-Shannon)',
    description: 'Analog signal sampling laboratory demonstrating the Nyquist criterion (fs >= 2 fmax), aliasing, and sinc reconstruction.',
    suggestedBranches: ['ECE', 'EEE', 'ECT'],
    defaultConfiguration: {
      defaultInputFreq: 5,
      defaultSamplingRate: 25,
      signalType: 'SINE',
    },
    configFields: [
      {
        key: 'defaultInputFreq',
        label: 'Default Input Signal Frequency (Hz)',
        type: 'number',
        defaultValue: 5,
      },
      {
        key: 'defaultSamplingRate',
        label: 'Default Sampling Rate (Hz)',
        type: 'number',
        defaultValue: 25,
      },
    ],
  },

  CIRCUIT_VISUALIZER: {
    id: 'CIRCUIT_VISUALIZER',
    label: 'AC Circuits & RLC Resonance Visualizer',
    description: 'Alternating Current RLC circuit laboratory featuring dynamic phasor diagram, impedance calculation, and dual oscilloscope traces.',
    suggestedBranches: ['EEE', 'ECE', 'MECH'],
    defaultConfiguration: {
      circuitType: 'RLC_AC',
      defaultFrequency: 50,
      defaultResistance: 100,
      defaultInductance: 50,
      defaultCapacitance: 20,
    },
    configFields: [
      {
        key: 'circuitType',
        label: 'Circuit Topology',
        type: 'select',
        options: [
          { label: 'Series RLC Circuit (AC Source)', value: 'RLC_AC' },
          { label: 'Parallel RLC Circuit', value: 'RLC_PARALLEL' },
          { label: 'Pure Inductive / Capacitive (Phasor)', value: 'PURE_REACTIVE' },
        ],
        defaultValue: 'RLC_AC',
      },
      {
        key: 'defaultFrequency',
        label: 'AC Supply Frequency (Hz)',
        type: 'number',
        defaultValue: 50,
      },
      {
        key: 'defaultResistance',
        label: 'Resistance R (Ohms)',
        type: 'number',
        defaultValue: 100,
      },
      {
        key: 'defaultInductance',
        label: 'Inductance L (millihenries, mH)',
        type: 'number',
        defaultValue: 50,
      },
      {
        key: 'defaultCapacitance',
        label: 'Capacitance C (microfarads, µF)',
        type: 'number',
        defaultValue: 20,
      },
    ],
  },

  GENERIC_INTERACTIVE: {
    id: 'GENERIC_INTERACTIVE',
    label: 'Generic Interactive Concept Visualizer',
    description: 'Adaptable parameter-exploration canvas for mathematical models and engineering equations.',
    suggestedBranches: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    defaultConfiguration: {},
    configFields: [],
  },
};

/**
 * Returns all registered visualization engines
 */
export function getRegisteredEngines(): VisualizationEngineDescriptor[] {
  return Object.values(VISUALIZATION_REGISTRY);
}

/**
 * Returns a specific engine descriptor or null if not registered
 */
export function getEngineById(id: VisualizationType | string): VisualizationEngineDescriptor | null {
  return VISUALIZATION_REGISTRY[id as VisualizationType] || null;
}

/**
 * Validates and merges configuration with defaults for a given visualization engine
 */
export function resolveEngineConfig(
  type: VisualizationType | string | null | undefined,
  config?: Record<string, any>
): Record<string, any> {
  if (!type) return {};
  const engine = getEngineById(type);
  if (!engine) return config || {};
  return {
    ...engine.defaultConfiguration,
    ...(config || {}),
  };
}
