import axios from 'axios';
import { TeamMember } from './types';

const API_BASE_URL = 'http://localhost:3000/team';

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const addTeamMember = async (member: Omit<TeamMember, '_id'>): Promise<TeamMember> => {
  const response = await axios.post(API_BASE_URL, member);
  return response.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const updateTeamMember = async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, member);
  return response.data;
};
