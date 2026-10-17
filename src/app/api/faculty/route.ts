import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const facultyList = await db.users.findManyFaculty();
    return NextResponse.json({ success: true, data: facultyList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { name, email, password, department, designation } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const existing = await db.users.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newFaculty = await db.users.create({
      name,
      email,
      passwordHash,
      role: 'FACULTY',
      department: department || 'Computer Science & Engineering',
      designation: designation || 'Assistant Professor',
    });

    return NextResponse.json({ success: true, data: newFaculty }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
