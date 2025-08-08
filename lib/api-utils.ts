import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message: message || 'Operation completed successfully'
  });
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  
  if (error.name === 'ValidationError') {
    return errorResponse('Validation error: ' + error.message, 400);
  }
  
  if (error.name === 'CastError') {
    return errorResponse('Invalid ID format', 400);
  }
  
  if (error.code === 11000) {
    return errorResponse('Duplicate entry found', 409);
  }
  
  if (error.message?.includes('MONGODB_URI')) {
    return errorResponse('Database connection error', 500);
  }
  
  return errorResponse('Internal server error', 500);
}

export function validateId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
}

export function paginateResults<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): { data: T[]; pagination: { page: number; limit: number; total: number; pages: number } } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      pages: Math.ceil(data.length / limit)
    }
  };
} 