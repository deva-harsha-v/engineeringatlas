// Engineering Atlas Core TypeScript Definitions

export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type MaterialType = 'NOTES' | 'PPT' | 'LAB_MANUAL' | 'REFERENCE' | 'HANDOUT' | 'OTHER';

export type ExamType = 'INTERNAL_1' | 'INTERNAL_2' | 'END_SEMESTER' | 'MODEL_PAPER' | 'SUPPLEMENTARY';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionType = 'MCQ' | 'DESCRIPTIVE' | 'NUMERICAL';

export type VisualizationType =
  | 'TREE_VISUALIZER'
  | 'PROCESS_SCHEDULER'
  | 'DEADLOCK_GRAPH'
  | 'PAGE_REPLACEMENT'
  | 'PACKET_FLOW'
  | 'PIPELINE_VISUALIZER'
  | 'NORMALIZATION_ENGINE'
  | 'SORTING_VISUALIZER'
  | 'GENERIC_INTERACTIVE';

export interface AcademicProfile {
  branch: string; // e.g. "CSE"
  branchName?: string; // e.g. "Computer Science & Engineering"
  year: number; // e.g. 3
  yearName?: string; // e.g. "III Year"
  semester: number; // e.g. 7
  semesterName?: string; // e.g. "VII Semester"
  section: string; // e.g. "CSE-A"
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
  semesterName?: string;
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
  facultyName?: string;
  subjectName?: string;
  sectionName?: string;
  downloadsCount: number;
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
  facultyName?: string;
  subjectName?: string;
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

export interface AtlasTopic {
  id: string;
  title: string;
  slug: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  unit: number;
  topic: string;
  difficulty: QuestionDifficulty;
  estimatedTime: string;
  learningObjectives: string[];
  visualizationType: VisualizationType;
  overview: string;
  whyItMatters: string;
  concept: string;
  howItWorks: string;
  example: string;
  commonMistakes: string;
  quickRevision: string;
  status: ContentStatus;
  viewCount: number;
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
