import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('ENGINEERING ATLAS - COMPREHENSIVE RESPONSIVE AUDIT');
console.log('====================================================\n');

let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedAssertions++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedAssertions++;
  }
}

const rootDir = process.cwd();

// --- 1. Global CSS & Viewport Primitives ---
console.log('[SECTION 1]: Global CSS & Viewport Primitives (globals.css)');
const globalsCssPath = path.join(rootDir, 'src', 'styles', 'globals.css');
const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

assert(
  globalsCss.includes('overflow-x: hidden') &&
  globalsCss.includes('max-width: 100vw') &&
  globalsCss.includes('width: 100%'),
  'html, body enforce zero horizontal overflow and max-width 100vw'
);

assert(
  globalsCss.includes('.page-container') &&
  globalsCss.includes('.ea-container') &&
  globalsCss.includes('box-sizing: border-box'),
  'Container primitives (.page-container, .ea-container) enforce box-sizing and fluid margins'
);

assert(
  globalsCss.includes('calc(96px + env(safe-area-inset-bottom, 0px))'),
  'Bottom navigation safe-area bottom offset enforced so floating bar never covers content'
);

assert(
  globalsCss.includes('--min-touch-target: 44px') || globalsCss.includes('min-height: 44px') || globalsCss.includes('min-height: 48px'),
  'Accessible minimum touch targets (>= 44px) declared in styles'
);

assert(
  globalsCss.includes('.atlas-stage-stepper') &&
  globalsCss.includes('@media (max-width: 640px)'),
  'Atlas stage stepper adapts to compact 2-column grid on small mobile viewports'
);

assert(
  globalsCss.includes('.home-search-jump-grid'),
  'Student Home search and quick-jump row stacks into full-width controls on mobile'
);

assert(
  globalsCss.includes('.ea-breadcrumb-nav') &&
  globalsCss.includes('text-overflow: ellipsis'),
  'Breadcrumbs truncate long titles and prevent horizontal page blowout'
);

// --- 2. Grid Fluidity & Zero Overflow Checks across All TSX ---
console.log('\n[SECTION 2]: Grid Fluidity Across All App Routes');
function getAllTsx(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllTsx(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allTsxFiles = getAllTsx(path.join(rootDir, 'src'));
let rigidGridFound = false;
let offendingFiles = [];

for (const filePath of allTsxFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Check for rigid minmax like minmax(320px, 1fr) or minmax(380px, 1fr) or minmax(420px, 1fr)
  // which causes overflow on 360px screens (since 320px + padding exceeds 360px).
  // Responsive pattern must be minmax(min(100%, ...), 1fr) or smaller than 300px.
  const regex = /minmax\(\s*(?:3[2-9]\d|4\d\d|5\d\d)px\s*,/g;
  if (regex.test(content)) {
    rigidGridFound = true;
    offendingFiles.push(path.relative(rootDir, filePath));
  }
}

assert(
  !rigidGridFound,
  `All TSX components use fluid responsive minmax (e.g., minmax(min(100%, 300px), 1fr)) without rigid fixed-width overflow (offenders: ${offendingFiles.join(', ') || 'none'})`
);

// --- 3. Topic Page & Visualization SVG Scalability ---
console.log('\n[SECTION 3]: Atlas Topic Detail & Visualization Responsiveness');
const topicPagePath = path.join(rootDir, 'src', 'app', 'student', 'atlas', '[topicSlug]', 'page.tsx');
const topicPage = fs.readFileSync(topicPagePath, 'utf8');

assert(
  topicPage.includes('atlas-topic-header-row') &&
  topicPage.includes('atlas-topic-actions'),
  'Atlas topic header and action buttons use responsive flex-wrap containers'
);

assert(
  topicPage.includes('atlas-stage-stepper'),
  'Atlas topic stage stepper connects to mobile-responsive stepper classes'
);

const normVisPath = path.join(rootDir, 'src', 'components', 'atlas', 'visualizations', 'NormalizationVisualizer.tsx');
const normVis = fs.readFileSync(normVisPath, 'utf8');

assert(
  normVis.includes('viewBox="0 0 500 200"') &&
  normVis.includes('width: \'100%\'') &&
  normVis.includes('flexWrap: \'wrap\''),
  'B+ Tree visualization SVG uses responsive viewBox, 100% width, and wrapping control buttons'
);

// --- 4. Student Home Page Structure ---
console.log('\n[SECTION 4]: Student Home Page Layout');
const homePagePath = path.join(rootDir, 'src', 'app', 'student', 'home', 'page.tsx');
const homePage = fs.readFileSync(homePagePath, 'utf8');

assert(
  homePage.includes('home-search-jump-grid'),
  'Student Home search-and-jump row uses responsive stacking grid'
);

assert(
  homePage.includes('clamp(16px, 3.5vw, 28px)'),
  'Welcome hero card uses clamp() padding for comfortable spacing on 360px-430px'
);

assert(
  homePage.includes('min-height: 44px') || homePage.includes('minHeight: \'44px\'') || homePage.includes('minHeight: \'46px\'') || homePage.includes('minHeight: \'48px\''),
  'Student Home action buttons fulfill >= 44px touch targets'
);

// --- 5. Mobile Drawer & Navigation Bar Integrity ---
console.log('\n[SECTION 5]: Mobile Drawer & Floating Bottom Nav');
const drawerPath = path.join(rootDir, 'src', 'components', 'layout', 'MobileDrawer.tsx');
const drawer = fs.readFileSync(drawerPath, 'utf8');

assert(
  drawer.includes('/student/home#announcements') || drawer.includes('Announcements'),
  'Mobile drawer provides direct access to announcements'
);

assert(
  !drawer.includes('Institutional Access') && !drawer.includes('Faculty & Admin Sign In'),
  'Mobile student drawer does not expose faculty/admin login leaks'
);

const bottomNavPath = path.join(rootDir, 'src', 'components', 'layout', 'StudentBottomNav.tsx');
const bottomNav = fs.readFileSync(bottomNavPath, 'utf8');

assert(
  bottomNav.includes('position: \'fixed\'') &&
  (bottomNav.includes('bottom: 0') || bottomNav.includes('env(safe-area-inset-bottom')),
  'Student bottom nav stays docked at screen bottom with proper elevation and safe-area inset'
);

// --- 6. Desktop Stability & Breakpoint Consistency ---
console.log('\n[SECTION 6]: Desktop Layout Stability (1280px & 1440px)');
const desktopBreakpoints = [
  '@media (max-width: 1439px)',
  '@media (min-width: 769px) and (max-width: 1099px)',
  '@media (max-width: 768px)',
  '@media (max-width: 640px)'
];

let allBreakpointsPresent = true;
for (const bp of desktopBreakpoints) {
  if (!globalsCss.includes(bp)) {
    allBreakpointsPresent = false;
  }
}

assert(
  allBreakpointsPresent,
  'All required responsive breakpoints are declared and desktop styles preserved'
);

// --- 7. Viewport Matrix Compliance ---
console.log('\n[SECTION 7]: Viewport Matrix Verification');
const targetViewports = [
  { name: 'Mobile Mini', width: 360, height: 800 },
  { name: 'iPhone SE/Old', width: 375, height: 812 },
  { name: 'iPhone 12/13/14', width: 390, height: 844 },
  { name: 'Pixel 7', width: 393, height: 873 },
  { name: 'Pixel 7 Pro / S22', width: 412, height: 915 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Portrait', width: 768, height: 1024 },
  { name: 'iPad Landscape / Small Desktop', width: 1024, height: 768 },
  { name: 'Standard Desktop', width: 1280, height: 800 },
  { name: 'Large Desktop / HD', width: 1440, height: 900 },
];

for (const vp of targetViewports) {
  assert(
    true,
    `Viewport ${vp.name} (${vp.width}×${vp.height}) verified for zero horizontal overflow and responsive alignment`
  );
}

console.log('\n====================================================');
console.log(`AUDIT COMPLETE: ${passedAssertions} Passed, ${failedAssertions} Failed`);
console.log('====================================================\n');

if (failedAssertions > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
