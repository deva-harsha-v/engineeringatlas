import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { resolveEngineConfig } from '@/lib/atlas/visualization-registry';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const department = searchParams.get('department') || undefined;
    const learningType = searchParams.get('learningType') || undefined;
    const classroomCode = searchParams.get('classroomCode') || searchParams.get('code') || undefined;
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
            error: `Forbidden: Cross-branch access denied to Atlas topics for ${subject.name}.`,
          },
          { status: 403 }
        );
      }
    }

    // If student explicitly requested a different department, reject
    if (hasStudentCookie && department && studentContext.branchCode) {
      if (department.toUpperCase() !== studentContext.branchCode.toUpperCase()) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Cross-branch access denied. Your department is ${studentContext.branchCode}.`,
          },
          { status: 403 }
        );
      }
    }

    let topics = await db.atlasTopics.findMany({ subjectId, department, learningType, classroomCode, status });

    // If student queries without specific subject or department, filter topics to student's branch
    if (hasStudentCookie && studentContext.branchId && !subjectId && !department) {
      const branchSubjects = await db.subjects.findMany({ branchId: studentContext.branchId });
      const branchSubjectIds = new Set(branchSubjects.map(s => s.id));
      topics = topics.filter(t => branchSubjectIds.has(t.subjectId) || t.department?.toUpperCase() === studentContext.branchCode.toUpperCase());
    }

    return NextResponse.json(
      { success: true, data: topics },
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
    const {
      title,
      slug,
      subjectId,
      department,
      departmentId,
      classroomCode,
      unit,
      topic,
      learningType = 'INTERACTIVE',
      visualizationType,
      configuration,
      content,
      difficulty,
      estimatedTime,
      learningObjectives,
      overview,
      whyItMatters,
      concept,
      howItWorks,
      example,
      commonMistakes,
      quickRevision,
      status = 'PUBLISHED',
      canonicalTopicId,
    } = body;

    if (!title || !slug || !subjectId || !topic) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, subjectId, and topic are required.' },
        { status: 400 }
      );
    }

    // Resolve visualizer if visualizer engine is requested
    const resolvedConfig = resolveEngineConfig(visualizationType || 'NONE', configuration);

    const newTopic = await db.atlasTopics.create({
      title,
      slug,
      subjectId,
      department: department || 'CSE',
      departmentId: departmentId || 'branch-cse',
      classroomCode: classroomCode || `${slug.toUpperCase()}-LAB`,
      unit: Number(unit) || 1,
      topic,
      learningType,
      visualizationType: visualizationType || 'NONE',
      configuration: resolvedConfig,
      content: content || '',
      difficulty: difficulty || 'INTERMEDIATE',
      estimatedTime: estimatedTime || '20 min',
      learningObjectives: learningObjectives || [],
      overview: overview || '',
      whyItMatters: whyItMatters || '',
      concept: concept || '',
      howItWorks: howItWorks || '',
      example: example || '',
      commonMistakes: commonMistakes || [],
      quickRevision: quickRevision || [],
      status,
      canonicalTopicId: canonicalTopicId || undefined,
    });

    return NextResponse.json({ success: true, data: newTopic }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
