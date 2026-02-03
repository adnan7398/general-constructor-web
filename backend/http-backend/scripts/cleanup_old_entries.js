import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import SiteAccount from '../models/siteaccounthistory.js';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  try {
    const sites = await SiteAccount.find();
    console.log(`Found ${sites.length} sites`);

    let totalRemoved = 0;

    for (const site of sites) {
      const originalCount = site.entries.length;
      
      // Keep only entries that have payer field (new entries)
      // Remove entries without payer (old duplicates)
      site.entries = site.entries.filter(entry => entry.payer !== undefined && entry.payer !== null);
      
      const removedCount = originalCount - site.entries.length;
      
      if (removedCount > 0) {
        await site.save();
        console.log(`Site "${site.siteName}": Removed ${removedCount} old entries (had ${originalCount}, now has ${site.entries.length})`);
        totalRemoved += removedCount;
      }
    }

    console.log(`\nCleanup complete. Total old entries removed: ${totalRemoved}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
}

run();
