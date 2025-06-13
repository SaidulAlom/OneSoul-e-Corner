import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const user = await UserModel.findById(params.id).select('-password');
      if (!user) {
        return errorResponse('User not found', 404);
      }
      return successResponse(user);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const body = await request.json();
      const { name, email, role, password } = body;

      // Check if user exists
      const existingUser = await UserModel.findById(params.id);
      if (!existingUser) {
        return errorResponse('User not found', 404);
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== existingUser.email) {
        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
          return errorResponse('Email already in use');
        }
      }

      // Update user
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) updateData.password = password;

      const updatedUser = await UserModel.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      ).select('-password');

      return successResponse(updatedUser, 'User updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      
      // Prevent self-deletion
      if (params.id === user.userId) {
        return errorResponse('Cannot delete your own account');
      }

      const deletedUser = await UserModel.findByIdAndDelete(params.id);
      if (!deletedUser) {
        return errorResponse('User not found', 404);
      }

      return successResponse(null, 'User deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
} 