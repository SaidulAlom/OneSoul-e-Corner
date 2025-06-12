export interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: 'national' | 'international' | 'regional';
  featured: boolean;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  category: 'government' | 'private' | 'walkin' | 'exam';
  state: string;
  sector: string;
  qualifications: string;
  applyLink: string;
  lastDate: string;
  featured: boolean;
  createdAt: string;
}

export interface Vlog {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  category: 'education' | 'tech' | 'daily';
  featured: boolean;
  createdAt: string;
}

export interface EBook {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  coverImage: string;
  fileUrl: string;
  category: 'competitive' | 'fiction' | 'learning';
  featured: boolean;
  rating: number;
  downloads: number;
  createdAt: string;
}

export interface ServiceRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  notes?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  purchases: {
    ebookId: string;
    purchaseDate: string;
    paymentId: string;
  }[];
  serviceRequests: string[];
  createdAt: string;
}

export interface AuthUser {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}