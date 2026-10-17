import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const intelligence = await db.intelligence.getPastPaperTrends(params.subjectId);
    return NextResponse.json({ success: true, data: intelligence });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
