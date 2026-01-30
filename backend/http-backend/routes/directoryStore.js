import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Directory from '../models/directory.js';
import File from '../models/file.js';
import Project from '../models/project.js';

const router = express.Router();

// Configure storage for local uploads (can be switched to S3 later)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ================= FOLDERS =================

// Create a new folder
router.post('/folders', async (req, res) => {
  try {
    const { name, projectId, parentId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({ message: 'Name and Project ID are required' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Prepare folder data
    const folderData = {
      name,
      project: projectId,
      parent: parentId || null,
    };

    // Calculate path if parent exists
    if (parentId) {
      const parentFolder = await Directory.findById(parentId);
      if (parentFolder) {
        folderData.path = `${parentFolder.path}${parentFolder.name}/`;
      }
    }

    const newFolder = new Directory(folderData);
    await newFolder.save();

    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Create Folder Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A folder with this name already exists in this location' });
    }
    res.status(500).json({ message: 'Server error creating folder' });
  }
});

// Get folder contents (subfolders and files)
router.get('/projects/:projectId/content', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { folderId } = req.query; // If null/undefined, get root contents

    // Normalize folderId to null if it's "null" string or undefined
    const parentId = (folderId && folderId !== 'null' && folderId !== 'undefined') ? folderId : null;

    const [folders, files, currentFolder] = await Promise.all([
      Directory.find({ project: projectId, parent: parentId }).sort({ name: 1 }),
      File.find({ project: projectId, folder: parentId }).sort({ name: 1 }),
      parentId ? Directory.findById(parentId) : Promise.resolve(null)
    ]);

    // Construct breadcrumbs
    let breadcrumbs = [];
    if (currentFolder) {
      // Logic to build breadcrumbs could be recursive or stored in path. 
      // For simple implementation, we might send current folder details.
      // A proper breadcrumb impl might require recursive lookup or storing path array.
      // For now, let's just return the current folder info.
    }

    res.json({
      currentFolder,
      folders,
      files,
      breadcrumbs: [] // Todo implementation
    });
  } catch (error) {
    console.error('Get Content Error:', error);
    res.status(500).json({ message: 'Server error fetching directory content' });
  }
});

// Delete folder (recursive - BE CAREFUL)
router.delete('/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement recursive delete or prevent delete if not empty
    // For MVP: Prevent delete if not empty
    const subFolders = await Directory.countDocuments({ parent: id });
    const files = await File.countDocuments({ folder: id });

    if (subFolders > 0 || files > 0) {
      return res.status(400).json({ message: 'Folder is not empty' });
    }

    await Directory.findByIdAndDelete(id);
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting folder' });
  }
});

// ================= FILES =================

// Upload file
router.post('/files', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId, folderId } = req.body;
    const parentId = (folderId && folderId !== 'null' && folderId !== 'undefined') ? folderId : null;

    if (!projectId) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const newFile = new File({
      name: req.file.originalname, // Allow renaming later?
      originalName: req.file.originalname,
      project: projectId,
      folder: parentId,
      url: `/uploads/documents/${req.file.filename}`, // Relative URL
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    await newFile.save();
    res.status(201).json(newFile);

  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup if database save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Delete file
router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove from disk
    // extract filename from url
    const filename = path.basename(file.url);
    const filePath = path.join(process.cwd(), 'uploads/documents', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Delete File Error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

export default router;
