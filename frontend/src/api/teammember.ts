import axios from 'axios';

export interface TeamMember {
  _id: string;
  name: string;
  role: 'Engineer' | 'Architect' | 'Contractor' | 'Manager' | 'Supervisor' | 'Worker';
  contact: {
    phone: string;
    email: string;
  };
  profileImage: string;
  assignedProject: string[]; 
  joinedDate: Date;
  isActive: boolean;
}
const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};
const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/team';
const API_BASE_URL_USER = 'https://general-constructor-web-2.onrender.com/user';
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await axios.get(API_BASE_URL, { headers });

  const formatted = response.data.map((member: any) => ({
    ...member,
    assignedProject: Array.isArray(member.assignedProject)
      ? member.assignedProject
      : [member.assignedProject],
    joinedDate: new Date(member.joinedDate),
  }));

  return formatted;
};

export const addTeamMember = async (
  member: Omit<TeamMember, '_id'>
): Promise<TeamMember> => {
  const response = await axios.post(API_BASE_URL, member, { headers });
  return response.data;
};

export const getassignedProjects = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/user-projects`, { headers });
  return response.data;
};
export const deleteTeamMember = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, { headers });
};
export const updateTeamMember = async (
  id: string,
  member: Partial<TeamMember>
): Promise<TeamMember> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, member, { headers });
  return response.data;
};
export const fetchTeam = async (projectId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/team/${projectId}`, { headers });
  return response.data;
};
