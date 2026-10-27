import fs from 'fs';
import path from 'path';

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

console.log('====================================================');
console.log('VERIFYING FINAL FACULTY PORTAL & ASSIGNMENT DRAFT SYSTEM');
console.log('====================================================\n');

// 1. Sidebar Verification
console.log('[SECTION 1]: Sidebar Structure & Branding');
const sidebarPath = 'src/components/layout/FacultySidebar.tsx';
assert(fs.existsSync(sidebarPath), 'FacultySidebar.tsx exists');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
const navConfigPath = 'src/lib/facultyNavConfig.ts';
assert(fs.existsSync(navConfigPath), 'facultyNavConfig.ts exists');
const navConfigContent = fs.readFileSync(navConfigPath, 'utf8');

assert(sidebarContent.includes('ENGINEERING'), 'Sidebar displays "ENGINEERING"');
assert(sidebarContent.includes('ATLAS'), 'Sidebar displays "ATLAS"');
assert(sidebarContent.includes('#2563EB') || sidebarContent.includes('#60A5FA') || sidebarContent.includes('var(--primary)'), 'Sidebar displays blue ATLAS branding');

// Check the exact 7 items from centralized configuration
const exactItems = [
  'Dashboard',
  'My Classes',
  'Materials',
  'Assignments',
  'Question Papers',
  'Questions',
  'Announcements',
];

for (const item of exactItems) {
  assert(sidebarContent.includes(`label: '${item}'`) || navConfigContent.includes(`label: '${item}'`), `Sidebar contains "${item}"`);
}

// Ensure removed items are NOT present in either
assert(!sidebarContent.includes("label: 'Students'") && !navConfigContent.includes("label: 'Students'"), 'Sidebar excludes "Students"');
assert(!sidebarContent.includes("label: 'Academic Calendar'") && !navConfigContent.includes("label: 'Academic Calendar'"), 'Sidebar excludes "Academic Calendar"');
assert(!sidebarContent.includes("label: 'Analytics'") && !navConfigContent.includes("label: 'Analytics'"), 'Sidebar excludes "Analytics"');

// Dynamic elements
assert(sidebarContent.includes('useFacultyClass'), 'Sidebar is dynamic: connects to useFacultyClass');
assert(!sidebarContent.includes('ACTIVE CLASS'), 'Sidebar excludes active class widget per user instruction');
assert(sidebarContent.includes('draftCount'), 'Sidebar is dynamic: displays draft badges');

// 2. Theme Toggle & Theme Reactivity
console.log('\n[SECTION 2]: Theme Toggle & Faculty Theme Reactivity');
const layoutPath = 'src/components/layout/FacultyLayout.tsx';
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(layoutContent.includes('faculty-layout-root'), 'FacultyLayout uses faculty-layout-root class');
assert(!layoutContent.includes("backgroundColor: '#F8FAFC'"), 'FacultyLayout has no hardcoded background color');

const headerPath = 'src/components/layout/FacultyHeader.tsx';
const headerContent = fs.readFileSync(headerPath, 'utf8');
assert(headerContent.includes('faculty-header-bar'), 'FacultyHeader uses faculty-header-bar class');
assert(headerContent.includes('<ThemeToggle'), 'FacultyHeader includes ThemeToggle');
assert(!headerContent.includes('AcademicSelectorModal'), 'FacultyHeader has NO academic-context selector modal');

const pageHeaderPath = 'src/components/layout/FacultyPageHeader.tsx';
const pageHeaderContent = fs.readFileSync(pageHeaderPath, 'utf8');
assert(!pageHeaderContent.includes('AcademicSelectorModal'), 'FacultyPageHeader has NO academic-context selector modal');
assert(!pageHeaderContent.includes('ACTIVE CLASS'), 'FacultyPageHeader excludes active class pill per user instruction');

// 3. Database & Data Model: Faculty Assignments as Classes
console.log('\n[SECTION 3]: Faculty Assignments & Classes Data Model');
const dbPath = 'data/atlas-db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const kumarClasses = db.facultyAssignments.filter((fa) => fa.facultyId === 'user-kumar');
assert(kumarClasses.length === 3, `Dr. Kumar has 3 distinct classes (found ${kumarClasses.length})`);

const dbmsClass = kumarClasses.find((c) => c.subjectId === 'sub-dbms' && c.sectionId === 'sec-csea');
assert(!!dbmsClass, 'Dr. Kumar has CSE-A · VII Semester · DBMS');

const cnClass = kumarClasses.find((c) => c.subjectId === 'sub-cn' && c.sectionId === 'sec-cseb');
assert(!!cnClass, 'Dr. Kumar has CSE-B · VII Semester · Computer Networks');

const osClass = kumarClasses.find((c) => c.subjectId === 'sub-os-6' && c.sectionId === 'sec-cse6-a');
assert(!!osClass, 'Dr. Kumar has CSE-A · VI Semester · Operating Systems');

// 4. Faculty Dashboard Requirements
console.log('\n[SECTION 4]: Faculty Dashboard');
const dashPath = 'src/app/faculty/page.tsx';
const dashContent = fs.readFileSync(dashPath, 'utf8');

assert(dashContent.includes('Dr. {displayName}'), 'Dashboard greets Dr. Kumar');
assert(dashContent.includes('Here’s what’s happening across your classes today.'), 'Dashboard subtitle matches requirement');
assert(dashContent.includes('My Classes'), 'Dashboard has primary section: My Classes');
assert(dashContent.includes('Open Class'), 'Dashboard cards have [Open Class →]');
assert(dashContent.includes('Needs Attention'), 'Dashboard has "Needs Attention" section');
assert(dashContent.includes('Draft Assignment'), 'Needs Attention lists draft assignments');
assert(dashContent.includes('Upcoming Deadlines'), 'Dashboard has "Upcoming" section');
assert(dashContent.includes('Recent Faculty Activity'), 'Dashboard has "Recent Activity" section');
// Check that student submission/grading is excluded from dashboard
assert(!dashContent.includes('Student Submissions'), 'Dashboard does NOT include Student Submissions');
assert(!dashContent.includes('Grading Queue'), 'Dashboard does NOT include Grading Queue');
assert(!dashContent.includes('Submission analytics'), 'Dashboard does NOT include Submission analytics');

// 5. Assignment Draft System
console.log('\n[SECTION 5]: Assignment Draft System');
const asgPagePath = 'src/app/faculty/assignments/page.tsx';
const asgContent = fs.readFileSync(asgPagePath, 'utf8');

assert(asgContent.includes("'UPCOMING'"), 'Assignments has Upcoming tab');
assert(asgContent.includes("'PUBLISHED'"), 'Assignments has Published tab');
assert(asgContent.includes("'DRAFTS'"), 'Assignments has Drafts tab');
assert(asgContent.includes("'PAST'"), 'Assignments has Past tab');
assert(asgContent.includes('Continue Editing'), 'Draft card includes [Continue Editing →]');
assert(asgContent.includes('Delete Draft'), 'Draft card allows deleting unwanted drafts');
assert(asgContent.includes('Publish Directly'), 'Draft card allows publishing');

const newAsgPath = 'src/app/faculty/assignments/new/page.tsx';
const newAsgContent = fs.readFileSync(newAsgPath, 'utf8');

assert(newAsgContent.includes('Save Draft'), 'Create Assignment has "Save Draft" button');
assert(newAsgContent.includes('Publish Assignment'), 'Create Assignment has "Publish Assignment" button');
assert(newAsgContent.includes('draftId'), 'Create Assignment loads existing draftId to continue editing');

// Draft security in API
const asgApiPath = 'src/app/api/assignments/route.ts';
const asgApiContent = fs.readFileSync(asgApiPath, 'utf8');
assert(asgApiContent.includes("status: 'PUBLISHED'"), 'Students are strictly restricted to published assignments');
assert(asgApiContent.includes("=== 'DRAFT'"), 'API supports saving drafts');

const asgIdApiPath = 'src/app/api/assignments/[id]/route.ts';
const asgIdApiContent = fs.readFileSync(asgIdApiPath, 'utf8');
assert(asgIdApiContent.includes("assignment.status !== 'PUBLISHED'"), 'Direct ID API blocks students from accessing drafts with 404');

console.log('\n====================================================');
console.log(`AUDIT COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) process.exit(1);
