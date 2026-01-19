import axios from 'axios';

const getToken = () => localStorage.getItem('token');
const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/reports';

export interface LabourDetail {
  date: string;
  workers: number;
  description: string;
}

export interface WorkEntry {
  task: string;
  description: string;
  completedOn: string;
}

export interface UpcomingWork {
  task: string;
  plannedDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Issue {
  issue: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'open' | 'in-progress' | 'resolved';
  reportedOn: string;
}

export interface Report {
  _id: string;
  project: string | { _id: string; name: string; status: string; projectType: string };
  projectName: string;
  weekNumber: number;
  year: number;
  weekStartDate: string;
  weekEndDate: string;
  labour: {
    totalWorkers: number;
    workingDays: number;
    totalManDays: number;
    labourCost: number;
    details: LabourDetail[];
  };
  financial: {
    weeklyIncome: number;
    weeklyExpense: number;
    materialCost: number;
    labourCost: number;
    otherCost: number;
    netAmount: number;
  };
  progress: {
    percentageComplete: number;
    previousWeekProgress: number;
    weeklyProgressGain: number;
    status: 'on-track' | 'ahead' | 'behind' | 'at-risk';
  };
  workCompleted: WorkEntry[];
  upcomingWork: UpcomingWork[];
  issues: Issue[];
  notes: string;
  generatedAt: string;
  lastUpdated: string;
}

export interface WeeklySummary {
  weekNumber: number;
  year: number;
  totalProjects: number;
  totalLabourCost: number;
  totalMaterialCost: number;
  totalIncome: number;
  totalExpense: number;
  averageProgress: number;
  projectsOnTrack: number;
  projectsAtRisk: number;
  reports: Report[];
}

// Get all reports
export const getReports = async (filters?: { projectId?: string; year?: number; weekNumber?: number }): Promise<Report[]> => {
  const params = new URLSearchParams();
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.year) params.append('year', String(filters.year));
  if (filters?.weekNumber) params.append('weekNumber', String(filters.weekNumber));
  
  const response = await axios.get(`${API_BASE_URL}?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Get reports for a project
export const getProjectReports = async (projectId: string): Promise<Report[]> => {
  const response = await axios.get(`${API_BASE_URL}/project/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Get current week report for a project
export const getCurrentWeekReport = async (projectId: string): Promise<Report> => {
  const response = await axios.get(`${API_BASE_URL}/current/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Get single report
export const getReport = async (id: string): Promise<Report> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Create report
export const createReport = async (projectId: string, date?: string): Promise<Report> => {
  const response = await axios.post(API_BASE_URL, { projectId, date }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.report;
};

// Update report
export const updateReport = async (id: string, data: Partial<Report>): Promise<Report> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.report;
};

// Add labour entry
export const addLabourEntry = async (reportId: string, entry: { date: string; workers: number; description: string }): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/labour`, entry, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.report;
};

// Add work entry
export const addWorkEntry = async (reportId: string, entry: { task: string; description: string; completedOn?: string }): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/work`, entry, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.report;
};

// Add issue
export const addIssue = async (reportId: string, entry: { issue: string; severity: string }): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/issue`, entry, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.report;
};

// Get weekly summary
export const getWeeklySummary = async (weekNumber?: number, year?: number): Promise<WeeklySummary> => {
  const params = new URLSearchParams();
  if (weekNumber) params.append('weekNumber', String(weekNumber));
  if (year) params.append('year', String(year));
  
  const response = await axios.get(`${API_BASE_URL}/summary/weekly?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Delete report
export const deleteReport = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
