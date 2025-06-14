import mongoose, { Schema, Document, Model, Types, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserWithPassword } from '@/lib/types';

// Define the base user interface without _id
interface IUserBase {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Define the user document interface
export interface IUser extends IUserBase {
  _id: Types.ObjectId;
}

// Define the user document with methods
export interface UserDocument extends HydratedDocument<IUserBase> {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the user model interface
export interface UserModel extends Model<UserDocument> {
  // Add any static methods here if needed
}

// Define the schema
const userSchema = new Schema<IUserBase, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Create and export the model
export const UserModel = (mongoose.models.User as UserModel) || 
  mongoose.model<UserDocument, UserModel>('User', userSchema);

// Export the User type for use in other models
export type { User }; 