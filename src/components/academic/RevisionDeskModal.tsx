'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button } from '@/components/ui';
import { useRevisionDesk, RevisionItem } from '@/lib/useRevisionDesk';
import { Bookmark, Trash2, ExternalLink, Compass, BookOpen, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface RevisionDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RevisionDeskModal({ isOpen, onClose }: RevisionDeskModalProps) {
  const { items, removeBookmark, clearAll } = useRevisionDesk();
  const [selectedType, setSelectedType] = useState<'ALL' | 'TOPIC' | 'QUESTION' | 'NOTE'>('ALL');

  const filteredItems = selectedType === 'ALL'
    ? items
    : items.filter((item) => item.type === selectedType);

  const getIcon = (type: RevisionItem['type']) => {
    switch (type) {
      case 'TOPIC':
        return <Compass size={15} color="var(--secondary)" />;
      case 'NOTE':
        return <BookOpen size={15} color="var(--accent)" />;
      case 'QUESTION':
        return <HelpCircle size={15} color="var(--tertiary)" />;
      case 'PAPER':
        return <FileText size={15} color="var(--warning)" />;
      default:
        return <Bookmark size={15} color="var(--primary)" />;
    }
  };

  const getBadgeLabel = (type: RevisionItem['type']) => {
    switch (type) {
      case 'TOPIC':
        return 'ATLAS VISUALIZER';
      case 'NOTE':
        return 'COURSE NOTES';
      case 'QUESTION':
        return 'PRACTICE QUESTION';
      case 'PAPER':
        return 'PAST PAPER';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Revision Desk">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Curated personal queue of high-yield concepts, tricky practice questions, and notes saved for exam prep.
          </p>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear Desk
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'ALL', label: `All (${items.length})` },
            { id: 'TOPIC', label: `Atlas Modules (${items.filter((i) => i.type === 'TOPIC').length})` },
            { id: 'QUESTION', label: `Questions (${items.filter((i) => i.type === 'QUESTION').length})` },
            { id: 'NOTE', label: `Notes (${items.filter((i) => i.type === 'NOTE').length})` },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedType(pill.id as any)}
              style={{
                padding: '5px 10px',
                borderRadius: 'var(--radius-pill)',
                border: selectedType === pill.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: selectedType === pill.id ? 'var(--surface-container-high)' : 'var(--surface-container)',
                color: selectedType === pill.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* List of Bookmarked Items */}
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '36px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
            }}
          >
            <Bookmark size={28} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Revision Desk is Clean
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px auto 0', maxWidth: '320px' }}>
              Bookmark key Atlas simulations, tricky questions, or faculty lecture notes to queue them here for Mid-Term and Semester revision.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--surface-container)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-container-high)',
                      flexShrink: 0,
                    }}
                  >
                    {getIcon(item.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          backgroundColor: 'var(--surface-container-lowest)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {getBadgeLabel(item.type)}
                      </span>
                      {item.unit && (
                        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                          Unit {item.unit}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <Link href={item.url} onClick={onClose} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm" style={{ padding: '4px 10px', fontSize: '11px' }}>
                      Open <ExternalLink size={11} style={{ marginLeft: '4px' }} />
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeBookmark(item.id)}
                    title="Remove from Revision Desk"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
