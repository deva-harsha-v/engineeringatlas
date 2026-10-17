'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredProfile } from '@/lib/useProfile';

export default function StudentRootPage() {
  const router = useRouter();

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      router.replace('/student/home');
    } else {
      router.replace('/student/setup');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        Loading Engineering Atlas workspace...
      </div>
    </div>
  );
}
