import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import XLSX from 'xlsx';
import Resource from '../models/resources.js';

function detectResourceType(name) {
  if (!name) return 'Other';
  const s = name.toString().toLowerCase();
  if (s.match(/labou?r|mistri|worker|worker|labour/)) return 'Labor';
  if (s.match(/truck|vehicle|car|tractor|loader|excavator/)) return 'Vehicle';
  if (s.match(/cement|morang|sand|baloo|steel|paint|tile|bric|brick|gravel|stone|iron|pipe|plumb|electric|wiring/)) return 'Material';
  if (s.match(/generator|pump|compressor|drill|equipment|machine/)) return 'Equipment';
  return 'Other';
}

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

  let created = 0;
  let updated = 0;

  for (const [i, row] of rows.entries()) {
    const vals = Object.values(row);
    const particular = (vals[1] || '').toString().trim();
    const siteName = (vals[4] || '').toString().trim();
    const amountRaw = vals[5] || vals[4] || vals[0];
    const amount = Number(amountRaw) || 0;

    if (!particular || !siteName) continue; // skip non-resource lines

    // Heuristic: consider this a resource if particular contains material/paint/cement/morang/tile/etc or labor keywords
    const type = detectResourceType(particular);
    if (type === 'Other') continue; // skip generic lines

    const name = particular.replace(/\s+/g, ' ').trim();
    const cost = amount;
    const quantity = 1;

    // upsert: if resource with same name and site exists, increment cost and quantity
    const existing = await Resource.findOne({ name: { $regex: `^${name}$`, $options: 'i' }, siteName });
    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity;
      existing.cost = (existing.cost || 0) + cost;
      existing.status = 'In Use';
      await existing.save();
      updated++;
    } else {
      const r = new Resource({
        name,
        siteName,
        type,
        quantity,
        status: 'In Use',
        location: siteName,
        cost,
        description: `Imported from spreadsheet row ${i + 2}`
      });
      await r.save();
      created++;
    }
  }

  console.log(`Resources import finished. Created: ${created}, Updated: ${updated}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Import resources error:', err);
  process.exit(1);
});
