import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId') || undefined;
    const semesterId = searchParams.get('semesterId') || undefined;

    const subjects = await db.subjects.findMany({ branchId, semesterId });
    return NextResponse.json({ success: true, data: subjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { name, code, branchId, semesterId, description, unitsCount, topicsCount } = body;

    if (!name || !code || !branchId || !semesterId) {
      return NextResponse.json(
        { success: false, error: 'Name, code, branchId, and semesterId are required.' },
        { status: 400 }
      );
    }

    const newSub = await db.subjects.create({
      name,
      code,
      branchId,
      semesterId,
      description,
      unitsCount: Number(unitsCount) || 5,
      topicsCount: Number(topicsCount) || 30,
    });

    return NextResponse.json({ success: true, data: newSub }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
