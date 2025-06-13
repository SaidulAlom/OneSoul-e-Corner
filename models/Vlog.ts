import mongoose, { Schema, Document } from 'mongoose';

export interface Vlog {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface VlogDocument extends Vlog, Document {
  createdAt: Date;
  updatedAt: Date;
}

const vlogSchema = new Schema<VlogDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
vlogSchema.index({ title: 'text', description: 'text' });
vlogSchema.index({ category: 1 });
vlogSchema.index({ status: 1 });
vlogSchema.index({ createdBy: 1 });
vlogSchema.index({ tags: 1 });

// Method to increment view count
vlogSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment like count
vlogSchema.methods.incrementLikeCount = async function() {
  this.likeCount += 1;
  return this.save();
};

// Method to decrement like count
vlogSchema.methods.decrementLikeCount = async function() {
  if (this.likeCount > 0) {
    this.likeCount -= 1;
  }
  return this.save();
};

// Method to increment comment count
vlogSchema.methods.incrementCommentCount = async function() {
  this.commentCount += 1;
  return this.save();
};

// Method to decrement comment count
vlogSchema.methods.decrementCommentCount = async function() {
  if (this.commentCount > 0) {
    this.commentCount -= 1;
  }
  return this.save();
};

// Pre-save middleware to handle publishedAt date
vlogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const VlogModel = mongoose.models.Vlog || mongoose.model<VlogDocument>('Vlog', vlogSchema); 