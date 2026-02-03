import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Project from '../models/project.js';
import TeamMember from '../models/teammember.js';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const argv = process.argv.slice(2);
  const title = argv[0] || 'Imported Project - Sample';
  const description = argv[1] || 'Project created via import script';
  const category = argv[2] || 'Residential';
  const location = argv[3] || 'Default Site Location';
  const image = argv[4] || 'https://via.placeholder.com/600x400?text=project+image';

  // Create project
  const project = new Project({
    title,
    description,
    category,
    location,
    images: [image]
  });
  await project.save();
  console.log('Created Project:', project._id.toString());

  // Create team member and assign project
  const tmName = argv[5] || 'Imported Team Member';
  const tmEmail = argv[6] || 'teammember@example.com';
  const tmRole = argv[7] || 'Manager';

  const member = new TeamMember({
    name: tmName,
    role: tmRole,
    contact: { email: tmEmail },
    assignedProject: [project._id]
  });
  await member.save();
  console.log('Created TeamMember:', member._id.toString());

  // Optionally add createdBy on project if a user id passed
  const createdBy = argv[8];
  if (createdBy) {
    project.createdBy = createdBy;
    await project.save();
    console.log('Updated project.createdBy:', createdBy);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => {
  console.error('Error creating project/team member:', err);
  process.exit(1);
});
