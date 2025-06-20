// routes/resources.js
import express from 'express';
import Resource from '../models/resources.js'; // Adjust the path as necessary

const resourcesrouter= express.Router();
// routes/resources.js
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
export default resourcesrouter;
