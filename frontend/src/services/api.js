import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data)
};

export const skillsAPI = {
  getSkills: (search) => api.get(`/skills${search ? `?search=${search}` : ''}`),
  seedSkills: () => api.post('/skills/seed')
};

export const assessmentsAPI = {
  getQuestions: (skill) => api.get(`/assessments/${skill}`),
  submitAssessment: (data) => api.post('/assessments/submit', data)
};

export default api;

