'use client';

import { useState, useEffect } from 'react';
import { AcademicProfile } from './types';

const STORAGE_KEY = 'ea_academic_profile';

export const DEFAULT_PROFILE: AcademicProfile = {
  branch: 'CSE',
  branchName: 'Computer Science & Engineering',
  year: 3,
  yearName: 'III Year',
  semester: 7,
  semesterName: 'VII Semester',
  section: 'CSE-A',
};

export function getStoredProfile(): AcademicProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    return JSON.parse(item) as AcademicProfile;
  } catch (e) {
    return null;
  }
}

export function saveStoredProfile(profile: AcademicProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('ea_profile_changed'));
}

export function useAcademicProfile() {
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const p = getStoredProfile();
    setProfile(p || DEFAULT_PROFILE);
    setIsLoaded(true);

    const onProfileChange = () => {
      setProfile(getStoredProfile() || DEFAULT_PROFILE);
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
