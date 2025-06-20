// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['Material', 'Equipment', 'Labor', 'Vehicle', 'Other'],
    default: 'Other',
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'In Use', 'Pending', 'Completed', 'Damaged'],
    default: 'Pending',
  },
  location: String,
  cost: {
    type: Number,
    default: 0,
  },
  startDate: Date,
  endDate: Date,
  description: String,
}, {
  timestamps: true
});

export default mongoose.model('Resource', resourceSchema);
