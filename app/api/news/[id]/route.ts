import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { NewsModel } from '@/models/News';
import { adminMiddleware } from '@/middleware/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/news/[id] - Get a single news article
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const news = await NewsModel.findById(params.id);
    
    if (!news) {
      return errorResponse('News not found', 404);
    }

    // Increment view count
    await news.incrementViewCount();

    return successResponse(news);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/news/[id] - Update a news article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(req, async (request, user) => {
    try {
      await connectDB();

      const news = await NewsModel.findById(params.id);
      
      if (!news) {
        return errorResponse('News not found', 404);
      }

      const body = await request.json();
      const {
        title,
        content,
        summary,
        imageUrl,
        category,
        tags,
        author,
        status,
      } = body;

      // Update fields if provided
      if (title) news.title = title;
      if (content) news.content = content;
      if (summary) news.summary = summary;
      if (imageUrl) news.imageUrl = imageUrl;
      if (category) news.category = category;
      if (tags) news.tags = tags;
      if (author) news.author = author;
      if (status) news.status = status;

      await news.save();

      return successResponse(news);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/news/[id] - Delete a news article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(req, async (request, user) => {
    try {
      await connectDB();

      const news = await NewsModel.findById(params.id);
      
      if (!news) {
        return errorResponse('News not found', 404);
      }

      await news.deleteOne();

      return successResponse({ message: 'News deleted successfully' });
    } catch (error) {
      return handleApiError(error);
    }
  });
} 