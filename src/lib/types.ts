// Engineering Atlas Core TypeScript Definitions

export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type MaterialType = 'NOTES' | 'PPT' | 'LAB_MANUAL' | 'REFERENCE' | 'HANDOUT' | 'OTHER';

export type ExamType = 'INTERNAL_1' | 'INTERNAL_2' | 'END_SEMESTER' | 'MODEL_PAPER' | 'SUPPLEMENTARY';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionType = 'MCQ' | 'DESCRIPTIVE' | 'NUMERICAL';

export type LearningType =
  | 'STANDARD_CONTENT'
  | 'VISUAL_EXPLANATION'
  | 'ANIMATION'
  | 'INTERACTIVE'
  | 'SIMULATION'
  | 'DIAGRAM'
  | 'PRACTICE'
  | 'LAB';

export type VisualizationType =
  | 'TREE_VISUALIZER'
  | 'PROCESS_SCHEDULER'
  | 'DEADLOCK_GRAPH'
  | 'PAGE_REPLACEMENT'
  | 'PACKET_FLOW'
  | 'PIPELINE_VISUALIZER'
  | 'NORMALIZATION_ENGINE'
  | 'SORTING_VISUALIZER'
  | 'WAVEFORM_VISUALIZER'
  | 'CIRCUIT_VISUALIZER'
  | 'GENERIC_INTERACTIVE';

export interface AcademicProfile {
  branch: string; // e.g. "CSE"
  branchName?: string; // e.g. "Computer Science & Engineering"
  year: number; // e.g. 3
  yearName?: string; // e.g. "III Year"
  semester: number; // e.g. 7
  semesterName?: string; // e.g. "VII Semester"
  section: string; // e.g. "CSE-A"
  sectionId?: string; // e.g. "sec-csea"
  studentName?: string; // e.g. "Aspirant"
  rollNumber?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  institutionId: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
  mustChangePassword?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING_PASSWORD_CHANGE';
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  branchId: string;
  yearNumber: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: string;
  academicYearId: string;
  semNumber: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  semesterId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  branchId: string;
  semesterId: string;
  name: string;
  code: string;
  description?: string;
  unitsCount: number;
  topicsCount: number;
  atlasCount?: number;
  materialsCount?: number;
  assignmentsCount?: number;
  papersCount?: number;
  questionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyAssignment {
  id: string;
  facultyId: string;
  subjectId: string;
  sectionId: string;
  academicYear?: string;
  facultyName?: string;
  subjectName?: string;
  subjectCode?: string;
  sectionName?: string;
  branchCode?: string;
  branchName?: string;
  semesterName?: string;
  studentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  unit?: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  status: ContentStatus;
  subjectId: string;
  sectionId?: string;
  facultyId: string;
  facultyAssignmentId?: string;
  facultyName?: string;
  subjectName?: string;
  sectionName?: string;
  downloadsCount: number;
  version?: number;
  previousVersions?: Array<{ version: number; fileUrl: string; fileName: string; replacedAt: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  unit?: number;
  deadline: string;
  fileUrl?: string;
  fileName?: string;
  submissionMethod: string;
  status: ContentStatus;
  subjectId: string;
  sectionId: string;
  facultyId: string;
  facultyAssignmentId?: string;
  facultyName?: string;
  subjectName?: string;
  subjectCode?: string;
  sectionName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  academicYear: string;
  examType: ExamType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: ContentStatus;
  branchId: string;
  semesterId: string;
  subjectId: string;
  subjectName?: string;
  extractedQuestionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  subjectId: string;
  subjectName?: string;
  unit: number;
  topic: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  questionText: string;
  options?: string[]; // Parsed from JSON string
  correctAnswer: string;
  explanation: string;
  frequency: number;
  repeatCount: number;
  status: ContentStatus;
  facultyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AtlasTopicMapping {
  id: string;
  atlasTopicId: string;
  branchId?: string;
  branchCode?: string;
  subjectId: string;
  unit: number;
  topicName?: string;
}

export interface AtlasTopic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  departmentId?: string;
  department?: string; // e.g. "CSE", "ECE", "EEE", "MECH", "CIVIL", "COMMON"
  classroomCode?: string; // e.g. "OS-CPU-01"
  unitId?: string;
  unit: number;
  topic: string;
  learningType: LearningType;
  visualizationType?: VisualizationType | null;
  configuration?: Record<string, any>;
  canonicalTopicId?: string;
  academicMappings?: AtlasTopicMapping[];
  difficulty: QuestionDifficulty;
  estimatedTime: string;
  learningObjectives: string[];
  content?: string; // Detailed structured academic content for standard or visual topics
  overview: string;
  whyItMatters: string;
  concept: string;
  howItWorks: string;
  example: string;
  commonMistakes: string;
  quickRevision: string;
  commonPitfalls?: string[];
  revisionChecklist?: string[];
  status: ContentStatus;
  viewCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  institutionId: string;
  subjectId?: string;
  subjectName?: string;
  sectionId?: string;
  sectionName?: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeSet {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  topic?: string;
  unit?: number;
  questions: Question[];
  totalQuestions: number;
  estimatedMinutes: number;
}
