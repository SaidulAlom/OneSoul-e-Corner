import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { uploadToCloudinary } from '@/lib/upload';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  return adminMiddleware(request, async (req) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const folder = formData.get('folder') as string || 'general';

      if (!file) {
        return errorResponse('No file provided');
      }

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const url = await uploadToCloudinary(buffer, folder, {
        resource_type: 'auto',
      });

      return successResponse({ url }, 'File uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      return errorResponse('Failed to upload file');
    }
  });
} 