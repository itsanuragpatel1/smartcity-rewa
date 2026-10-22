import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:5000/api';
  const trimmed = envUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Automatically inject JWT token into header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication Services
export const authAPI = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Complaint Services
export const complaintAPI = {
  submit: async (formData) => {
    // Note: formData must be a multipart/form-data object containing files, description, category, anonymous, location
    const response = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    // Note: statusData is a FormData for uploaded images, remarks, status
    const response = await api.put(`/complaints/${id}/status`, statusData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/complaints/dashboard-stats');
    return response.data;
  },
};

// Announcement Services
export const announcementAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },
};

// Scheme Services
export const schemeAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/schemes', { params });
    return response.data;
  },
};

// Municipal Bills Services
export const billAPI = {
  get: async (billType, consumerNumber) => {
    const response = await api.get(`/bills/${encodeURIComponent(billType)}/${consumerNumber}`);
    return response.data;
  },
  pay: async (billId, paymentMethod) => {
    const response = await api.post(`/bills/${billId}/pay`, { paymentMethod });
    return response.data;
  },
};

export default api;
