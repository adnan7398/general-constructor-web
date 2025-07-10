import express from 'express';
import TeamMember from '../models/teammember.js';
import adminMiddleware from '../middleware/adminmiddleware.js';
const TeamRouter = express.Router();
TeanmRouter.use(express.json());
TeamRouter.use(adminMiddleware);
// Create new Team Member
TeamRouter.post('/', async (req, res) => {
  try {
    const teamMember = new TeamMember(req.body);
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Team Members (optionally filter by assignedProject)
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

// Get a Team Member by ID
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

// get project by team member id
TeamRouter.get('/project/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id).populate('assignedProject');
    if (!teamMember) return res.status(404).json({ message: 'Team Member not found' });
    res.json(teamMember.assignedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default TeamRouter;
