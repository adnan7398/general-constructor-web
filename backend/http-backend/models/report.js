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
  
  // ============ LABOUR MANAGEMENT ============
  labour: {
    // Summary
    totalWorkers: { type: Number, default: 0 },
    workingDays: { type: Number, default: 0 },
    totalManDays: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 }, // Overtime hours
    
    // Detailed breakdown by category
    breakdown: {
      skilled: { count: Number, cost: Number },      // Masons, Electricians, Plumbers
      semiskilled: { count: Number, cost: Number },  // Helpers, Assistants
      unskilled: { count: Number, cost: Number },    // General labourers
      supervisors: { count: Number, cost: Number },  // Site supervisors
      contractors: { count: Number, cost: Number },  // Sub-contractors
    },
    
    // Daily attendance log
    details: [{
      date: Date,
      workers: Number,
      skilled: { type: Number, default: 0 },
      unskilled: { type: Number, default: 0 },
      description: String,
      shift: { type: String, enum: ['day', 'night', 'both'], default: 'day' },
    }],
  },
  
  // ============ MATERIAL TRACKING ============
  materials: {
    totalCost: { type: Number, default: 0 },
    items: [{
      name: String,                  // e.g., Cement, Steel, Sand
      category: {
        type: String,
        enum: ['cement', 'steel', 'aggregate', 'sand', 'bricks', 'tiles', 'paint', 'electrical', 'plumbing', 'wood', 'glass', 'other'],
      },
      quantity: Number,
      unit: String,                  // bags, tons, cubic meters, pieces
      unitCost: Number,
      totalCost: Number,
      supplier: String,
      deliveryDate: Date,
      invoiceNo: String,
    }],
    // Stock levels
    stockStatus: [{
      material: String,
      available: Number,
      required: Number,
      unit: String,
      status: { type: String, enum: ['sufficient', 'low', 'critical', 'out-of-stock'], default: 'sufficient' },
    }],
  },
  
  // ============ EQUIPMENT & MACHINERY ============
  equipment: {
    totalCost: { type: Number, default: 0 },
    items: [{
      name: String,                  // e.g., JCB, Crane, Mixer
      type: {
        type: String,
        enum: ['excavator', 'crane', 'mixer', 'compactor', 'scaffolding', 'pump', 'generator', 'vehicle', 'tools', 'other'],
      },
      hoursUsed: Number,
      fuelCost: Number,
      rentalCost: Number,
      maintenanceCost: Number,
      operator: String,
      status: { type: String, enum: ['operational', 'under-maintenance', 'idle', 'breakdown'], default: 'operational' },
    }],
  },
  
  // ============ FINANCIAL SUMMARY ============
  financial: {
    // Income
    weeklyIncome: { type: Number, default: 0 },
    clientPayment: { type: Number, default: 0 },
    advanceReceived: { type: Number, default: 0 },
    
    // Expenses breakdown
    weeklyExpense: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    materialCost: { type: Number, default: 0 },
    equipmentCost: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    utilityCost: { type: Number, default: 0 },      // Electricity, Water
    miscCost: { type: Number, default: 0 },
    
    // Summary
    netAmount: { type: Number, default: 0 },
    cashInHand: { type: Number, default: 0 },
    pendingPayments: { type: Number, default: 0 },
  },
  
  // ============ PROGRESS TRACKING ============
  progress: {
    percentageComplete: { type: Number, default: 0, min: 0, max: 100 },
    previousWeekProgress: { type: Number, default: 0 },
    weeklyProgressGain: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['on-track', 'ahead', 'behind', 'at-risk', 'halted'],
      default: 'on-track',
    },
    // Phase-wise progress
    phases: [{
      name: String,                  // Foundation, Structure, Finishing, etc.
      planned: Number,               // Planned %
      actual: Number,                // Actual %
      variance: Number,              // Difference
    }],
  },
  
  // ============ WORK ACTIVITIES ============
  workCompleted: [{
    task: String,
    description: String,
    completedOn: Date,
    category: {
      type: String,
      enum: ['excavation', 'foundation', 'structure', 'masonry', 'plumbing', 'electrical', 'flooring', 'painting', 'finishing', 'landscaping', 'other'],
    },
    quantity: String,                // e.g., "50 sqft", "10 columns"
    location: String,                // e.g., "Ground Floor", "Block A"
  }],
  
  upcomingWork: [{
    task: String,
    plannedDate: Date,
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    estimatedDays: Number,
    dependencies: [String],          // What needs to be done first
  }],
  
  // ============ SAFETY & COMPLIANCE ============
  safety: {
    incidentCount: { type: Number, default: 0 },
    nearMissCount: { type: Number, default: 0 },
    safetyMeetingsHeld: { type: Number, default: 0 },
    ppeCompliance: { type: Number, default: 100 },  // Percentage
    
    incidents: [{
      date: Date,
      type: { type: String, enum: ['injury', 'near-miss', 'property-damage', 'fire', 'other'] },
      description: String,
      severity: { type: String, enum: ['minor', 'moderate', 'serious', 'fatal'] },
      actionTaken: String,
      reportedBy: String,
    }],
    
    inspections: [{
      date: Date,
      type: String,                  // Safety, Quality, Government
      inspector: String,
      result: { type: String, enum: ['passed', 'failed', 'conditional'] },
      remarks: String,
    }],
  },
  
  // ============ WEATHER IMPACT ============
  weather: {
    workingDays: { type: Number, default: 6 },
    rainDays: { type: Number, default: 0 },
    haltDays: { type: Number, default: 0 },
    conditions: [{
      date: Date,
      condition: { type: String, enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'extreme-heat'] },
      workStatus: { type: String, enum: ['full-work', 'partial-work', 'no-work'] },
      remarks: String,
    }],
  },
  
  // ============ QUALITY CONTROL ============
  quality: {
    testsCompleted: { type: Number, default: 0 },
    testsPassed: { type: Number, default: 0 },
    testsFailed: { type: Number, default: 0 },
    
    tests: [{
      date: Date,
      type: String,                  // Concrete cube test, Soil test, etc.
      result: { type: String, enum: ['passed', 'failed', 'pending'] },
      value: String,                 // e.g., "28 N/mm²"
      standard: String,              // Required value
      remarks: String,
    }],
    
    defects: [{
      date: Date,
      location: String,
      description: String,
      severity: { type: String, enum: ['minor', 'major', 'critical'] },
      status: { type: String, enum: ['open', 'in-progress', 'resolved'] },
      resolution: String,
    }],
  },
  
  // ============ ISSUES & BLOCKERS ============
  issues: [{
    issue: String,
    category: {
      type: String,
      enum: ['material-shortage', 'labour-shortage', 'equipment-breakdown', 'weather', 'design-change', 'client-delay', 'permit', 'financial', 'quality', 'safety', 'other'],
    },
    severity: {
      type: String,
      enum: ['critical', 'major', 'minor'],
      default: 'minor',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'escalated'],
      default: 'open',
    },
    impact: String,                  // Days delayed, cost impact
    actionTaken: String,
    assignedTo: String,
    reportedOn: { type: Date, default: Date.now },
    resolvedOn: Date,
  }],
  
  // ============ SITE PHOTOS ============
  photos: [{
    url: String,
    caption: String,
    date: { type: Date, default: Date.now },
    category: { type: String, enum: ['progress', 'issue', 'quality', 'safety', 'general'] },
  }],
  
  // ============ VISITOR LOG ============
  visitors: [{
    date: Date,
    name: String,
    designation: String,
    organization: String,
    purpose: String,
    remarks: String,
  }],
  
  // ============ NOTES & REMARKS ============
  notes: {
    type: String,
    default: '',
  },
  
  // Key highlights for management
  highlights: [{
    type: { type: String, enum: ['achievement', 'concern', 'decision', 'milestone'] },
    description: String,
  }],
  
  // ============ REPORT METADATA ============
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
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'revision-required'],
    default: 'draft',
  },
  approvedBy: String,
  approvedAt: Date,
});

// Compound index for unique weekly reports per project
reportSchema.index({ project: 1, weekNumber: 1, year: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);
