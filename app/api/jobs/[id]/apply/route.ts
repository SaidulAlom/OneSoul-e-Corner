import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { JobModel } from '@/models/Job';
import { JobApplicationModel } from '@/models/JobApplication';
import { authMiddleware } from '@/middleware/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

// POST /api/jobs/[id]/apply - Submit job application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      // Check if job exists and is active
      const job = await JobModel.findById(params.id);
      if (!job) {
        return errorResponse('Job not found', 404);
      }

      if (job.status !== 'active') {
        return errorResponse('This job is no longer accepting applications');
      }

      if (job.applicationDeadline < new Date()) {
        return errorResponse('Application deadline has passed');
      }

      // Check if user has already applied
      const existingApplication = await JobApplicationModel.findOne({
        job: params.id,
        applicant: user.userId,
      });

      if (existingApplication) {
        return errorResponse('You have already applied for this job');
      }

      const body = await request.json();
      const { resume, coverLetter } = body;

      if (!resume) {
        return errorResponse('Resume is required');
      }

      const application = await JobApplicationModel.create({
        job: params.id,
        applicant: user.userId,
        resume,
        coverLetter,
      });

      return successResponse(application, 'Application submitted successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// GET /api/jobs/[id]/apply - Get application status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      const application = await JobApplicationModel.findOne({
        job: params.id,
        applicant: user.userId,
      }).populate('job', 'title company');

      if (!application) {
        return errorResponse('Application not found', 404);
      }

      return successResponse(application);
    } catch (error) {
      return handleApiError(error);
    }
  });
} 