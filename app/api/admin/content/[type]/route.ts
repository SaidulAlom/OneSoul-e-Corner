import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { NewsModel } from '@/models/News';
import { VlogModel } from '@/models/Vlog';
import { EBookModel } from '@/models/Ebook';
import { JobModel } from '@/models/Job';
import { adminMiddleware } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/admin/content/[type] - Get all content of a specific type (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      
      let content;
      switch (params.type) {
        case 'news':
          content = await NewsModel.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .lean();
          break;
        case 'vlogs':
          content = await VlogModel.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .lean();
          break;
        case 'ebooks':
          content = await EBookModel.find()
            .sort({ createdAt: -1 })
            .lean();
          break;
        case 'jobs':
          content = await JobModel.find()
            .sort({ createdAt: -1 })
            .lean();
          break;
        default:
          return errorResponse('Invalid content type', 400);
      }

      return successResponse(content);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// POST /api/admin/content/[type] - Create new content (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();
      const raw = await request.json();

      // Normalize common inputs coming from forms (strings)
      const normalizeBoolean = (v: any) => v === true || v === 'true' || v === '1' || v === 1;
      const normalizeNumber = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));
      const status: string | undefined = typeof raw.status === 'string' ? raw.status.toLowerCase() : undefined;
      const featured = normalizeBoolean(raw.featured);

      let newContent;
      switch (params.type) {
        case 'news': {
          const published = status === 'published';
          newContent = await NewsModel.create({
            title: raw.title,
            excerpt: raw.excerpt ?? '',
            content: raw.content ?? '',
            category: raw.category ?? 'General',
            tags: raw.tags ?? [],
            author: user._id,
            published,
            featured,
          });
          break;
        }
        case 'vlogs': {
          const published = status === 'published';
          newContent = await VlogModel.create({
            title: raw.title,
            description: raw.description ?? '',
            videoUrl: raw.videoUrl ?? '',
            thumbnailUrl: raw.thumbnailUrl ?? '',
            category: raw.category ?? 'General',
            tags: raw.tags ?? [],
            duration: normalizeNumber(raw.duration) ?? 0,
            author: user._id,
            published,
            featured,
          });
          break;
        }
        case 'ebooks': {
          // Treat "published" as available to align with UI
          const available = status === 'published' || status === 'available';
          newContent = await EBookModel.create({
            title: raw.title,
            description: raw.description ?? '',
            author: raw.author ?? 'Unknown',
            category: raw.category ?? 'General',
            price: normalizeNumber(raw.price) ?? 0,
            fileUrl: raw.fileUrl ?? '',
            coverImage: raw.coverImage ?? '',
            available,
            featured,
          });
          break;
        }
        case 'jobs': {
          // Treat "published" as active to align with UI
          const active = status === 'published' || status === 'active';
          newContent = await JobModel.create({
            title: raw.title,
            description: raw.description ?? '',
            company: raw.company ?? '',
            location: raw.location ?? '',
            type: raw.type ?? 'full-time',
            salary: normalizeNumber(raw.salary),
            requirements: raw.requirements ?? '',
            category: raw.category ?? 'General',
            active,
            featured,
          });
          break;
        }
        default:
          return errorResponse('Invalid content type', 400);
      }

      return successResponse(newContent, `${params.type.slice(0, -1)} created successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
