import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const structure = await db.getAcademicStructure();
    return NextResponse.json(
      { success: true, data: structure },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'CREATE_BRANCH': {
        const { name, code } = body;
        if (!name?.trim() || !code?.trim()) {
          return NextResponse.json(
            { success: false, error: 'Branch name and code are required' },
            { status: 400 }
          );
        }
        const newBranch = await db.branches.create({
          name: name.trim(),
          code: code.trim().toUpperCase(),
        });
        return NextResponse.json({
          success: true,
          data: newBranch,
          message: `Branch ${newBranch.code} created with 4 years and 8 semesters.`,
        });
      }

      case 'DELETE_BRANCH': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ success: false, error: 'Branch ID is required' }, { status: 400 });
        }
        await db.branches.delete(id);
        return NextResponse.json({ success: true, message: 'Branch deleted successfully' });
      }

      case 'CREATE_SECTION': {
        const { name, semesterId } = body;
        if (!name?.trim() || !semesterId) {
          return NextResponse.json(
            { success: false, error: 'Section name and semesterId are required' },
            { status: 400 }
          );
        }
        const newSection = await db.sections.create({
          name: name.trim().toUpperCase(),
          semesterId,
        });
        return NextResponse.json({
          success: true,
          data: newSection,
          message: `Section ${newSection.name} created for semester.`,
        });
      }

      case 'DELETE_SECTION': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ success: false, error: 'Section ID is required' }, { status: 400 });
        }
        await db.sections.delete(id);
        return NextResponse.json({ success: true, message: 'Section deleted successfully' });
      }

      case 'CREATE_SUBJECT': {
        const { name, code, branchId, semesterId, unitsCount = 5 } = body;
        if (!name?.trim() || !code?.trim() || !branchId || !semesterId) {
          return NextResponse.json(
            { success: false, error: 'Name, code, branchId and semesterId are required' },
            { status: 400 }
          );
        }
        const newSubject = await db.subjects.create({
          branchId,
          semesterId,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          unitsCount: Number(unitsCount) || 5,
          topicsCount: 30,
        });
        return NextResponse.json({
          success: true,
          data: newSubject,
          message: `Subject ${newSubject.code} created.`,
        });
      }

      case 'DELETE_SUBJECT': {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ success: false, error: 'Subject ID is required' }, { status: 400 });
        }
        await db.subjects.delete(id);
        return NextResponse.json({ success: true, message: 'Subject deleted successfully' });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (type === 'SECTION') {
      await db.sections.delete(id);
      return NextResponse.json({ success: true, message: 'Section deleted' });
    } else if (type === 'BRANCH') {
      await db.branches.delete(id);
      return NextResponse.json({ success: true, message: 'Branch deleted' });
    } else if (type === 'SUBJECT') {
      await db.subjects.delete(id);
      return NextResponse.json({ success: true, message: 'Subject deleted' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
