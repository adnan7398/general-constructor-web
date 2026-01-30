import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Labour', 'Material', 'Equipment', 'Overhead', 'Other']
    },
    lineItem: {
        type: String,
        required: true // e.g., 'Cement', 'Skilled Labour - Mason'
    },

    // Financials
    allocatedAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 }, // Updated via aggregation or triggers

    // Unit details (optional depending on line item)
    unitRate: Number,
    quantity: Number,
    unit: String,

    currency: { type: String, default: 'INR' },
    fiscalYear: Number,

    status: {
        type: String,
        enum: ['active', 'locked', 'archived'],
        default: 'active'
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }
}, { timestamps: true });

// Compound index to ensure unique line items per project per year (optional but recommended)
BudgetSchema.index({ project: 1, category: 1, lineItem: 1 }, { unique: false });

export default mongoose.model('Budget', BudgetSchema);
