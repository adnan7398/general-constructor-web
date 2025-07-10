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
const token = localStorage.getItem('token');
const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/project';
export const getPendingProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/pending`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCompletedProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_BASE_URL}/completed`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const completeProject = async (id: string): Promise<void> => {
  await axios.put(
    `${API_BASE_URL}/complete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const addProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
  const response = await axios.post(`${API_BASE_URL}/add`, project,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.project;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// team member of a specific prject 
export const fetchTeam = async (projectId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/team/${projectId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}