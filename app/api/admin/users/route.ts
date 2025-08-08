import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { adminMiddleware } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      
      const users = await UserModel.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

      return successResponse(users);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// POST /api/admin/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const body = await request.json();

      // Check if user with email already exists
      const existingUser = await UserModel.findOne({ email: body.email });
      if (existingUser) {
        return errorResponse('User with this email already exists', 409);
      }

      // Create new user
      const newUser = await UserModel.create({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role || 'user',
        isVerified: body.isVerified || false
      });

      // Return user without password
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return successResponse(userResponse, 'User created successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
