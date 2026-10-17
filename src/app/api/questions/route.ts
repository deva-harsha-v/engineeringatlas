import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const unit = searchParams.get('unit') ? Number(searchParams.get('unit')) : undefined;
    const topic = searchParams.get('topic') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;

    const questions = await db.questions.findMany({ subjectId, unit, topic, difficulty });
    return NextResponse.json({ success: true, data: questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { subjectId, unit, topic, difficulty, type, questionText, options, correctAnswer, explanation } = body;

    if (!subjectId || !topic || !questionText || !correctAnswer || !explanation) {
      return NextResponse.json(
        { success: false, error: 'Subject, topic, questionText, correctAnswer, and explanation are required.' },
        { status: 400 }
      );
    }

    const newQuestion = await db.questions.create({
      subjectId,
      unit: Number(unit) || 1,
      topic,
      difficulty: difficulty || 'MEDIUM',
      type: type || 'MCQ',
      questionText,
      options: options || undefined,
      correctAnswer: String(correctAnswer),
      explanation,
      frequency: 1,
      repeatCount: 1,
      status: 'PUBLISHED',
      facultyId: auth.user.id,
    });

    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
