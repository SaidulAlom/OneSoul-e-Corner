import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (!db.connection || !db.connection.db) {
      throw new Error('Database connection not established');
    }

    // Test database connection by getting server status
    const status = await db.connection.db.admin().serverStatus();
    
    return successResponse({
      message: 'Database connection successful',
      status: {
        version: status.version,
        uptime: status.uptime,
        connections: status.connections,
        host: db.connection.host,
        name: db.connection.name
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to connect to database',
      500
    );
  }
} 