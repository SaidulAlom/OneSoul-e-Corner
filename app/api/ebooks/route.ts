import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { EbookModel } from '@/models/Ebook';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError, paginatedResponse } from '@/lib/api-utils';

// GET /api/ebooks - List e-books with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }

    // Get total count
    const total = await EbookModel.countDocuments(query);

    // Get paginated results
    const ebooks = await EbookModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return paginatedResponse(ebooks, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/ebooks - Create new e-book (admin only)
export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const body = await request.json();
      const { title, author, description, category, cover, fileUrl, price } = body;

      // Validate required fields
      if (!title || !author || !description || !category || !cover || !fileUrl) {
        return errorResponse('Missing required fields');
      }

      const ebook = await EbookModel.create({
        ...body,
        uploadedBy: user.userId,
      });

      return successResponse(ebook, 'E-Book created successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}