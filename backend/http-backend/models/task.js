import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    deadline: Date
  });

  
export default mongoose.model('Task', taskSchema);