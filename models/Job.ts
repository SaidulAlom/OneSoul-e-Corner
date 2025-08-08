import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  requirements: string;
  salary?: string;
  applicationUrl?: string;
  applicationEmail?: string;
  deadline?: Date;
  featured: boolean;
  active: boolean;
  applications: Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [50, 'Company name cannot be more than 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    enum: ['technology', 'marketing', 'sales', 'design', 'engineering', 'management', 'customer-service', 'other']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [100, 'Job description must be at least 100 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required'],
    minlength: [50, 'Job requirements must be at least 50 characters']
  },
  salary: {
    type: String,
    trim: true
  },
  applicationUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Application URL must be a valid URL'
    }
  },
  applicationEmail: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        return !v || v > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'JobApplication'
  }],
  views: {
    type: Number,
    min: [0, 'Views cannot be negative'],
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
jobSchema.index({ title: 'text', description: 'text', requirements: 'text' });
jobSchema.index({ company: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ active: 1 });
jobSchema.index({ featured: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ deadline: 1 });

// Virtual for days until deadline
jobSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.deadline) return null;
  const now = new Date();
  const diffTime = this.deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for formatted views
jobSchema.virtual('formattedViews').get(function() {
  if (this.views >= 1000000) {
    return `${(this.views / 1000000).toFixed(1)}M`;
  } else if (this.views >= 1000) {
    return `${(this.views / 1000).toFixed(1)}K`;
  }
  return this.views.toString();
});

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Pre-save middleware to validate deadline
jobSchema.pre('save', function(next) {
  if (this.deadline && this.deadline <= new Date()) {
    this.active = false;
  }
  next();
});

// Static method to find active jobs
jobSchema.statics.findActive = function() {
  return this.find({ active: true })
    .sort({ createdAt: -1 });
};

// Static method to find featured jobs
jobSchema.statics.findFeatured = function() {
  return this.find({ featured: true, active: true })
    .sort({ createdAt: -1 });
};

// Static method to find jobs by category
jobSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, active: true })
    .sort({ createdAt: -1 });
};

// Static method to find jobs by location
jobSchema.statics.findByLocation = function(location: string) {
  return this.find({ 
    location: { $regex: location, $options: 'i' }, 
    active: true 
  }).sort({ createdAt: -1 });
};

// Instance method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to add application
jobSchema.methods.addApplication = function(applicationId: Types.ObjectId) {
  if (!this.applications.includes(applicationId)) {
    this.applications.push(applicationId);
  }
  return this.save();
};

export const JobModel = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema); 