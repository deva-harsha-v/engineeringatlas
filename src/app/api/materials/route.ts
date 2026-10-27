import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getStudentAcademicContextFromRequest } from '@/lib/academic-context';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId') || undefined;
    const requestedSectionId = searchParams.get('sectionId') || undefined;
    const facultyId = searchParams.get('facultyId') || undefined;
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || 'PUBLISHED';

    // Check student context
    const studentContext = await getStudentAcademicContextFromRequest(req);
    const hasStudentCookie = Boolean(
      req.cookies.get('ea_academic_context')?.value ||
      req.cookies.get('ea_section_id')?.value ||
      req.headers.get('x-academic-context')
    );

    // If explicit section requested by student, enforce section match
    if (hasStudentCookie && requestedSectionId && requestedSectionId !== studentContext.sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Access denied to materials for section '${requestedSectionId}'. Your active section is '${studentContext.sectionName || studentContext.sectionId}'.`,
        },
        { status: 403 }
      );
    }

    // If subjectId is requested, verify it belongs to student's branch
    if (hasStudentCookie && subjectId && studentContext.branchId) {
      const subject = await db.subjects.findById(subjectId);
      if (subject && subject.branchId !== studentContext.branchId) {
        return NextResponse.json(
          {
            success: false,
            error: `Forbidden: Cross-branch access denied. Subject belongs to another branch.`,
          },
          { status: 403 }
        );
      }
    }

    let materials = await db.materials.findMany({
      subjectId,
      sectionId: requestedSectionId,
      facultyId,
      type,
      status,
    });

    // If student requesting without specific sectionId, filter out other sections' materials
    if (hasStudentCookie) {
      materials = materials.filter(m => {
        // Must match student's section or be universal (no sectionId)
        if (m.sectionId && m.sectionId !== studentContext.sectionId) {
          return false;
        }
        return true;
      });
    }

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
    const { title, description, type, unit, fileUrl, fileName, fileSize, mimeType, storageKey, subjectId, sectionId, sectionIds } = body;

    if (!title || !fileUrl || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'Title, fileUrl, and subjectId are required.' },
        { status: 400 }
      );
    }

    // Determine target sections
    const targetSections: (string | undefined)[] =
      Array.isArray(sectionIds) && sectionIds.length > 0
        ? sectionIds
        : [sectionId || undefined];

    // Verify faculty assignment if requester is FACULTY
    if (auth.user.role === 'FACULTY') {
      const assignments = await db.facultyAssignments.findMany({
        facultyId: auth.user.id,
        subjectId,
      });

      const allowedSectionIds = new Set(assignments.map(a => a.sectionId));
      for (const targetSec of targetSections) {
        if (targetSec && !allowedSectionIds.has(targetSec)) {
          return NextResponse.json(
            { success: false, error: `Forbidden: You are not assigned to teach section '${targetSec}'.` },
            { status: 403 }
          );
        }
      }
    }

    const createdMaterials = [];
    for (const secId of targetSections) {
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
        sectionId: secId,
        facultyId: auth.user.id,
      });
      createdMaterials.push(newMaterial);
    }

    return NextResponse.json({
      success: true,
      data: createdMaterials[0],
      count: createdMaterials.length,
      created: createdMaterials,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
