import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function adminMiddleware(req: NextRequest) {
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

    // Add user to request for use in the route handler
    const request = req as any;
    request.user = dbUser;

    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 