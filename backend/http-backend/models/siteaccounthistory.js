import mongoose from 'mongoose';
import { type } from 'os';

const entrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  typeofExpense: { type: String, enum: ['LABOUR', 'MATERIAL'], required: true },
  category: { type: String, required: true },
  particular: { type: String },
  amount: { type: Number, required: true },
  Quantity: { type: Number, required: true },
  paymentMode: { type: String },
}, { _id: true });

const siteAccountSchema = new mongoose.Schema({
  siteName: { type: String, required: true, unique: true },
  entries: [entrySchema]
}, { timestamps: true });

// Force schema reload by adding a timestamp
const modelName = 'SiteAccount';
const existingModel = mongoose.models[modelName];
if (existingModel) {
  delete mongoose.models[modelName];
}

export default mongoose.model(modelName, siteAccountSchema);
