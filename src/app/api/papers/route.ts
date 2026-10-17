import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const examType = searchParams.get('examType') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    const papers = await db.questionPapers.findMany({ subjectId, academicYear, examType, status });
    return NextResponse.json({ success: true, data: papers });
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
