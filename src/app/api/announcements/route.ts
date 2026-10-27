import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const requestedSectionId = searchParams.get('sectionId') || undefined;

    // Check student context
    const studentContext = await getStudentAcademicContextFromRequest(req);
    const hasStudentCookie = Boolean(
      req.cookies.get('ea_academic_context')?.value ||
      req.cookies.get('ea_section_id')?.value ||
      req.headers.get('x-academic-context')
    );

    // If explicit section requested by student, enforce section match
    if (hasStudentCookie && requestedSectionId && requestedSectionId !== studentContext.sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Access denied to announcements for section '${requestedSectionId}'. Your active section is '${studentContext.sectionName || studentContext.sectionId}'.`,
        },
        { status: 403 }
      );
    }

    // If subjectId requested, verify subject belongs to student's branch
    if (hasStudentCookie && subjectId && studentContext.branchId) {
      const subject = await db.subjects.findById(subjectId);
      if (subject && subject.branchId !== studentContext.branchId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Cross-branch access denied.`,
          },
          { status: 403 }
        );
      }
    }

    let announcements = await db.announcements.findMany({ subjectId, sectionId: requestedSectionId, status: 'PUBLISHED' });

    // If student requesting without specific sectionId, filter out other sections' announcements
    if (hasStudentCookie) {
      announcements = announcements.filter(a => {
        if (a.sectionId && a.sectionId !== studentContext.sectionId) {
          return false;
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, data: announcements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { title, content, priority, subjectId, sectionId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const inst = await db.getInstitution();
    const newAnn = await db.announcements.create({
      institutionId: inst.id,
      title,
      content,
      priority: priority || 'NORMAL',
      subjectId: subjectId || undefined,
      sectionId: sectionId || undefined,
      authorId: auth.user.id,
      status: 'PUBLISHED',
    });

    return NextResponse.json({ success: true, data: newAnn }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
