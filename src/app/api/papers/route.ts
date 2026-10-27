import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const examType = searchParams.get('examType') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    // Check student context
    const studentContext = await getStudentAcademicContextFromRequest(req);
    const hasStudentCookie = Boolean(
      req.cookies.get('ea_academic_context')?.value ||
      req.cookies.get('ea_branch_code')?.value ||
      req.headers.get('x-academic-context')
    );

    // If student queries a subject, verify that subject belongs to student's branch
    if (hasStudentCookie && subjectId && studentContext.branchId) {
      const subject = await db.subjects.findById(subjectId);
      if (subject && subject.branchId !== studentContext.branchId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Cross-branch access denied to question papers for ${subject.name}.`,
          },
          { status: 403 }
        );
      }
    }

    let papers = await db.questionPapers.findMany({ subjectId, academicYear, examType, status });

    // If student requesting without specific subject, filter to student's branch
    if (hasStudentCookie && studentContext.branchId) {
      const branchSubjects = await db.subjects.findMany({ branchId: studentContext.branchId });
      const branchSubjectIds = new Set(branchSubjects.map(s => s.id));
      papers = papers.filter(p => branchSubjectIds.has(p.subjectId) || p.branchId === studentContext.branchId);
    }

    return NextResponse.json(
      { success: true, data: papers },
      {
        headers: {
          'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
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
    const { title, academicYear, examType, fileUrl, fileName, fileSize, branchId, semesterId, subjectId } = body;

    if (!title || !academicYear || !fileUrl || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'Title, academicYear, fileUrl, and subjectId are required.' },
        { status: 400 }
      );
    }

    const newPaper = await db.questionPapers.create({
      title,
      academicYear,
      examType: examType || 'END_SEMESTER',
      fileUrl,
      fileName: fileName || title,
      fileSize: Number(fileSize) || 1024,
      status: 'PUBLISHED',
      branchId: branchId || 'branch-cse',
      semesterId: semesterId || 'sem-7',
      subjectId,
    });

    return NextResponse.json({ success: true, data: newPaper }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
