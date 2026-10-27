import { RippleLoader } from '@/components/ui/RippleLoader';

export default function StudentLoading() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 16px',
        boxSizing: 'border-box',
      }}
    >
      <RippleLoader size="md" message="Loading Student Workspace..." subMessage="Synchronizing Academic Context" />
    </div>
  );
}
