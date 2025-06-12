import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['government', 'private', 'walkin', 'exam'],
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
  lastDate: {
    type: Date,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);