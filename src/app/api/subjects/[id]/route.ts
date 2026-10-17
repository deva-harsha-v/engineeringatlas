import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subject = await db.subjects.findById(params.id);
    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: subject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    await db.subjects.delete(params.id);
    return NextResponse.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
