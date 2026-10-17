import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const sectionId = searchParams.get('sectionId') || undefined;
    const facultyId = searchParams.get('facultyId') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    const assignments = await db.assignments.findMany({ subjectId, sectionId, facultyId, status });
    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { title, description, unit, deadline, fileUrl, fileName, submissionMethod, subjectId, sectionId } = body;

    if (!title || !description || !deadline || !subjectId || !sectionId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, deadline, subjectId, and sectionId are required.' },
        { status: 400 }
      );
    }

    const newAssignment = await db.assignments.create({
      title,
      description,
      unit: Number(unit) || 1,
      deadline,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      submissionMethod: submissionMethod || 'Submit handwritten solutions in class.',
      status: 'PUBLISHED',
      subjectId,
      sectionId,
      facultyId: auth.user.id,
    });

    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
