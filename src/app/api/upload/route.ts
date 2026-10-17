import { NextRequest, NextResponse } from 'next/server';
import { getStorageDriver, validateFile } from '@/lib/storage';
import { requireRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    const validation = validateFile(file.name, file.type, file.size);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storage = getStorageDriver();
    const uploadResult = await storage.upload(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      data: uploadResult,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'File upload failed.' }, { status: 500 });
  }
}
