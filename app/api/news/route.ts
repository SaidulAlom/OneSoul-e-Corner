import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { NewsModel } from '@/models/News';
import { adminMiddleware } from '@/middleware/auth';
import { successResponse, errorResponse, paginatedResponse, handleApiError } from '@/lib/api-utils';
import { QueryParams } from '@/lib/types';

// GET /api/news - List news articles
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || '-createdAt';

    const query: any = { status: 'published' };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.featured = true;
    }

    const total = await NewsModel.countDocuments(query);
    const news = await NewsModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name email')
      .lean();

    return paginatedResponse(news, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/news - Create news article
export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const body = await request.json();
      const { title, content, category, image, tags, featured, status } = body;

      // Validate required fields
      if (!title || !content || !category || !image) {
        return errorResponse('Missing required fields');
      }

      const news = await NewsModel.create({
        title,
        content,
        category,
        image,
        tags: tags || [],
        featured: featured || false,
        status: status || 'draft',
        author: user.userId,
        publishedAt: status === 'published' ? new Date() : undefined,
      });

      return successResponse(news, 'News article created successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}