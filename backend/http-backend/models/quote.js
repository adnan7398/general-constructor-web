import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'read', 'contacted'],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quote', quoteSchema);
