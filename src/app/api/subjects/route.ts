import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedBranchId = searchParams.get('branchId') || undefined;
    const requestedSemesterId = searchParams.get('semesterId') || undefined;
    const enforceContext = searchParams.get('enforce') === 'true';

    // Resolve student academic context from cookies / headers
    const studentContext = await getStudentAcademicContextFromRequest(req);
    const hasStudentCookie = Boolean(
      req.cookies.get('ea_academic_context')?.value ||
      req.cookies.get('ea_branch_code')?.value ||
      req.headers.get('x-academic-context')
    );

    // If student cookie or header is present, enforce branch isolation
    if (hasStudentCookie && studentContext.branchId) {
      if (requestedBranchId && requestedBranchId !== studentContext.branchId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Cross-branch access denied. Your academic context is ${studentContext.branchCode}.`,
          },
          { status: 403 }
        );
      }
    }

    const branchId = requestedBranchId || (hasStudentCookie ? studentContext.branchId : undefined);
    const semesterId = requestedSemesterId || undefined;

    const subjects = await db.subjects.findMany({ branchId, semesterId });
    return NextResponse.json(
      { success: true, data: subjects },
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
