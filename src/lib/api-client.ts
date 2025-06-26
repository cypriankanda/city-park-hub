import axios from 'axios';

// Dynamic base URL depending on environment
const API_BASE_URL = 'https://city-park-hub-1rf7.onrender.com';

// Create Axios client with proxy URL
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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
      throw new Error('No response received from server');
    } else {
      throw new Error('Network error occurred. Please check your internet connection.');
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
  getAll: (): Promise<ParkingSpot[]> =>
    apiClient.get('/api/parking-spots').then((res) => res.data),

  getAvailability: (spotId: number): Promise<ParkingSpot> =>
    apiClient.get(`/api/parking/spots/${spotId}/availability`).then((res) => res.data),
};

export const bookingApi = {
  create: async (
    data: {
      parking_space_id: number;
      start_time: Date;
      end_time: Date;
      duration_hours: number;
      local_kw: string;
    }
  ) => {
    try {
      // Format dates as ISO strings
      const requestData = {
        parking_space_id: data.parking_space_id,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        duration_hours: data.duration_hours,
        local_kw: data.local_kw
      };

      console.log('Sending booking request:', {
        endpoint: '/api/bookings',
        data: requestData,
      });

      const response = await apiClient.post('/api/bookings', requestData);
      
      console.log('Booking response:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getAll: (): Promise<Booking[]> =>
    apiClient.get('/api/bookings').then((res) => res.data),

  update: (id: number, data: Partial<Booking>): Promise<Booking> =>
    apiClient.put(`/api/bookings/${id}`, data).then((res) => res.data),

  cancel: (id: number): Promise<void> =>
    apiClient.delete(`/api/bookings/${id}`).then((res) => res.data),
};


