import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // ============ BASIC INFORMATION ============
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projectCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://placehold.co/300x200/1e293b/94a3b8?text=Project",
  },
  
  // ============ PROJECT CLASSIFICATION ============
  projectType: {
    type: String,
    enum: ['commercial', 'industrial', 'residential', 'infrastructure', 'public', 'renovation', 'interior'],
    default: 'commercial',
  },
  constructionType: {
    type: String,
    enum: ['new-construction', 'renovation', 'extension', 'repair', 'demolition'],
    default: 'new-construction',
  },
  buildingType: {
    type: String,
    enum: ['apartment', 'villa', 'office', 'warehouse', 'factory', 'hospital', 'school', 'mall', 'hotel', 'road', 'bridge', 'other'],
  },
  
  // ============ TIMELINE ============
  startDate: Date,
  expectedEndDate: Date,
  actualEndDate: Date,
  
  // Phase-wise timeline
  phases: [{
    name: String,                    // Foundation, Structure, MEP, Finishing
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'delayed'], default: 'not-started' },
    progress: { type: Number, default: 0 },
  }],
  
  // ============ FINANCIAL ============
  budget: {
    type: Number,
    min: 0,
    default: 0,
  },
  estimatedCost: { type: Number, default: 0 },
  actualCost: { type: Number, default: 0 },
  
  // Cost breakdown
  costBreakdown: {
    labour: { estimated: Number, actual: Number },
    material: { estimated: Number, actual: Number },
    equipment: { estimated: Number, actual: Number },
    overhead: { estimated: Number, actual: Number },
    contingency: { estimated: Number, actual: Number },
  },
  
  // Payment tracking
  contractValue: { type: Number, default: 0 },
  amountReceived: { type: Number, default: 0 },
  amountPending: { type: Number, default: 0 },
  
  // ============ STATUS & PROGRESS ============
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'on-hold', 'completed', 'cancelled'],
    default: 'ongoing',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  healthStatus: {
    type: String,
    enum: ['green', 'yellow', 'red'],    // On track, At risk, Critical
    default: 'green',
  },
  
  // ============ LOCATION & SITE ============
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  siteArea: {
    value: Number,
    unit: { type: String, default: 'sqft' },
  },
  builtUpArea: {
    value: Number,
    unit: { type: String, default: 'sqft' },
  },
  floors: { type: Number, default: 1 },
  
  // ============ CLIENT INFORMATION ============
  client: {
    name: String,
    company: String,
    phone: String,
    email: String,
    address: String,
  },
  
  // ============ TEAM ============
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  }],
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  },
  siteEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  },
  
  // ============ CONTRACTORS ============
  contractors: [{
    name: String,
    company: String,
    work: String,                    // Electrical, Plumbing, etc.
    contact: String,
    contractValue: Number,
    startDate: Date,
    endDate: Date,
  }],
  
  // ============ PERMITS & DOCUMENTS ============
  permits: [{
    name: String,                    // Building permit, NOC, etc.
    number: String,
    issuedDate: Date,
    expiryDate: Date,
    status: { type: String, enum: ['applied', 'approved', 'pending', 'rejected', 'expired'], default: 'pending' },
  }],
  
  documents: [{
    name: String,
    type: { type: String, enum: ['drawing', 'contract', 'permit', 'invoice', 'report', 'photo', 'other'] },
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  
  // ============ WEBSITE SHOWCASE ============
  showOnWebsite: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  showcaseImages: [String],
  
  // ============ METADATA ============
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  
  // ============ NOTES ============
  notes: String,
  tags: [String],
});

// Update timestamp on save
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate project code if not provided
projectSchema.pre('save', async function(next) {
  if (!this.projectCode) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('Project').countDocuments() + 1;
    this.projectCode = `PRJ-${year}-${count.toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Project', projectSchema);
