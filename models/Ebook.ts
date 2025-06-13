import mongoose, { Schema, Document } from 'mongoose';

export interface Ebook {
  title: string;
  description: string;
  author: string;
  coverImage: string;
  fileUrl: string;
  category: string;
  tags: string[];
  price: number;
  isFree: boolean;
  downloadCount: number;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface EbookDocument extends Ebook, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ebookSchema = new Schema<EbookDocument>(
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
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
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
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
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
ebookSchema.index({ title: 'text', description: 'text', author: 'text' });
ebookSchema.index({ category: 1 });
ebookSchema.index({ status: 1 });
ebookSchema.index({ createdBy: 1 });
ebookSchema.index({ tags: 1 });

// Virtual for formatted price
ebookSchema.virtual('formattedPrice').get(function() {
  return this.isFree ? 'Free' : `$${this.price.toFixed(2)}`;
});

// Method to increment view count
ebookSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment download count
ebookSchema.methods.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  return this.save();
};

// Pre-save middleware to handle publishedAt date
ebookSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const EbookModel = mongoose.models.Ebook || mongoose.model<EbookDocument>('Ebook', ebookSchema); 