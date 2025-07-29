import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

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
    enum: ['admin', 'superadmin', 'worker', 'manager', 'client'],
    default: 'client',
  },

  phone: { type: String },

  address: { type: String },

  projectAssigned: { type: String },

  profileImage: {
    type: String,
    default: 'https://www.gravatar.com/avatar/',
  },

  joinedDate: {
    type: Date,
    default: Date.now,
  },

  notes: { type: String },

  // User settings
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Only for worker/client roles (who is the admin who created this account)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
