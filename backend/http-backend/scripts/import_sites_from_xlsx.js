import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import XLSX from 'xlsx';
import User from '../models/admin.js';
import Project from '../models/Project.js';

async function run() {
  const filePath = process.argv[2] || process.env.IMPORT_XLSX;
  const adminEmail = process.env.IMPORT_ADMIN_EMAIL || 'Hassan1234@gmail.com';
  const adminPassword = process.env.IMPORT_ADMIN_PASSWORD || 'Hassan@123';

  if (!filePath) {
    console.error('Usage: node import_sites_from_xlsx.js <path-to-xlsx>');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ensure admin exists
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({ name: 'Import Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    await admin.save();
    console.log('Created admin user:', admin.email);
  } else {
    console.log('Found admin user:', admin.email);
  }

  // Read workbook
  const wb = XLSX.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`Found ${rows.length} rows in sheet '${sheetName}'`);

  const created = [];
  for (const [i, row] of rows.entries()) {
    // map common header names
    const title = row.title || row.name || row['Project Name'] || row['Site Name'] || row.project;
    const description = row.description || row.desc || row.details || '';
    let category = row.category || row.Category || row.type || 'Residential';
    // normalize category to allowed enum values
    const allowed = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'Interior'];
    if (!allowed.includes(category)) {
      // try basic normalization
      const c = String(category || '').toLowerCase();
      if (c.includes('res')) category = 'Residential';
      else if (c.includes('com')) category = 'Commercial';
      else if (c.includes('ind')) category = 'Industrial';
      else if (c.includes('infra')) category = 'Infrastructure';
      else category = 'Residential';
    }

    const status = (row.status || 'upcoming').toString().toLowerCase();
    const location = row.location || row.site || row.address || '';
    const imagesRaw = row.images || row.image || row.Images || '';
    const images = imagesRaw ? String(imagesRaw).split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean) : ['https://placehold.co/600x400'];
    const videoUrl = row.videoUrl || row.video || '';
    const notes = row.notes || row.remarks || '';
    const completionDate = row.completionDate || row.completedOn || row['Completion Date'] || '';
    const isFeatured = !!(row.isFeatured || row.featured || row.Featured === 'true' || row.Featured === '1');

    if (!title || !description || !location) {
      console.warn(`Skipping row ${i + 2}: missing required fields (title/description/location). Row:`, row);
      continue;
    }

    const proj = new Project({
      title: String(title),
      description: String(description),
      category,
      status: ['upcoming', 'ongoing', 'completed'].includes(status) ? status : 'upcoming',
      location: String(location),
      images,
      videoUrl: videoUrl || undefined,
      notes: notes || undefined,
      completionDate: completionDate ? new Date(completionDate) : undefined,
      isFeatured,
      createdBy: admin._id,
    });

    try {
      await proj.save();
      created.push(proj);
      console.log(`Created project ${proj._id} - ${proj.title}`);
    } catch (err) {
      console.error(`Failed to create project for row ${i + 2}:`, err.message || err);
    }
  }

  console.log(`Import finished. Created ${created.length} projects.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
