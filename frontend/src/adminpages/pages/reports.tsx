import React, { useState, useEffect } from 'react';
import {
  FileText, Calendar, TrendingUp, TrendingDown, Users, DollarSign,
  AlertTriangle, CheckCircle, Clock, Plus, Download, ChevronDown,
  ChevronRight, Building, Briefcase, ArrowUp, ArrowDown, Save,
  Loader2, Package, Truck, Cloud, Shield, HardHat, Wrench,
  ClipboardCheck, Eye, Send, ThumbsUp, AlertCircle, Sun, CloudRain
} from 'lucide-react';
import { getAllProjects, Project } from '../../api/projects';
import {
  Report, getReports, getCurrentWeekReport, updateReport,
  addLabourEntry, addMaterialEntry, addEquipmentEntry, addWorkEntry, 
  addIssue, addWeatherEntry, addSafetyIncident, addQualityTest,
  getWeeklySummary, WeeklySummary, submitReport
} from '../../api/reports';
import PageHeader from '../component/PageHeader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tab type
type TabType = 'overview' | 'labour' | 'materials' | 'equipment' | 'safety' | 'quality' | 'issues' | 'history' | 'summary';

const ReportsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Editable states
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<'on-track' | 'ahead' | 'behind' | 'at-risk' | 'halted'>('on-track');
  const [editFinancial, setEditFinancial] = useState({
    weeklyIncome: 0, clientPayment: 0, labourCost: 0, materialCost: 0, 
    equipmentCost: 0, transportCost: 0, miscCost: 0
  });
  const [editNotes, setEditNotes] = useState('');

  // Form visibility states
  const [showForm, setShowForm] = useState<string | null>(null);

  // Form data states
  const [labourForm, setLabourForm] = useState({ date: '', workers: 0, skilled: 0, unskilled: 0, description: '', shift: 'day' });
  const [materialForm, setMaterialForm] = useState({ name: '', category: 'cement', quantity: 0, unit: 'bags', unitCost: 0, supplier: '' });
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: 'mixer', hoursUsed: 0, fuelCost: 0, rentalCost: 0, status: 'operational' });
  const [workForm, setWorkForm] = useState({ task: '', description: '', category: 'structure', quantity: '', location: '' });
  const [issueForm, setIssueForm] = useState({ issue: '', category: 'other', severity: 'minor', impact: '', assignedTo: '' });
  const [weatherForm, setWeatherForm] = useState({ date: '', condition: 'sunny', workStatus: 'full-work', remarks: '' });
  const [safetyForm, setSafetyForm] = useState({ type: 'near-miss', description: '', severity: 'minor', actionTaken: '' });
  const [qualityForm, setQualityForm] = useState({ type: '', result: 'pending', value: '', standard: '', remarks: '' });

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
      const activeProjects = data.filter(p => p.status !== 'upcoming');
      setProjects(activeProjects);
      if (activeProjects.length > 0) setSelectedProject(activeProjects[0]._id);
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
      setEditFinancial({
        weeklyIncome: report.financial?.weeklyIncome || 0,
        clientPayment: report.financial?.clientPayment || 0,
        labourCost: report.financial?.labourCost || 0,
        materialCost: report.financial?.materialCost || 0,
        equipmentCost: report.financial?.equipmentCost || 0,
        transportCost: report.financial?.transportCost || 0,
        miscCost: report.financial?.miscCost || 0,
      });
      setEditNotes(report.notes || '');
    } catch (err) {
      console.error('Error loading current report:', err);
      setCurrentReport(null);
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
      const totalExpense = editFinancial.labourCost + editFinancial.materialCost + 
        editFinancial.equipmentCost + editFinancial.transportCost + editFinancial.miscCost;
      
      await updateReport(currentReport._id, {
        progress: { 
          ...currentReport.progress, 
          percentageComplete: editProgress, 
          status: editStatus 
        },
        financial: {
          ...editFinancial,
          weeklyExpense: totalExpense,
          netAmount: editFinancial.weeklyIncome + editFinancial.clientPayment - totalExpense
        },
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

  const handleSubmitReport = async () => {
    if (!currentReport) return;
    try {
      await submitReport(currentReport._id);
      await loadCurrentReport();
      alert('Report submitted for approval');
    } catch (err) {
      console.error('Error submitting report:', err);
    }
  };

  // Form handlers
  const handleAddLabour = async () => {
    if (!currentReport || !labourForm.date || !labourForm.workers) return;
    try {
      await addLabourEntry(currentReport._id, labourForm as any);
      setLabourForm({ date: '', workers: 0, skilled: 0, unskilled: 0, description: '', shift: 'day' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddMaterial = async () => {
    if (!currentReport || !materialForm.name) return;
    try {
      await addMaterialEntry(currentReport._id, materialForm as any);
      setMaterialForm({ name: '', category: 'cement', quantity: 0, unit: 'bags', unitCost: 0, supplier: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddEquipment = async () => {
    if (!currentReport || !equipmentForm.name) return;
    try {
      await addEquipmentEntry(currentReport._id, equipmentForm as any);
      setEquipmentForm({ name: '', type: 'mixer', hoursUsed: 0, fuelCost: 0, rentalCost: 0, status: 'operational' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddWork = async () => {
    if (!currentReport || !workForm.task) return;
    try {
      await addWorkEntry(currentReport._id, workForm as any);
      setWorkForm({ task: '', description: '', category: 'structure', quantity: '', location: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddIssue = async () => {
    if (!currentReport || !issueForm.issue) return;
    try {
      await addIssue(currentReport._id, issueForm as any);
      setIssueForm({ issue: '', category: 'other', severity: 'minor', impact: '', assignedTo: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddWeather = async () => {
    if (!currentReport || !weatherForm.date) return;
    try {
      await addWeatherEntry(currentReport._id, weatherForm as any);
      setWeatherForm({ date: '', condition: 'sunny', workStatus: 'full-work', remarks: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddSafety = async () => {
    if (!currentReport || !safetyForm.description) return;
    try {
      await addSafetyIncident(currentReport._id, safetyForm as any);
      setSafetyForm({ type: 'near-miss', description: '', severity: 'minor', actionTaken: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  const handleAddQuality = async () => {
    if (!currentReport || !qualityForm.type) return;
    try {
      await addQualityTest(currentReport._id, qualityForm as any);
      setQualityForm({ type: '', result: 'pending', value: '', standard: '', remarks: '' });
      setShowForm(null);
      await loadCurrentReport();
    } catch (err) { console.error('Error:', err); }
  };

  // Utility functions
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const formatCurrency = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'on-track': 'bg-emerald-500/20 text-emerald-400',
      'ahead': 'bg-blue-500/20 text-blue-400',
      'behind': 'bg-amber-500/20 text-amber-400',
      'at-risk': 'bg-red-500/20 text-red-400',
      'halted': 'bg-slate-500/20 text-slate-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'critical': 'bg-red-500/20 text-red-400',
      'major': 'bg-amber-500/20 text-amber-400',
      'minor': 'bg-slate-600 text-slate-400',
      'serious': 'bg-red-500/20 text-red-400',
      'moderate': 'bg-amber-500/20 text-amber-400',
    };
    return colors[severity] || 'bg-slate-600 text-slate-400';
  };

  const exportReportToPDF = (report: Report) => {
    const doc = new jsPDF();
    const projectName = typeof report.project === 'object' ? report.project.name : report.projectName;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('WEEKLY SITE REPORT', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(projectName, 105, 24, { align: 'center' });
    doc.text(`Week ${report.weekNumber}, ${report.year} | ${formatDate(report.weekStartDate)} - ${formatDate(report.weekEndDate)}`, 105, 31, { align: 'center' });
    
    let y = 42;
    
    // Progress & Status
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('PROGRESS & STATUS', 14, y);
    y += 6;
    
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Current Progress', `${report.progress?.percentageComplete || 0}%`],
        ['Weekly Gain', `${report.progress?.weeklyProgressGain || 0}%`],
        ['Status', (report.progress?.status || 'N/A').toUpperCase()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
      styles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 50 } },
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Financial Summary
    doc.text('FINANCIAL SUMMARY', 14, y);
    y += 6;
    
    const totalExpense = (report.financial?.labourCost || 0) + (report.financial?.materialCost || 0) + 
      (report.financial?.equipmentCost || 0) + (report.financial?.transportCost || 0);
    
    autoTable(doc, {
      startY: y,
      head: [['Category', 'Amount']],
      body: [
        ['Income Received', formatCurrency(report.financial?.weeklyIncome || 0)],
        ['Client Payment', formatCurrency(report.financial?.clientPayment || 0)],
        ['Labour Cost', formatCurrency(report.financial?.labourCost || 0)],
        ['Material Cost', formatCurrency(report.financial?.materialCost || 0)],
        ['Equipment Cost', formatCurrency(report.financial?.equipmentCost || 0)],
        ['Total Expense', formatCurrency(totalExpense)],
        ['Net Amount', formatCurrency(report.financial?.netAmount || 0)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], fontSize: 9 },
      styles: { fontSize: 9 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Labour Summary
    if (report.labour?.details?.length > 0) {
      doc.text('LABOUR LOG', 14, y);
      y += 6;
      
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Workers', 'Skilled', 'Unskilled', 'Description']],
        body: report.labour.details.map(l => [
          formatDate(l.date), 
          String(l.workers), 
          String(l.skilled || 0),
          String(l.unskilled || 0),
          l.description || '-'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246], fontSize: 9 },
        styles: { fontSize: 8 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Materials
    if (report.materials?.items?.length > 0 && y < 230) {
      doc.text('MATERIALS RECEIVED', 14, y);
      y += 6;
      
      autoTable(doc, {
        startY: y,
        head: [['Material', 'Qty', 'Unit', 'Cost']],
        body: report.materials.items.map(m => [m.name, String(m.quantity), m.unit, formatCurrency(m.totalCost)]),
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11], fontSize: 9 },
        styles: { fontSize: 8 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Work Completed
    if (report.workCompleted?.length > 0 && y < 250) {
      doc.text('WORK COMPLETED', 14, y);
      y += 6;
      
      autoTable(doc, {
        startY: y,
        head: [['Task', 'Location', 'Quantity']],
        body: report.workCompleted.map(w => [w.task, w.location || '-', w.quantity || '-']),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], fontSize: 9 },
        styles: { fontSize: 8 },
      });
    }
    
    // Safety
    if ((report.safety?.incidentCount || 0) > 0 || (report.safety?.nearMissCount || 0) > 0) {
      doc.addPage();
      y = 20;
      doc.text('SAFETY REPORT', 14, y);
      y += 6;
      
      autoTable(doc, {
        startY: y,
        body: [
          ['Incidents', String(report.safety?.incidentCount || 0)],
          ['Near Misses', String(report.safety?.nearMissCount || 0)],
          ['PPE Compliance', `${report.safety?.ppeCompliance || 100}%`],
        ],
        theme: 'grid',
        styles: { fontSize: 9 },
      });
    }
    
    // Issues
    if (report.issues?.length > 0) {
      y = (doc as any).lastAutoTable?.finalY + 10 || y + 10;
      if (y > 250) { doc.addPage(); y = 20; }
      
      doc.text('ISSUES & BLOCKERS', 14, y);
      y += 6;
      
      autoTable(doc, {
        startY: y,
        head: [['Issue', 'Category', 'Severity', 'Status']],
        body: report.issues.map(i => [i.issue, i.category || '-', i.severity, i.status]),
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68], fontSize: 9 },
        styles: { fontSize: 8 },
      });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    doc.save(`SiteReport_${projectName.replace(/\s+/g, '_')}_Week${report.weekNumber}_${report.year}.pdf`);
  };

  // Tabs configuration
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye className="h-4 w-4" /> },
    { id: 'labour', label: 'Labour', icon: <Users className="h-4 w-4" /> },
    { id: 'materials', label: 'Materials', icon: <Package className="h-4 w-4" /> },
    { id: 'equipment', label: 'Equipment', icon: <Truck className="h-4 w-4" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="h-4 w-4" /> },
    { id: 'quality', label: 'Quality', icon: <ClipboardCheck className="h-4 w-4" /> },
    { id: 'issues', label: 'Issues', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="h-4 w-4" /> },
    { id: 'summary', label: 'Summary', icon: <Briefcase className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  const inputClass = "w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30";
  const selectClass = inputClass;

  return (
    <div className="max-w-[1800px] space-y-6">
      <PageHeader title="Weekly Site Reports" subtitle="Construction progress tracking & documentation">
        <div className="flex items-center gap-3">
          {currentReport && currentReport.status === 'draft' && (
            <button onClick={handleSubmitReport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              <Send className="h-4 w-4" /> Submit
            </button>
          )}
          {currentReport && (
            <button onClick={() => exportReportToPDF(currentReport)} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          )}
        </div>
      </PageHeader>

      {/* Project Selector */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-slate-400" />
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 min-w-[250px]">
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {currentReport && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${currentReport.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : currentReport.status === 'submitted' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-600 text-slate-400'}`}>
              {currentReport.status?.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Week Header */}
      {currentReport && activeTab !== 'history' && activeTab !== 'summary' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Calendar className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">Week {currentReport.weekNumber}, {currentReport.year}</h2>
                <p className="text-slate-400 text-sm">{formatDate(currentReport.weekStartDate)} - {formatDate(currentReport.weekEndDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(editStatus)}`}>
                {editStatus.replace('-', ' ').toUpperCase()}
              </span>
              <button onClick={handleSaveReport} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && currentReport && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Progress', value: `${editProgress}%`, icon: TrendingUp, color: 'blue', sub: `+${currentReport.progress?.weeklyProgressGain || 0}% this week` },
              { label: 'Man Days', value: currentReport.labour?.totalManDays || 0, icon: Users, color: 'violet' },
              { label: 'Material Cost', value: formatCurrency(currentReport.materials?.totalCost || 0), icon: Package, color: 'amber' },
              { label: 'Equipment Cost', value: formatCurrency(currentReport.equipment?.totalCost || 0), icon: Truck, color: 'cyan' },
              { label: 'Total Expense', value: formatCurrency(editFinancial.labourCost + editFinancial.materialCost + editFinancial.equipmentCost), icon: TrendingDown, color: 'red' },
              { label: 'Net Amount', value: formatCurrency(editFinancial.weeklyIncome + editFinancial.clientPayment - (editFinancial.labourCost + editFinancial.materialCost + editFinancial.equipmentCost + editFinancial.transportCost + editFinancial.miscCost)), icon: DollarSign, color: 'emerald' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 bg-${stat.color}-500/20 rounded-lg`}>
                    <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
                  </div>
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-slate-100">{stat.value}</div>
                {stat.sub && <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>}
              </div>
            ))}
          </div>

          {/* Progress & Financial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" /> Progress & Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Completion Progress</label>
                  <input type="range" min="0" max="100" value={editProgress} onChange={(e) => setEditProgress(Number(e.target.value))} className="w-full accent-primary-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span><span className="text-primary-400 font-bold text-base">{editProgress}%</span><span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Project Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className={selectClass}>
                    <option value="on-track">On Track</option>
                    <option value="ahead">Ahead of Schedule</option>
                    <option value="behind">Behind Schedule</option>
                    <option value="at-risk">At Risk</option>
                    <option value="halted">Work Halted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" /> Financial Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Income Received', key: 'weeklyIncome', color: 'emerald' },
                  { label: 'Client Payment', key: 'clientPayment', color: 'blue' },
                  { label: 'Labour Cost', key: 'labourCost', color: 'violet' },
                  { label: 'Material Cost', key: 'materialCost', color: 'amber' },
                  { label: 'Equipment Cost', key: 'equipmentCost', color: 'cyan' },
                  { label: 'Transport/Misc', key: 'transportCost', color: 'slate' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-slate-400 mb-1">{field.label}</label>
                    <input type="number" value={(editFinancial as any)[field.key]} onChange={(e) => setEditFinancial({ ...editFinancial, [field.key]: Number(e.target.value) })} className={inputClass} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Completed & Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Work Completed */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" /> Work Completed
                </h3>
                <button onClick={() => setShowForm(showForm === 'work' ? null : 'work')} className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {showForm === 'work' && (
                <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                  <input type="text" placeholder="Task/Activity" value={workForm.task} onChange={(e) => setWorkForm({ ...workForm, task: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={workForm.category} onChange={(e) => setWorkForm({ ...workForm, category: e.target.value })} className={selectClass}>
                      {['excavation', 'foundation', 'structure', 'masonry', 'plumbing', 'electrical', 'flooring', 'painting', 'finishing', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="text" placeholder="Location" value={workForm.location} onChange={(e) => setWorkForm({ ...workForm, location: e.target.value })} className={inputClass} />
                  </div>
                  <input type="text" placeholder="Quantity (e.g., 50 sqft)" value={workForm.quantity} onChange={(e) => setWorkForm({ ...workForm, quantity: e.target.value })} className={inputClass} />
                  <button onClick={handleAddWork} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add Work</button>
                </div>
              )}
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {currentReport.workCompleted?.length ? currentReport.workCompleted.map((w, i) => (
                  <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-200 font-medium text-sm">{w.task}</span>
                      <span className="text-xs bg-slate-600 px-2 py-0.5 rounded text-slate-300">{w.category}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{w.location} {w.quantity && `• ${w.quantity}`}</div>
                  </div>
                )) : <p className="text-slate-500 text-sm text-center py-4">No work entries</p>}
              </div>
            </div>

            {/* Weather */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-400" /> Weather Log
                </h3>
                <button onClick={() => setShowForm(showForm === 'weather' ? null : 'weather')} className="p-1.5 bg-sky-500/20 rounded-lg text-sky-400 hover:bg-sky-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {showForm === 'weather' && (
                <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                  <input type="date" value={weatherForm.date} onChange={(e) => setWeatherForm({ ...weatherForm, date: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={weatherForm.condition} onChange={(e) => setWeatherForm({ ...weatherForm, condition: e.target.value })} className={selectClass}>
                      <option value="sunny">Sunny</option>
                      <option value="cloudy">Cloudy</option>
                      <option value="rainy">Rainy</option>
                      <option value="stormy">Stormy</option>
                      <option value="extreme-heat">Extreme Heat</option>
                    </select>
                    <select value={weatherForm.workStatus} onChange={(e) => setWeatherForm({ ...weatherForm, workStatus: e.target.value })} className={selectClass}>
                      <option value="full-work">Full Work</option>
                      <option value="partial-work">Partial Work</option>
                      <option value="no-work">No Work</option>
                    </select>
                  </div>
                  <button onClick={handleAddWeather} className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium">Add Entry</button>
                </div>
              )}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Sun className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-100">{currentReport.weather?.workingDays || 0}</div>
                    <div className="text-xs text-slate-500">Working Days</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <CloudRain className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-100">{currentReport.weather?.rainDays || 0}</div>
                    <div className="text-xs text-slate-500">Rain Days</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-100">{currentReport.weather?.haltDays || 0}</div>
                    <div className="text-xs text-slate-500">Halt Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Notes & Remarks</h3>
            <textarea rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Add any additional notes..." className={`${inputClass} resize-none`} />
          </div>
        </div>
      )}

      {/* LABOUR TAB */}
      {activeTab === 'labour' && currentReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Workers', value: currentReport.labour?.totalWorkers || 0, icon: Users, color: 'violet' },
              { label: 'Working Days', value: currentReport.labour?.workingDays || 0, icon: Calendar, color: 'blue' },
              { label: 'Man Days', value: currentReport.labour?.totalManDays || 0, icon: HardHat, color: 'amber' },
              { label: 'Labour Cost', value: formatCurrency(currentReport.labour?.labourCost || 0), icon: DollarSign, color: 'emerald' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Daily Attendance Log</h3>
              <button onClick={() => setShowForm(showForm === 'labour' ? null : 'labour')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Add Entry
              </button>
            </div>
            {showForm === 'labour' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <input type="date" value={labourForm.date} onChange={(e) => setLabourForm({ ...labourForm, date: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Total Workers" value={labourForm.workers || ''} onChange={(e) => setLabourForm({ ...labourForm, workers: Number(e.target.value) })} className={inputClass} />
                  <input type="number" placeholder="Skilled" value={labourForm.skilled || ''} onChange={(e) => setLabourForm({ ...labourForm, skilled: Number(e.target.value) })} className={inputClass} />
                  <input type="number" placeholder="Unskilled" value={labourForm.unskilled || ''} onChange={(e) => setLabourForm({ ...labourForm, unskilled: Number(e.target.value) })} className={inputClass} />
                  <select value={labourForm.shift} onChange={(e) => setLabourForm({ ...labourForm, shift: e.target.value })} className={selectClass}>
                    <option value="day">Day Shift</option>
                    <option value="night">Night Shift</option>
                    <option value="both">Both</option>
                  </select>
                  <button onClick={handleAddLabour} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium">Add</button>
                </div>
                <input type="text" placeholder="Description (optional)" value={labourForm.description} onChange={(e) => setLabourForm({ ...labourForm, description: e.target.value })} className={`${inputClass} mt-3`} />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50">
                  <tr>
                    {['Date', 'Total', 'Skilled', 'Unskilled', 'Shift', 'Description'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentReport.labour?.details?.length ? currentReport.labour.details.map((l, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-slate-200">{formatDate(l.date)}</td>
                      <td className="px-4 py-3 text-slate-200 font-medium">{l.workers}</td>
                      <td className="px-4 py-3 text-emerald-400">{l.skilled || 0}</td>
                      <td className="px-4 py-3 text-amber-400">{l.unskilled || 0}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">{l.shift || 'day'}</span></td>
                      <td className="px-4 py-3 text-slate-400">{l.description || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No labour entries yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === 'materials' && currentReport && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Total Material Cost</h3>
                <p className="text-3xl font-bold text-amber-400 mt-1">{formatCurrency(currentReport.materials?.totalCost || 0)}</p>
              </div>
              <Package className="h-12 w-12 text-amber-400/30" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Materials Received</h3>
              <button onClick={() => setShowForm(showForm === 'material' ? null : 'material')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Add Material
              </button>
            </div>
            {showForm === 'material' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <input type="text" placeholder="Material Name" value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} className={inputClass} />
                  <select value={materialForm.category} onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })} className={selectClass}>
                    {['cement', 'steel', 'aggregate', 'sand', 'bricks', 'tiles', 'paint', 'electrical', 'plumbing', 'wood', 'glass', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="Quantity" value={materialForm.quantity || ''} onChange={(e) => setMaterialForm({ ...materialForm, quantity: Number(e.target.value) })} className={inputClass} />
                  <input type="text" placeholder="Unit" value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Unit Cost" value={materialForm.unitCost || ''} onChange={(e) => setMaterialForm({ ...materialForm, unitCost: Number(e.target.value) })} className={inputClass} />
                  <button onClick={handleAddMaterial} className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium">Add</button>
                </div>
                <input type="text" placeholder="Supplier (optional)" value={materialForm.supplier} onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })} className={`${inputClass} mt-3`} />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50">
                  <tr>
                    {['Material', 'Category', 'Quantity', 'Unit Cost', 'Total', 'Supplier'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentReport.materials?.items?.length ? currentReport.materials.items.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-slate-200 font-medium">{m.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">{m.category}</span></td>
                      <td className="px-4 py-3 text-slate-200">{m.quantity} {m.unit}</td>
                      <td className="px-4 py-3 text-slate-400">{formatCurrency(m.unitCost)}</td>
                      <td className="px-4 py-3 text-amber-400 font-medium">{formatCurrency(m.totalCost)}</td>
                      <td className="px-4 py-3 text-slate-400">{m.supplier || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No materials added yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EQUIPMENT TAB */}
      {activeTab === 'equipment' && currentReport && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Total Equipment Cost</h3>
                <p className="text-3xl font-bold text-cyan-400 mt-1">{formatCurrency(currentReport.equipment?.totalCost || 0)}</p>
              </div>
              <Truck className="h-12 w-12 text-cyan-400/30" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Equipment & Machinery</h3>
              <button onClick={() => setShowForm(showForm === 'equipment' ? null : 'equipment')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Add Equipment
              </button>
            </div>
            {showForm === 'equipment' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <input type="text" placeholder="Equipment Name" value={equipmentForm.name} onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })} className={inputClass} />
                  <select value={equipmentForm.type} onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.target.value })} className={selectClass}>
                    {['excavator', 'crane', 'mixer', 'compactor', 'scaffolding', 'pump', 'generator', 'vehicle', 'tools', 'other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input type="number" placeholder="Hours Used" value={equipmentForm.hoursUsed || ''} onChange={(e) => setEquipmentForm({ ...equipmentForm, hoursUsed: Number(e.target.value) })} className={inputClass} />
                  <input type="number" placeholder="Fuel Cost" value={equipmentForm.fuelCost || ''} onChange={(e) => setEquipmentForm({ ...equipmentForm, fuelCost: Number(e.target.value) })} className={inputClass} />
                  <input type="number" placeholder="Rental Cost" value={equipmentForm.rentalCost || ''} onChange={(e) => setEquipmentForm({ ...equipmentForm, rentalCost: Number(e.target.value) })} className={inputClass} />
                  <button onClick={handleAddEquipment} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Add</button>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50">
                  <tr>
                    {['Equipment', 'Type', 'Hours', 'Fuel Cost', 'Rental', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentReport.equipment?.items?.length ? currentReport.equipment.items.map((e, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-slate-200 font-medium">{e.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs">{e.type}</span></td>
                      <td className="px-4 py-3 text-slate-200">{e.hoursUsed}h</td>
                      <td className="px-4 py-3 text-slate-400">{formatCurrency(e.fuelCost)}</td>
                      <td className="px-4 py-3 text-cyan-400">{formatCurrency(e.rentalCost)}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${e.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{e.status}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No equipment logged yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY TAB */}
      {activeTab === 'safety' && currentReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Incidents', value: currentReport.safety?.incidentCount || 0, icon: AlertTriangle, color: 'red' },
              { label: 'Near Misses', value: currentReport.safety?.nearMissCount || 0, icon: AlertCircle, color: 'amber' },
              { label: 'Safety Meetings', value: currentReport.safety?.safetyMeetingsHeld || 0, icon: Users, color: 'blue' },
              { label: 'PPE Compliance', value: `${currentReport.safety?.ppeCompliance || 100}%`, icon: Shield, color: 'emerald' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Safety Incidents</h3>
              <button onClick={() => setShowForm(showForm === 'safety' ? null : 'safety')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Report Incident
              </button>
            </div>
            {showForm === 'safety' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select value={safetyForm.type} onChange={(e) => setSafetyForm({ ...safetyForm, type: e.target.value })} className={selectClass}>
                    <option value="near-miss">Near Miss</option>
                    <option value="injury">Injury</option>
                    <option value="property-damage">Property Damage</option>
                    <option value="fire">Fire</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={safetyForm.severity} onChange={(e) => setSafetyForm({ ...safetyForm, severity: e.target.value })} className={selectClass}>
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="serious">Serious</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={safetyForm.description} onChange={(e) => setSafetyForm({ ...safetyForm, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
                <input type="text" placeholder="Action Taken" value={safetyForm.actionTaken} onChange={(e) => setSafetyForm({ ...safetyForm, actionTaken: e.target.value })} className={inputClass} />
                <button onClick={handleAddSafety} className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Report</button>
              </div>
            )}
            <div className="p-4 space-y-3">
              {currentReport.safety?.incidents?.length ? currentReport.safety.incidents.map((inc, i) => (
                <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${inc.type === 'injury' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{inc.type}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(inc.severity)}`}>{inc.severity}</span>
                  </div>
                  <p className="text-slate-200 text-sm">{inc.description}</p>
                  {inc.actionTaken && <p className="text-slate-500 text-xs mt-2">Action: {inc.actionTaken}</p>}
                </div>
              )) : <p className="text-slate-500 text-center py-4">No incidents reported</p>}
            </div>
          </div>
        </div>
      )}

      {/* QUALITY TAB */}
      {activeTab === 'quality' && currentReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-slate-100">{currentReport.quality?.testsCompleted || 0}</div>
              <div className="text-slate-400 text-sm">Tests Completed</div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{currentReport.quality?.testsPassed || 0}</div>
              <div className="text-slate-400 text-sm">Passed</div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{currentReport.quality?.testsFailed || 0}</div>
              <div className="text-slate-400 text-sm">Failed</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Quality Tests</h3>
              <button onClick={() => setShowForm(showForm === 'quality' ? null : 'quality')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Add Test
              </button>
            </div>
            {showForm === 'quality' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input type="text" placeholder="Test Type (e.g., Cube Test)" value={qualityForm.type} onChange={(e) => setQualityForm({ ...qualityForm, type: e.target.value })} className={inputClass} />
                  <select value={qualityForm.result} onChange={(e) => setQualityForm({ ...qualityForm, result: e.target.value })} className={selectClass}>
                    <option value="pending">Pending</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <input type="text" placeholder="Value (e.g., 28 N/mm²)" value={qualityForm.value} onChange={(e) => setQualityForm({ ...qualityForm, value: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="Standard Required" value={qualityForm.standard} onChange={(e) => setQualityForm({ ...qualityForm, standard: e.target.value })} className={inputClass} />
                </div>
                <button onClick={handleAddQuality} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add Test</button>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50">
                  <tr>
                    {['Test Type', 'Value', 'Standard', 'Result', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentReport.quality?.tests?.length ? currentReport.quality.tests.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-slate-200 font-medium">{t.type}</td>
                      <td className="px-4 py-3 text-slate-200">{t.value || '-'}</td>
                      <td className="px-4 py-3 text-slate-400">{t.standard || '-'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${t.result === 'passed' ? 'bg-emerald-500/20 text-emerald-400' : t.result === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-400'}`}>{t.result}</span></td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(t.date)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No quality tests recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ISSUES TAB */}
      {activeTab === 'issues' && currentReport && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-100">Issues & Blockers</h3>
              <button onClick={() => setShowForm(showForm === 'issue' ? null : 'issue')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" /> Report Issue
              </button>
            </div>
            {showForm === 'issue' && (
              <div className="p-4 border-b border-slate-700 bg-slate-700/30 space-y-3">
                <textarea placeholder="Issue Description" value={issueForm.issue} onChange={(e) => setIssueForm({ ...issueForm, issue: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select value={issueForm.category} onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })} className={selectClass}>
                    {['material-shortage', 'labour-shortage', 'equipment-breakdown', 'weather', 'design-change', 'client-delay', 'permit', 'financial', 'quality', 'safety', 'other'].map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                  </select>
                  <select value={issueForm.severity} onChange={(e) => setIssueForm({ ...issueForm, severity: e.target.value })} className={selectClass}>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                  <input type="text" placeholder="Impact" value={issueForm.impact} onChange={(e) => setIssueForm({ ...issueForm, impact: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="Assigned To" value={issueForm.assignedTo} onChange={(e) => setIssueForm({ ...issueForm, assignedTo: e.target.value })} className={inputClass} />
                </div>
                <button onClick={handleAddIssue} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium">Add Issue</button>
              </div>
            )}
            <div className="p-4 space-y-3">
              {currentReport.issues?.length ? currentReport.issues.map((issue, i) => (
                <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">{issue.category}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${issue.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : issue.status === 'open' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{issue.status}</span>
                  </div>
                  <p className="text-slate-200">{issue.issue}</p>
                  {issue.impact && <p className="text-slate-500 text-sm mt-1">Impact: {issue.impact}</p>}
                  {issue.assignedTo && <p className="text-slate-500 text-xs mt-1">Assigned to: {issue.assignedTo}</p>}
                </div>
              )) : <p className="text-slate-500 text-center py-8">No issues reported</p>}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
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
                <p>No reports found</p>
              </div>
            ) : allReports.map(report => (
              <div key={report._id} className="p-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedReport(expandedReport === report._id ? null : report._id)}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-700 rounded-lg"><Calendar className="h-5 w-5 text-slate-400" /></div>
                    <div>
                      <h3 className="font-medium text-slate-200">Week {report.weekNumber}, {report.year}</h3>
                      <p className="text-sm text-slate-500">{formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.progress?.status || 'on-track')}`}>
                      {report.progress?.percentageComplete || 0}%
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); exportReportToPDF(report); }} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                      <Download className="h-4 w-4" />
                    </button>
                    {expandedReport === report._id ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>
                {expandedReport === report._id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div><span className="text-xs text-slate-500">Income</span><p className="text-emerald-400 font-medium">{formatCurrency(report.financial?.weeklyIncome || 0)}</p></div>
                    <div><span className="text-xs text-slate-500">Expense</span><p className="text-red-400 font-medium">{formatCurrency(report.financial?.weeklyExpense || 0)}</p></div>
                    <div><span className="text-xs text-slate-500">Man Days</span><p className="text-slate-200 font-medium">{report.labour?.totalManDays || 0}</p></div>
                    <div><span className="text-xs text-slate-500">Materials</span><p className="text-amber-400 font-medium">{formatCurrency(report.materials?.totalCost || 0)}</p></div>
                    <div><span className="text-xs text-slate-500">Issues</span><p className="text-slate-200 font-medium">{report.issues?.length || 0}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUMMARY TAB */}
      {activeTab === 'summary' && weeklySummary && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl"><Briefcase className="h-6 w-6 text-amber-400" /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Week {weeklySummary.weekNumber}, {weeklySummary.year}</h2>
                <p className="text-slate-400">Summary across all projects</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Projects', value: weeklySummary.totalProjects, color: 'slate' },
                { label: 'Total Income', value: formatCurrency(weeklySummary.totalIncome), color: 'emerald' },
                { label: 'Total Expense', value: formatCurrency(weeklySummary.totalExpense), color: 'red' },
                { label: 'Avg. Progress', value: `${weeklySummary.averageProgress.toFixed(1)}%`, color: 'blue' },
                { label: 'On Track', value: weeklySummary.projectsOnTrack, color: 'emerald' },
                { label: 'At Risk', value: weeklySummary.projectsAtRisk, color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                  <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" /> Projects On Track ({weeklySummary.projectsOnTrack})
              </h3>
              <div className="space-y-2">
                {weeklySummary.reports.filter(r => r.progress?.status === 'on-track' || r.progress?.status === 'ahead').map(r => (
                  <div key={r._id} className="p-3 bg-slate-700/30 rounded-lg flex justify-between">
                    <span className="text-slate-200">{r.projectName}</span>
                    <span className="text-emerald-400">{r.progress?.percentageComplete}%</span>
                  </div>
                ))}
                {weeklySummary.projectsOnTrack === 0 && <p className="text-slate-500 text-center py-4">No projects on track</p>}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> Projects At Risk ({weeklySummary.projectsAtRisk})
              </h3>
              <div className="space-y-2">
                {weeklySummary.reports.filter(r => r.progress?.status === 'behind' || r.progress?.status === 'at-risk' || r.progress?.status === 'halted').map(r => (
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

      {/* No Report State */}
      {!currentReport && activeTab !== 'history' && activeTab !== 'summary' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Report Available</h3>
          <p className="text-slate-500">Select a project to view or create a weekly report</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
