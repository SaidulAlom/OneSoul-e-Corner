import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

// Base user interface without password
export interface User {
  _id: string | mongoose.Types.ObjectId;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// User with password for internal use
export interface UserWithPassword extends Omit<User, '_id'> {
  _id?: string | mongoose.Types.ObjectId;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
} 