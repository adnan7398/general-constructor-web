// routes/resources.js
import express from 'express';
import Resource from '../models/resources.js'; // Adjust the path as necessary
import Adminmiddleware from  '../middleware/adminmiddleware.js'; // Adjust the path as necessary
const resourcesrouter= express.Router();
// routes/resources.js
resourcesrouter.use(express.json());
resourcesrouter.use(Adminmiddleware);
resourcesrouter.post('/', async (req, res) => {
    try {
      const {
        name,
        siteName,
        type,
        status,
        location,
        contactInfo,
        cost,
        startDate,
        endDate,
        description,
        quantity,
      } = req.body;
  
      const newResource = new Resource({
        name,
        siteName,
        type,
        status,
        location,
        cost,
        startDate,
        endDate,
        description,
        quantity,
      });
  
      await newResource.save();
      res.status(201).json({ success: true, resource: newResource });
    } catch (err) {
      console.error('Error creating resource:', err);
      res.status(400).json({
        error: 'Failed to create resource',
        details: err
      });
    }
  });
  
resourcesrouter.get('/', async (req, res) => {
    try {
      const resources = await Resource.find();
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch resources', details: error });
    }
  });

resourcesrouter.get('/site/:siteName', async (req, res) => {
    try {
      const { siteName } = req.params;
      const resources = await Resource.find({ siteName });
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch resources by site', details: error });
    }
  });

resourcesrouter.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await Resource.findById(id);
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.status(200).json({ success: true, resource });
    } catch (err) {
      console.error('Error fetching resource:', err);
      res.status(500).json({ error: 'Failed to fetch resource', details: err.message });
    }
  });

resourcesrouter.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.status(200).json({ success: true, resource: updatedResource });
    } catch (err) {
      console.error('Error updating resource:', err);
      res.status(500).json({ error: 'Failed to update resource', details: err.message });
    }
  });

resourcesrouter.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedResource = await Resource.findByIdAndDelete(id);
  
      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.status(200).json({ success: true, message: 'Resource deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err);
      res.status(500).json({ error: 'Failed to delete resource', details: err.message });
    }
  });

export default resourcesrouter;
