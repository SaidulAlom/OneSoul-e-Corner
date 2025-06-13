import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { JobModel } from '@/models/Job';
import { adminMiddleware } from '@/middleware/auth';
import { successResponse, errorResponse, paginatedResponse, handleApiError } from '@/lib/api-utils';

// GET /api/jobs - List jobs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const sort = searchParams.get('sort') || '-createdAt';

    const query: any = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter out expired jobs
    query.applicationDeadline = { $gt: new Date() };

    const total = await JobModel.countDocuments(query);
    const jobs = await JobModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('postedBy', 'name email')
      .lean();

    return paginatedResponse(jobs, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/jobs - Create job
export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const body = await request.json();
      const {
        title,
        company,
        location,
        type,
        category,
        description,
        requirements,
        responsibilities,
        salary,
        benefits,
        applicationDeadline,
        contactEmail,
      } = body;

      // Validate required fields
      if (!title || !company || !location || !type || !category || !description || !applicationDeadline || !contactEmail) {
        return errorResponse('Missing required fields');
      }

      const job = await JobModel.create({
        title,
        company,
        location,
        type,
        category,
        description,
        requirements: requirements || [],
        responsibilities: responsibilities || [],
        salary,
        benefits: benefits || [],
        applicationDeadline: new Date(applicationDeadline),
        contactEmail,
        postedBy: user.userId,
      });

      return successResponse(job, 'Job posted successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}