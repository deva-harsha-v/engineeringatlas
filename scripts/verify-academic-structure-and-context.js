import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    totalPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    totalFailed++;
  }
}

console.log('====================================================');
console.log('FACULTY REDESIGN, ACADEMIC STRUCTURE & ISOLATION AUDIT');
console.log('====================================================\n');

// 1. Faculty Portal Unified Visual Design Language
console.log('[SECTION 1]: Faculty Portal Unified Visual Design Language');
const facultySidebarPath = path.join(ROOT_DIR, 'src/components/layout/FacultySidebar.tsx');
assert(fs.existsSync(facultySidebarPath), 'FacultySidebar.tsx exists');
const facultySidebarContent = fs.readFileSync(facultySidebarPath, 'utf8');
const navConfigContent = fs.readFileSync(path.join(ROOT_DIR, 'src/lib/facultyNavConfig.ts'), 'utf8');
assert(facultySidebarContent.includes('var(--surface-1)') || facultySidebarContent.includes('#0D111D'), 'FacultySidebar uses surface theme styling');
assert(facultySidebarContent.includes('ENGINEERING') && facultySidebarContent.includes('ATLAS'), 'FacultySidebar displays ENGINEERING ATLAS branding');
assert(navConfigContent.includes('/faculty/assignments'), 'FacultySidebar links to Assignments');
assert(navConfigContent.includes('/faculty/materials'), 'FacultySidebar links to Materials');
assert(navConfigContent.includes('/faculty/classes'), 'FacultySidebar links to My Classes');
assert(navConfigContent.includes('/faculty/papers'), 'FacultySidebar links to Question Papers');
assert(navConfigContent.includes('/faculty/announcements'), 'FacultySidebar links to Announcements');
assert(facultySidebarContent.includes('Build a better learning experience'), 'FacultySidebar includes bottom tip card');

const facultyHeaderPath = path.join(ROOT_DIR, 'src/components/layout/FacultyHeader.tsx');
assert(fs.existsSync(facultyHeaderPath), 'FacultyHeader.tsx exists');
const facultyHeaderContent = fs.readFileSync(facultyHeaderPath, 'utf8');
assert(facultyHeaderContent.includes('Search'), 'FacultyHeader has search input pill');
assert(facultyHeaderContent.includes('ThemeToggle'), 'FacultyHeader includes theme toggle');
assert(facultyHeaderContent.includes('Bell'), 'FacultyHeader includes notification bell with indicator');
assert(facultyHeaderContent.includes('Dr. P. Kumar'), 'FacultyHeader displays faculty profile pill');

const facultyPageHeaderPath = path.join(ROOT_DIR, 'src/components/layout/FacultyPageHeader.tsx');
assert(fs.existsSync(facultyPageHeaderPath), 'FacultyPageHeader.tsx exists');
const facultyPageHeaderContent = fs.readFileSync(facultyPageHeaderPath, 'utf8');
assert(!facultyPageHeaderContent.includes('AcademicSelectorModal'), 'FacultyPageHeader correctly has NO separate academic modal (context driven by active class)');
assert(!facultyPageHeaderContent.includes('ACTIVE CLASS'), 'FacultyPageHeader excludes active class pill');

const facultyAssignmentsPath = path.join(ROOT_DIR, 'src/app/faculty/assignments/page.tsx');
assert(fs.existsSync(facultyAssignmentsPath), 'Faculty assignments page exists');
const facultyAssignmentsContent = fs.readFileSync(facultyAssignmentsPath, 'utf8');
assert(facultyAssignmentsContent.includes('Upcoming'), 'Assignments page renders Upcoming tab');
assert(facultyAssignmentsContent.includes('Drafts'), 'Assignments page renders Drafts tab');
assert(facultyAssignmentsContent.includes('Published Tasks') || facultyAssignmentsContent.includes('Saved Drafts'), 'Assignments page displays 4 stat metric cards');
assert(facultyAssignmentsContent.includes('Create Assignment'), 'Assignments page has + Create Assignment CTA');

// 2. Admin Academic Structure Management
console.log('\n[SECTION 2]: Admin Academic Structure Management');
const academicRoutePath = path.join(ROOT_DIR, 'src/app/api/academic/structure/route.ts');
assert(fs.existsSync(academicRoutePath), 'API route /api/academic/structure exists');
const academicRouteContent = fs.readFileSync(academicRoutePath, 'utf8');
assert(academicRouteContent.includes('CREATE_BRANCH'), 'API supports CREATE_BRANCH action');
assert(academicRouteContent.includes('DELETE_BRANCH'), 'API supports DELETE_BRANCH action');
assert(academicRouteContent.includes('CREATE_SECTION'), 'API supports CREATE_SECTION assigned to semester');
assert(academicRouteContent.includes('DELETE_SECTION'), 'API supports DELETE_SECTION action');
assert(academicRouteContent.includes('CREATE_SUBJECT'), 'API supports CREATE_SUBJECT action');

const adminAcademicPath = path.join(ROOT_DIR, 'src/app/admin/academic/page.tsx');
assert(fs.existsSync(adminAcademicPath), 'Admin Academic page exists');
const adminAcademicContent = fs.readFileSync(adminAcademicPath, 'utf8');
assert(adminAcademicContent.includes('Create Academic Branch') || adminAcademicContent.includes('Add Branch'), 'Admin Academic page allows creating branches');
assert(adminAcademicContent.includes('Create Semester Section') || adminAcademicContent.includes('Add Section'), 'Admin Academic page allows assigning sections to semesters');
assert(adminAcademicContent.includes('handleDeleteNode'), 'Admin Academic page allows deleting sections and branches');

// 3. Dynamic Section Resolution in AcademicSelectorModal
console.log('\n[SECTION 3]: Dynamic Section Resolution in AcademicSelectorModal');
const selectorModalPath = path.join(ROOT_DIR, 'src/components/academic/AcademicSelectorModal.tsx');
assert(fs.existsSync(selectorModalPath), 'AcademicSelectorModal.tsx exists');
const selectorModalContent = fs.readFileSync(selectorModalPath, 'utf8');
assert(selectorModalContent.includes('/api/academic/structure'), 'AcademicSelectorModal fetches live academic structure dynamically');
assert(selectorModalContent.includes('availableSections'), 'AcademicSelectorModal dynamically resolves sections for Branch + Semester');
assert(selectorModalContent.includes('updateProfile'), 'AcademicSelectorModal commits active academic context to cookies and state');

// 4. Strict Academic Context Isolation
console.log('\n[SECTION 4]: Strict Academic Context Isolation');
const subjectsRoutePath = path.join(ROOT_DIR, 'src/app/api/subjects/route.ts');
assert(fs.existsSync(subjectsRoutePath), 'API route /api/subjects exists');
const subjectsRouteContent = fs.readFileSync(subjectsRoutePath, 'utf8');
assert(subjectsRouteContent.includes('getStudentAcademicContextFromRequest'), 'Subjects API resolves student context from cookies/headers');
assert(subjectsRouteContent.includes('Forbidden: Cross-branch access denied'), 'Subjects API blocks cross-branch queries with 403 Forbidden');

const materialsRoutePath = path.join(ROOT_DIR, 'src/app/api/materials/route.ts');
assert(fs.existsSync(materialsRoutePath), 'API route /api/materials exists');
const materialsRouteContent = fs.readFileSync(materialsRoutePath, 'utf8');
assert(materialsRouteContent.includes('getStudentAcademicContextFromRequest'), 'Materials API resolves student academic context');
assert(materialsRouteContent.includes('Forbidden: Access denied to materials for section'), 'Materials API rejects cross-section queries with 403 Forbidden');
assert(materialsRouteContent.includes('Forbidden: Cross-branch access denied'), 'Materials API rejects cross-branch queries with 403 Forbidden');

const materialsIdRoutePath = path.join(ROOT_DIR, 'src/app/api/materials/[id]/route.ts');
assert(fs.existsSync(materialsIdRoutePath), 'API route /api/materials/[id] exists');
const materialsIdRouteContent = fs.readFileSync(materialsIdRoutePath, 'utf8');
assert(materialsIdRouteContent.includes('Forbidden: This material is designated for section'), 'Direct Material ID query returns 403 Forbidden for other sections');

const papersRoutePath = path.join(ROOT_DIR, 'src/app/api/papers/route.ts');
assert(fs.existsSync(papersRoutePath), 'API route /api/papers exists');
const papersRouteContent = fs.readFileSync(papersRoutePath, 'utf8');
assert(papersRouteContent.includes('Forbidden: Cross-branch access denied to question papers'), 'Papers API blocks cross-branch queries with 403 Forbidden');

const questionsRoutePath = path.join(ROOT_DIR, 'src/app/api/questions/route.ts');
assert(fs.existsSync(questionsRoutePath), 'API route /api/questions exists');
const questionsRouteContent = fs.readFileSync(questionsRoutePath, 'utf8');
assert(questionsRouteContent.includes('Forbidden: Cross-branch access denied to practice questions'), 'Questions API blocks cross-branch queries with 403 Forbidden');

const announcementsRoutePath = path.join(ROOT_DIR, 'src/app/api/announcements/route.ts');
assert(fs.existsSync(announcementsRoutePath), 'API route /api/announcements exists');
const announcementsRouteContent = fs.readFileSync(announcementsRoutePath, 'utf8');
assert(announcementsRouteContent.includes('Forbidden: Access denied to announcements for section'), 'Announcements API rejects cross-section queries with 403 Forbidden');

const atlasRoutePath = path.join(ROOT_DIR, 'src/app/api/atlas/route.ts');
assert(fs.existsSync(atlasRoutePath), 'API route /api/atlas exists');
const atlasRouteContent = fs.readFileSync(atlasRoutePath, 'utf8');
assert(atlasRouteContent.includes('Forbidden: Cross-branch access denied to Atlas topics'), 'Atlas API blocks cross-branch queries with 403 Forbidden');

// 5. Redesigned Unified Faculty Pages
console.log('\n[SECTION 5]: Redesigned Unified Faculty Pages');
const facultyPages = [
  { file: 'src/app/faculty/page.tsx', name: 'Dashboard' },
  { file: 'src/app/faculty/classes/page.tsx', name: 'My Classes' },
  { file: 'src/app/faculty/classes/[classId]/page.tsx', name: 'Class Workspace' },
  { file: 'src/app/faculty/materials/page.tsx', name: 'Materials' },
  { file: 'src/app/faculty/materials/new/page.tsx', name: 'New Material' },
  { file: 'src/app/faculty/assignments/page.tsx', name: 'Assignments' },
  { file: 'src/app/faculty/assignments/new/page.tsx', name: 'New Assignment' },
  { file: 'src/app/faculty/papers/page.tsx', name: 'Question Papers' },
  { file: 'src/app/faculty/questions/page.tsx', name: 'Question Bank' },
  { file: 'src/app/faculty/announcements/page.tsx', name: 'Announcements' },
];

for (const p of facultyPages) {
  const fullPath = path.join(ROOT_DIR, p.file);
  assert(fs.existsSync(fullPath), `${p.name} page exists at ${p.file}`);
  const content = fs.readFileSync(fullPath, 'utf8');
  if (p.name !== 'Dashboard') {
    assert(content.includes('FacultyPageHeader'), `${p.name} uses unified FacultyPageHeader`);
  } else {
    assert(content.includes('Dr.') && content.includes('happening across your classes'), 'Dashboard uses personalized greeting header');
  }
}

console.log('\n====================================================');
console.log(`AUDIT COMPLETE: ${totalPassed} Passed, ${totalFailed} Failed`);
console.log('====================================================');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
