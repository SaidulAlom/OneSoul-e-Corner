import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { NewsModel } from '@/models/News';
import { VlogModel } from '@/models/Vlog';
import { EBookModel } from '@/models/Ebook';
import { JobModel } from '@/models/Job';
import { adminMiddleware } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError, validateId } from '@/lib/api-utils';

// GET /api/admin/content/[type]/[id] - Get a single content item (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid content ID format', 400);
      }

      await connectDB();
      
      let content;
      switch (params.type) {
        case 'news':
          content = await NewsModel.findById(params.id).populate('author', 'name').lean();
          break;
        case 'vlogs':
          content = await VlogModel.findById(params.id).populate('author', 'name').lean();
          break;
        case 'ebooks':
          content = await EBookModel.findById(params.id).lean();
          break;
        case 'jobs':
          content = await JobModel.findById(params.id).lean();
          break;
        default:
          return errorResponse('Invalid content type', 400);
      }

      if (!content) {
        return errorResponse('Content not found', 404);
      }

      return successResponse(content);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PUT /api/admin/content/[type]/[id] - Update content (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid content ID format', 400);
      }

      await connectDB();
      const raw = await request.json();

      const normalizeBoolean = (v: any) => v === true || v === 'true' || v === '1' || v === 1;
      const normalizeNumber = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));
      const status: string | undefined = typeof raw.status === 'string' ? raw.status.toLowerCase() : undefined;
      const featured = normalizeBoolean(raw.featured);

      let updatedContent;
      switch (params.type) {
        case 'news': {
          const published = status === 'published';
          updatedContent = await NewsModel.findByIdAndUpdate(
            params.id,
            {
              title: raw.title,
              excerpt: raw.excerpt,
              content: raw.content,
              category: raw.category,
              tags: raw.tags,
              published,
              featured,
              updatedAt: new Date()
            },
            { new: true, runValidators: true }
          ).populate('author', 'name');
          break;
        }
        case 'vlogs': {
          const published = status === 'published';
          updatedContent = await VlogModel.findByIdAndUpdate(
            params.id,
            {
              title: raw.title,
              description: raw.description,
              videoUrl: raw.videoUrl,
              thumbnailUrl: raw.thumbnailUrl,
              category: raw.category,
              tags: raw.tags,
              duration: normalizeNumber(raw.duration),
              published,
              featured,
              updatedAt: new Date()
            },
            { new: true, runValidators: true }
          ).populate('author', 'name');
          break;
        }
        case 'ebooks': {
          const available = status === 'published' || status === 'available';
          updatedContent = await EBookModel.findByIdAndUpdate(
            params.id,
            {
              title: raw.title,
              description: raw.description,
              author: raw.author,
              category: raw.category,
              price: normalizeNumber(raw.price),
              fileUrl: raw.fileUrl,
              coverImage: raw.coverImage,
              available,
              featured,
              updatedAt: new Date()
            },
            { new: true, runValidators: true }
          );
          break;
        }
        case 'jobs': {
          const active = status === 'published' || status === 'active';
          updatedContent = await JobModel.findByIdAndUpdate(
            params.id,
            {
              title: raw.title,
              description: raw.description,
              company: raw.company,
              location: raw.location,
              type: raw.type,
              salary: normalizeNumber(raw.salary),
              requirements: raw.requirements,
              category: raw.category,
              active,
              featured,
              updatedAt: new Date()
            },
            { new: true, runValidators: true }
          );
          break;
        }
        default:
          return errorResponse('Invalid content type', 400);
      }

      if (!updatedContent) {
        return errorResponse('Content not found', 404);
      }

      return successResponse(updatedContent, 'Content updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/admin/content/[type]/[id] - Delete content (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      if (!validateId(params.id)) {
        return errorResponse('Invalid content ID format', 400);
      }

      await connectDB();
      
      let deletedContent;
      switch (params.type) {
        case 'news':
          deletedContent = await NewsModel.findByIdAndDelete(params.id);
          break;
        case 'vlogs':
          deletedContent = await VlogModel.findByIdAndDelete(params.id);
          break;
        case 'ebooks':
          deletedContent = await EBookModel.findByIdAndDelete(params.id);
          break;
        case 'jobs':
          deletedContent = await JobModel.findByIdAndDelete(params.id);
          break;
        default:
          return errorResponse('Invalid content type', 400);
      }
      
      if (!deletedContent) {
        return errorResponse('Content not found', 404);
      }

      return successResponse(null, 'Content deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
