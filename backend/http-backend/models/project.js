import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://via.placeholder.com/300x200.png?text=Project+Image",
  },
  projectType: {
    type: String,
    enum: ['commercial', 'industrial', 'residential', 'infrastructure'],
    default: 'commercial',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  budget: {
    type: Number,
    min: 0,
  },

  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming'],
    default: 'ongoing',
  },

  
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  }],

  // Optional fields
  location: {
    type: String,
  },
  clientName: {
    type: String,
  },
  documents: [{
    type: String,
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Project', projectSchema);
