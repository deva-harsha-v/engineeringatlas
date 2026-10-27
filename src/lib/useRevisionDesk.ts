'use client';

import { useState, useEffect } from 'react';

export interface RevisionItem {
  id: string;
  type: 'TOPIC' | 'QUESTION' | 'NOTE' | 'PAPER';
  title: string;
  subtitle?: string;
  url: string;
  unit?: number | string;
  subjectCode?: string;
  savedAt: string;
}

const STORAGE_KEY = 'ea-revision-desk';

export function useRevisionDesk() {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading revision desk from localStorage', e);
    }
    setMounted(true);
  }, []);

  const saveItems = (newItems: RevisionItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('ea-revision-desk-changed'));
    } catch (e) {
      console.error('Error writing revision desk to localStorage', e);
    }
  };

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch (e) {}
    };
    window.addEventListener('ea-revision-desk-changed', handleSync);
    return () => window.removeEventListener('ea-revision-desk-changed', handleSync);
  }, []);

  const toggleBookmark = (item: Omit<RevisionItem, 'savedAt'>) => {
    const exists = items.some((i) => i.id === item.id);
    if (exists) {
      saveItems(items.filter((i) => i.id !== item.id));
    } else {
      const newItem: RevisionItem = {
        ...item,
        savedAt: new Date().toISOString(),
      };
      saveItems([newItem, ...items]);
    }
  };

  const isBookmarked = (id: string): boolean => {
    return items.some((i) => i.id === id);
  };

  const removeBookmark = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    saveItems([]);
  };

  return {
    items,
    count: mounted ? items.length : 0,
    toggleBookmark,
    isBookmarked,
    removeBookmark,
    clearAll,
  };
}
