import { RippleLoader } from '@/components/ui/RippleLoader';

export default function FacultyLoading() {
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
      <RippleLoader size="md" message="Loading Faculty Portal..." subMessage="Synchronizing Institutional Records" />
    </div>
  );
}
