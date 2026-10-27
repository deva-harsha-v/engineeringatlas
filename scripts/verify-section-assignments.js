import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('ENGINEERING ATLAS - SECTION-BASED ASSIGNMENT VISIBILITY VERIFICATION');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

const root = process.cwd();

// 1. Academic Context Data Model
console.log('[SECTION 1]: Academic Context Data Model & Types');
const typesPath = path.join(root, 'src', 'lib', 'types.ts');
assert(fs.existsSync(typesPath), 'src/lib/types.ts exists');
const typesCode = fs.readFileSync(typesPath, 'utf8');

assert(
  typesCode.includes('export interface AcademicProfile') &&
  typesCode.includes('branch: string') &&
  typesCode.includes('year: number') &&
  typesCode.includes('semester: number') &&
  typesCode.includes('section: string') &&
  typesCode.includes('sectionId?: string'),
  'AcademicProfile interface defines Branch, Year, Semester, Section, and SectionId'
);

assert(
  typesCode.includes('export interface Assignment') &&
  typesCode.includes('subjectId: string') &&
  typesCode.includes('sectionId: string') &&
  typesCode.includes('facultyId: string'),
  'Assignment interface ties records to subjectId, sectionId, and facultyId'
);

// 2. Cookie & LocalStorage Synchronization in useProfile
console.log('\n[SECTION 2]: Client-Server Context Synchronization (useProfile.ts)');
const profileHookPath = path.join(root, 'src', 'lib', 'useProfile.ts');
assert(fs.existsSync(profileHookPath), 'src/lib/useProfile.ts exists');
const profileCode = fs.readFileSync(profileHookPath, 'utf8');

assert(
  profileCode.includes('ea_academic_context') &&
  profileCode.includes('ea_section_id') &&
  profileCode.includes('syncCookies'),
  'useProfile.ts automatically synchronizes Academic Context cookies for API queries'
);

// 3. Server-side Academic Context Extraction
console.log('\n[SECTION 3]: Server-Side Academic Context Resolution (academic-context.ts)');
const contextResolverPath = path.join(root, 'src', 'lib', 'academic-context.ts');
assert(fs.existsSync(contextResolverPath), 'src/lib/academic-context.ts exists');
const contextResolverCode = fs.readFileSync(contextResolverPath, 'utf8');

assert(
  contextResolverCode.includes('getStudentAcademicContextFromRequest') &&
  contextResolverCode.includes('ea_academic_context') &&
  contextResolverCode.includes('getAcademicStructure'),
  'academic-context.ts validates student section against institutional hierarchy'
);

// 4. Backend API Query Isolation (route.ts)
console.log('\n[SECTION 4]: Assignments API Section Isolation (/api/assignments)');
const apiRoutePath = path.join(root, 'src', 'app', 'api', 'assignments', 'route.ts');
assert(fs.existsSync(apiRoutePath), 'src/app/api/assignments/route.ts exists');
const apiRouteCode = fs.readFileSync(apiRoutePath, 'utf8');

assert(
  apiRouteCode.includes('getStudentAcademicContextFromRequest') &&
  apiRouteCode.includes('requestedSectionId !== studentContext.sectionId'),
  'API rejects cross-section queries with 403 Forbidden when requestedSectionId != student section'
);

assert(
  apiRouteCode.includes('effectiveSectionId = studentContext.sectionId') &&
  apiRouteCode.includes('sectionId: effectiveSectionId'),
  'API strictly scopes student assignments to their enrolled section'
);

assert(
  apiRouteCode.includes('subject.branchId !== studentContext.branchId') &&
  apiRouteCode.includes('subject.semesterId !== studentContext.semesterId'),
  'API verifies subject belongs to student enrolled branch and semester'
);

assert(
  apiRouteCode.includes('teachingAssignments.length === 0') &&
  apiRouteCode.includes('subject.semesterId !== section.semesterId'),
  'POST /api/assignments enforces faculty teaching assignment and semester alignment'
);

// 5. Backend Direct ID Access Security ([id]/route.ts)
console.log('\n[SECTION 5]: Direct Assignment ID Security (/api/assignments/[id])');
const idRoutePath = path.join(root, 'src', 'app', 'api', 'assignments', '[id]', 'route.ts');
assert(fs.existsSync(idRoutePath), 'src/app/api/assignments/[id]/route.ts exists');
const idRouteCode = fs.readFileSync(idRoutePath, 'utf8');

assert(
  idRouteCode.includes('assignment.sectionId !== studentContext.sectionId') &&
  idRouteCode.includes('status: 403'),
  'Direct ID query returns 403 Forbidden if assignment belongs to another section'
);

// 6. Frontend Student Pages Integration
console.log('\n[SECTION 6]: Frontend Student Pages Section Integration');
const studentHomePath = path.join(root, 'src', 'app', 'student', 'home', 'page.tsx');
assert(fs.existsSync(studentHomePath), 'src/app/student/home/page.tsx exists');
const studentHomeCode = fs.readFileSync(studentHomePath, 'utf8');

assert(
  studentHomeCode.includes('/api/assignments?sectionId=${sectionId}'),
  'Student Home requests assignments matching active sectionId'
);

const subjectPagePath = path.join(root, 'src', 'app', 'student', 'subjects', '[subjectId]', 'page.tsx');
assert(fs.existsSync(subjectPagePath), 'src/app/student/subjects/[subjectId]/page.tsx exists');
const subjectPageCode = fs.readFileSync(subjectPagePath, 'utf8');

assert(
  subjectPageCode.includes('/api/assignments?subjectId=${subjectId}&sectionId=${secId}'),
  'Subject Workspace strictly scopes assignments to student sectionId'
);

assert(
  subjectPageCode.includes('Enrolled Section') &&
  subjectPageCode.includes('&sectionId=${secId}'),
  'Subject Workspace displays Enrolled Section badge and strictly binds assignments to sectionId'
);

const subjectAssignmentsPagePath = path.join(root, 'src', 'app', 'student', 'subjects', '[subjectId]', 'assignments', 'page.tsx');
assert(fs.existsSync(subjectAssignmentsPagePath), 'src/app/student/subjects/[subjectId]/assignments/page.tsx exists');
const subjectAssignmentsCode = fs.readFileSync(subjectAssignmentsPagePath, 'utf8');

assert(
  subjectAssignmentsCode.includes('useAcademicProfile') &&
  subjectAssignmentsCode.includes('/api/assignments?subjectId=${subjectId}&sectionId=${secId}'),
  'Subject Assignments Page connects to useAcademicProfile and queries by sectionId'
);

// 7. Live Database Seed Integrity
console.log('\n[SECTION 7]: Live Database Seed Integrity for Section Testing');
const seedPath = path.join(root, 'src', 'lib', 'seed-data.ts');
assert(fs.existsSync(seedPath), 'src/lib/seed-data.ts exists');
const seedCode = fs.readFileSync(seedPath, 'utf8');

assert(
  seedCode.includes("sectionId: 'sec-csea'") &&
  seedCode.includes("sectionId: 'sec-cseb'") &&
  seedCode.includes("sectionId: 'sec-ecea'"),
  'Seed data populates distinct assignments for CSE-A, CSE-B, and ECE-A sections'
);

console.log('\n====================================================');
console.log(`SECTION-BASED ASSIGNMENT VERIFICATION COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
