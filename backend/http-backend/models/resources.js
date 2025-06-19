// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['pcs', 'kg', 'litre', 'sqft', 'meter', 'bags', 'set', 'other'],
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

export default  mongoose.model('Resource', resourceSchema);
