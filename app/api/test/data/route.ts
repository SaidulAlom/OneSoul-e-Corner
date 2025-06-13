import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { successResponse, errorResponse } from '@/lib/api-utils';
import mongoose from 'mongoose';

// Create a test schema
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: { type: Date, default: Date.now }
});

// Create or get the model
const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Create a test document
    const testDoc = await TestModel.create({
      name: 'Test Document',
      timestamp: new Date()
    });

    // Read the document back
    const readDoc = await TestModel.findById(testDoc._id);

    return successResponse({
      message: 'Database operations successful',
      created: testDoc,
      read: readDoc
    });
  } catch (error) {
    console.error('Database operation error:', error);
    return errorResponse('Failed to perform database operations', 500);
  }
} 