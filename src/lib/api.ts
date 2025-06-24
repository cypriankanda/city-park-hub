export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://city-park-hub-1rf7.onrender.com';

export const api = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  users: {
    profile: `${API_BASE_URL}/api/users/profile`,
  },
  // Add other API endpoints as needed
};
