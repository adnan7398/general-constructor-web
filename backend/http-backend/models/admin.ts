import mongoose, { Schema } from 'mongoose';
export interface IAdmin extends Document {
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'moderator'; 
  createdAt: Date;
  updatedAt: Date;
  matchPassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema: Schema<IAdmin>  = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'moderator'],
      default: 'admin',
    },
  },
  { timestamps: true }
);
export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
    