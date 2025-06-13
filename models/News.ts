import mongoose, { Schema, Document } from 'mongoose';

export interface News {
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: string;
  tags: string[];
  author: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface NewsDocument extends News, Document {
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<NewsDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
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
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
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
newsSchema.index({ title: 'text', content: 'text', summary: 'text' });
newsSchema.index({ category: 1 });
newsSchema.index({ status: 1 });
newsSchema.index({ createdBy: 1 });
newsSchema.index({ tags: 1 });

// Method to increment view count
newsSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment like count
newsSchema.methods.incrementLikeCount = async function() {
  this.likeCount += 1;
  return this.save();
};

// Method to decrement like count
newsSchema.methods.decrementLikeCount = async function() {
  if (this.likeCount > 0) {
    this.likeCount -= 1;
  }
  return this.save();
};

// Method to increment comment count
newsSchema.methods.incrementCommentCount = async function() {
  this.commentCount += 1;
  return this.save();
};

// Method to decrement comment count
newsSchema.methods.decrementCommentCount = async function() {
  if (this.commentCount > 0) {
    this.commentCount -= 1;
  }
  return this.save();
};

// Pre-save middleware to handle publishedAt date
newsSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const NewsModel = mongoose.models.News || mongoose.model<NewsDocument>('News', newsSchema); 