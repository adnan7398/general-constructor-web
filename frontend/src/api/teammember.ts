import axios from 'axios';
interface TeamMember {
  _id: string;
  name: string;
  role: 'Engineer' | 'Architect' | 'Contractor' | 'Manager' | 'Supervisor' | 'Worker';
  contact: {
    phone: string;
    email: string;
  };
  profileImage: string;
  assignedProject: string; // ObjectId as string
  joinedDate: Date;
  isActive: boolean;
}


const API_BASE_URL = 'http://localhost:3000/team';
const API_BASE_URL_USER = 'http://localhost:3000/user';
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const addTeamMember = async (member: Omit<TeamMember, '_id'>): Promise<TeamMember> => {
  const response = await axios.post(API_BASE_URL, member);
  return response.data;
};
export const getassignedProjects = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/user-projects`);
  return response.data;
}

export const deleteTeamMember = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const updateTeamMember = async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, member);
  return response.data;
};
export const fetchTeam = async (projectId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/team/${projectId}`);
  return response.data;
}