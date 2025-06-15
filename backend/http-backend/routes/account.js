
import express from 'express';
const accountRoutes = express.Router();
import Entry from '../models/siteaccounthistory.js';

// Create new entry
accountRoutes.post('/', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get entries by month/year/site
accountRoutes.get('/', async (req, res) => {
  const { month, year, siteName } = req.query;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  try {
    const entries = await Entry.find({
      siteName,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update entry
accountRoutes.put('/:id', async (req, res) => {
  try {
    const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete entry
accountRoutes.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Summary
accountRoutes.get('/summary', async (req, res) => {
  const { month, year, siteName } = req.query;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  try {
    const entries = await Entry.find({
      siteName,
      date: { $gte: start, $lte: end }
    });

    const income = entries.filter(e => e.type === 'INCOME').reduce((sum, e) => sum + e.amount, 0);
    const expense = entries.filter(e => e.type === 'EXPENSE').reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default accountRoutes;
