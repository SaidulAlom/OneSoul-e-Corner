import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEBook extends Document {
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl?: string;
  fileUrl?: string;
  fileSize?: number;
  pages?: number;
  language: string;
  price: number;
  featured: boolean;
  available: boolean;
  downloads: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ebookSchema = new Schema<IEBook>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'business', 'self-help', 'fiction', 'non-fiction', 'education', 'health', 'other']
  },
  coverUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Cover URL must be a valid URL'
    }
  },
  fileUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'File URL must be a valid URL'
    }
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  downloads: {
    type: Number,
    min: [0, 'Downloads cannot be negative'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
ebookSchema.index({ title: 'text', description: 'text', author: 'text' });
ebookSchema.index({ category: 1 });
ebookSchema.index({ author: 1 });
ebookSchema.index({ available: 1 });
ebookSchema.index({ featured: 1 });
ebookSchema.index({ createdAt: -1 });
ebookSchema.index({ downloads: -1 });

// Virtual for formatted file size
ebookSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for formatted price
ebookSchema.virtual('formattedPrice').get(function() {
  if (this.price === 0) return 'Free';
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted downloads
ebookSchema.virtual('formattedDownloads').get(function() {
  if (this.downloads >= 1000000) {
    return `${(this.downloads / 1000000).toFixed(1)}M`;
  } else if (this.downloads >= 1000) {
    return `${(this.downloads / 1000).toFixed(1)}K`;
  }
  return this.downloads.toString();
});

// Pre-save middleware to ensure tags are unique
ebookSchema.pre('save', function(next) {
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

// Static method to find featured ebooks
ebookSchema.statics.findFeatured = function() {
  return this.find({ featured: true, available: true })
    .sort({ createdAt: -1 });
};

// Static method to find ebooks by category
ebookSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, available: true })
    .sort({ createdAt: -1 });
};

// Static method to find free ebooks
ebookSchema.statics.findFree = function() {
  return this.find({ price: 0, available: true })
    .sort({ downloads: -1 });
};

// Instance method to increment downloads
ebookSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

export const EBookModel = mongoose.models.EBook || mongoose.model<IEBook>('EBook', ebookSchema); 