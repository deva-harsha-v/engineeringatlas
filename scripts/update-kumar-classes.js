import fs from 'fs';

const dbPath = 'data/atlas-db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Ensure subject sub-os-6 exists for VI Semester CSE
if (!db.subjects.find(s => s.id === 'sub-os-6')) {
  db.subjects.push({
    id: 'sub-os-6',
    branchId: 'branch-cse',
    semesterId: 'sem-6',
    name: 'Operating Systems',
    code: 'CS601',
    description: 'Processes, concurrency, memory management, and file systems.',
    unitsCount: 5,
    topicsCount: 24,
    materialsCount: 4,
    assignmentsCount: 3,
    papersCount: 2,
    questionsCount: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// 2. Ensure Dr. Kumar has the exact 3 classes
db.facultyAssignments = db.facultyAssignments.filter(fa => fa.facultyId !== 'user-kumar');
db.facultyAssignments.push(
  {
    id: 'fa-kumar-1',
    facultyId: 'user-kumar',
    subjectId: 'sub-dbms',
    sectionId: 'sec-csea',
    academicYear: '2026-2027',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fa-kumar-2',
    facultyId: 'user-kumar',
    subjectId: 'sub-cn',
    sectionId: 'sec-cseb',
    academicYear: '2026-2027',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fa-kumar-3',
    facultyId: 'user-kumar',
    subjectId: 'sub-os-6',
    sectionId: 'sec-cse6-a',
    academicYear: '2026-2027',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
);

// 3. Ensure Draft Assignment exists
const existingDraftIndex = db.assignments.findIndex(a => a.id === 'asg-draft-dbms-04');
const draftObj = {
  id: 'asg-draft-dbms-04',
  title: 'Assignment 04 · Normalization & Indexing',
  description: 'Construct B+ tree indexes and perform multi-valued dependency decomposition on schema R.',
  unit: 4,
  deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
  submissionMethod: 'Submit handwritten solutions in class on Friday.',
  status: 'DRAFT',
  subjectId: 'sub-dbms',
  sectionId: 'sec-csea',
  facultyId: 'user-kumar',
  facultyAssignmentId: 'fa-kumar-1',
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date(Date.now() - 7200000).toISOString()
};
if (existingDraftIndex >= 0) {
  db.assignments[existingDraftIndex] = draftObj;
} else {
  db.assignments.push(draftObj);
}

// 4. Ensure published assignments exist for Dr. Kumar
const existingPubIndex = db.assignments.findIndex(a => a.id === 'asg-pub-dbms-03');
const pubObj1 = {
  id: 'asg-pub-dbms-03',
  title: 'Assignment 03 · Normalization & BCNF',
  description: 'Solve candidate key problems and decompose schema into 3NF and BCNF.',
  unit: 3,
  deadline: '2026-10-22T23:59:00.000Z',
  submissionMethod: 'Submit handwritten solutions in class.',
  status: 'PUBLISHED',
  subjectId: 'sub-dbms',
  sectionId: 'sec-csea',
  facultyId: 'user-kumar',
  facultyAssignmentId: 'fa-kumar-1',
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
};
if (existingPubIndex >= 0) {
  db.assignments[existingPubIndex] = pubObj1;
} else {
  db.assignments.push(pubObj1);
}

const existingPub2Index = db.assignments.findIndex(a => a.id === 'asg-pub-cn-02');
const pubObj2 = {
  id: 'asg-pub-cn-02',
  title: 'Assignment 02 · Subnetting & CIDR Routing',
  description: 'Calculate subnet masks, usable hosts, and CIDR prefix aggregation.',
  unit: 2,
  deadline: '2026-10-25T23:59:00.000Z',
  submissionMethod: 'Submit handwritten solutions in class.',
  status: 'PUBLISHED',
  subjectId: 'sub-cn',
  sectionId: 'sec-cseb',
  facultyId: 'user-kumar',
  facultyAssignmentId: 'fa-kumar-2',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
};
if (existingPub2Index >= 0) {
  db.assignments[existingPub2Index] = pubObj2;
} else {
  db.assignments.push(pubObj2);
}

// 5. Ensure an unpublished material exists for Needs Attention
const existingDraftMatIndex = db.materials.findIndex(m => m.id === 'mat-draft-dbms-01');
const draftMatObj = {
  id: 'mat-draft-dbms-01',
  title: 'Unit 4 Lecture Notes: B+ Tree Indexing & Hashing',
  description: 'Draft slides on dense vs sparse indexes and multi-level indexing.',
  type: 'NOTES',
  unit: 4,
  fileUrl: '/uploads/b_tree_indexing_draft.pdf',
  fileName: 'b_tree_indexing_draft.pdf',
  fileSize: 2450000,
  mimeType: 'application/pdf',
  storageKey: 'b_tree_indexing_draft.pdf',
  status: 'DRAFT',
  subjectId: 'sub-dbms',
  sectionId: 'sec-csea',
  facultyId: 'user-kumar',
  facultyAssignmentId: 'fa-kumar-1',
  downloadsCount: 0,
  createdAt: new Date(Date.now() - 14400000).toISOString(),
  updatedAt: new Date(Date.now() - 14400000).toISOString()
};
if (existingDraftMatIndex >= 0) {
  db.materials[existingDraftMatIndex] = draftMatObj;
} else {
  db.materials.push(draftMatObj);
}

// 6. Ensure draft announcement exists
if (!db.announcements) db.announcements = [];
const existingDraftAnnIndex = db.announcements.findIndex(a => a.id === 'ann-draft-kumar-01');
const draftAnnObj = {
  id: 'ann-draft-kumar-01',
  title: 'Upcoming Lab Assessment on SQL Joins & Subqueries',
  content: 'Draft guidelines for the mid-semester lab test scheduled next week.',
  authorId: 'user-kumar',
  authorName: 'Dr. P. Kumar',
  targetRole: 'STUDENT',
  subjectId: 'sub-dbms',
  sectionId: 'sec-csea',
  status: 'DRAFT',
  priority: 'MEDIUM',
  createdAt: new Date(Date.now() - 18000000).toISOString(),
  updatedAt: new Date(Date.now() - 18000000).toISOString()
};
if (existingDraftAnnIndex >= 0) {
  db.announcements[existingDraftAnnIndex] = draftAnnObj;
} else {
  db.announcements.push(draftAnnObj);
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Database updated successfully with Dr. Kumar classes and draft items.');
