'use client';

import { useState, useEffect } from 'react';
import { AcademicProfile } from './types';

const STORAGE_KEY = 'ea_academic_profile';

export const DEFAULT_PROFILE: AcademicProfile = {
  branch: 'CSE',
  branchName: 'Computer Science & Engineering',
  year: 4,
  yearName: 'IV Year',
  semester: 7,
  semesterName: 'VII Semester',
  section: 'CSE-A',
  sectionId: 'sec-csea',
  studentName: 'Aspirant',
};

// High-speed in-memory singleton cache to eliminate hydration delay across soft navigations
let cachedMemoryProfile: AcademicProfile | null = null;

export function getStoredProfile(): AcademicProfile | null {
  if (cachedMemoryProfile) return cachedMemoryProfile;
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    const parsed = JSON.parse(item) as AcademicProfile;
    cachedMemoryProfile = parsed;
    return parsed;
  } catch (e) {
    return null;
  }
}

function syncCookies(profile: AcademicProfile) {
  if (typeof document === 'undefined') return;
  const cookieOptions = '; path=/; max-age=31536000; SameSite=Lax';
  document.cookie = `ea_academic_context=${encodeURIComponent(JSON.stringify(profile))}${cookieOptions}`;
  document.cookie = `ea_section_id=${encodeURIComponent(profile.sectionId || '')}${cookieOptions}`;
  document.cookie = `ea_branch_code=${encodeURIComponent(profile.branch || '')}${cookieOptions}`;
  document.cookie = `ea_semester=${encodeURIComponent(String(profile.semester || ''))}${cookieOptions}`;
  document.cookie = `ea_year=${encodeURIComponent(String(profile.year || ''))}${cookieOptions}`;
}

export function saveStoredProfile(profile: AcademicProfile): void {
  cachedMemoryProfile = profile;
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  syncCookies(profile);
  window.dispatchEvent(new Event('ea_profile_changed'));
}

export function useAcademicProfile() {
  // Always initialize with DEFAULT_PROFILE so SSR output matches initial client hydration render 100%
  const [profile, setProfile] = useState<AcademicProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let p = getStoredProfile();
    if (!p) {
      p = DEFAULT_PROFILE;
      saveStoredProfile(DEFAULT_PROFILE);
    } else {
      // Auto-heal any stale/inconsistent year vs semester combinations from previous states
      if (p.semester && (!p.year || p.year !== Math.ceil(p.semester / 2))) {
        const correctYear = Math.ceil(p.semester / 2);
        const yearNames = ['I Year', 'II Year', 'III Year', 'IV Year'];
        p = {
          ...p,
          year: correctYear,
          yearName: yearNames[correctYear - 1] || `${correctYear} Year`,
        };
        saveStoredProfile(p);
      } else {
        syncCookies(p);
      }
    }

    cachedMemoryProfile = p;
    setProfile(p);
    setIsLoaded(true);

    const onProfileChange = () => {
      const updated = getStoredProfile() || DEFAULT_PROFILE;
      cachedMemoryProfile = updated;
      setProfile(updated);
      syncCookies(updated);
    };

    window.addEventListener('ea_profile_changed', onProfileChange);
    return () => window.removeEventListener('ea_profile_changed', onProfileChange);
  }, []);

  const updateProfile = (newProfile: AcademicProfile) => {
    saveStoredProfile(newProfile);
    setProfile(newProfile);
  };

  return { profile: profile || DEFAULT_PROFILE, isLoaded, hasProfile: !!getStoredProfile(), updateProfile };
}
