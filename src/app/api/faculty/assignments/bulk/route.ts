import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

interface AssignmentImportRow {
  facultyEmailOrId: string;
  subjectCodeOrId: string;
  sectionNameOrId: string;
  academicYear?: string;
}

interface RowError {
  row: number;
  entry: string;
  error: string;
}

function parseCsv(csvText: string): AssignmentImportRow[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('faculty') || firstLine.includes('email') || firstLine.includes('subject');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map(line => {
    const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    return {
      facultyEmailOrId: parts[0] || '',
      subjectCodeOrId: parts[1] || '',
      sectionNameOrId: parts[2] || '',
      academicYear: parts[3] || '2026-2027',
    };
  });
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { csv, rows: incomingRows, validateOnly = false } = body;

    let rows: AssignmentImportRow[] = [];
    if (typeof csv === 'string' && csv.trim().length > 0) {
      rows = parseCsv(csv);
    } else if (Array.isArray(incomingRows)) {
      rows = incomingRows;
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No assignment records provided. Provide CSV or rows array.' },
        { status: 400 }
      );
    }

    // Cache lookup sets from DB
    const facultyMembers = await db.users.findManyFaculty();
    const subjects = await db.subjects.findMany();
    const sections = await db.academicStructure.getSections();
    const currentAssignments = await db.facultyAssignments.findMany();

    const errors: RowError[] = [];
    const validRows: Array<{
      rowIndex: number;
      facultyId: string;
      facultyName: string;
      facultyEmail: string;
      subjectId: string;
      subjectCode: string;
      subjectName: string;
      sectionId: string;
      sectionName: string;
      academicYear: string;
    }> = [];

    const seenKeySet = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 1;
      const r = rows[i];
      const facKey = (r.facultyEmailOrId || '').trim();
      const subKey = (r.subjectCodeOrId || '').trim();
      const secKey = (r.sectionNameOrId || '').trim();

      if (!facKey || !subKey || !secKey) {
        errors.push({
          row: rowNum,
          entry: `${facKey || 'empty'} | ${subKey || 'empty'} | ${secKey || 'empty'}`,
          error: 'Faculty, Subject, and Section are all required',
        });
        continue;
      }

      // Match Faculty
      const faculty = facultyMembers.find(
        f => f.id === facKey || f.email.toLowerCase() === facKey.toLowerCase()
      );
      if (!faculty) {
        errors.push({
          row: rowNum,
          entry: facKey,
          error: `Faculty member '${facKey}' not found in registry`,
        });
        continue;
      }

      // Match Subject
      const subject = subjects.find(
        s => s.id === subKey || s.code.toLowerCase() === subKey.toLowerCase()
      );
      if (!subject) {
        errors.push({
          row: rowNum,
          entry: subKey,
          error: `Subject code '${subKey}' not found in academic structure`,
        });
        continue;
      }

      // Match Section
      const section = sections.find(
        sec => sec.id === secKey || sec.name.toLowerCase() === secKey.toLowerCase()
      );
      if (!section) {
        errors.push({
          row: rowNum,
          entry: secKey,
          error: `Section '${secKey}' not found (e.g. valid: CSE-A, CSE-B, ECE-A, ECE-B)`,
        });
        continue;
      }

      const assignmentKey = `${faculty.id}::${subject.id}::${section.id}`;
      if (seenKeySet.has(assignmentKey)) {
        errors.push({
          row: rowNum,
          entry: `${faculty.name} - ${subject.code} - ${section.name}`,
          error: 'Duplicate assignment within this import batch',
        });
        continue;
      }
      seenKeySet.add(assignmentKey);

      // Check existing assignment in DB
      const alreadyAssigned = currentAssignments.some(
        ca => ca.facultyId === faculty.id && ca.subjectId === subject.id && ca.sectionId === section.id
      );
      if (alreadyAssigned) {
        errors.push({
          row: rowNum,
          entry: `${faculty.name} - ${subject.code} - ${section.name}`,
          error: 'Teaching assignment already active in system',
        });
        continue;
      }

      validRows.push({
        rowIndex: rowNum,
        facultyId: faculty.id,
        facultyName: faculty.name,
        facultyEmail: faculty.email,
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        sectionId: section.id,
        sectionName: section.name,
        academicYear: r.academicYear || '2026-2027',
      });
    }

    if (validateOnly) {
      return NextResponse.json({
        success: true,
        mode: 'preview',
        totalRows: rows.length,
        validCount: validRows.length,
        invalidCount: errors.length,
        preview: validRows,
        errors,
      });
    }

    const createdAssignments = [];
    for (const v of validRows) {
      const assignment = await db.facultyAssignments.create({
        facultyId: v.facultyId,
        subjectId: v.subjectId,
        sectionId: v.sectionId,
        academicYear: v.academicYear,
      });
      createdAssignments.push(assignment);
    }

    return NextResponse.json({
      success: true,
      mode: 'committed',
      totalRows: rows.length,
      createdCount: createdAssignments.length,
      invalidCount: errors.length,
      createdAssignments,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
