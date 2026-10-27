import { RippleLoader } from '@/components/ui/RippleLoader';

export default function RootLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <RippleLoader size="lg" message="Loading Engineering Atlas..." subMessage="Institutional Academic Platform" />
    </div>
  );
}
