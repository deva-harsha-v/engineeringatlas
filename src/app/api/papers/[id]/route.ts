import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paper = await db.questionPapers.findById(params.id);
    if (!paper) {
      return NextResponse.json({ success: false, error: 'Question paper not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: paper });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    await db.questionPapers.delete(params.id);
    return NextResponse.json({ success: true, message: 'Question paper deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
