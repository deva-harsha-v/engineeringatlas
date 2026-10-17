import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, setAuthCookie, clearAuthCookie, getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Password incorrect.' },
        { status: 401 }
      );
    }

    const { passwordHash, ...safeUser } = user;
    const token = signToken(safeUser);

    const res = NextResponse.json({
      success: true,
      user: safeUser,
      token,
    });

    setAuthCookie(res, token);
    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
