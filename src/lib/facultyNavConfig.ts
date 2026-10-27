export interface FacultyNavItem {
  id: string;
  label: string;
  path: string;
  iconName: 'LayoutDashboard' | 'Users' | 'Box' | 'FileCheck' | 'FileText' | 'HelpCircle' | 'Megaphone';
  exact?: boolean;
}

/**
 * Centralized Faculty Portal Navigation Configuration
 * Single source of truth for faculty sidebar and mobile navigation.
 * Excludes all generic ERP, analytics, calendar, and student administration modules.
 */
export const FACULTY_NAV_ITEMS: FacultyNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/faculty',
    iconName: 'LayoutDashboard',
    exact: true,
  },
  {
    id: 'classes',
    label: 'My Classes',
    path: '/faculty/classes',
    iconName: 'Users',
  },
  {
    id: 'materials',
    label: 'Materials',
    path: '/faculty/materials',
    iconName: 'Box',
  },
  {
    id: 'assignments',
    label: 'Assignments',
    path: '/faculty/assignments',
    iconName: 'FileCheck',
  },
  {
    id: 'papers',
    label: 'Question Papers',
    path: '/faculty/papers',
    iconName: 'FileText',
  },
  {
    id: 'questions',
    label: 'Questions',
    path: '/faculty/questions',
    iconName: 'HelpCircle',
  },
  {
    id: 'announcements',
    label: 'Announcements',
    path: '/faculty/announcements',
    iconName: 'Megaphone',
  },
];
