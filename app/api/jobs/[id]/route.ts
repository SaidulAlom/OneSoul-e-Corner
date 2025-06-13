import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { JobModel } from '@/models/Job';
import { adminMiddleware } from '@/middleware/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// GET /api/jobs/[id] - Get single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const job = await JobModel.findById(params.id)
      .populate('postedBy', 'name email')
      .lean();

    if (!job) {
      return errorResponse('Job not found', 404);
    }

    // Increment views
    await JobModel.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return successResponse(job);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const job = await JobModel.findById(params.id);
      if (!job) {
        return errorResponse('Job not found', 404);
      }

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
        status,
      } = body;

      // Update fields
      if (title) job.title = title;
      if (company) job.company = company;
      if (location) job.location = location;
      if (type) job.type = type;
      if (category) job.category = category;
      if (description) job.description = description;
      if (requirements) job.requirements = requirements;
      if (responsibilities) job.responsibilities = responsibilities;
      if (salary) job.salary = salary;
      if (benefits) job.benefits = benefits;
      if (applicationDeadline) job.applicationDeadline = new Date(applicationDeadline);
      if (contactEmail) job.contactEmail = contactEmail;
      if (status) job.status = status;

      await job.save();

      return successResponse(job, 'Job updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const job = await JobModel.findByIdAndDelete(params.id);
      if (!job) {
        return errorResponse('Job not found', 404);
      }

      return successResponse(null, 'Job deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
} 