import express from 'express';
import Project from '../models/project.js';
import project from '../models/project.js';
const projectRoutes = express.Router();
projectRoutes.post('/add', async (req, res) => {
    try {
      const newProject = new Project(req.body);
      const saved = await newProject.save();
      res.status(201).json({ message: "Project created successfully", project: saved });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Mark Project as Completed
  projectRoutes.put('/complete/:id', async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { status: 'completed' },
        { new: true }
      );
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json({ message: "Project marked as completed", project });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  // get all projects by site name 
  projectRoutes.get('/all', async (req, res) => {
    try {
      const projects = await Project.find({ status: { $in: ['ongoing', 'upcoming','completed'] } });
      res.json(projects);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  //  Get All Pending Projects (ongoing or upcoming)
  projectRoutes.get('/pending', async (req, res) => {
    try {
      const projects = await Project.find({ status: { $in: ['ongoing', 'upcoming'] } });
      res.json(projects);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  //  Get All Completed Projects
  projectRoutes.get('/completed', async (req, res) => {
    try {
      const projects = await Project.find({ status: 'completed' });
      res.json(projects);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Get Project By ID
  projectRoutes.get('/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate("team");
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project.team ? project : { ...project.toObject(), team: [] });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  projectRouter.get('/team/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId).populate('team');
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      return res.status(200).json(project.team);
    } catch (error) {
      console.error('Error fetching team members:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  export default projectRoutes;

  