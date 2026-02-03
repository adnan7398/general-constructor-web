import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import XLSX from 'xlsx';
import SiteAccount from '../models/siteaccounthistory.js';

function excelSerialToJSDate(serial) {
  // XLSX.SSF.parse_date_code returns an object; use it if available
  try {
    const d = XLSX.SSF.parse_date_code(Number(serial));
    if (d && d.y) return new Date(d.y, d.m - 1, d.d);
  } catch (e) {}
  // fallback: try parse as ISO string
  const parsed = new Date(serial);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date();
}

function detectTypeofExpense(text) {
  if (!text) return 'MATERIAL';
  const t = String(text).toLowerCase();
  if (t.includes('labour') || t.includes('mistri')) return 'LABOUR';
  return 'MATERIAL';
}

async function run() {
  const filePath = process.argv[2] || process.env.IMPORT_XLSX || '/Users/syedtahoor/Desktop/general-constructor-web/ALL SITES ACCOUNT JAN 2026.xlsx';
  if (!filePath) {
    console.error('Please provide path to XLSX file');
    process.exit(1);
  }
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

  let createdEntries = 0;

  for (const [i, row] of rows.entries()) {
    const values = Object.values(row);
    // many ledger files have no headers so columns come as properties like __EMPTY
    // Heuristic mapping based on observed data structure:
    // col0: date/serial/id, col1: particular/description, col2: paymentMode, col3: payerName, col4: siteName, col5: amount
    const dateRaw = values[0];
    const particular = values[1] || '';
    const paymentMode = values[2] || '';
    const payer = values[3] || '';
    const siteName = values[4] || 'Unknown Site';
    const amountRaw = values[5] || values[4] || values[0];

    if (!siteName || siteName === '') {
      console.warn(`Skipping row ${i + 2}: no siteName (values: ${values.slice(0,6).join('|')})`);
      continue;
    }

    const amount = Number(amountRaw) || 0;
    if (amount === 0) {
      // skip zero/blank amounts
      continue;
    }

    // determine date
    let date = new Date();
    if (typeof dateRaw === 'number') {
      date = excelSerialToJSDate(dateRaw);
    } else if (typeof dateRaw === 'string' && dateRaw.trim()) {
      const parsed = new Date(dateRaw);
      if (!isNaN(parsed.getTime())) date = parsed;
    }

    const entry = {
      date,
      type: 'EXPENSE',
      typeofExpense: detectTypeofExpense(particular),
      category: particular || 'Misc',
      particular: particular,
      amount,
      Quantity: 1,
      paymentMode: paymentMode || 'Cash',
      payer: payer || ''
    };

    // upsert site and push entry
    try {
      await SiteAccount.findOneAndUpdate(
        { siteName },
        { $push: { entries: entry } },
        { upsert: true, new: true }
      );
      createdEntries++;
    } catch (err) {
      console.error(`Failed to add entry for row ${i + 2}:`, err.message || err);
    }
  }

  console.log(`Import finished. Created/added ${createdEntries} entries.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
