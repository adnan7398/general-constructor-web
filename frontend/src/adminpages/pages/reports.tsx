import React, { useState, useEffect } from 'react';
import {
  FileText, Calendar, TrendingUp, TrendingDown, Users, DollarSign,
  AlertTriangle, CheckCircle, Clock, Plus, Download, ChevronDown,
  ChevronRight, Building, Briefcase, ArrowUp, ArrowDown, X, Save,
  FileSpreadsheet, Loader2
} from 'lucide-react';
import { getAllProjects, Project } from '../../api/projects';
import {
  Report, getReports, getCurrentWeekReport, updateReport,
  addLabourEntry, addWorkEntry, addIssue, getWeeklySummary, WeeklySummary
} from '../../api/reports';
import PageHeader from '../component/PageHeader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'summary'>('current');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Form states
  const [labourForm, setLabourForm] = useState({ date: '', workers: 0, description: '' });
  const [workForm, setWorkForm] = useState({ task: '', description: '' });
  const [issueForm, setIssueForm] = useState({ issue: '', severity: 'minor' as const });
  const [showLabourForm, setShowLabourForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Editable report fields
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<'on-track' | 'ahead' | 'behind' | 'at-risk'>('on-track');
  const [editFinancial, setEditFinancial] = useState({
    weeklyIncome: 0, weeklyExpense: 0, materialCost: 0, labourCost: 0, otherCost: 0
  });
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    loadProjects();
    loadWeeklySummary();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadCurrentReport();
      loadAllReports();
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data.filter(p => p.status !== 'upcoming'));
      if (data.length > 0) setSelectedProject(data[0]._id);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentReport = async () => {
    if (!selectedProject) return;
    try {
      const report = await getCurrentWeekReport(selectedProject);
      setCurrentReport(report);
      setEditProgress(report.progress?.percentageComplete || 0);
      setEditStatus(report.progress?.status || 'on-track');
      setEditFinancial(report.financial || { weeklyIncome: 0, weeklyExpense: 0, materialCost: 0, labourCost: 0, otherCost: 0 });
      setEditNotes(report.notes || '');
    } catch (err) {
      console.error('Error loading current report:', err);
    }
  };

  const loadAllReports = async () => {
    if (!selectedProject) return;
    try {
      const reports = await getReports({ projectId: selectedProject });
      setAllReports(reports);
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  const loadWeeklySummary = async () => {
    try {
      const summary = await getWeeklySummary();
      setWeeklySummary(summary);
    } catch (err) {
      console.error('Error loading weekly summary:', err);
    }
  };

  const handleSaveReport = async () => {
    if (!currentReport) return;
    setSaving(true);
    try {
      await updateReport(currentReport._id, {
        progress: { ...currentReport.progress, percentageComplete: editProgress, status: editStatus },
        financial: editFinancial,
        notes: editNotes,
      });
      await loadCurrentReport();
      await loadWeeklySummary();
    } catch (err) {
      console.error('Error saving report:', err);
      alert('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLabour = async () => {
    if (!currentReport || !labourForm.date || !labourForm.workers) return;
    try {
      await addLabourEntry(currentReport._id, labourForm);
      setLabourForm({ date: '', workers: 0, description: '' });
      setShowLabourForm(false);
      await loadCurrentReport();
    } catch (err) {
      console.error('Error adding labour:', err);
    }
  };

  const handleAddWork = async () => {
    if (!currentReport || !workForm.task) return;
    try {
      await addWorkEntry(currentReport._id, workForm);
      setWorkForm({ task: '', description: '' });
      setShowWorkForm(false);
      await loadCurrentReport();
    } catch (err) {
      console.error('Error adding work:', err);
    }
  };

  const handleAddIssue = async () => {
    if (!currentReport || !issueForm.issue) return;
    try {
      await addIssue(currentReport._id, issueForm);
      setIssueForm({ issue: '', severity: 'minor' });
      setShowIssueForm(false);
      await loadCurrentReport();
    } catch (err) {
      console.error('Error adding issue:', err);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-emerald-500/20 text-emerald-400';
      case 'ahead': return 'bg-blue-500/20 text-blue-400';
      case 'behind': return 'bg-amber-500/20 text-amber-400';
      case 'at-risk': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const exportReportToPDF = (report: Report) => {
    const doc = new jsPDF();
    const projectName = typeof report.project === 'object' ? report.project.name : report.projectName;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Weekly Project Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text(projectName, 105, 30, { align: 'center' });
    doc.text(`Week ${report.weekNumber}, ${report.year}`, 105, 38, { align: 'center' });
    doc.text(`${formatDate(report.weekStartDate)} - ${formatDate(report.weekEndDate)}`, 105, 46, { align: 'center' });
    
    let y = 60;
    
    // Progress Section
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Progress Overview', 14, y);
    y += 8;
    
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Current Progress', `${report.progress?.percentageComplete || 0}%`],
        ['Previous Week', `${report.progress?.previousWeekProgress || 0}%`],
        ['Weekly Gain', `${report.progress?.weeklyProgressGain || 0}%`],
        ['Status', report.progress?.status?.toUpperCase() || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Financial Section
    doc.text('Financial Summary', 14, y);
    y += 8;
    
    autoTable(doc, {
      startY: y,
      head: [['Category', 'Amount']],
      body: [
        ['Weekly Income', formatCurrency(report.financial?.weeklyIncome || 0)],
        ['Weekly Expense', formatCurrency(report.financial?.weeklyExpense || 0)],
        ['Labour Cost', formatCurrency(report.financial?.labourCost || 0)],
        ['Material Cost', formatCurrency(report.financial?.materialCost || 0)],
        ['Net Amount', formatCurrency(report.financial?.netAmount || 0)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Labour Details
    if (report.labour?.details?.length > 0) {
      doc.text('Labour Details', 14, y);
      y += 8;
      
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Workers', 'Description']],
        body: report.labour.details.map(l => [formatDate(l.date), String(l.workers), l.description || '-']),
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 10 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Work Completed
    if (report.workCompleted?.length > 0) {
      doc.text('Work Completed', 14, y);
      y += 8;
      
      autoTable(doc, {
        startY: y,
        head: [['Task', 'Description', 'Completed On']],
        body: report.workCompleted.map(w => [w.task, w.description || '-', formatDate(w.completedOn)]),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 10 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Issues
    if (report.issues?.length > 0 && y < 250) {
      doc.text('Issues & Blockers', 14, y);
      y += 8;
      
      autoTable(doc, {
        startY: y,
        head: [['Issue', 'Severity', 'Status']],
        body: report.issues.map(i => [i.issue, i.severity.toUpperCase(), i.status.toUpperCase()]),
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 10 },
      });
    }
    
    // Notes
    if (report.notes) {
      y = (doc as any).lastAutoTable?.finalY + 15 || y + 15;
      if (y < 270) {
        doc.text('Notes:', 14, y);
        doc.setFontSize(10);
        doc.text(report.notes, 14, y + 6, { maxWidth: 180 });
      }
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
    
    doc.save(`Report_${projectName}_Week${report.weekNumber}_${report.year}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] space-y-6">
      <PageHeader title="Weekly Reports" subtitle="Generate and manage weekly project reports">
        {currentReport && (
          <button
            onClick={() => exportReportToPDF(currentReport)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        )}
      </PageHeader>

      {/* Project Selector & Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-slate-400" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {(['current', 'history', 'summary'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
            >
              {tab === 'current' ? 'Current Week' : tab === 'history' ? 'History' : 'Weekly Summary'}
            </button>
          ))}
        </div>
      </div>

      {/* Current Week Tab */}
      {activeTab === 'current' && currentReport && (
        <div className="space-y-6">
          {/* Week Info Header */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                  <Calendar className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Week {currentReport.weekNumber}, {currentReport.year}</h2>
                  <p className="text-slate-400 text-sm">{formatDate(currentReport.weekStartDate)} - {formatDate(currentReport.weekEndDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(editStatus)}`}>
                  {editStatus.replace('-', ' ').toUpperCase()}
                </span>
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Report
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-400" /></div>
                <span className="text-slate-400 text-sm">Progress</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{editProgress}%</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                {(currentReport.progress?.weeklyProgressGain || 0) >= 0 ? (
                  <><ArrowUp className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400">+{currentReport.progress?.weeklyProgressGain || 0}%</span></>
                ) : (
                  <><ArrowDown className="h-4 w-4 text-red-400" /><span className="text-red-400">{currentReport.progress?.weeklyProgressGain}%</span></>
                )}
                <span className="text-slate-500">from last week</span>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg"><DollarSign className="h-5 w-5 text-emerald-400" /></div>
                <span className="text-slate-400 text-sm">Weekly Income</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">{formatCurrency(editFinancial.weeklyIncome)}</div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500/20 rounded-lg"><TrendingDown className="h-5 w-5 text-red-400" /></div>
                <span className="text-slate-400 text-sm">Weekly Expense</span>
              </div>
              <div className="text-3xl font-bold text-red-400">{formatCurrency(editFinancial.weeklyExpense)}</div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-violet-500/20 rounded-lg"><Users className="h-5 w-5 text-violet-400" /></div>
                <span className="text-slate-400 text-sm">Labour Days</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{currentReport.labour?.totalManDays || 0}</div>
              <div className="text-sm text-slate-500">{currentReport.labour?.workingDays || 0} working days</div>
            </div>
          </div>

          {/* Edit Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress & Status */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Progress & Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Completion Progress (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span className="text-primary-400 font-medium">{editProgress}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Project Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="on-track">On Track</option>
                    <option value="ahead">Ahead of Schedule</option>
                    <option value="behind">Behind Schedule</option>
                    <option value="at-risk">At Risk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Financial Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weekly Income (₹)</label>
                  <input
                    type="number"
                    value={editFinancial.weeklyIncome}
                    onChange={(e) => setEditFinancial({ ...editFinancial, weeklyIncome: Number(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weekly Expense (₹)</label>
                  <input
                    type="number"
                    value={editFinancial.weeklyExpense}
                    onChange={(e) => setEditFinancial({ ...editFinancial, weeklyExpense: Number(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Labour Cost (₹)</label>
                  <input
                    type="number"
                    value={editFinancial.labourCost}
                    onChange={(e) => setEditFinancial({ ...editFinancial, labourCost: Number(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Material Cost (₹)</label>
                  <input
                    type="number"
                    value={editFinancial.materialCost}
                    onChange={(e) => setEditFinancial({ ...editFinancial, materialCost: Number(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Labour, Work Completed, Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Labour Section */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-400" /> Labour Log
                </h3>
                <button onClick={() => setShowLabourForm(!showLabourForm)} className="p-1.5 bg-violet-500/20 rounded-lg text-violet-400 hover:bg-violet-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {showLabourForm && (
                <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                  <input type="date" value={labourForm.date} onChange={(e) => setLabourForm({ ...labourForm, date: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <input type="number" placeholder="No. of workers" value={labourForm.workers || ''} onChange={(e) => setLabourForm({ ...labourForm, workers: Number(e.target.value) })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <input type="text" placeholder="Description" value={labourForm.description} onChange={(e) => setLabourForm({ ...labourForm, description: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <button onClick={handleAddLabour} className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium">Add Entry</button>
                </div>
              )}
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {currentReport.labour?.details?.length ? currentReport.labour.details.map((l, i) => (
                  <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{formatDate(l.date)}</span>
                      <span className="text-violet-400 font-medium">{l.workers} workers</span>
                    </div>
                    {l.description && <p className="text-xs text-slate-500 mt-1">{l.description}</p>}
                  </div>
                )) : <p className="text-slate-500 text-sm text-center py-4">No labour entries</p>}
              </div>
            </div>

            {/* Work Completed Section */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" /> Work Completed
                </h3>
                <button onClick={() => setShowWorkForm(!showWorkForm)} className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {showWorkForm && (
                <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                  <input type="text" placeholder="Task name" value={workForm.task} onChange={(e) => setWorkForm({ ...workForm, task: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <input type="text" placeholder="Description" value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <button onClick={handleAddWork} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add Work</button>
                </div>
              )}
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {currentReport.workCompleted?.length ? currentReport.workCompleted.map((w, i) => (
                  <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-slate-200 font-medium text-sm">{w.task}</span>
                      <span className="text-xs text-slate-500">{formatDate(w.completedOn)}</span>
                    </div>
                    {w.description && <p className="text-xs text-slate-500 mt-1">{w.description}</p>}
                  </div>
                )) : <p className="text-slate-500 text-sm text-center py-4">No work entries</p>}
              </div>
            </div>

            {/* Issues Section */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" /> Issues & Blockers
                </h3>
                <button onClick={() => setShowIssueForm(!showIssueForm)} className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400 hover:bg-amber-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {showIssueForm && (
                <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                  <input type="text" placeholder="Issue description" value={issueForm.issue} onChange={(e) => setIssueForm({ ...issueForm, issue: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm" />
                  <select value={issueForm.severity} onChange={(e) => setIssueForm({ ...issueForm, severity: e.target.value as any })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm">
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                  <button onClick={handleAddIssue} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium">Add Issue</button>
                </div>
              )}
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {currentReport.issues?.length ? currentReport.issues.map((issue, i) => (
                  <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-200 text-sm">{issue.issue}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' : issue.severity === 'major' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-slate-400'}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{issue.status} · {formatDate(issue.reportedOn)}</div>
                  </div>
                )) : <p className="text-slate-500 text-sm text-center py-4">No issues reported</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Notes & Remarks</h3>
            <textarea
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add any additional notes or observations..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Report History</h2>
            <p className="text-slate-400 text-sm">Past weekly reports for this project</p>
          </div>
          <div className="divide-y divide-slate-700">
            {allReports.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reports found for this project</p>
              </div>
            ) : allReports.map(report => (
              <div key={report._id} className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === report._id ? null : report._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">Week {report.weekNumber}, {report.year}</h3>
                      <p className="text-sm text-slate-500">{formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.progress?.status || 'on-track')}`}>
                      {report.progress?.percentageComplete || 0}% Complete
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); exportReportToPDF(report); }}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {expandedReport === report._id ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>
                {expandedReport === report._id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-slate-500">Income</span>
                      <p className="text-emerald-400 font-medium">{formatCurrency(report.financial?.weeklyIncome || 0)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Expense</span>
                      <p className="text-red-400 font-medium">{formatCurrency(report.financial?.weeklyExpense || 0)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Labour Days</span>
                      <p className="text-slate-200 font-medium">{report.labour?.totalManDays || 0}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Issues</span>
                      <p className="text-slate-200 font-medium">{report.issues?.length || 0}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && weeklySummary && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Briefcase className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Week {weeklySummary.weekNumber}, {weeklySummary.year}</h2>
                <p className="text-slate-400">Summary across all projects</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <div className="text-slate-400 text-sm">Total Projects</div>
                <div className="text-2xl font-bold text-slate-100">{weeklySummary.totalProjects}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <div className="text-slate-400 text-sm">Total Income</div>
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(weeklySummary.totalIncome)}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <div className="text-slate-400 text-sm">Total Expense</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(weeklySummary.totalExpense)}</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <div className="text-slate-400 text-sm">Avg. Progress</div>
                <div className="text-2xl font-bold text-blue-400">{weeklySummary.averageProgress.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Projects On Track ({weeklySummary.projectsOnTrack})
              </h3>
              <div className="space-y-2">
                {weeklySummary.reports.filter(r => r.progress?.status === 'on-track' || r.progress?.status === 'ahead').map(r => (
                  <div key={r._id} className="p-3 bg-slate-700/30 rounded-lg flex justify-between">
                    <span className="text-slate-200">{r.projectName}</span>
                    <span className="text-emerald-400">{r.progress?.percentageComplete}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Projects At Risk ({weeklySummary.projectsAtRisk})
              </h3>
              <div className="space-y-2">
                {weeklySummary.reports.filter(r => r.progress?.status === 'behind' || r.progress?.status === 'at-risk').map(r => (
                  <div key={r._id} className="p-3 bg-slate-700/30 rounded-lg flex justify-between">
                    <span className="text-slate-200">{r.projectName}</span>
                    <span className="text-amber-400">{r.progress?.percentageComplete}%</span>
                  </div>
                ))}
                {weeklySummary.projectsAtRisk === 0 && <p className="text-slate-500 text-center py-4">All projects on track!</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
