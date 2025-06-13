import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

type AdminHandler = (req: NextRequest, user: any) => Promise<NextResponse>;

export async function adminMiddleware(
  req: NextRequest,
  handler: AdminHandler
): Promise<NextResponse> {
  try {
    // Get current user from token
    const user = getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get full user details from database
    const dbUser = await UserModel.findById(user.userId);
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Execute the handler with the authenticated user
    return await handler(req, dbUser);
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 