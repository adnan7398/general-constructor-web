import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'Interior']
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    type: String, // URL paths to images
    required: true
  }],
  videoUrl: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  completionDate: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
