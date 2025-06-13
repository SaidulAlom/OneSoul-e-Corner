import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';

export interface Job {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  category: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  applicationDeadline: Date;
  contactEmail: string;
  status: 'active' | 'closed';
  postedBy: mongoose.Types.ObjectId;
  applications: number;
  views: number;
}

export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [{
      type: String,
      trim: true,
    }],
    responsibilities: [{
      type: String,
      trim: true,
    }],
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    benefits: [{
      type: String,
      trim: true,
    }],
    applicationDeadline: {
      type: Date,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ type: 1, category: 1, status: 1 });
jobSchema.index({ applicationDeadline: 1 });

// Virtual for formatted deadline
jobSchema.virtual('formattedDeadline').get(function() {
  return this.applicationDeadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Method to check if job is expired
jobSchema.methods.isExpired = function(): boolean {
  return this.applicationDeadline < new Date();
};

export const JobModel = mongoose.models.Job || mongoose.model<JobDocument>('Job', jobSchema); 