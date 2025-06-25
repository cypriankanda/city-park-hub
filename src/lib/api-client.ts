import axios from 'axios';

// Dynamic base URL depending on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const isDev = import.meta.env.DEV;
const PROXY_URL = isDev ? '' : API_BASE_URL;

// Create Axios client
export const apiClient = axios.create({
  baseURL: PROXY_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Attach auth token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle and log errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw error;
    } else if (error.request) {
      console.error('Network Error:', error.message);
      throw new Error('Network error occurred. Please check your internet connection.');
    } else {
      console.error('Request Error:', error.message);
      throw new Error('An error occurred while processing your request.');
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
  distance: string;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
  rating: number;
  features: string[];
  walkTime: string;
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
  getAll: () =>
    apiClient.get<ParkingSpot[]>('/api/parking/spots').then((res) => res.data),

  getAvailability: (spotId: number) =>
    apiClient
      .get<ParkingSpot>(`/api/parking/spots/${spotId}/availability`)
      .then((res) => res.data),
};

export const bookingApi = {
  create: (
    data: {
      parking_space_id: number;
      start_time: Date;
      end_time: Date;
      duration_hours: number;
      local_kw: string;
    },
    endpoint: string = '/api/bookings'
  ) => {
    const requestData = {
      parking_space_id: data.parking_space_id,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      duration_hours: Number(data.duration_hours),
    };

    return apiClient.post(`${endpoint}?local_kw=${encodeURIComponent(data.local_kw)}`, requestData)
      .then((response) => {
        console.log('Booking response:', response.data);
        return response.data;
      })
      .catch((error) => {
        console.error('Booking API Error:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        throw error;
      });
  },

  getAll: () =>
    apiClient.get<Booking[]>('/api/bookings').then((res) => res.data),

  update: (id: number, data: Partial<Booking>) =>
    apiClient.put(`/api/bookings/${id}`, data).then((res) => res.data),

  cancel: (id: number) =>
    apiClient.delete(`/api/bookings/${id}`).then((res) => res.data),
};


