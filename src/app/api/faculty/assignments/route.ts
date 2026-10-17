import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const facultyId = auth.user.role === 'ADMIN'
      ? searchParams.get('facultyId') || undefined
      : auth.user.id;

    const assignments = await db.facultyAssignments.findMany({ facultyId });
    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { facultyId, subjectId, sectionId, academicYear } = body;

    if (!facultyId || !subjectId || !sectionId) {
      return NextResponse.json(
        { success: false, error: 'FacultyId, subjectId, and sectionId are required.' },
        { status: 400 }
      );
    }

    const newAssignment = await db.facultyAssignments.create({
      facultyId,
      subjectId,
      sectionId,
      academicYear: academicYear || '2026-2027',
    });

    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Assignment ID is required.' }, { status: 400 });
    }

    await db.facultyAssignments.delete(id);
    return NextResponse.json({ success: true, message: 'Assignment removed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
