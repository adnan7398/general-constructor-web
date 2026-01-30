import axios from 'axios';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  projectType: 'commercial' | 'residential' | 'industrial' | 'infrastructure' | 'public';
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  team?: string[];
  image?: string;
  images?: string[];
  videoUrl?: string;
  notes?: string;
  location?: string;
  clientName?: string;
  documents?: string[];
  createdAt?: string;
  showOnWebsite?: boolean;
  displayOrder?: number;
}

const getToken = () => localStorage.getItem('token');
const API_BASE_URL = 'http://localhost:3000/project';

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
};

export const getPendingProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/?status=upcoming`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getCompletedProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/?status=completed`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const completeProject = async (id: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${id}`, { status: 'completed' }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const addProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
  const response = await axios.post(`${API_BASE_URL}/`, project, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data; // Backend returns the object directly
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const toggleShowcase = async (id: string): Promise<Project> => {
  const response = await axios.patch(`${API_BASE_URL}/toggle-showcase/${id}`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.project;
};

export const uploadProjectImage = async (id: string, file: File): Promise<Project> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${API_BASE_URL}/upload-image/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.project;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Get showcase projects (public, no auth)
export const getShowcaseProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/showcase`);
  return response.data;
};

export const fetchTeam = async (projectId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/team/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};