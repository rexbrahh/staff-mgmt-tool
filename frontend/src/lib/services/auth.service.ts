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
    console.log('📧 AuthService: Sending credentials:', { email: credentials.email, password: '***' });
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('📡 AuthService: API response received:', response.data);
      console.log('✅ AuthService: Response status:', response.status);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('💾 AuthService: Token saved to localStorage');
        
        // Also set token in cookies for middleware
        document.cookie = `token=${response.data.token}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
        console.log('🍪 AuthService: Token saved to cookies');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('🚨 AuthService: API call failed:', error);
      console.error('📄 Error response data:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      console.error('🔗 Error config:', error.config);
      console.error('💥 Full error object:', error);
      
      // Re-throw with more specific error information
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const errorStatus = error.response?.status || 'Unknown';
      
      console.error('🎯 Throwing error with message:', errorMessage, 'status:', errorStatus);
      
      throw new Error(`${errorMessage} (Status: ${errorStatus})`);
    }
  },

  async register(userData: { email: string; password: string; firstName: string; lastName: string }) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Also set token in cookies for middleware
      document.cookie = `token=${response.data.token}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    // Also remove token from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },

  getToken() {
    return localStorage.getItem('token');
  },
};