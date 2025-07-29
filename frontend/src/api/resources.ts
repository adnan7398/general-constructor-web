import axios from 'axios';

export interface Resource {
  _id: string;
  name: string;
  siteName: string;
  type: 'Material' | 'Equipment' | 'Labor' | 'Vehicle' | 'Other';
  quantity: number;
  status: 'Available' | 'In Use' | 'Pending' | 'Completed' | 'Damaged';
  location?: string;
  cost: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  projectType: 'commercial' | 'industrial' | 'residential' | 'infrastructure';
  location?: string;
}

const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/resources';
const PROJECT_API_URL = 'https://general-constructor-web-2.onrender.com/project';

export const getAllResources = async (): Promise<Resource[]> => {
  try {
    const response = await axios.get(API_BASE_URL, { headers });
    return response.data.map((resource: any) => ({
      ...resource,
      startDate: resource.startDate ? new Date(resource.startDate) : undefined,
      endDate: resource.endDate ? new Date(resource.endDate) : undefined,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const getResourcesBySite = async (siteName: string): Promise<Resource[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/site/${siteName}`, { headers });
    return response.data.map((resource: any) => ({
      ...resource,
      startDate: resource.startDate ? new Date(resource.startDate) : undefined,
      endDate: resource.endDate ? new Date(resource.endDate) : undefined,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching resources by site:', error);
    throw error;
  }
};

export const createResource = async (resource: Omit<Resource, '_id' | 'createdAt' | 'updatedAt'>): Promise<Resource> => {
  try {
    const response = await axios.post(API_BASE_URL, resource, { headers });
    return {
      ...response.data,
      startDate: response.data.startDate ? new Date(response.data.startDate) : undefined,
      endDate: response.data.endDate ? new Date(response.data.endDate) : undefined,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

export const updateResource = async (id: string, resource: Partial<Resource>): Promise<Resource> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, resource, { headers });
    return {
      ...response.data,
      startDate: response.data.startDate ? new Date(response.data.startDate) : undefined,
      endDate: response.data.endDate ? new Date(response.data.endDate) : undefined,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

export const deleteResource = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, { headers });
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${PROJECT_API_URL}/all`, { headers });
    return response.data.map((project: any) => ({
      ...project,
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getResourceById = async (id: string): Promise<Resource> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers });
    return {
      ...response.data,
      startDate: response.data.startDate ? new Date(response.data.startDate) : undefined,
      endDate: response.data.endDate ? new Date(response.data.endDate) : undefined,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    throw error;
  }
}; 