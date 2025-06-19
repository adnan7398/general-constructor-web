// routes/resources.js
import express from 'express';
import Resource from '../models/resources.js'; // Adjust the path as necessary

const router = express.Router();

// Get all resources, grouped by site
router.get('/', async (req, res) => {
  try {
    const all = await Resource.find().sort({ siteName: 1 });
    const grouped = all.reduce((acc, resource) => {
      if (!acc[resource.siteName]) acc[resource.siteName] = [];
      acc[resource.siteName].push(resource);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resources for a specific site
router.get('/:siteName', async (req, res) => {
  try {
    const resources = await Resource.find({ siteName: req.params.siteName });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site resources' });
  }
});

// Add new resource
router.post('/', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create resource', details: err });
  }
});

// Optional: Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete resource' });
  }
});

export default router;
