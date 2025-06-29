import axios from 'axios';
import { API_BASE_URL } from './api';


// Create Axios client with proxy URL
console.log('API_BASE_URL:', API_BASE_URL);
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add auth token and error handling
apiClient.interceptors.request.use((config) => {
  // Skip token addition for login and register endpoints
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
    return config;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    throw new Error('Not authenticated');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      config: error.config,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.error || data?.detail || `Server error: ${status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      const errorMessage = `Network error: ${error.message}`;
      console.error('Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      });
      throw new Error(errorMessage);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Network error: ${error.message}`);
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
  totalSpots: number;
  pricePerHour: number;
  rating: number;
  features: string[];
  walkTime?: string;
}

export interface BookingResponse {
  id: number;
  parking_spot_id: number;
  start_time: string;
  end_time: string;
  duration_hours: number;
  local_kw: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
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

// -----------------------------
// API Functions
// -----------------------------

export const parkingApi = {
  getAll: (): Promise<ParkingSpot[]> =>
    apiClient.get('/api/parking/spots').then((res) => res.data),

  getAvailability: (spotId: number): Promise<ParkingSpot> =>
    apiClient.get(`/api/parking/spots/${spotId}/availability`).then((res) => res.data),

  bookSpot: (spotId: number, data: { start_time: string; duration_hours: number }, local_kw?: string): Promise<any> =>
    apiClient.post(`/api/parking/spots/${spotId}/book`, {
      start_time: new Date(data.start_time),
      duration_hours: data.duration_hours,
      local_kw: local_kw || ''
    }).then((res) => res.data)
};

export const bookingApi = {
  create: async (
    data: {
      parking_space_id: number;
      start_time: string; 
      end_time: string;
      duration_hours: number;
    },
    local_kw: string
  ) => {
    try {
      // Convert string dates to Date objects if needed
      const startDateTime = typeof data.start_time === 'string' 
        ? new Date(data.start_time) 
        : data.start_time;
      const endDateTime = typeof data.end_time === 'string' 
        ? new Date(data.end_time) 
        : data.end_time;

      // Format dates in YYYY-MM-DD HH:mm:ss format
      const requestData = {
        parking_space_id: data.parking_space_id,
        start_time: startDateTime.toISOString().split('.')[0],
        end_time: endDateTime.toISOString().split('.')[0],
        duration_hours: data.duration_hours
      };

      console.log('Sending booking request:', {
        endpoint: '/api/bookings',
        data: requestData,
      });

      const response = await apiClient.post(`/api/bookings?local_kw=${encodeURIComponent(local_kw)}`, requestData);
      
      console.log('Booking response:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Booking error details:', {
        error: error,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      if (error.response) {
        console.error('Full error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        // Try to extract error details in various formats
        let errorMessage = 'Unknown error';
        
        if (error.response?.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const errorDetails = error.response.data.detail.map((err: any) => {
              if (typeof err === 'string') return err;
              if (err.loc && err.msg) {
                return `${err.loc.join('.')}: ${err.msg}`;
              }
              if (err.type && err.msg) {
                return `${err.type}: ${err.msg}`;
              }
              if (err.msg) return err.msg;
              if (err.detail) return err.detail;
              if (err.error) return err.error;
              if (typeof err === 'object') return JSON.stringify(err);
              return 'Unknown error';
            });
            errorMessage = errorDetails.join(', ');
          } else {
            errorMessage = error.response.data.detail;
          }
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        // Show the full error details in the console
        console.error('Detailed error:', {
          fullResponse: error.response.data,
          errorMessage: errorMessage
        });
        
        throw new Error(errorMessage);
      } else {
        // Try FastAPI style error with single detail
        if (error.response?.data?.detail && typeof error.response.data.detail === 'string') {
          throw new Error(error.response.data.detail);
        }

        // Try regular JSON error
        if (typeof error.response?.data === 'object') {
          const errorMessages = Object.entries(error.response.data).map(([field, msg]) => {
            return `${field}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`;
          });
          throw new Error(errorMessages.join(', '));
        }

        // Try raw string error
        if (typeof error.response?.data === 'string') {
          throw new Error(error.response.data);
        }
      }

      throw new Error('Booking failed: ' + error.message);
    }
  },

  getAll: (): Promise<Booking[]> =>
    apiClient.get('/api/bookings').then((res) => res.data),

  update: (id: number, data: Partial<Booking>): Promise<Booking> =>
    apiClient.put(`/api/bookings/${id}`, data).then((res) => res.data),

  cancel: (id: number): Promise<void> =>
    apiClient.delete(`/api/bookings/${id}`).then((res) => res.data),
};


