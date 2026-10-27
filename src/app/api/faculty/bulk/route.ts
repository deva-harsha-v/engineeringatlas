import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, hashPassword } from '@/lib/auth';

interface FacultyImportRow {
  name: string;
  email: string;
  department?: string;
  designation?: string;
  password?: string;
}

interface RowError {
  row: number;
  email?: string;
  error: string;
}

function parseCsv(csvText: string): FacultyImportRow[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Inspect header if exists
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('name') || firstLine.includes('email');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map(line => {
    // Basic CSV splitting handling commas
    const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    return {
      name: parts[0] || '',
      email: parts[1] || '',
      department: parts[2] || 'Computer Science & Engineering',
      designation: parts[3] || 'Assistant Professor',
      password: parts[4] || '',
    };
  });
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { csv, rows: incomingRows, defaultPassword = 'password123', validateOnly = false } = body;

    let rows: FacultyImportRow[] = [];
    if (typeof csv === 'string' && csv.trim().length > 0) {
      rows = parseCsv(csv);
    } else if (Array.isArray(incomingRows)) {
      rows = incomingRows;
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No faculty records provided. Provide a CSV string or rows array.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: RowError[] = [];
    const validRows: Array<FacultyImportRow & { resolvedPassword: string; rowIndex: number }> = [];
    const seenEmailsInBatch = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 1;
      const r = rows[i];
      const trimmedName = (r.name || '').trim();
      const trimmedEmail = (r.email || '').trim().toLowerCase();

      if (!trimmedName) {
        errors.push({ row: rowNum, email: trimmedEmail, error: 'Name is required' });
        continue;
      }

      if (!trimmedEmail) {
        errors.push({ row: rowNum, email: '', error: 'Email is required' });
        continue;
      }

      if (!emailRegex.test(trimmedEmail)) {
        errors.push({ row: rowNum, email: trimmedEmail, error: 'Invalid email format' });
        continue;
      }

      if (seenEmailsInBatch.has(trimmedEmail)) {
        errors.push({ row: rowNum, email: trimmedEmail, error: 'Duplicate email within uploaded batch' });
        continue;
      }
      seenEmailsInBatch.add(trimmedEmail);

      // Check collision with existing DB users
      const existing = await db.users.findByEmail(trimmedEmail);
      if (existing) {
        errors.push({ row: rowNum, email: trimmedEmail, error: 'Account already exists in Engineering Atlas' });
        continue;
      }

      const pass = (r.password && r.password.trim().length >= 6) ? r.password.trim() : defaultPassword;
      validRows.push({
        name: trimmedName,
        email: trimmedEmail,
        department: (r.department || 'Computer Science & Engineering').trim(),
        designation: (r.designation || 'Assistant Professor').trim(),
        resolvedPassword: pass,
        rowIndex: rowNum,
      });
    }

    // If dry-run / validate-only mode
    if (validateOnly) {
      return NextResponse.json({
        success: true,
        mode: 'preview',
        totalRows: rows.length,
        validCount: validRows.length,
        invalidCount: errors.length,
        preview: validRows.slice(0, 50).map(v => ({
          row: v.rowIndex,
          name: v.name,
          email: v.email,
          department: v.department,
          designation: v.designation,
          initialPassword: v.resolvedPassword,
          mustChangePassword: true,
        })),
        errors,
      });
    }

    // Execute bulk commit
    const createdUsers = [];
    for (const v of validRows) {
      const passwordHash = await hashPassword(v.resolvedPassword);
      const user = await db.users.create({
        name: v.name,
        email: v.email,
        passwordHash,
        role: 'FACULTY',
        department: v.department,
        designation: v.designation,
        mustChangePassword: true,
      });
      createdUsers.push(user);
    }

    return NextResponse.json({
      success: true,
      mode: 'committed',
      totalRows: rows.length,
      createdCount: createdUsers.length,
      invalidCount: errors.length,
      createdUsers,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
