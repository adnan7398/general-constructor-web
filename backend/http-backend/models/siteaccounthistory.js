import mongoose from 'mongoose';
import { type } from 'os';

const entrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  typeofExpense: { type: String,enum :['LABOUR','MAINTENAINCE'], required: true },
  category: { type: String, required: true },
  particular: { type: String },
  amount: { type: Number, required: true },
  Quantity: { type: String, required: true },
  paymentMode: { type: String },
}, { _id: true });

const siteAccountSchema = new mongoose.Schema({
  siteName: { type: String, required: true, unique: true },
  entries: [entrySchema]
}, { timestamps: true });

export default mongoose.model('SiteAccount', siteAccountSchema);
