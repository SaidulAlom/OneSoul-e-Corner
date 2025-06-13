import { NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse } from './types';

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return NextResponse.json(response, { status });
}

export function errorResponse(
  error: string,
  status = 400
): NextResponse {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const response: PaginatedResponse<T[]> = {
    success: true,
    data,
    total,
    page,
    limit,
    totalPages,
  };
  return NextResponse.json(response);
}

export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error);
  
  if (error.name === 'ValidationError') {
    return errorResponse('Validation error: ' + error.message);
  }
  
  if (error.name === 'MongoError' && error.code === 11000) {
    return errorResponse('Duplicate entry found');
  }
  
  return errorResponse('Internal server error', 500);
} 