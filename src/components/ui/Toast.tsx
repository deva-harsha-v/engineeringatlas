'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg: string, d?: number) => showToast(msg, 'success', d),
    error: (msg: string, d?: number) => showToast(msg, 'error', d),
    warning: (msg: string, d?: number) => showToast(msg, 'warning', d),
    info: (msg: string, d?: number) => showToast(msg, 'info', d),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: 'min(calc(100% - 32px), 380px)',
          pointerEvents: 'none',
        }}
        className="toast-container-responsive"
      >
        {toasts.map((t) => {
          const icon =
            t.type === 'success' ? (
              <CheckCircle2 size={18} color="var(--tertiary)" />
            ) : t.type === 'error' ? (
              <AlertCircle size={18} color="var(--error)" />
            ) : t.type === 'warning' ? (
              <AlertTriangle size={18} color="var(--warning)" />
            ) : (
              <Info size={18} color="var(--secondary)" />
            );

          return (
            <div
              key={t.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-container-high)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                animation: 'toast-slide-in 0.25s ease-out',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {icon}
                <span style={{ lineHeight: 1.4 }}>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
