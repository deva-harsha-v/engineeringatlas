'use client';

import React from 'react';
import { AtlasEmptyState } from '@/components/ambient';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', className = '', style }: BadgeProps) {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`badge ${variantClass} ${className}`} style={style}>
      {children}
    </span>
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  isLoading = false,
  loadingText,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className} ${isLoading ? 'btn-loading' : ''}`}
      disabled={isDisabled}
      aria-busy={isLoading}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: isDisabled ? 0.72 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...props}
    >
      {isLoading && (
        <span
          className="ea-btn-spinner"
          aria-hidden="true"
          style={{
            width: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
            height: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'ea-btn-spin 0.6s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', onClick, hoverable = false, style }: CardProps) {
  const clickableClass = (onClick || hoverable) ? 'ea-card-clickable' : '';
  return (
    <div
      className={`ea-card ${clickableClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <AtlasEmptyState
      icon={icon}
      title={title}
      description={description}
      actionText={actionText}
      onAction={onAction}
    />
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = '560px' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="ea-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '14px',
      }}
    >
      <div
        className="ea-modal-card"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="ea-modal-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              fontSize: '20px',
              lineHeight: 1,
              padding: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="ea-modal-body" style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { ToastProvider, useToast } from './Toast';
export type { ToastType, ToastMessage } from './Toast';
export { ScrollToTopButton } from './ScrollToTopButton';
export { RippleLoader, FullScreenRippleLoader } from './RippleLoader';
export type { RippleLoaderProps } from './RippleLoader';
export { LoadingProvider, useGlobalLoading } from './LoadingContext';

// Engineering Atlas Ambient Visual Design System
export {
  AtlasAmbientBackground,
  AtlasGrid,
  AtlasAmbientShape,
  AtlasGlow,
  AtlasOrbital,
  AtlasEmptyState,
} from '@/components/ambient';
export type {
  AtlasAmbientBackgroundProps,
  AmbientIntensity,
  AtlasGridProps,
  AtlasAmbientShapeProps,
  AtlasGlowProps,
  AtlasOrbitalProps,
  AtlasEmptyStateProps,
} from '@/components/ambient';
