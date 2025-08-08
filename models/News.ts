import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  author: Types.ObjectId;
  published: boolean;
  featured: boolean;
  tags: string[];
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'business', 'politics', 'health', 'sports', 'entertainment', 'education', 'other']
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid URL'
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  views: {
    type: Number,
    min: [0, 'Views cannot be negative'],
    default: 0
  },
  likes: {
    type: Number,
    min: [0, 'Likes cannot be negative'],
    default: 0
  }
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
newsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
newsSchema.index({ category: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ published: 1 });
newsSchema.index({ featured: 1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ views: -1 });

// Virtual for reading time estimation
newsSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Virtual for formatted views
newsSchema.virtual('formattedViews').get(function() {
  if (this.views >= 1000000) {
    return `${(this.views / 1000000).toFixed(1)}M`;
  } else if (this.views >= 1000) {
    return `${(this.views / 1000).toFixed(1)}K`;
  }
  return this.views.toString();
});

// Pre-save middleware to ensure tags are unique
newsSchema.pre('save', function(next) {
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

// Static method to find featured news
newsSchema.statics.findFeatured = function() {
  return this.find({ featured: true, published: true })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to find news by category
newsSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, published: true })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Instance method to increment views
newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
newsSchema.methods.toggleLike = function() {
  this.likes += 1;
  return this.save();
};

export const NewsModel = mongoose.models.News || mongoose.model<INews>('News', newsSchema); 