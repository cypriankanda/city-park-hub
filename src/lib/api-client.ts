import axios from 'axios';
import { API_BASE_URL } from './api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const parkingApi = {
  getAll: () => apiClient.get<ParkingSpot[]>('/api/parking/spots').then(res => res.data),
  getAvailability: (spotId: number) => apiClient.get<ParkingSpot>(`/api/parking/spots/${spotId}/availability`).then(res => res.data),
};

export const bookingApi = {
  create: (data: {
    spotId: number;
    startTime: string;
    endTime: string;
    durationHours: number;
  }) => apiClient.post<Booking>('/api/bookings', data).then(res => res.data),
  getAll: () => apiClient.get<Booking[]>('/api/bookings').then(res => res.data),
  update: (id: number, data: Partial<Booking>) => apiClient.put<Booking>(`/api/bookings/${id}`, data).then(res => res.data),
  cancel: (id: number) => apiClient.delete(`/api/bookings/${id}`).then(res => res.data),
};

export default apiClient;
