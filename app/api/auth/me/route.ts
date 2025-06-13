import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { authMiddleware } from '@/middleware/auth';
import { ApiResponse, User } from '@/lib/types';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const userDoc = await UserModel.findById(user.userId);
      if (!userDoc) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      const response: ApiResponse<User> = {
        success: true,
        data: userDoc.toJSON(),
      };

      return NextResponse.json(response);
    } catch (error: any) {
      console.error('Get profile error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to get profile' },
        { status: 500 }
      );
    }
  });
} 