import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';

export interface News {
  title: string;
  content: string;
  category: string;
  image: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  views: number;
  featured: boolean;
  status: 'draft' | 'published';
  publishedAt?: Date;
}

export interface NewsDocument extends News, Document {
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<NewsDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for formatted date
newsSchema.virtual('formattedDate').get(function() {
  return this.publishedAt?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export const NewsModel = mongoose.models.News || mongoose.model<NewsDocument>('News', newsSchema); 