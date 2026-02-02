import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import XLSX from 'xlsx';
import Project from '../models/project.js';
import TeamMember from '../models/teammember.js';

async function run() {
  const filePath = process.argv[2] || process.env.IMPORT_XLSX || '/Users/syedtahoor/Desktop/general-constructor-web/ALL SITES ACCOUNT JAN 2026.xlsx';
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log('Rows parsed:', rows.length);

  const siteSet = new Map();
  for (const row of rows) {
    const vals = Object.values(row);
    const siteName = (vals[4] || '').toString().trim();
    if (siteName) siteSet.set(siteName, true);
  }

  console.log('Unique sites found:', siteSet.size);

  let createdProjects = 0;
  let skippedProjects = 0;
  let createdMembers = 0;

  for (const siteName of siteSet.keys()) {
    // Skip if project already exists with same title+location
    const existing = await Project.findOne({ title: siteName });
    if (existing) {
      skippedProjects++;
      // ensure there is at least one team member assigned
      const memberExists = await TeamMember.findOne({ 'assignedProject': existing._id });
      if (!memberExists) {
        const tm = new TeamMember({
          name: `Team - ${siteName}`,
          role: 'Supervisor',
          contact: { email: `team+${siteName.replace(/\s+/g,'').toLowerCase()}@example.com` },
          assignedProject: [existing._id]
        });
        await tm.save();
        createdMembers++;
      }
      continue;
    }

    const proj = new Project({
      title: siteName,
      description: `Imported project for site ${siteName}`,
      category: 'Residential',
      location: siteName,
      images: ['https://via.placeholder.com/800x600?text=project']
    });
    await proj.save();
    createdProjects++;

    const tm = new TeamMember({
      name: `Team - ${siteName}`,
      role: 'Supervisor',
      contact: { email: `team+${siteName.replace(/\s+/g,'').toLowerCase()}@example.com` },
      assignedProject: [proj._id]
    });
    await tm.save();
    createdMembers++;
  }

  console.log(`Import complete. Projects created: ${createdProjects}, skipped(existing): ${skippedProjects}, TeamMembers created: ${createdMembers}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error importing projects/team members:', err);
  process.exit(1);
});
