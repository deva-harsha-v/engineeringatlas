'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'circle';
}

export function ThemeToggle({ className = '', showLabel = false, variant = 'default' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ea-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
      if (current) setTheme(current);
    }

    const handleThemeChange = () => {
      const updated = (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
      setTheme(updated);
      document.documentElement.classList.toggle('dark', updated === 'dark');
      document.documentElement.classList.toggle('light', updated === 'light');
    };

    window.addEventListener('ea-theme-change', handleThemeChange);
    return () => window.removeEventListener('ea-theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
    localStorage.setItem('ea-theme', nextTheme);
    window.dispatchEvent(new Event('ea-theme-change'));
  };

  if (!mounted) {
    if (variant === 'circle') {
      return (
        <button
          className={`ea-navbar-circle-btn ${className}`}
          aria-label="Toggle theme"
          type="button"
        >
          <Moon size={18} color="#6366F1" />
        </button>
      );
    }
    return (
      <button
        className={`btn btn-ghost btn-sm ${className}`}
        style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}
        aria-label="Toggle theme"
        type="button"
      >
        <Moon size={16} />
      </button>
    );
  }

  if (variant === 'circle') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`ea-navbar-circle-btn ${className}`}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? (
          <Sun size={18} color="#818CF8" />
        ) : (
          <Moon size={18} color="#6366F1" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`btn btn-ghost btn-sm ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        color: 'var(--text-secondary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface-1)',
        transition: 'all 0.15s ease',
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun size={15} color="#F59E0B" />
      ) : (
        <Moon size={15} color="#6366F1" />
      )}
      {showLabel && (
        <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </span>
      )}
    </button>
  );
}
