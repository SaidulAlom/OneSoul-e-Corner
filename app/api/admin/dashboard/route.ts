import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { UserModel } from '@/models/User';
import { NewsModel } from '@/models/News';
import { JobModel } from '@/models/Job';
import { VlogModel } from '@/models/Vlog';
import { EBookModel } from '@/models/Ebook';
import { JobApplicationModel } from '@/models/JobApplication';
import { adminMiddleware } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  return adminMiddleware(request, async (req, user) => {
    try {
      await connectDB();

      // Get counts for all collections
      const [
        totalUsers,
        totalNews,
        totalJobs,
        totalVlogs,
        totalEbooks,
        totalApplications
      ] = await Promise.all([
        UserModel.countDocuments(),
        NewsModel.countDocuments(),
        JobModel.countDocuments({ active: true }),
        VlogModel.countDocuments({ published: true }),
        EBookModel.countDocuments({ available: true }),
        JobApplicationModel.countDocuments()
      ]);

      // Get recent activity (last 10 activities across all collections)
      const recentActivity = await Promise.all([
        // Recent user registrations
        UserModel.find()
          .sort({ createdAt: -1 })
          .limit(3)
          .select('name email createdAt')
          .lean()
          .then(users => users.map(user => ({
            action: `New user registered: ${user.name}`,
            time: new Date(user.createdAt).toLocaleString(),
            type: 'user'
          }))),

        // Recent news articles
        NewsModel.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('title createdAt')
          .lean()
          .then(news => news.map(article => ({
            action: `News published: ${article.title}`,
            time: new Date(article.createdAt).toLocaleString(),
            type: 'news'
          }))),

        // Recent job postings
        JobModel.find({ active: true })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('title company createdAt')
          .lean()
          .then(jobs => jobs.map(job => ({
            action: `Job posted: ${job.title} at ${job.company}`,
            time: new Date(job.createdAt).toLocaleString(),
            type: 'job'
          }))),

        // Recent vlogs
        VlogModel.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('title createdAt')
          .lean()
          .then(vlogs => vlogs.map(vlog => ({
            action: `Vlog published: ${vlog.title}`,
            time: new Date(vlog.createdAt).toLocaleString(),
            type: 'vlog'
          }))),

        // Recent ebooks
        EBookModel.find({ available: true })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('title author createdAt')
          .lean()
          .then(ebooks => ebooks.map(ebook => ({
            action: `E-book added: ${ebook.title} by ${ebook.author}`,
            time: new Date(ebook.createdAt).toLocaleString(),
            type: 'ebook'
          }))),

        // Recent job applications
        JobApplicationModel.find()
          .sort({ createdAt: -1 })
          .limit(3)
          .populate('job', 'title')
          .select('name job createdAt')
          .lean()
          .then(applications => applications.map(app => ({
            action: `Job application: ${app.name} applied for ${app.job?.title || 'Unknown Job'}`,
            time: new Date(app.createdAt).toLocaleString(),
            type: 'application'
          })))
      ]);

      // Combine and sort all activities by time
      const allActivities = recentActivity.flat().sort((a, b) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      ).slice(0, 10);

      const dashboardData = {
        totalUsers,
        totalNews,
        totalJobs,
        totalVlogs,
        totalEbooks,
        totalApplications,
        recentActivity: allActivities
      };

      return successResponse(dashboardData);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
