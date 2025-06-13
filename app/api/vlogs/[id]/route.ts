import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { VlogModel } from '@/models/Vlog';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/vlogs/[id] - Get a single vlog and increment views
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vlog = await VlogModel.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email');
    if (!vlog) {
      return errorResponse('Vlog not found', 404);
    }
    return successResponse(vlog);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/vlogs/[id] - Update a vlog (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const body = await request.json();
      const vlog = await VlogModel.findByIdAndUpdate(
        params.id,
        { ...body },
        { new: true }
      );
      if (!vlog) {
        return errorResponse('Vlog not found', 404);
      }
      return successResponse(vlog, 'Vlog updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/vlogs/[id] - Delete a vlog (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const vlog = await VlogModel.findByIdAndDelete(params.id);
      if (!vlog) {
        return errorResponse('Vlog not found', 404);
      }
      return successResponse(null, 'Vlog deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
} 