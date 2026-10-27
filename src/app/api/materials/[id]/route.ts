import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await db.materials.findById(params.id);
    if (!material) {
      return NextResponse.json({ success: false, error: 'Material not found.' }, { status: 404 });
    }

    // Check student context
    const hasStudentCookie = Boolean(
      req.cookies.get('ea_academic_context')?.value ||
      req.cookies.get('ea_section_id')?.value ||
      req.headers.get('x-academic-context')
    );

    if (hasStudentCookie) {
      const studentContext = await getStudentAcademicContextFromRequest(req);

      // Section match check
      if (material.sectionId && material.sectionId !== studentContext.sectionId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: This material is designated for section '${material.sectionId}'. Your active section is '${studentContext.sectionName || studentContext.sectionId}'.`,
          },
          { status: 403 }
        );
      }

      // Branch match check
      if (studentContext.branchId && material.subjectId) {
        const subject = await db.subjects.findById(material.subjectId);
        if (subject && subject.branchId !== studentContext.branchId) {
          return NextResponse.json(
            {
              success: false,
              error: `Forbidden: Cross-branch access denied.`,
            },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: material });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const existing = await db.materials.findById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Material not found.' }, { status: 404 });
    }

    if (auth.user.role === 'FACULTY' && existing.facultyId !== auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only modify your own materials.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, status, fileUrl, fileName, fileSize, mimeType, title, description, unit } = body;

    let updated: any = existing;

    if (action === 'replace_file' || (fileUrl && fileUrl !== existing.fileUrl)) {
      if (!fileUrl) {
        return NextResponse.json({ success: false, error: 'New fileUrl is required to replace file.' }, { status: 400 });
      }
      updated = await db.materials.replaceFile(params.id, {
        fileUrl,
        fileName: fileName || existing.fileName,
        fileSize: fileSize || existing.fileSize,
        mimeType: mimeType || existing.mimeType,
      });
    }

    if (status) {
      updated = await db.materials.updateStatus(params.id, status);
    }

    if (title || description !== undefined || unit !== undefined) {
      updated = await db.materials.update(params.id, {
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(unit !== undefined ? { unit: Number(unit) } : {}),
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, ['FACULTY', 'ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const existing = await db.materials.findById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Material not found.' }, { status: 404 });
    }

    if (auth.user.role === 'FACULTY' && existing.facultyId !== auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only delete your own materials.' },
        { status: 403 }
      );
    }

    await db.materials.delete(params.id);
    return NextResponse.json({ success: true, message: 'Material deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
