import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const freshUser = await db.users.findById(user.id);
  return NextResponse.json({ success: true, user: freshUser || user });
}
