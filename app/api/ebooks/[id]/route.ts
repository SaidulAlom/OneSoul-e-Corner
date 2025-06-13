import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { EbookModel } from '@/models/Ebook';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/ebooks/[id] - Get a single e-book and increment views
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const ebook = await EbookModel.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!ebook) {
      return errorResponse('E-Book not found', 404);
    }
    return successResponse(ebook);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/ebooks/[id] - Update an e-book (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const body = await request.json();
      const ebook = await EbookModel.findByIdAndUpdate(
        params.id,
        { ...body },
        { new: true }
      );
      if (!ebook) {
        return errorResponse('E-Book not found', 404);
      }
      return successResponse(ebook, 'E-Book updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/ebooks/[id] - Delete an e-book (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const ebook = await EbookModel.findByIdAndDelete(params.id);
      if (!ebook) {
        return errorResponse('E-Book not found', 404);
      }
      return successResponse(null, 'E-Book deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
} 