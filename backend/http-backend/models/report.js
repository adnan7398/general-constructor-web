import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // Reference to project
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  
  // Week information
  weekNumber: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  weekEndDate: {
    type: Date,
    required: true,
  },
  
  // Labour summary
  labour: {
    totalWorkers: { type: Number, default: 0 },
    workingDays: { type: Number, default: 0 },
    totalManDays: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    details: [{
      date: Date,
      workers: Number,
      description: String,
    }],
  },
  
  // Financial summary
  financial: {
    weeklyIncome: { type: Number, default: 0 },
    weeklyExpense: { type: Number, default: 0 },
    materialCost: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
  },
  
  // Progress tracking
  progress: {
    percentageComplete: { type: Number, default: 0, min: 0, max: 100 },
    previousWeekProgress: { type: Number, default: 0 },
    weeklyProgressGain: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['on-track', 'ahead', 'behind', 'at-risk'],
      default: 'on-track',
    },
  },
  
  // Work done this week
  workCompleted: [{
    task: String,
    description: String,
    completedOn: Date,
  }],
  
  // Upcoming work
  upcomingWork: [{
    task: String,
    plannedDate: Date,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  }],
  
  // Issues and blockers
  issues: [{
    issue: String,
    severity: {
      type: String,
      enum: ['critical', 'major', 'minor'],
      default: 'minor',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    reportedOn: { type: Date, default: Date.now },
  }],
  
  // Notes and remarks
  notes: {
    type: String,
    default: '',
  },
  
  // Report metadata
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  generatedBy: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for unique weekly reports per project
reportSchema.index({ project: 1, weekNumber: 1, year: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);
