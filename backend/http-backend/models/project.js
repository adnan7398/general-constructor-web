import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://placehold.co/300x200/1e293b/94a3b8?text=Project",
  },
  projectType: {
    type: String,
    enum: ['commercial', 'industrial', 'residential', 'infrastructure', 'public'],
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
  // Show this project on the public website
  showOnWebsite: {
    type: Boolean,
    default: false,
  },
  // Display order on website (lower = first)
  displayOrder: {
    type: Number,
    default: 0,
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  }],
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
