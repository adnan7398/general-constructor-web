import express from 'express';
import Quote from '../models/quote.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const router = express.Router();
router.use(express.json());

// Public: Submit a quote (contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const quote = new Quote({ name, email, phone: phone || '', service: service || '', message });
    await quote.save();
    res.status(201).json({ message: 'Quote submitted successfully', id: quote._id });
  } catch (err) {
    console.error('Quote submit error:', err);
    res.status(500).json({ error: 'Failed to submit quote' });
  }
});

// Admin: Get all quotes
router.get('/', AdminMiddleware, async (req, res) => {
  try {
    const quotes = await Quote.find({}).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error('Get quotes error:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Admin: Update quote status
router.patch('/:id/status', AdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['new', 'read', 'contacted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const quote = await Quote.findByIdAndUpdate(id, { status }, { new: true });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    console.error('Update quote status error:', err);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Admin: Delete a quote
router.delete('/:id', AdminMiddleware, async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted successfully' });
  } catch (err) {
    console.error('Delete quote error:', err);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
