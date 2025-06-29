// Determine backend base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin);

// Define API endpoints with relative paths
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  users: {
    profile: '/api/users/profile',
  },
  bookings: {
    create: '/api/bookings?local_kw=true',
    root: '/api/bookings',
    byId: (id: number) => `/api/bookings/${id}`,
  },
  parking: {
    spots: '/api/parking/spots',
    availability: (id: number) => `/api/parking/spots/${id}/availability`,
    book: (id: number) => `/api/parking/spots/${id}/book`,
  },
};

// Define API endpoints with absolute paths for backward compatibility
export const apiAbsolute = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  users: {
    profile: `${API_BASE_URL}/api/users/profile`,
  },
  bookings: {
    create: `${API_BASE_URL}/api/bookings?local_kw=true`,
    root: `${API_BASE_URL}/api/bookings`,
    byId: (id: number) => `${API_BASE_URL}/api/bookings/${id}`,
  },
  parking: {
    spots: `${API_BASE_URL}/api/parking/spots`,
    availability: (id: number) => `${API_BASE_URL}/api/parking/spots/${id}/availability`,
    book: (id: number) => `${API_BASE_URL}/api/parking/spots/${id}/book`,
  },
};
