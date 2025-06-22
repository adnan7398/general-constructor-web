import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Engineer', 'Architect', 'Contractor', 'Manager', 'Supervisor', 'Worker'],
    default: 'Engineer'
  },
  contact: {
    phone: String,
    email: String
  },
  profileImage: {
    type: String,
    default: 'https://www.gravatar.com/avatar/default'
  },
  assignedProject: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }],
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('TeamMember', teamMemberSchema);
