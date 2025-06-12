import mongoose from 'mongoose';

const VlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['education', 'tech', 'daily'],
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

export default mongoose.models.Vlog || mongoose.model('Vlog', VlogSchema);