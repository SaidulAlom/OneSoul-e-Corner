import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';
import { Job } from './Job';

export interface JobApplication {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  notes?: string;
}

export interface JobApplicationDocument extends JobApplication, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<JobApplicationDocument>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
jobApplicationSchema.index({ status: 1 });

// Update job applications count when application is created
jobApplicationSchema.post('save', async function() {
  const Job = mongoose.model('Job');
  await Job.findByIdAndUpdate(this.job, { $inc: { applications: 1 } });
});

export const JobApplicationModel = mongoose.models.JobApplication || 
  mongoose.model<JobApplicationDocument>('JobApplication', jobApplicationSchema); 