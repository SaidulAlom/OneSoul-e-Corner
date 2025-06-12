import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import ServiceRequest from '@/lib/models/ServiceRequest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};

    if (status) {
      query.status = status;
    }

    const total = await ServiceRequest.countDocuments(query);
    const services = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const serviceRequest = new ServiceRequest(body);
    await serviceRequest.save();

    return NextResponse.json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}