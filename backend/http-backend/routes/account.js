import express from 'express';
const accountRoutes = express.Router();
import SiteAccount from '../models/siteaccounthistory.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';
accountRoutes.use(express.json());
accountRoutes.use(AdminMiddleware);
accountRoutes.post('/newsite', async (req, res) => {
  try {
    const { siteName } = req.body;

    if (!siteName) {
      return res.status(400).json({ error: 'siteName is required' });
    }

    const existing = await SiteAccount.findOne({ siteName });
    if (existing) {
      return res.status(409).json({ error: 'Site already exists' });
    }

    const newSite = new SiteAccount({ siteName, entries: [] });
    await newSite.save();

    res.status(201).json({ message: 'Site created successfully', site: newSite });
  } catch (err) {
    console.error('Error creating site:', err);
    res.status(500).json({ error: err.message });
  }
});
accountRoutes.post('/', async (req, res) => {
  try {
    const { siteName, entries } = req.body;

    if (!siteName || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'siteName and entries[] are required' });
    }

    // Validate each entry has required fields
    for (const entry of entries) {
      if (!entry.date || !entry.type || !entry.typeofExpense || !entry.category || !entry.amount || entry.Quantity === undefined) {
        return res.status(400).json({ 
          error: 'Each entry must have: date, type, typeofExpense, category, amount, and Quantity' 
        });
      }
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
accountRoutes.get('/sites', async (req, res) => {
  try {
    const siteNames = await SiteAccount.distinct('siteName');
    res.json(siteNames);
  } catch (error) {
    console.error('Failed to fetch site names:', error);
    res.status(500).json({ error: 'Failed to fetch site names' });
  }
});
accountRoutes.get('/site', async (req, res) => {
  try {
    const sites = await SiteAccount.find().populate('entries');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

//  Update an entry by entryId OR add if not present
accountRoutes.put('/:siteName', async (req, res) => {
  try {
    const { siteName } = req.params;
    const { entryId, newEntry } = req.body;

    console.log('PUT request received:', { siteName, entryId, newEntry });
    console.log('newEntry.typeofExpense:', newEntry.typeofExpense);
    console.log('Valid enum values:', ['LABOUR', 'MAINTENANCE']);

    if (!entryId || !newEntry) {
      return res.status(400).json({ error: 'entryId and newEntry are required' });
    }

    // Validate required fields for newEntry
    console.log('Validating newEntry fields:', {
      date: newEntry.date,
      type: newEntry.type,
      typeofExpense: newEntry.typeofExpense,
      category: newEntry.category,
      amount: newEntry.amount,
      Quantity: newEntry.Quantity
    });
    
    console.log('typeofExpense value:', newEntry.typeofExpense, 'Type:', typeof newEntry.typeofExpense);
    
    if (!newEntry.date || !newEntry.type || !newEntry.typeofExpense || !newEntry.category || !newEntry.amount || newEntry.Quantity === undefined || newEntry.Quantity === null) {
      return res.status(400).json({ 
        error: 'newEntry must have: date, type, typeofExpense, category, amount, and Quantity' 
      });
    }
    
    // Validate enum values
    const validTypes = ['INCOME', 'EXPENSE'];
    const validTypeofExpense = ['LABOUR', 'MAINTENANCE'];
    
    if (!validTypes.includes(newEntry.type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    if (!validTypeofExpense.includes(newEntry.typeofExpense)) {
      return res.status(400).json({ 
        error: `Invalid typeofExpense. Must be one of: ${validTypeofExpense.join(', ')}` 
      });
    }

    const site = await SiteAccount.findOne({ siteName });

    if (!site) return res.status(404).json({ error: 'Site not found' });

    const index = site.entries.findIndex(entry => entry._id.toString() === entryId);

    if (index === -1) {
      site.entries.push(newEntry);
    } else {
      // Preserve the _id when updating
      const existingEntry = site.entries[index];
      site.entries[index] = { ...newEntry, _id: existingEntry._id };
    }

    console.log('About to save site with entries:', site.entries);
    
    try {
      await site.save();
      console.log('Site saved successfully');
      res.status(200).json({ message: 'Entry updated successfully', site });
    } catch (saveError) {
      console.error('Save error:', saveError);
      res.status(500).json({ error: saveError.message });
    }
  } catch (err) {
    console.error('Error updating or adding entry:', err);
    res.status(500).json({ error: err.message });
  }
});
accountRoutes.delete('/:siteName/:entryId', async (req, res) => {
  try {
    const { siteName, entryId } = req.params;

    if (!entryId) {
      return res.status(400).json({ error: 'entryId is required' });
    }

    const site = await SiteAccount.findOne({ siteName });

    if (!site) return res.status(404).json({ error: 'Site not found' });

    const entryIndex = site.entries.findIndex(entry => entry._id.toString() === entryId);

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    site.entries.splice(entryIndex, 1);
    await site.save({validateBeforeSave: false});
    res.status(200).json({ message: 'Entry deleted successfully', site });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: err.message });
  }
});
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
