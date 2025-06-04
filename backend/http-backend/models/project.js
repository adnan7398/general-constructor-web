import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    pojecttype: { type: String, enum: ['commercial', 'industrial', 'Residential','Infratsructure'], default: 'commercial' },
    startDate: Date,
    endDate: Date,
    budget: Number,
    status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], default: 'ongoing' },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' }]
  });



export default mongoose.model('Project', projectSchema);


  