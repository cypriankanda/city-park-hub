import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Use proxy for local development
const isDev = import.meta.env.DEV;
const PROXY_URL = isDev ? '' : API_BASE_URL;

const apiClient = axios.create({
  baseURL: PROXY_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000
});

// Add error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with an error
      console.error('Server Error:', error.response.data);
      throw error;
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
      throw new Error('Network error occurred. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
      throw new Error('An error occurred while processing your request.');
    }
  }
);

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
    parking_spot_id: number;
    start_time: Date;
    end_time: Date;
    duration_hours: number;
  }, endpoint: string = '/api/bookings') => {
    // Convert dates to ISO strings before sending
    const requestData = {
      parking_spot_id: data.parking_spot_id,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      duration_hours: Number(data.duration_hours)
    };

    // Add proper error handling
    console.log('Sending booking request to:', `${endpoint}?local_kw=true`);
    console.log('Request data:', requestData);
    
    return apiClient.post(`${endpoint}?local_kw=true`, requestData)
      .then(response => {
        console.log('Booking response:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Booking API Error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        throw error;
      });
  },
  getAll: () => apiClient.get('/api/bookings').then(res => res.data),
  update: (id: number, data: Partial<Booking>) => apiClient.put(`/api/bookings/${id}`, data).then(res => res.data),
  cancel: (id: number) => apiClient.delete(`/api/bookings/${id}`).then(res => res.data),
};

export default apiClient;
