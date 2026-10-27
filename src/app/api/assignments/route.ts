import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const requestedSubjectId = searchParams.get('subjectId') || undefined;
    const requestedSectionId = searchParams.get('sectionId') || undefined;
    const requestedFacultyId = searchParams.get('facultyId') || undefined;
    const statusParam = searchParams.get('status');
    const status = statusParam === 'ALL' ? undefined : (statusParam || (auth?.role === 'FACULTY' ? undefined : 'PUBLISHED'));

    // 1. ADMIN: unrestricted access across all sections for administrative oversight
    if (auth?.role === 'ADMIN') {
      const assignments = await db.assignments.findMany({
        subjectId: requestedSubjectId,
        sectionId: requestedSectionId,
        facultyId: requestedFacultyId,
        status,
      });
      return NextResponse.json({ success: true, data: assignments });
    }

    // 2. FACULTY: access assignments they teach or authored across their assigned sections
    if (auth?.role === 'FACULTY') {
      let facultyAssignments = await db.assignments.findMany({
        subjectId: requestedSubjectId,
        sectionId: requestedSectionId,
        facultyId: requestedFacultyId || auth.id,
        status,
      });

      const teaching = await db.facultyAssignments.findMany({ facultyId: auth.id });
      const allowedSectionIds = new Set(teaching.map((t) => t.sectionId));

      facultyAssignments = facultyAssignments.filter(
        (a) => a.facultyId === auth.id || allowedSectionIds.has(a.sectionId)
      );

      return NextResponse.json({ success: true, data: facultyAssignments });
    }

    // 3. STUDENT: Strict section-based visibility using active Academic Context
    const studentContext = await getStudentAcademicContextFromRequest(req);

    // Security Gate: Reject cross-section assignment snooping even if caller explicitly passes other sectionId
    if (requestedSectionId && requestedSectionId !== studentContext.sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Cross-section access denied. You are enrolled in section ${studentContext.sectionName || studentContext.sectionId}. You cannot access assignments belonging to another section.`,
        },
        { status: 403 }
      );
    }

    // Enforce student's exact sectionId
    const effectiveSectionId = studentContext.sectionId;

    // Security Gate: If subjectId is requested, verify it belongs to student's academic branch and semester
    if (requestedSubjectId) {
      const subject = await db.subjects.findById(requestedSubjectId);
      if (!subject) {
        return NextResponse.json({ success: false, error: 'Subject not found.' }, { status: 404 });
      }

      if (studentContext.branchId && subject.branchId !== studentContext.branchId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Subject ${subject.name} does not belong to your academic branch (${studentContext.branchCode}).`,
          },
          { status: 403 }
        );
      }

      if (studentContext.semesterId && subject.semesterId !== studentContext.semesterId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Subject ${subject.name} does not belong to your academic semester (${studentContext.semesterName || studentContext.semesterNumber}).`,
          },
          { status: 403 }
        );
      }
    }

    // Fetch assignments strictly matching student's section and published status
    const assignments = await db.assignments.findMany({
      subjectId: requestedSubjectId,
      sectionId: effectiveSectionId,
      status: 'PUBLISHED',
    });

    return NextResponse.json(
      {
        success: true,
        data: assignments,
        academicContext: {
          branch: studentContext.branchCode,
          year: studentContext.yearNumber,
          semester: studentContext.semesterNumber,
          section: studentContext.sectionName,
          sectionId: studentContext.sectionId,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=180, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { id: existingId, title, description, unit, deadline, fileUrl, fileName, submissionMethod, subjectId, sectionId, status: requestedStatus } = body;
    const assignmentStatus = requestedStatus === 'DRAFT' ? 'DRAFT' : 'PUBLISHED';

    if (!title || !subjectId || !sectionId) {
      return NextResponse.json(
        { success: false, error: 'Title, subjectId, and sectionId are required.' },
        { status: 400 }
      );
    }

    if (assignmentStatus === 'PUBLISHED' && (!description || !deadline)) {
      return NextResponse.json(
        { success: false, error: 'Description and deadline are required to publish an assignment.' },
        { status: 400 }
      );
    }

    // Validate subject & section existence and semester alignment
    const subject = await db.subjects.findById(subjectId);
    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject not found.' }, { status: 404 });
    }

    const section = await db.sections.findById(sectionId);
    if (!section) {
      return NextResponse.json({ success: false, error: 'Section not found.' }, { status: 404 });
    }

    if (subject.semesterId !== section.semesterId) {
      return NextResponse.json(
        { success: false, error: 'Validation Error: Subject and Section belong to different academic semesters.' },
        { status: 400 }
      );
    }

    let facultyAssignmentId: string | undefined;

    // Verify faculty teaching assignment: must be tied to Branch + Year + Semester + Section + Subject
    if (auth.user.role === 'FACULTY') {
      const teachingAssignments = await db.facultyAssignments.findMany({
        facultyId: auth.user.id,
        subjectId,
        sectionId,
      });

      if (teachingAssignments.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You are not assigned to teach this subject and section.' },
          { status: 403 }
        );
      }

      facultyAssignmentId = teachingAssignments[0].id;
    }

    const effectiveDeadline = deadline || new Date(Date.now() + 7 * 86400000).toISOString();
    const effectiveDescription = description || 'Draft assignment description.';

    // If updating an existing draft:
    if (existingId) {
      const existing = await db.assignments.findById(existingId);
      if (existing) {
        const updated = await db.assignments.update(existingId, {
          title,
          description: effectiveDescription,
          unit: Number(unit) || 1,
          deadline: effectiveDeadline,
          fileUrl: fileUrl || existing.fileUrl,
          fileName: fileName || existing.fileName,
          submissionMethod: submissionMethod || existing.submissionMethod,
          status: assignmentStatus,
          subjectId,
          sectionId,
          facultyAssignmentId,
        });
        return NextResponse.json({ success: true, data: updated });
      }
    }

    const newAssignment = await db.assignments.create({
      title,
      description: effectiveDescription,
      unit: Number(unit) || 1,
      deadline: effectiveDeadline,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      submissionMethod: submissionMethod || 'Submit handwritten solutions in class.',
      status: assignmentStatus,
      subjectId,
      sectionId,
      facultyId: auth.user.id,
      facultyAssignmentId,
    });

    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
