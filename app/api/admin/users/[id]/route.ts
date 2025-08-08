import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { adminMiddleware } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError, validateId } from '@/lib/api-utils';

// GET /api/admin/users/[id] - Get a single user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid user ID format', 400);
      }

      await connectDB();
      const userData = await UserModel.findById(params.id)
        .select('-password')
        .lean();

      if (!userData) {
        return errorResponse('User not found', 404);
      }

      return successResponse(userData);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PUT /api/admin/users/[id] - Update a user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid user ID format', 400);
      }

      await connectDB();
      const body = await request.json();

      // Check if email is being changed and if it already exists
      if (body.email) {
        const existingUser = await UserModel.findOne({ 
          email: body.email, 
          _id: { $ne: params.id } 
        });
        if (existingUser) {
          return errorResponse('Email already exists', 409);
        }
      }

      // Update user
      const updatedUser = await UserModel.findByIdAndUpdate(
        params.id,
        {
          name: body.name,
          email: body.email,
          role: body.role,
          isVerified: body.isVerified,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return errorResponse('User not found', 404);
      }

      return successResponse(updatedUser, 'User updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/admin/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid user ID format', 400);
      }

      await connectDB();
      
      // Prevent admin from deleting themselves
      if (params.id === user._id.toString()) {
        return errorResponse('Cannot delete your own account', 400);
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
