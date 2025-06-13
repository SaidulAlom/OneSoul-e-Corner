import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError, paginatedResponse } from '@/lib/api-utils';

// GET /api/users - List users with filtering and pagination
export async function GET(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const searchParams = request.nextUrl.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const role = searchParams.get('role') || '';

      // Build query
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      if (role) {
        query.role = role;
      }

      // Get total count
      const total = await UserModel.countDocuments(query);

      // Get paginated results
      const users = await UserModel.find(query)
        .select('-password') // Exclude password from results
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return paginatedResponse(users, total, page, limit);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const body = await request.json();
      const { name, email, password, role } = body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return errorResponse('Missing required fields');
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return errorResponse('User with this email already exists');
      }

      const newUser = await UserModel.create({
        name,
        email,
        password, // Password will be hashed by the model's pre-save hook
        role,
      });

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return successResponse(userResponse, 'User created successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
} 