import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  purchases: [{
    ebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EBook',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    paymentId: String,
  }],
  serviceRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);