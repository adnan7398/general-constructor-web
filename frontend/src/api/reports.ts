import axios from 'axios';

const getToken = () => localStorage.getItem('token');
const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/reports';

// ============ INTERFACES ============

export interface LabourDetail {
  date: string;
  workers: number;
  skilled?: number;
  unskilled?: number;
  description: string;
  shift?: 'day' | 'night' | 'both';
}

export interface MaterialItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  deliveryDate?: string;
  invoiceNo?: string;
}

export interface EquipmentItem {
  name: string;
  type: string;
  hoursUsed: number;
  fuelCost: number;
  rentalCost: number;
  maintenanceCost?: number;
  operator?: string;
  status: 'operational' | 'under-maintenance' | 'idle' | 'breakdown';
}

export interface WorkEntry {
  task: string;
  description: string;
  completedOn: string;
  category?: string;
  quantity?: string;
  location?: string;
}

export interface UpcomingWork {
  task: string;
  plannedDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDays?: number;
  dependencies?: string[];
}

export interface SafetyIncident {
  date: string;
  type: 'injury' | 'near-miss' | 'property-damage' | 'fire' | 'other';
  description: string;
  severity: 'minor' | 'moderate' | 'serious' | 'fatal';
  actionTaken?: string;
  reportedBy?: string;
}

export interface WeatherCondition {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'extreme-heat';
  workStatus: 'full-work' | 'partial-work' | 'no-work';
  remarks?: string;
}

export interface QualityTest {
  date: string;
  type: string;
  result: 'passed' | 'failed' | 'pending';
  value?: string;
  standard?: string;
  remarks?: string;
}

export interface Issue {
  issue: string;
  category?: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  impact?: string;
  actionTaken?: string;
  assignedTo?: string;
  reportedOn: string;
  resolvedOn?: string;
}

export interface Visitor {
  date: string;
  name: string;
  designation?: string;
  organization?: string;
  purpose: string;
  remarks?: string;
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
    overtime?: number;
    breakdown?: {
      skilled?: { count: number; cost: number };
      semiskilled?: { count: number; cost: number };
      unskilled?: { count: number; cost: number };
      supervisors?: { count: number; cost: number };
      contractors?: { count: number; cost: number };
    };
    details: LabourDetail[];
  };
  
  materials: {
    totalCost: number;
    items: MaterialItem[];
    stockStatus?: Array<{
      material: string;
      available: number;
      required: number;
      unit: string;
      status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
    }>;
  };
  
  equipment: {
    totalCost: number;
    items: EquipmentItem[];
  };
  
  financial: {
    weeklyIncome: number;
    clientPayment?: number;
    advanceReceived?: number;
    weeklyExpense: number;
    labourCost: number;
    materialCost: number;
    equipmentCost?: number;
    transportCost?: number;
    utilityCost?: number;
    miscCost?: number;
    netAmount: number;
    cashInHand?: number;
    pendingPayments?: number;
  };
  
  progress: {
    percentageComplete: number;
    previousWeekProgress: number;
    weeklyProgressGain: number;
    status: 'on-track' | 'ahead' | 'behind' | 'at-risk' | 'halted';
    phases?: Array<{
      name: string;
      planned: number;
      actual: number;
      variance: number;
    }>;
  };
  
  workCompleted: WorkEntry[];
  upcomingWork: UpcomingWork[];
  
  safety: {
    incidentCount: number;
    nearMissCount: number;
    safetyMeetingsHeld: number;
    ppeCompliance: number;
    incidents: SafetyIncident[];
    inspections?: Array<{
      date: string;
      type: string;
      inspector: string;
      result: 'passed' | 'failed' | 'conditional';
      remarks?: string;
    }>;
  };
  
  weather: {
    workingDays: number;
    rainDays: number;
    haltDays: number;
    conditions: WeatherCondition[];
  };
  
  quality: {
    testsCompleted: number;
    testsPassed: number;
    testsFailed: number;
    tests: QualityTest[];
    defects?: Array<{
      date: string;
      location: string;
      description: string;
      severity: 'minor' | 'major' | 'critical';
      status: 'open' | 'in-progress' | 'resolved';
      resolution?: string;
    }>;
  };
  
  issues: Issue[];
  photos?: Array<{ url: string; caption: string; date: string; category: string }>;
  visitors: Visitor[];
  notes: string;
  highlights?: Array<{ type: string; description: string }>;
  
  generatedAt: string;
  lastUpdated: string;
  status: 'draft' | 'submitted' | 'approved' | 'revision-required';
  approvedBy?: string;
  approvedAt?: string;
}

export interface WeeklySummary {
  weekNumber: number;
  year: number;
  totalProjects: number;
  totalIncome: number;
  totalExpense: number;
  totalLabourCost: number;
  totalMaterialCost: number;
  totalEquipmentCost: number;
  totalManDays: number;
  averageProgress: number;
  projectsOnTrack: number;
  projectsAtRisk: number;
  totalIncidents: number;
  totalNearMisses: number;
  openIssues: number;
  criticalIssues: number;
  reports: Report[];
}

// ============ API FUNCTIONS ============

const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// Get all reports
export const getReports = async (filters?: { projectId?: string; year?: number; weekNumber?: number; status?: string }): Promise<Report[]> => {
  const params = new URLSearchParams();
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.year) params.append('year', String(filters.year));
  if (filters?.weekNumber) params.append('weekNumber', String(filters.weekNumber));
  if (filters?.status) params.append('status', filters.status);
  
  const response = await axios.get(`${API_BASE_URL}?${params}`, { headers: authHeaders() });
  return response.data;
};

// Get reports for a project
export const getProjectReports = async (projectId: string): Promise<Report[]> => {
  const response = await axios.get(`${API_BASE_URL}/project/${projectId}`, { headers: authHeaders() });
  return response.data;
};

// Get current week report for a project
export const getCurrentWeekReport = async (projectId: string): Promise<Report> => {
  const response = await axios.get(`${API_BASE_URL}/current/${projectId}`, { headers: authHeaders() });
  return response.data;
};

// Get single report
export const getReport = async (id: string): Promise<Report> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, { headers: authHeaders() });
  return response.data;
};

// Create report
export const createReport = async (projectId: string, date?: string): Promise<Report> => {
  const response = await axios.post(API_BASE_URL, { projectId, date }, { headers: authHeaders() });
  return response.data.report;
};

// Update report
export const updateReport = async (id: string, data: Partial<Report>): Promise<Report> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, { headers: authHeaders() });
  return response.data.report;
};

// Add labour entry
export const addLabourEntry = async (reportId: string, entry: Partial<LabourDetail>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/labour`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add material entry
export const addMaterialEntry = async (reportId: string, entry: Partial<MaterialItem>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/material`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add equipment entry
export const addEquipmentEntry = async (reportId: string, entry: Partial<EquipmentItem>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/equipment`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add work entry
export const addWorkEntry = async (reportId: string, entry: Partial<WorkEntry>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/work`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add safety incident
export const addSafetyIncident = async (reportId: string, entry: Partial<SafetyIncident>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/safety`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add weather entry
export const addWeatherEntry = async (reportId: string, entry: Partial<WeatherCondition>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/weather`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add quality test
export const addQualityTest = async (reportId: string, entry: Partial<QualityTest>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/quality`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Add issue
export const addIssue = async (reportId: string, entry: Partial<Issue>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/issue`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Update issue status
export const updateIssueStatus = async (reportId: string, issueIndex: number, data: { status?: string; actionTaken?: string }): Promise<Report> => {
  const response = await axios.patch(`${API_BASE_URL}/${reportId}/issue/${issueIndex}`, data, { headers: authHeaders() });
  return response.data.report;
};

// Add visitor entry
export const addVisitorEntry = async (reportId: string, entry: Partial<Visitor>): Promise<Report> => {
  const response = await axios.post(`${API_BASE_URL}/${reportId}/visitor`, entry, { headers: authHeaders() });
  return response.data.report;
};

// Submit report for approval
export const submitReport = async (reportId: string): Promise<Report> => {
  const response = await axios.patch(`${API_BASE_URL}/${reportId}/submit`, {}, { headers: authHeaders() });
  return response.data.report;
};

// Approve report
export const approveReport = async (reportId: string, approvedBy: string): Promise<Report> => {
  const response = await axios.patch(`${API_BASE_URL}/${reportId}/approve`, { approvedBy }, { headers: authHeaders() });
  return response.data.report;
};

// Get weekly summary
export const getWeeklySummary = async (weekNumber?: number, year?: number): Promise<WeeklySummary> => {
  const params = new URLSearchParams();
  if (weekNumber) params.append('weekNumber', String(weekNumber));
  if (year) params.append('year', String(year));
  
  const response = await axios.get(`${API_BASE_URL}/summary/weekly?${params}`, { headers: authHeaders() });
  return response.data;
};

// Delete report
export const deleteReport = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, { headers: authHeaders() });
};
