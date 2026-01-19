import express from 'express';
import multer from 'multer';
import path from 'path';
import Project from '../models/project.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const projectRoutes = express.Router();

// Multer config for project images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/projects/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `project-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// ========== PUBLIC ROUTES (no auth) ==========

// Get projects to show on website (public)
projectRoutes.get('/showcase', async (req, res) => {
  try {
    const projects = await Project.find({ showOnWebsite: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PROTECTED ROUTES ==========
projectRoutes.use(AdminMiddleware);

// Add new project
projectRoutes.post('/add', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload project image
projectRoutes.post('/upload-image/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const imageUrl = `/uploads/projects/${req.file.filename}`;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Image uploaded', project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update project (including showOnWebsite, displayOrder)
projectRoutes.put('/update/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle showOnWebsite
projectRoutes.patch('/toggle-showcase/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.showOnWebsite = !project.showOnWebsite;
    await project.save();
    res.json({ message: `Project ${project.showOnWebsite ? 'added to' : 'removed from'} showcase`, project });
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

// Get all projects
projectRoutes.get('/all', async (req, res) => {
  try {
    const projects = await Project.find({ status: { $in: ['ongoing', 'upcoming', 'completed'] } });
    res.json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get pending projects
projectRoutes.get('/pending', async (req, res) => {
  try {
    const projects = await Project.find({ status: { $in: ['ongoing', 'upcoming'] } });
    res.json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get completed projects
projectRoutes.get('/completed', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'completed' });
    res.json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single project
projectRoutes.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("team");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete project
projectRoutes.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default projectRoutes;

  