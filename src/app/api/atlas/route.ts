import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    const topics = await db.atlasTopics.findMany({ subjectId, status });
    return NextResponse.json({ success: true, data: topics });
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
      unit,
      topic,
      difficulty,
      estimatedTime,
      learningObjectives,
      visualizationType,
      overview,
      whyItMatters,
      concept,
      howItWorks,
      example,
      commonMistakes,
      quickRevision,
    } = body;

    if (!title || !slug || !subjectId || !topic) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, subjectId, and topic are required.' },
        { status: 400 }
      );
    }

    const newTopic = await db.atlasTopics.create({
      title,
      slug,
      subjectId,
      unit: Number(unit) || 1,
      topic,
      difficulty: difficulty || 'MEDIUM',
      estimatedTime: estimatedTime || '15 mins',
      learningObjectives: learningObjectives || [],
      visualizationType: visualizationType || 'GENERIC_INTERACTIVE',
      overview: overview || '',
      whyItMatters: whyItMatters || '',
      concept: concept || '',
      howItWorks: howItWorks || '',
      example: example || '',
      commonMistakes: commonMistakes || '',
      quickRevision: quickRevision || '',
      status: 'PUBLISHED',
    });

    return NextResponse.json({ success: true, data: newTopic }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
