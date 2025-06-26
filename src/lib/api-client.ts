import axios from 'axios';

// Dynamic base URL depending on environment
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '' // Use empty string to use the Vite proxy in development
  : (import.meta.env.VITE_API_BASE_URL || 'https://city-park-hub-1rf7.onrender.com');

console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('API Base URL:', API_BASE_URL);

// Create Axios client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Only use withCredentials in production
  withCredentials: !isDevelopment,
  timeout: 30000,
});

// Attach auth token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
  console.log('Request headers:', config.headers);
  
  return config;
});

// Handle and log errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.status, response.statusText);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      request: error.request ? 'Request made but no response' : null
    });
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${data?.detail || 'Invalid request data'}`);
        case 401:
          throw new Error('Authentication required. Please log in.');
        case 403:
          throw new Error('Access denied. You don\'t have permission for this action.');
        case 404:
          throw new Error('Resource not found.');
        case 422:
          if (data?.detail && Array.isArray(data.detail)) {
            const validationErrors = data.detail.map((err: any) => 
              `${err.loc?.join('.') || 'Field'}: ${err.msg}`
            ).join(', ');
            throw new Error(`Validation error: ${validationErrors}`);
          }
          throw new Error(`Validation error: ${data?.detail || 'Invalid data provided'}`);
        case 500:
          throw new Error(`Server error: ${data?.detail || 'Internal server error occurred'}`);
        default:
          throw new Error(`Server error (${status}): ${data?.detail || error.response.statusText}`);
      }
    } else if (error.request) {
      // Request made but no response received
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to server. Please check if the server is running.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Server not found. Please check the server URL.');
      } else if (error.message.includes('CORS')) {
        throw new Error('CORS error: Please ensure the server allows requests from this domain.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server took too long to respond.');
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

// -----------------------------
// Type Definitions
// -----------------------------

export interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  distance?: string;
  availableSpots: number;
  totalSpots?: number;
  pricePerHour: number;
  rating?: number;
  features?: string[];
  walkTime?: string;
}

export interface Booking {
  id: number;
  location: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  paymentMethod: string;
}

export interface CreateBookingRequest {
  parking_space_id: number;
  start_time: string;
  end_time: string;
  duration_hours: number;
  local_kw?: string;
}

// -----------------------------
// API Functions
// -----------------------------

export const parkingApi = {
  getAll: async (): Promise<ParkingSpot[]> => {
    try {
      console.log('Fetching parking spots...');
      const response = await apiClient.get<ParkingSpot[]>('/api/parking/spots');
      console.log('Parking spots fetched successfully:', response.data?.length, 'spots');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch parking spots:', error);
      throw error;
    }
  },

  getAvailability: async (spotId: number): Promise<ParkingSpot> => {
    try {
      console.log(`Fetching availability for spot ${spotId}...`);
      const response = await apiClient.get<ParkingSpot>(`/api/parking/spots/${spotId}/availability`);
      console.log('Availability fetched successfully');
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch availability for spot ${spotId}:`, error);
      throw error;
    }
  },
};

export const bookingApi = {
  create: async (data: CreateBookingRequest): Promise<any> => {
    try {
      console.log('Creating booking with data:', data);

      // Validate required fields
      if (!data.parking_space_id) {
        throw new Error('Please select a parking spot');
      }
      if (!data.start_time || !data.end_time) {
        throw new Error('Please select start and end times');
      }
      if (data.duration_hours <= 0) {
        throw new Error('Duration must be greater than 0 hours');
      }

      // Validate time logic
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      const now = new Date();

      if (startTime < now) {
        throw new Error('Start time cannot be in the past');
      }
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      // Prepare the request payload
      const requestData = {
        parking_space_id: data.parking_space_id,
        start_time: data.start_time,
        end_time: data.end_time,
        duration_hours: data.duration_hours,
      };

      console.log('Sending booking request:', requestData);

      // Build URL with query parameter if provided
      let url = '/api/bookings';
      if (data.local_kw) {
        url += `?local_kw=${encodeURIComponent(data.local_kw)}`;
      }

      const response = await apiClient.post(url, requestData);
      
      console.log('Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw error;
    }
  },

  getAll: async (): Promise<Booking[]> => {
    try {
      console.log('Fetching all bookings...');
      const response = await apiClient.get<Booking[]>('/api/bookings');
      console.log('Bookings fetched successfully:', response.data?.length, 'bookings');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Booking>): Promise<any> => {
    try {
      console.log(`Updating booking ${id} with data:`, data);
      const response = await apiClient.put(`/api/bookings/${id}`, data);
      console.log('Booking updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Failed to update booking ${id}:`, error);
      throw error;
    }
  },

  cancel: async (id: number): Promise<any> => {
    try {
      console.log(`Cancelling booking ${id}...`);
      const response = await apiClient.delete(`/api/bookings/${id}`);
      console.log('Booking cancelled successfully');
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel booking ${id}:`, error);
      throw error;
    }
  },
};