import axios from 'axios';

const API_BASE = 'https://general-constructor-web-2.onrender.com';

// Hero Content
export const getHeroContent = async () => {
    const response = await axios.get(`${API_BASE}/hero`);
    return response.data;
};

export const updateHeroContent = async (data: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE}/hero`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Testimonials
export const getTestimonials = async () => {
    const response = await axios.get(`${API_BASE}/testimonials`);
    return response.data;
};

export const createTestimonial = async (data: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/testimonials`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateTestimonial = async (id: string, data: Partial<any>) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE}/testimonials/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};

export const deleteTestimonial = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE}/testimonials/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
};
