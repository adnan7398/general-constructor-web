import express from 'express';
import Report from '../models/report.js';
import Project from '../models/project.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const reportRoutes = express.Router();
reportRoutes.use(AdminMiddleware);

// Helper: Get week number and dates
const getWeekInfo = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  
  // Get week start (Monday) and end (Sunday)
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(current.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return {
    weekNumber,
    year: new Date(date).getFullYear(),
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
  };
};

// Get all reports (with optional filters)
reportRoutes.get('/', async (req, res) => {
  try {
    const { projectId, year, weekNumber } = req.query;
    const filter = {};
    if (projectId) filter.project = projectId;
    if (year) filter.year = parseInt(year);
    if (weekNumber) filter.weekNumber = parseInt(weekNumber);
    
    const reports = await Report.find(filter)
      .sort({ year: -1, weekNumber: -1 })
      .populate('project', 'name status projectType');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports for a specific project
reportRoutes.get('/project/:projectId', async (req, res) => {
  try {
    const reports = await Report.find({ project: req.params.projectId })
      .sort({ year: -1, weekNumber: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current week report for a project (or create if not exists)
reportRoutes.get('/current/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const { weekNumber, year, weekStartDate, weekEndDate } = getWeekInfo();
    
    let report = await Report.findOne({
      project: req.params.projectId,
      weekNumber,
      year,
    });
    
    if (!report) {
      // Get previous week's report for progress comparison
      const prevReport = await Report.findOne({
        project: req.params.projectId,
        $or: [
          { year, weekNumber: weekNumber - 1 },
          { year: year - 1, weekNumber: 52 },
        ],
      }).sort({ year: -1, weekNumber: -1 });
      
      report = new Report({
        project: req.params.projectId,
        projectName: project.name,
        weekNumber,
        year,
        weekStartDate,
        weekEndDate,
        progress: {
          previousWeekProgress: prevReport?.progress?.percentageComplete || 0,
        },
      });
      await report.save();
    }
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single report
reportRoutes.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('project');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new report
reportRoutes.post('/', async (req, res) => {
  try {
    const { projectId, date } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const { weekNumber, year, weekStartDate, weekEndDate } = getWeekInfo(date ? new Date(date) : new Date());
    
    // Check if report already exists
    const existing = await Report.findOne({ project: projectId, weekNumber, year });
    if (existing) {
      return res.status(400).json({ error: 'Report for this week already exists', report: existing });
    }
    
    const report = new Report({
      project: projectId,
      projectName: project.name,
      weekNumber,
      year,
      weekStartDate,
      weekEndDate,
      ...req.body,
    });
    
    await report.save();
    res.status(201).json({ message: 'Report created', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update report
reportRoutes.put('/:id', async (req, res) => {
  try {
    const { labour, financial, progress, workCompleted, upcomingWork, issues, notes } = req.body;
    
    const updateData = { lastUpdated: new Date() };
    if (labour) updateData.labour = labour;
    if (financial) {
      updateData.financial = {
        ...financial,
        netAmount: (financial.weeklyIncome || 0) - (financial.weeklyExpense || 0),
      };
    }
    if (progress) {
      const report = await Report.findById(req.params.id);
      updateData.progress = {
        ...progress,
        weeklyProgressGain: (progress.percentageComplete || 0) - (report?.progress?.previousWeekProgress || 0),
      };
    }
    if (workCompleted) updateData.workCompleted = workCompleted;
    if (upcomingWork) updateData.upcomingWork = upcomingWork;
    if (issues) updateData.issues = issues;
    if (notes !== undefined) updateData.notes = notes;
    
    const report = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    res.json({ message: 'Report updated', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add labour entry
reportRoutes.post('/:id/labour', async (req, res) => {
  try {
    const { date, workers, description } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.labour.details.push({ date, workers, description });
    report.labour.totalWorkers = report.labour.details.reduce((sum, d) => sum + (d.workers || 0), 0);
    report.labour.workingDays = report.labour.details.length;
    report.labour.totalManDays = report.labour.details.reduce((sum, d) => sum + (d.workers || 0), 0);
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Labour entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add work completed entry
reportRoutes.post('/:id/work', async (req, res) => {
  try {
    const { task, description, completedOn } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.workCompleted.push({ task, description, completedOn: completedOn || new Date() });
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Work entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add issue
reportRoutes.post('/:id/issue', async (req, res) => {
  try {
    const { issue, severity } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.issues.push({ issue, severity, status: 'open', reportedOn: new Date() });
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Issue added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get weekly summary across all projects
reportRoutes.get('/summary/weekly', async (req, res) => {
  try {
    const { weekNumber, year } = req.query;
    const { weekNumber: currentWeek, year: currentYear } = getWeekInfo();
    
    const reports = await Report.find({
      weekNumber: weekNumber ? parseInt(weekNumber) : currentWeek,
      year: year ? parseInt(year) : currentYear,
    }).populate('project', 'name status projectType');
    
    const summary = {
      weekNumber: weekNumber || currentWeek,
      year: year || currentYear,
      totalProjects: reports.length,
      totalLabourCost: reports.reduce((sum, r) => sum + (r.financial?.labourCost || 0), 0),
      totalMaterialCost: reports.reduce((sum, r) => sum + (r.financial?.materialCost || 0), 0),
      totalIncome: reports.reduce((sum, r) => sum + (r.financial?.weeklyIncome || 0), 0),
      totalExpense: reports.reduce((sum, r) => sum + (r.financial?.weeklyExpense || 0), 0),
      averageProgress: reports.length > 0 
        ? reports.reduce((sum, r) => sum + (r.progress?.percentageComplete || 0), 0) / reports.length 
        : 0,
      projectsOnTrack: reports.filter(r => r.progress?.status === 'on-track' || r.progress?.status === 'ahead').length,
      projectsAtRisk: reports.filter(r => r.progress?.status === 'at-risk' || r.progress?.status === 'behind').length,
      reports,
    };
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete report
reportRoutes.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default reportRoutes;
