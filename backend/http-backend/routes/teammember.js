import express from 'express';
import TeamMember from '../models/teammember.js';
import Project from '../models/project.js';
import adminMiddleware from '../middleware/adminmiddleware.js';
const TeamRouter = express.Router();
TeamRouter.use(express.json());

TeamRouter.get('/test-no-auth', async (req, res) => {
  try {
    console.log('Test no-auth endpoint called');
    res.json({ message: 'Team router no-auth is working' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

TeamRouter.get('/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const count = await TeamMember.countDocuments();
    res.json({ message: 'Database connection working', teamMemberCount: count });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: error.message });
  }
});

TeamRouter.use(adminMiddleware);

TeamRouter.get('/test', async (req, res) => {
  try {
    console.log('Test endpoint called');
    res.json({ message: 'Team router is working' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
TeamRouter.post('/', async (req, res) => {
  try {
    const teamMember = new TeamMember(req.body);
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

TeamRouter.get('/with-projects', async (req, res) => {
  try {
    console.log('Fetching team members with projects...');
    const teamMembers = await TeamMember.find().populate({
      path: 'assignedProject',
      model: 'Project',
      select: 'name description status projectType startDate endDate budget location clientName'
    });
    console.log('Found team members:', teamMembers.length);
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members with projects:', error);
    res.status(500).json({ error: error.message });
  }
});

TeamRouter.get('/project/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id).populate('assignedProject');
    if (!teamMember) return res.status(404).json({ message: 'Team Member not found' });
    res.json(teamMember.assignedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

TeamRouter.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedProject) {
      filter.assignedProject = req.query.assignedProject;
    }
    const teamMembers = await TeamMember.find(filter);
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

TeamRouter.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) return res.status(404).json({ message: 'Team Member not found' });
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Team Member by ID
TeamRouter.put('/:id', async (req, res) => {
  try {
    const updatedMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMember) return res.status(404).json({ message: 'Team Member not found' });
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Team Member by ID
TeamRouter.delete('/:id', async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Team Member not found' });
    res.json({ message: 'Team Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default TeamRouter;
