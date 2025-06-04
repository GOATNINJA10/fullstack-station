import axios from 'axios';
import { ChargingStation } from '../types';

const API_URL = 'http://localhost:3001/api';

// Helper to get the auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllStations = async (): Promise<ChargingStation[]> => {
  try {
    const response = await axios.get(`${API_URL}/stations`, getAuthHeader());
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch stations');
    }
    
    return response.data.data.stations;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error fetching stations');
    }
    throw new Error('Failed to connect to server');
  }
};

export const getStationById = async (id: string): Promise<ChargingStation> => {
  try {
    const response = await axios.get(`${API_URL}/stations/${id}`, getAuthHeader());
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch station');
    }
    
    return response.data.data.station;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Station not found');
      }
      throw new Error(error.response.data.message || 'Error fetching station');
    }
    throw new Error('Failed to connect to server');
  }
};

export const createStation = async (stationData: Partial<ChargingStation>): Promise<ChargingStation> => {
  try {
    const response = await axios.post(`${API_URL}/stations`, stationData, getAuthHeader());
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create station');
    }
    
    return response.data.data.station;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error creating station');
    }
    throw new Error('Failed to connect to server');
  }
};

export const updateStation = async (id: string, stationData: Partial<ChargingStation>): Promise<ChargingStation> => {
  try {
    const response = await axios.put(`${API_URL}/stations/${id}`, stationData, getAuthHeader());
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update station');
    }
    
    return response.data.data.station;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Station not found');
      }
      throw new Error(error.response.data.message || 'Error updating station');
    }
    throw new Error('Failed to connect to server');
  }
};

export const deleteStation = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/stations/${id}`, getAuthHeader());
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete station');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Station not found');
      }
      throw new Error(error.response.data.message || 'Error deleting station');
    }
    throw new Error('Failed to connect to server');
  }
};