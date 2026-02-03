import axios from 'axios';
import { API_BASE } from '../utils/api';

const API_BASE_URL = `${API_BASE}/quotes`;

export interface Quote {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
}

/** Submit a quote from the public contact form (no auth). */
export const submitQuote = async (data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<{ message: string; id: string }> => {
  const response = await axios.post(API_BASE_URL, data);
  return { message: response.data.message, id: response.data.id };
};

/** Get all quotes (admin only). */
export const getQuotes = async (): Promise<Quote[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/** Update quote status (admin only). */
export const updateQuoteStatus = async (
  id: string,
  status: 'new' | 'read' | 'contacted'
): Promise<Quote> => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/** Delete a quote (admin only). */
export const deleteQuote = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
