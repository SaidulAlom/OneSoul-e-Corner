import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import EBook from '@/lib/models/EBook';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await EBook.countDocuments(query);
    const ebooks = await EBook.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json({
      success: true,
      data: ebooks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ebooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const ebook = new EBook(body);
    await ebook.save();

    return NextResponse.json({
      success: true,
      data: ebook,
    });
  } catch (error) {
    console.error('Error creating ebook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ebook' },
      { status: 500 }
    );
  }
}