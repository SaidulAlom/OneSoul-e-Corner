import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJobApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    minlength: [100, 'Cover letter must be at least 100 characters'],
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  resumeUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Resume URL must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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
jobApplicationSchema.index({ job: 1 });
jobApplicationSchema.index({ applicant: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });
jobApplicationSchema.index({ email: 1 });

// Compound index to prevent duplicate applications
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Virtual for formatted status
jobApplicationSchema.virtual('statusLabel').get(function() {
  const statusLabels = {
    pending: 'Pending Review',
    reviewed: 'Reviewed',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired'
  };
  return statusLabels[this.status] || this.status;
});

// Pre-save middleware to validate unique application
jobApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingApplication = await this.constructor.findOne({
      job: this.job,
      applicant: this.applicant
    });
    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }
  }
  next();
});

// Static method to find applications by job
jobApplicationSchema.statics.findByJob = function(jobId: string) {
  return this.find({ job: jobId })
    .populate('applicant', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 });
};

// Static method to find applications by applicant
jobApplicationSchema.statics.findByApplicant = function(applicantId: string) {
  return this.find({ applicant: applicantId })
    .populate('job', 'title company location type')
    .sort({ createdAt: -1 });
};

// Static method to find applications by status
jobApplicationSchema.statics.findByStatus = function(status: string) {
  return this.find({ status })
    .populate('applicant', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 });
};

// Instance method to update status
jobApplicationSchema.methods.updateStatus = function(newStatus: string, notes?: string) {
  this.status = newStatus;
  if (notes) {
    this.notes = notes;
  }
  return this.save();
};

export const JobApplicationModel = mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema); 