import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  category: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  whoGive: { type: String },
  paymentMode: { type: String },
  location: { type: String }
}, { _id: true });

const siteAccountSchema = new mongoose.Schema({
  siteName: { type: String, required: true, unique: true },
  entries: [entrySchema]
}, { timestamps: true });

export default mongoose.model('SiteAccount', siteAccountSchema);
