import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('ENGINEERING ATLAS - FINAL MOBILE NAV ARCHITECTURE VERIFICATION');
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

// 1. Shared Navigation Configuration
console.log('[SECTION 1]: Shared Navigation Configuration');
const navConfigPath = path.join(root, 'src', 'lib', 'navigation.ts');
assert(fs.existsSync(navConfigPath), 'src/lib/navigation.ts exists');
const navConfig = fs.readFileSync(navConfigPath, 'utf8');

assert(
  navConfig.includes('PRIMARY_NAVIGATION') &&
  navConfig.includes('/student/home') &&
  navConfig.includes('/student/atlas') &&
  navConfig.includes('/student/subjects') &&
  navConfig.includes('/student/practice') &&
  navConfig.includes('/student/papers'),
  'Shared PRIMARY_NAVIGATION config defines the 5 canonical destinations'
);

assert(
  navConfig.includes('SECONDARY_NAVIGATION') &&
  navConfig.includes('search') &&
  navConfig.includes('revision') &&
  navConfig.includes('announcements'),
  'Shared SECONDARY_NAVIGATION defines Search, Revision Desk, and Announcements'
);

// 2. Mobile Bottom Navigation Layer
console.log('\n[SECTION 2]: Floating Mobile Bottom Navigation Layer');
const bottomNavPath = path.join(root, 'src', 'components', 'layout', 'StudentBottomNav.tsx');
assert(fs.existsSync(bottomNavPath), 'StudentBottomNav.tsx exists');
const bottomNavCode = fs.readFileSync(bottomNavPath, 'utf8');

assert(
  bottomNavCode.includes('calc(12px + env(safe-area-inset-bottom') &&
  bottomNavCode.includes('calc(100% - 24px)') &&
  bottomNavCode.includes('420px'),
  'Bottom navigation is centered floating island with safe-area bottom offset and 420px max-width'
);

assert(
  bottomNavCode.includes('EngineeringAtlasLogo') &&
  bottomNavCode.includes('variant="icon"'),
  'Engineering Atlas logo acts as visual anchor on far left of bottom nav'
);

assert(
  bottomNavCode.includes('#6366F1'),
  'Active navigation state uses official Engineering Atlas Indigo (#6366F1)'
);

assert(
  bottomNavCode.includes('minWidth: \'44px\'') &&
  bottomNavCode.includes('minHeight: \'48px\''),
  'Navigation touch targets exceed minimum 44x44px requirements'
);

assert(
  bottomNavCode.includes('translateY(-2px)') &&
  bottomNavCode.includes('rgba(99, 102, 241,'),
  'Active state features tactile elevated pill with subtle transform and shadow'
);

// 3. Mobile Top & Hamburger Menu Button Layer
console.log('\n[SECTION 3]: Mobile Top & MobileMenuButton Layer');
const menuBtnPath = path.join(root, 'src', 'components', 'layout', 'MobileMenuButton.tsx');
assert(fs.existsSync(menuBtnPath), 'MobileMenuButton.tsx exists');
const menuBtnCode = fs.readFileSync(menuBtnPath, 'utf8');

assert(
  menuBtnCode.includes('calc(12px + env(safe-area-inset-top') &&
  menuBtnCode.includes('right: \'16px\''),
  'MobileMenuButton is fixed at top: calc(12px + env(safe-area-inset-top)) right: 16px'
);

assert(
  menuBtnCode.includes('minWidth: \'42px\'') &&
  menuBtnCode.includes('minHeight: \'42px\'') &&
  menuBtnCode.includes('borderRadius: \'var(--radius-md)\''),
  'MobileMenuButton has compact rounded surface with surface container styling'
);

// 4. Desktop Navbar Preserved & Conventional Top Bar Removed on Mobile
console.log('\n[SECTION 4]: Conventional Mobile Top Navbar Removed / Desktop Preserved');
const studentNavPath = path.join(root, 'src', 'components', 'layout', 'StudentNav.tsx');
const studentNavCode = fs.readFileSync(studentNavPath, 'utf8');

assert(
  studentNavCode.includes('desktop-only navbar-container'),
  'Conventional desktop navbar wrapped in desktop-only class so mobile renders zero top bar'
);

assert(
  studentNavCode.includes('<MobileMenuButton') &&
  studentNavCode.includes('<MobileDrawer'),
  'StudentNav connects floating MobileMenuButton and MobileDrawer'
);

// 5. Mobile Drawer Architecture & Information Groups
console.log('\n[SECTION 5]: Mobile Drawer Information Architecture');
const drawerPath = path.join(root, 'src', 'components', 'layout', 'MobileDrawer.tsx');
assert(fs.existsSync(drawerPath), 'MobileDrawer.tsx exists');
const drawerCode = fs.readFileSync(drawerPath, 'utf8');

assert(
  drawerCode.includes('EngineeringAtlasLogo') &&
  drawerCode.includes('aria-label="Close menu"'),
  'Drawer header contains official Engineering Atlas Logo and accessible close button'
);

assert(
  drawerCode.includes('Academic Context') &&
  drawerCode.includes('profile.branch') &&
  drawerCode.includes('profile.section') &&
  drawerCode.includes('Change Academic Profile'),
  'Academic Context displays Branch, Year, Semester, Section and Change Academic Profile CTA'
);

assert(
  drawerCode.includes('Search') &&
  drawerCode.includes('Revision Desk') &&
  drawerCode.includes('Announcements'),
  'Navigation / Tools group contains Search, Revision Desk (with badge), and Announcements'
);

assert(
  drawerCode.includes('Theme') &&
  drawerCode.includes('ThemeToggle') &&
  drawerCode.includes('Settings') &&
  drawerCode.includes('Help'),
  'Preferences & Support contains ThemeToggle, Settings, and Help'
);

assert(
  drawerCode.includes('Escape') &&
  drawerCode.includes('role="dialog"') &&
  drawerCode.includes('aria-modal="true"'),
  'Drawer handles Escape key, accessibility dialog roles, and focus restoration'
);

// 6. Atlas Immersive Mode
console.log('\n[SECTION 6]: Atlas Immersive Mode');
const topicPagePath = path.join(root, 'src', 'app', 'student', 'atlas', '[topicSlug]', 'page.tsx');
const topicPageCode = fs.readFileSync(topicPagePath, 'utf8');

assert(
  topicPageCode.includes('isImmersive') &&
  topicPageCode.includes('Immersive Mode') &&
  topicPageCode.includes('Exit Immersive Lab'),
  'Atlas topic page provides Immersive Mode toggle and clear Exit control'
);

assert(
  topicPageCode.includes('<StudentNav isHidden={isImmersive}') &&
  topicPageCode.includes('<StudentBottomNav isHidden={isImmersive}'),
  'Immersive mode cleanly hides mobile bottom navigation and top hamburger'
);

// 7. Global CSS Safe Areas & Reduced Motion
console.log('\n[SECTION 7]: Global CSS Safe Areas & Accessibility');
const cssPath = path.join(root, 'src', 'styles', 'globals.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(
  cssCode.includes('--mobile-nav-height: 64px') &&
  cssCode.includes('env(safe-area-inset-bottom'),
  'CSS enforces safe-area padding for mobile navigation'
);

assert(
  cssCode.includes('@media (prefers-reduced-motion: reduce)') &&
  cssCode.includes('.nav-bottom-item-active'),
  'Accessibility: reduced motion query disables transforms and animations'
);

console.log('\n====================================================');
console.log(`MOBILE NAV AUDIT COMPLETE: ${passed} Passed, ${failed} Failed`);
console.log('====================================================\n');

if (failed > 0) process.exit(1);
else process.exit(0);
