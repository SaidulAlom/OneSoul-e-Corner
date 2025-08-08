import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVlog extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  duration: number;
  views: number;
  likes: number;
  featured: boolean;
  published: boolean;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vlogSchema = new Schema<IVlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid URL'
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Thumbnail URL must be a valid URL'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'lifestyle', 'education', 'entertainment', 'business', 'health', 'other']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  duration: {
    type: Number,
    min: [0, 'Duration cannot be negative'],
    default: 0
  },
  views: {
    type: Number,
    min: [0, 'Views cannot be negative'],
    default: 0
  },
  likes: {
    type: Number,
    min: [0, 'Likes cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
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
vlogSchema.index({ title: 'text', description: 'text' });
vlogSchema.index({ category: 1 });
vlogSchema.index({ author: 1 });
vlogSchema.index({ published: 1 });
vlogSchema.index({ featured: 1 });
vlogSchema.index({ createdAt: -1 });
vlogSchema.index({ views: -1 });

// Virtual for formatted duration
vlogSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for view count with formatting
vlogSchema.virtual('formattedViews').get(function() {
  if (this.views >= 1000000) {
    return `${(this.views / 1000000).toFixed(1)}M`;
  } else if (this.views >= 1000) {
    return `${(this.views / 1000).toFixed(1)}K`;
  }
  return this.views.toString();
});

// Pre-save middleware to ensure tags are unique
vlogSchema.pre('save', function(next) {
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

// Static method to find featured vlogs
vlogSchema.statics.findFeatured = function() {
  return this.find({ featured: true, published: true })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to find vlogs by category
vlogSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, published: true })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Instance method to increment views
vlogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
vlogSchema.methods.toggleLike = function() {
  this.likes += 1;
  return this.save();
};

export const VlogModel = mongoose.models.Vlog || mongoose.model<IVlog>('Vlog', vlogSchema); 