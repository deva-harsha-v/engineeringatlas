import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const audit = await db.analytics.getSyllabusCoverageAudit();
    return NextResponse.json({ success: true, data: audit });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
