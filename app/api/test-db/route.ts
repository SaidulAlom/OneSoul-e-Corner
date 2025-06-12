import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';

export async function GET() {
  try {
    const conn = await connectDB();
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      connection: conn ? 'Connected' : 'Not connected'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to MongoDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 