 import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  error?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Failed to connect to server');
  }
};

export const registerUser = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, credentials);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Failed to connect to server');
  }
};
