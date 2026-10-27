'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  /**
   * How many pixels the user must scroll before the button appears.
   * Default: 320px — equivalent to roughly 1 viewport height on mobile.
   */
  threshold?: number;
  /**
   * Short label shown on hover/focus expansion.
   * Default: "Back to top"
   */
  label?: string;
  /**
   * Extra bottom offset in px (on top of the component's own safe-area logic).
   * Use when the button must clear a fixed bottom bar (e.g., StudentBottomNav ~76px total).
   */
  bottomOffset?: number;
}

/**
 * ScrollToTopButton
 *
 * Engineering Atlas — reusable scroll-to-top utility.
 *
 * Interaction (adapted from Uiverse.io by vinodjangid07):
 *   - Compact circle when idle.
 *   - Expands horizontally on hover/focus, revealing a short text label.
 *   - Arrow icon slides up and out as the label slides in from below.
 *   - Smooth cubic-bezier transitions for width, border-radius, background.
 *   - Tap/press feedback on mobile via :active transform.
 *
 * Accessibility:
 *   - aria-label="Back to top"
 *   - Keyboard: Enter/Space triggers scroll
 *   - Reduced-motion: no transforms or transitions
 *
 * Positioning:
 *   - Fixed, bottom-right.
 *   - Respects env(safe-area-inset-bottom).
 *   - bottomOffset prop clears the StudentBottomNav on mobile.
 */
export function ScrollToTopButton({
  threshold = 320,
  label = 'Back to top',
  bottomOffset = 0,
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case page was already scrolled (e.g., after nav)
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="ea-scroll-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px) + 16px)`,
      }}
    >
      {/* Up arrow — slides out on hover/focus */}
      <ArrowUp
        size={16}
        strokeWidth={2.2}
        className="ea-scroll-top-icon"
        aria-hidden="true"
      />
      {/* Label — slides in on hover/focus */}
      <span className="ea-scroll-top-label" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
