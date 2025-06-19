import express from 'express';
const accountRoutes = express.Router();
import SiteAccount from '../models/siteaccounthistory.js';

// ✅ POST: Add entries to a site
accountRoutes.post('/', async (req, res) => {
  try {
    const { siteName, entries } = req.body;

    if (!siteName || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'siteName and entries[] are required' });
    }

    const updatedSite = await SiteAccount.findOneAndUpdate(
      { siteName },
      { $push: { entries: { $each: entries } } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Entries added successfully', site: updatedSite });
  } catch (err) {
    console.error('Error adding entry:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: List all unique site names
accountRoutes.get('/sites', async (req, res) => {
  try {
    const siteNames = await SiteAccount.distinct('siteName');
    res.json(siteNames);
  } catch (error) {
    console.error('Failed to fetch site names:', error);
    res.status(500).json({ error: 'Failed to fetch site names' });
  }
});

// ✅ PUT: Update an entry by entryId OR add if not present
accountRoutes.put('/:siteName', async (req, res) => {
  try {
    const { siteName } = req.params;
    const { entryId, newEntry } = req.body;

    if (!entryId || !newEntry) {
      return res.status(400).json({ error: 'entryId and newEntry are required' });
    }

    const site = await SiteAccount.findOne({ siteName });

    if (!site) return res.status(404).json({ error: 'Site not found' });

    const index = site.entries.findIndex(entry => entry.id === entryId);

    if (index === -1) {
      site.entries.push(newEntry);
    } else {
      site.entries[index] = newEntry;
    }

    await site.save();

    res.status(200).json({ message: 'Entry updated successfully', site });
  } catch (err) {
    console.error('Error updating or adding entry:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Fetch all entries for a specific site
accountRoutes.get('/:siteName', async (req, res) => {
  try {
    const { siteName } = req.params;
    const site = await SiteAccount.findOne({ siteName });

    if (!site) return res.status(404).json({ error: 'Site not found' });

    res.status(200).json(site.entries);
  } catch (err) {
    console.error('Error fetching site data:', err);
    res.status(500).json({ error: err.message });
  }
});

export default accountRoutes;
