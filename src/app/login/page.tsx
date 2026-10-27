'use client';

import React from 'react';
import { FacultyLogin } from '@/components/auth/FacultyLogin';

/**
 * Unified Login Page for Engineering Atlas
 * Renders the Mercury-inspired Faculty & Academic authentication portal.
 * Features:
 * - Admin Login access placed strictly on /login in bottom-right corner with fixed positioning
 * - Password Viewer toggle with Eye and EyeOff
 */
export default function LoginPage() {
  return <FacultyLogin />;
}
