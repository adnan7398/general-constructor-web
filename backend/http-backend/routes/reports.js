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
    const { projectId, year, weekNumber, status } = req.query;
    const filter = {};
    if (projectId) filter.project = projectId;
    if (year) filter.year = parseInt(year);
    if (weekNumber) filter.weekNumber = parseInt(weekNumber);
    if (status) filter.status = status;
    
    const reports = await Report.find(filter)
      .sort({ year: -1, weekNumber: -1 })
      .populate('project', 'name status projectType location');
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
          previousWeekProgress: prevReport?.progress?.percentageComplete || project.progress || 0,
          percentageComplete: project.progress || 0,
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

// Update report - comprehensive update
reportRoutes.put('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const allowedFields = [
      'labour', 'materials', 'equipment', 'financial', 'progress',
      'workCompleted', 'upcomingWork', 'safety', 'weather', 'quality',
      'issues', 'photos', 'visitors', 'notes', 'highlights', 'status'
    ];
    
    const updateData = { lastUpdated: new Date() };
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // Calculate net amount if financial data updated
    if (updateData.financial) {
      const f = updateData.financial;
      updateData.financial.weeklyExpense = (f.labourCost || 0) + (f.materialCost || 0) + 
        (f.equipmentCost || 0) + (f.transportCost || 0) + (f.utilityCost || 0) + (f.miscCost || 0);
      updateData.financial.netAmount = (f.weeklyIncome || 0) + (f.clientPayment || 0) + 
        (f.advanceReceived || 0) - updateData.financial.weeklyExpense;
    }
    
    // Calculate weekly progress gain
    if (updateData.progress) {
      updateData.progress.weeklyProgressGain = 
        (updateData.progress.percentageComplete || 0) - (report.progress?.previousWeekProgress || 0);
    }
    
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    // Also update project progress
    if (updateData.progress?.percentageComplete !== undefined) {
      await Project.findByIdAndUpdate(report.project, { 
        progress: updateData.progress.percentageComplete,
        healthStatus: updateData.progress.status === 'at-risk' ? 'red' : 
                     updateData.progress.status === 'behind' ? 'yellow' : 'green'
      });
    }
    
    res.json({ message: 'Report updated', report: updatedReport });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add labour entry
reportRoutes.post('/:id/labour', async (req, res) => {
  try {
    const { date, workers, skilled, unskilled, description, shift } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.labour.details.push({ 
      date, 
      workers, 
      skilled: skilled || 0,
      unskilled: unskilled || 0,
      description,
      shift: shift || 'day'
    });
    
    // Recalculate totals
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

// Add material entry
reportRoutes.post('/:id/material', async (req, res) => {
  try {
    const { name, category, quantity, unit, unitCost, supplier, deliveryDate, invoiceNo } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const totalCost = (quantity || 0) * (unitCost || 0);
    
    report.materials.items.push({
      name, category, quantity, unit, unitCost, totalCost, supplier, deliveryDate, invoiceNo
    });
    
    // Recalculate total material cost
    report.materials.totalCost = report.materials.items.reduce((sum, m) => sum + (m.totalCost || 0), 0);
    report.financial.materialCost = report.materials.totalCost;
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Material entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add equipment entry
reportRoutes.post('/:id/equipment', async (req, res) => {
  try {
    const { name, type, hoursUsed, fuelCost, rentalCost, maintenanceCost, operator, status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.equipment.items.push({
      name, type, hoursUsed, fuelCost, rentalCost, maintenanceCost, operator, status
    });
    
    // Recalculate total equipment cost
    report.equipment.totalCost = report.equipment.items.reduce((sum, e) => 
      sum + (e.fuelCost || 0) + (e.rentalCost || 0) + (e.maintenanceCost || 0), 0);
    report.financial.equipmentCost = report.equipment.totalCost;
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Equipment entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add work completed entry
reportRoutes.post('/:id/work', async (req, res) => {
  try {
    const { task, description, completedOn, category, quantity, location } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.workCompleted.push({ 
      task, description, 
      completedOn: completedOn || new Date(),
      category, quantity, location
    });
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Work entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add safety incident
reportRoutes.post('/:id/safety', async (req, res) => {
  try {
    const { type, description, severity, actionTaken, reportedBy } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.safety.incidents.push({
      date: new Date(),
      type, description, severity, actionTaken, reportedBy
    });
    
    // Update counts
    if (type === 'near-miss') {
      report.safety.nearMissCount = (report.safety.nearMissCount || 0) + 1;
    } else {
      report.safety.incidentCount = (report.safety.incidentCount || 0) + 1;
    }
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Safety incident added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add weather entry
reportRoutes.post('/:id/weather', async (req, res) => {
  try {
    const { date, condition, workStatus, remarks } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.weather.conditions.push({ date, condition, workStatus, remarks });
    
    // Update weather summary
    const conditions = report.weather.conditions;
    report.weather.rainDays = conditions.filter(c => c.condition === 'rainy' || c.condition === 'stormy').length;
    report.weather.haltDays = conditions.filter(c => c.workStatus === 'no-work').length;
    report.weather.workingDays = conditions.filter(c => c.workStatus === 'full-work').length;
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Weather entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add quality test
reportRoutes.post('/:id/quality', async (req, res) => {
  try {
    const { type, result, value, standard, remarks } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.quality.tests.push({
      date: new Date(),
      type, result, value, standard, remarks
    });
    
    // Update quality summary
    const tests = report.quality.tests;
    report.quality.testsCompleted = tests.length;
    report.quality.testsPassed = tests.filter(t => t.result === 'passed').length;
    report.quality.testsFailed = tests.filter(t => t.result === 'failed').length;
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Quality test added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add issue
reportRoutes.post('/:id/issue', async (req, res) => {
  try {
    const { issue, category, severity, impact, assignedTo } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.issues.push({ 
      issue, 
      category: category || 'other',
      severity: severity || 'minor', 
      status: 'open', 
      impact,
      assignedTo,
      reportedOn: new Date() 
    });
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Issue added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update issue status
reportRoutes.patch('/:id/issue/:issueIndex', async (req, res) => {
  try {
    const { status, actionTaken, resolvedOn } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const issueIndex = parseInt(req.params.issueIndex);
    if (issueIndex < 0 || issueIndex >= report.issues.length) {
      return res.status(400).json({ error: 'Invalid issue index' });
    }
    
    if (status) report.issues[issueIndex].status = status;
    if (actionTaken) report.issues[issueIndex].actionTaken = actionTaken;
    if (status === 'resolved') report.issues[issueIndex].resolvedOn = resolvedOn || new Date();
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Issue updated', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add visitor entry
reportRoutes.post('/:id/visitor', async (req, res) => {
  try {
    const { name, designation, organization, purpose, remarks } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    report.visitors.push({
      date: new Date(),
      name, designation, organization, purpose, remarks
    });
    report.lastUpdated = new Date();
    
    await report.save();
    res.json({ message: 'Visitor entry added', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit report for approval
reportRoutes.patch('/:id/submit', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'submitted', lastUpdated: new Date() },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report submitted for approval', report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Approve report
reportRoutes.patch('/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved', 
        approvedBy, 
        approvedAt: new Date(),
        lastUpdated: new Date() 
      },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report approved', report });
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
    }).populate('project', 'name status projectType location healthStatus');
    
    const summary = {
      weekNumber: weekNumber || currentWeek,
      year: year || currentYear,
      totalProjects: reports.length,
      
      // Financial summary
      totalIncome: reports.reduce((sum, r) => sum + (r.financial?.weeklyIncome || 0) + (r.financial?.clientPayment || 0), 0),
      totalExpense: reports.reduce((sum, r) => sum + (r.financial?.weeklyExpense || 0), 0),
      totalLabourCost: reports.reduce((sum, r) => sum + (r.financial?.labourCost || 0), 0),
      totalMaterialCost: reports.reduce((sum, r) => sum + (r.financial?.materialCost || 0), 0),
      totalEquipmentCost: reports.reduce((sum, r) => sum + (r.financial?.equipmentCost || 0), 0),
      
      // Labour summary
      totalManDays: reports.reduce((sum, r) => sum + (r.labour?.totalManDays || 0), 0),
      
      // Progress summary
      averageProgress: reports.length > 0 
        ? reports.reduce((sum, r) => sum + (r.progress?.percentageComplete || 0), 0) / reports.length 
        : 0,
      projectsOnTrack: reports.filter(r => r.progress?.status === 'on-track' || r.progress?.status === 'ahead').length,
      projectsAtRisk: reports.filter(r => r.progress?.status === 'at-risk' || r.progress?.status === 'behind' || r.progress?.status === 'halted').length,
      
      // Safety summary
      totalIncidents: reports.reduce((sum, r) => sum + (r.safety?.incidentCount || 0), 0),
      totalNearMisses: reports.reduce((sum, r) => sum + (r.safety?.nearMissCount || 0), 0),
      
      // Issues summary
      openIssues: reports.reduce((sum, r) => sum + (r.issues?.filter(i => i.status === 'open').length || 0), 0),
      criticalIssues: reports.reduce((sum, r) => sum + (r.issues?.filter(i => i.severity === 'critical' && i.status !== 'resolved').length || 0), 0),
      
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
