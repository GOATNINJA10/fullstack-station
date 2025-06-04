export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ChargingStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'inactive';
  powerOutput: number;
  connectorType: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ChargingStationFilters = {
  status?: 'active' | 'inactive' | 'all';
  connectorType?: string;
  minPowerOutput?: number;
  maxPowerOutput?: number;
}