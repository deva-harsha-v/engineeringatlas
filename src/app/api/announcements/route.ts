import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const sectionId = searchParams.get('sectionId') || undefined;

    const announcements = await db.announcements.findMany({ subjectId, sectionId, status: 'PUBLISHED' });
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
