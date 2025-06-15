// models/SiteAccountEntry.ts
import mongoose from 'mongoose';

const siteAccountEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['EXPENSE', 'INCOME'],
    required: true,
  },
  category: {
    type: String, // e.g., LABOUR, MATERIAL, BATTI, etc.
    required: true,
  },
  description: {
    type: String, // e.g., "SHANU BHAI", "CUTTER MACHINE"
  },
  amount: {
    type: Number,
    required: true,
  },
  siteName: {
    type: String, // e.g., 'ERA', 'KHADRA NEW'
    required: true,
  },
});

export default mongoose.model('Entry', siteAccountEntrySchema);
