import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const sectionId = searchParams.get('sectionId') || undefined;
    const facultyId = searchParams.get('facultyId') || undefined;
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    const materials = await db.materials.findMany({ subjectId, sectionId, facultyId, type, status });
    return NextResponse.json({ success: true, data: materials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { title, description, type, unit, fileUrl, fileName, fileSize, mimeType, storageKey, subjectId, sectionId } = body;

    if (!title || !fileUrl || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'Title, fileUrl, and subjectId are required.' },
        { status: 400 }
      );
    }

    const newMaterial = await db.materials.create({
      title,
      description,
      type: type || 'NOTES',
      unit: Number(unit) || 1,
      fileUrl,
      fileName: fileName || title,
      fileSize: Number(fileSize) || 1024,
      mimeType: mimeType || 'application/pdf',
      storageKey: storageKey || fileName || 'file',
      status: 'PUBLISHED',
      subjectId,
      sectionId: sectionId || undefined,
      facultyId: auth.user.id,
    });

    return NextResponse.json({ success: true, data: newMaterial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
