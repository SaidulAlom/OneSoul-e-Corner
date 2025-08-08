import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from './database';
import { UserModel } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function authenticateUser(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    const token = extractTokenFromRequest(request);
    if (!token) {
      return { user: null, error: 'No token provided' };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { user: null, error: 'Invalid token' };
    }

    await connectDB();
    const user = await UserModel.findById(payload.userId).select('-password');
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

export async function authenticateAdmin(request: NextRequest): Promise<{ user: any; error?: string }> {
  const authResult = await authenticateUser(request);
  if (authResult.error) {
    return authResult;
  }

  if (authResult.user.role !== 'admin') {
    return { user: null, error: 'Admin access required' };
  }

  return authResult;
}

export function authMiddleware(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    return handler(request, authResult.user);
  };
}

export function adminMiddleware(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      );
    }

    return handler(request, authResult.user);
  };
}