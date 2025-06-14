import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel, UserDocument } from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { LoginCredentials, ApiResponse, AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await UserModel.findOne({ email }).exec() as UserDocument | null;
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}