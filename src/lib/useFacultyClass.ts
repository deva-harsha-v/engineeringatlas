'use client';

import { useState, useEffect, useCallback } from 'react';
import { FacultyAssignment } from './types';

const STORAGE_KEY = 'ea_faculty_active_class';

export function getStoredFacultyClassId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

export function saveStoredFacultyClassId(classId: string | null): void {
  if (typeof window === 'undefined') return;
  if (classId) {
    localStorage.setItem(STORAGE_KEY, classId);
    document.cookie = `ea_faculty_class_id=${encodeURIComponent(classId)}; path=/; max-age=31536000; SameSite=Lax`;
  } else {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `ea_faculty_class_id=; path=/; max-age=0; SameSite=Lax`;
  }
  window.dispatchEvent(new Event('ea_faculty_class_changed'));
}

export function useFacultyClass() {
  const [classes, setClasses] = useState<FacultyAssignment[]>([]);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadClasses = useCallback(async () => {
    try {
      const res = await fetch('/api/faculty/assignments');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setClasses(json.data);
        const storedId = getStoredFacultyClassId();
        const matched = json.data.find((c: FacultyAssignment) => c.id === storedId);
        if (matched) {
          setActiveClassId(matched.id);
        } else if (json.data.length > 0) {
          setActiveClassId(json.data[0].id);
          saveStoredFacultyClassId(json.data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load faculty classes:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();

    const handleClassChange = () => {
      const storedId = getStoredFacultyClassId();
      setActiveClassId(storedId);
    };

    window.addEventListener('ea_faculty_class_changed', handleClassChange);
    return () => window.removeEventListener('ea_faculty_class_changed', handleClassChange);
  }, [loadClasses]);

  const selectClass = (cls: FacultyAssignment | string | null) => {
    const id = typeof cls === 'string' ? cls : cls ? cls.id : null;
    setActiveClassId(id);
    saveStoredFacultyClassId(id);
  };

  const activeClass = classes.find((c) => c.id === activeClassId) || classes[0] || null;

  return {
    classes,
    activeClass,
    activeClassId,
    selectClass,
    loading,
    refreshClasses: loadClasses,
  };
}
