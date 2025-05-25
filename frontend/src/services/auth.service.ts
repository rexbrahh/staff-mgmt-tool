import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  }

  async getProfile(): Promise<AuthResponse['user']> {
    const token = this.getCurrentToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  }
}

export const authService = new AuthService(); 