// Authentication & Server-Side RBAC for Engineering Atlas
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, Role } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'ea_super_secure_jwt_secret_engineering_atlas_2026_svec_production';
const COOKIE_NAME = 'ea_session';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
      department: user.department,
      designation: user.designation,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  // Check cookie first
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value) {
    const user = verifyToken(cookie.value);
    if (user) return user;
  }

  // Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// Server-side RBAC guard
export function requireAuth(req: NextRequest): { user: AuthUser } | { error: NextResponse } {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

export function requireRole(req: NextRequest, allowedRoles: Role[]): { user: AuthUser } | { error: NextResponse } {
  const authResult = requireAuth(req);
  if ('error' in authResult) return authResult;

  const { user } = authResult;
  if (!allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { success: false, error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role.` },
        { status: 403 }
      ),
    };
  }

  return { user };
}
