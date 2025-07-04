import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: { email: string; password: string }) {
    console.log('🌐 AuthService: Making API call to:', `${API_URL}/auth/login`);
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('📡 AuthService: API response received:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('💾 AuthService: Token saved to localStorage');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('🚨 AuthService: API call failed:', error);
      console.error('📄 Error response:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      throw error;
    }
  },

  async register(userData: { email: string; password: string; firstName: string; lastName: string }) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },
};