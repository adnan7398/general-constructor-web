import express from 'express';
import Report from '../models/report.js';
import Budget from '../models/budget.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const analyticsRoutes = express.Router();
analyticsRoutes.use(AdminMiddleware);

// Budget vs Actuals
analyticsRoutes.get('/budget-vs-actual/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // 1. Get Budgets
        const budgets = await Budget.find({ project: projectId });

        // 2. Aggregate Actuals from Approved Reports
        const actuals = await Report.aggregate([
            { $match: { project: projectId, 'workflow.currentStep': 'approved' } }, // Only approved reports count
            {
                $group: {
                    _id: null,
                    totalLabour: { $sum: "$financial.labourCost" },
                    totalMaterial: { $sum: "$financial.materialCost" },
                    totalEquipment: { $sum: "$financial.equipmentCost" },
                    totalMisc: { $sum: "$financial.miscCost" }
                }
            }
        ]);

        const totalActuals = actuals[0] || { totalLabour: 0, totalMaterial: 0, totalEquipment: 0, totalMisc: 0 };

        // 3. Match Budget Categories to Actuals categories
        // Note: This matches the Report schema categories to Budget schema categories
        const comparison = {
            Labour: {
                budget: budgets.filter(b => b.category === 'Labour').reduce((s, b) => s + b.allocatedAmount, 0),
                actual: totalActuals.totalLabour
            },
            Material: {
                budget: budgets.filter(b => b.category === 'Material').reduce((s, b) => s + b.allocatedAmount, 0),
                actual: totalActuals.totalMaterial
            },
            Equipment: {
                budget: budgets.filter(b => b.category === 'Equipment').reduce((s, b) => s + b.allocatedAmount, 0),
                actual: totalActuals.totalEquipment
            },
            Other: {
                budget: budgets.filter(b => ['Overhead', 'Other'].includes(b.category)).reduce((s, b) => s + b.allocatedAmount, 0),
                actual: totalActuals.totalMisc
            }
        };

        res.json({
            projectId,
            currency: budgets[0]?.currency || 'INR',
            comparison,
            variance: {
                Labour: comparison.Labour.budget - comparison.Labour.actual,
                Material: comparison.Material.budget - comparison.Material.actual,
                Equipment: comparison.Equipment.budget - comparison.Equipment.actual,
                Other: comparison.Other.budget - comparison.Other.actual
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Risk Matrix
analyticsRoutes.get('/risk-matrix/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const reports = await Report.find({ project: projectId })
            .select('weekNumber year issues safety weather');

        const risks = {
            openIssues: 0,
            criticalIssues: 0,
            safetyIncidents: 0,
            nearMisses: 0,
            weatherHalts: 0,
            recentRisks: []
        };

        reports.forEach(report => {
            risks.openIssues += report.issues.filter(i => i.status === 'open').length;
            risks.criticalIssues += report.issues.filter(i => i.severity === 'critical').length;
            risks.safetyIncidents += report.safety.incidentCount || 0;
            risks.nearMisses += report.safety.nearMissCount || 0;
            risks.weatherHalts += report.weather.haltDays || 0;

            // Collect recent critical items
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 30); // Last 30 days

            report.issues.forEach(issue => {
                if (new Date(issue.reportedOn) > recentDate && issue.severity === 'critical') {
                    risks.recentRisks.push({
                        type: 'Issue',
                        severity: 'critical',
                        description: issue.issue,
                        date: issue.reportedOn,
                        week: report.weekNumber
                    });
                }
            });
            report.safety.incidents.forEach(inc => {
                if (new Date(inc.date) > recentDate) {
                    risks.recentRisks.push({
                        type: 'Safety',
                        severity: inc.severity,
                        description: inc.description,
                        date: inc.date,
                        week: report.weekNumber
                    });
                }
            });
        });

        res.json(risks);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default analyticsRoutes;
