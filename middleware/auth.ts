import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { CustomJwtPayload } from '@/lib/types';

export async function authMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, user: CustomJwtPayload) => Promise<NextResponse>
) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    return handler(request, decoded as CustomJwtPayload);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export function adminMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, user: CustomJwtPayload) => Promise<NextResponse>
) {
  return authMiddleware(request, async (req, user) => {
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    return handler(req, user);
  });
} 