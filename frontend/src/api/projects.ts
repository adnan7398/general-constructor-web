import axios from 'axios';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  projectType: 'commercial' | 'residential' | 'industrial' | 'infrastructure';
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  team?: string[];
  image?: string;
  location?: string;
  clientName?: string;
  documents?: string[];
  createdAt?: string;
}

const API_BASE_URL = 'http://localhost:3000/project';

// ✅ GET pending (ongoing + upcoming)
export const getPendingProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/pending`);
  return response.data;
};

// ✅ GET completed
export const getCompletedProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/completed`);
  return response.data;
};

// ✅ PUT complete project
export const completeProject = async (id: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/complete/${id}`);
};

// ✅ POST new project
export const addProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
  const response = await axios.post(`${API_BASE_URL}/add`, project);
  return response.data.project;
};

// ✅ GET project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};
