import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { profile } from 'console';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
  
    profileImage: {
      type: String,
      default: 'https://www.gravatar.com/avatar/', 
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
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
  }, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
