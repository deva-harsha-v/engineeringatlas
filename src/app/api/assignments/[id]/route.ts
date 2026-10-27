import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getUserFromRequest(req);
    const assignment = await db.assignments.findById(params.id);
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found.' }, { status: 404 });
    }

    // 1. ADMIN: unrestricted access
    if (auth?.role === 'ADMIN') {
      return NextResponse.json({ success: true, data: assignment });
    }

    // 2. FACULTY: allowed if author or assigned to teach this section
    if (auth?.role === 'FACULTY') {
      if (assignment.facultyId === auth.id) {
        return NextResponse.json({ success: true, data: assignment });
      }

      const teaching = await db.facultyAssignments.findMany({
        facultyId: auth.id,
        subjectId: assignment.subjectId,
        sectionId: assignment.sectionId,
      });

      if (teaching.length > 0) {
        return NextResponse.json({ success: true, data: assignment });
      }

      return NextResponse.json(
        { success: false, error: 'Forbidden: You are not assigned to this class section.' },
        { status: 403 }
      );
    }

    // 3. STUDENT: Strict section-based isolation & draft protection
    if (assignment.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Assignment not found.' }, { status: 404 });
    }

    const studentContext = await getStudentAcademicContextFromRequest(req);
    if (assignment.sectionId !== studentContext.sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Cross-section access denied. This assignment belongs to section ${assignment.sectionName || assignment.sectionId}. You are enrolled in section ${studentContext.sectionName || studentContext.sectionId}.`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const existing = await db.assignments.findById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Assignment not found.' }, { status: 404 });
    }

    if (auth.user.role === 'FACULTY' && existing.facultyId !== auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only modify your own assignments.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await db.assignments.update(params.id, body);
    return NextResponse.json({ success: true, data: updated });
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
    const existing = await db.assignments.findById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Assignment not found.' }, { status: 404 });
    }

    if (auth.user.role === 'FACULTY' && existing.facultyId !== auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only delete your own assignments.' },
        { status: 403 }
      );
    }

    await db.assignments.delete(params.id);
    return NextResponse.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
