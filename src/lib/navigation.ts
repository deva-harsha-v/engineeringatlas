import {
  Home,
  Compass,
  BookOpen,
  CheckSquare,
  FileText,
  Search,
  Bookmark,
  Bell,
  Settings,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

export interface PrimaryNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface SecondaryNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  actionKey?: 'search' | 'revision' | 'cohort';
}

/**
 * Shared Primary Navigation Items
 * Used across DesktopNavbar and MobileBottomNav to enforce single source of truth.
 */
export const PRIMARY_NAVIGATION: PrimaryNavItem[] = [
  { id: 'home', label: 'Home', path: '/student/home', icon: Home },
  { id: 'atlas', label: 'Atlas', path: '/student/atlas', icon: Compass },
  { id: 'subjects', label: 'Subjects', path: '/student/subjects', icon: BookOpen },
  { id: 'practice', label: 'Practice', path: '/student/practice', icon: CheckSquare },
  { id: 'papers', label: 'Papers', path: '/student/papers', icon: FileText },
];

/**
 * Secondary Tools & Utilities Navigation Items
 * Used inside MobileDrawer and Desktop secondary popovers.
 */
export const SECONDARY_NAVIGATION: SecondaryNavItem[] = [
  { id: 'search', label: 'Search', actionKey: 'search', icon: Search },
  { id: 'revision', label: 'Revision Desk', actionKey: 'revision', icon: Bookmark },
  { id: 'announcements', label: 'Announcements', path: '/student/home#announcements', icon: Bell },
];

export const PREFERENCE_NAVIGATION: SecondaryNavItem[] = [
  { id: 'settings', label: 'Settings', path: '/student/setup', icon: Settings },
];

export const SUPPORT_NAVIGATION: SecondaryNavItem[] = [
  { id: 'help', label: 'Help', path: '/about', icon: HelpCircle },
];

/**
 * Unified route active detector
 */
export function isRouteActive(itemPath: string, currentPath: string): boolean {
  if (itemPath === '/student/home') {
    return currentPath === '/student/home' || currentPath === '/student';
  }
  return currentPath.startsWith(itemPath);
}
