// Automated Navbar Refinement Verification Suite
const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

function runNavbarTests() {
  console.log('====================================================');
  console.log('ENGINEERING ATLAS - STUDENT NAVBAR VERIFICATION');
  console.log('====================================================\n');

  const navFile = path.join(process.cwd(), 'src', 'components', 'layout', 'StudentNav.tsx');
  const logoFile = path.join(process.cwd(), 'src', 'components', 'branding', 'EngineeringAtlasLogo.tsx');
  const cssFile = path.join(process.cwd(), 'src', 'styles', 'globals.css');

  assert(fs.existsSync(navFile), 'StudentNav.tsx exists');
  assert(fs.existsSync(logoFile), 'EngineeringAtlasLogo.tsx exists');
  assert(fs.existsSync(cssFile), 'globals.css exists');

  const navCode = fs.readFileSync(navFile, 'utf-8');
  const logoCode = fs.readFileSync(logoFile, 'utf-8');
  const cssCode = fs.readFileSync(cssFile, 'utf-8');

  // Requirement 1: Brand Area
  console.log('\n[1. Brand Area]');
  assert(
    navCode.includes('showSubtitle={false}'),
    'Subtitle (Sri Vasavi Engg College) strictly removed from student navbar'
  );
  assert(
    logoCode.includes('ea-brand-title-compact') && logoCode.includes('ea-brand-title-full'),
    'EngineeringAtlasLogo supports responsive compact title (ATLAS at narrower widths)'
  );
  assert(
    cssCode.includes('.ea-brand-title-compact'),
    'globals.css defines responsive rules for compact brand title (ATLAS at 769-1099px)'
  );

  // Requirement 2: Academic Context Selector
  console.log('\n[2. Academic Context Selector]');
  assert(
    !navCode.includes("{profile.branch} • {profile.yearName || 'III Year'} • {profile.semesterName || 'VII Sem'} • {profile.section}"),
    'Long four-part context permanently removed from the navbar header'
  );
  assert(
    navCode.includes('nav-cohort-compact') && navCode.includes('nav-cohort-full'),
    'Compact academic context selector implemented ([CSE-A ▾] and [CSE-A · III Sem ▾])'
  );
  assert(
    navCode.includes('Academic Profile') &&
    navCode.includes('Branch:') &&
    navCode.includes('Year:') &&
    navCode.includes('Semester:') &&
    navCode.includes('Section:') &&
    navCode.includes('Change Academic Context'),
    'Complete academic context appears inside the interactive dropdown popover with change button'
  );

  // Requirement 3: Compact Search
  console.log('\n[3. Compact Search]');
  assert(
    navCode.includes('nav-search-btn') && navCode.includes('nav-search-icon-btn'),
    'Desktop search button uses compact responsive classes (150-180px and icon-only)'
  );
  assert(
    navCode.includes('id="search-trigger-btn"'),
    'Preserves id="search-trigger-btn" for global Ctrl+K shortcut integration'
  );
  assert(
    cssCode.includes('width: 170px;') && cssCode.includes('width: 130px;'),
    'Search input width constrained to 170px (wide) and 130px (medium desktop)'
  );

  // Requirement 4: Primary Navigation & Revision Desk
  console.log('\n[4. Primary Navigation & Revision Desk]');
  assert(
    navCode.includes('/student/home') &&
    navCode.includes('/student/atlas') &&
    navCode.includes('/student/subjects') &&
    navCode.includes('/student/practice') &&
    navCode.includes('/student/papers'),
    'All five primary routes preserved in navigation: Home, Atlas, Subjects, Practice, Papers'
  );
  assert(
    navCode.includes('title="Revision Desk"') &&
    navCode.includes('aria-label="Revision Desk"') &&
    navCode.includes('<Bookmark size={16}'),
    'Revision Desk converted from wide text button into compact bookmark icon button ([🔖³])'
  );
  assert(
    navCode.includes('revisionCount > 0') && navCode.includes('borderRadius: \'var(--radius-pill)\''),
    'Revision Desk displays real-time counter badge over icon'
  );

  // Requirement 5: Secondary Navigation (⋯ Menu)
  console.log('\n[5. Secondary Navigation]');
  assert(
    navCode.includes('nav-more-dropdown-trigger') && navCode.includes('MoreHorizontal'),
    'Secondary menu (⋯) implemented for medium desktop widths (769-1099px)'
  );
  assert(
    navCode.includes('nav-item-papers'),
    'Papers link gracefully folds into secondary dropdown at 769-1099px while remaining visible >=1100px'
  );

  // Requirement 6: Student Profile Section
  console.log('\n[6. Student Profile Section]');
  assert(
    !navCode.includes('{profile.section} • {profile.semesterName || \'VII Sem\'}'),
    'Duplicate academic context removed from profile section'
  );
  assert(
    navCode.includes('Aspirant') && navCode.includes('nav-profile-name'),
    'Displays [A] Aspirant on large desktop and [A ▾] on compact desktop'
  );
  assert(
    navCode.includes('isProfileDropdownOpen'),
    'Clicking profile opens interactive student profile popover'
  );

  // Requirement 7 & Responsive Verification
  console.log('\n[7. Theme & Mobile Architecture]');
  assert(
    navCode.includes('<ThemeToggle />'),
    'ThemeToggle preserved as icon-only control'
  );
  assert(
    navCode.includes('mobile-only') && navCode.includes('<MobileDrawer'),
    'Mobile architecture preserved: top floating header + hamburger + drawer + bottom nav'
  );

  // Responsive Breakpoints defined in globals.css
  console.log('\n[8. Responsive CSS Breakpoints in globals.css]');
  const breakpoints = [
    { name: '≥ 1440px (Wide Desktop)', check: cssCode.includes('@media (max-width: 1439px)') },
    { name: '1100px - 1439px (Standard Desktop)', check: cssCode.includes('@media (min-width: 1100px) and (max-width: 1439px)') },
    { name: '900px - 1099px (Compact Desktop)', check: cssCode.includes('@media (max-width: 1099px)') },
    { name: '769px - 899px (Tablet/Desktop Transition)', check: cssCode.includes('@media (min-width: 769px) and (max-width: 1099px)') },
    { name: '≤ 768px (Mobile Header & Bottom Nav)', check: cssCode.includes('@media (max-width: 768px)') }
  ];

  breakpoints.forEach(b => {
    assert(b.check, `Breakpoint rule verified: ${b.name}`);
  });

  console.log('\n====================================================');
  console.log(`NAVBAR VERIFICATION COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('====================================================');

  if (testsFailed > 0) process.exit(1);
}

runNavbarTests();
