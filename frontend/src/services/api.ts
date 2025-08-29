import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Health check endpoint
export const healthCheck = () => api.get('/health/');

// Authentication endpoints
export const login = (email: string, password: string) =>
  api.post('/auth/login/', { email, password });

export const register = (userData: {
  email: string;
  password: string;
  display_name: string;
  user_type: 'artist' | 'listener';
}) => api.post('/auth/register/', userData);

export const forgotPassword = (email: string) =>
  api.post('/auth/forgot-password/', { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post('/auth/reset-password/', { token, new_password: newPassword });

// Music upload and management endpoints
export const uploadMusic = (formData: FormData) =>
  api.post('/music/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getArtistTracks = () =>
  api.get('/music/artist-tracks/');

export const getTrack = (trackId: string) =>
  api.get(`/music/tracks/${trackId}/`);

export const updateTrack = (trackId: string, trackData: any) =>
  api.put(`/music/tracks/${trackId}/`, trackData);

export const deleteTrack = (trackId: string) =>
  api.delete(`/music/tracks/${trackId}/`);

// Admin endpoints
export const getPendingTracks = () =>
  api.get('/admin/pending-tracks/');

export const getAllTracks = () =>
  api.get('/admin/all-tracks/');

export const updateTrackStatus = (trackId: string, statusData: {
  status: string;
  isrc?: string;
  lyrics_status?: string;
  notes?: string;
}) => api.put(`/admin/tracks/${trackId}/status/`, statusData);

export const getAdminStats = () =>
  api.get('/admin/stats/');

export const getArtistList = () =>
  api.get('/admin/artists/');

// User profile endpoints
export const getUserProfile = () =>
  api.get('/users/profile/');

export const updateUserProfile = (profileData: any) =>
  api.put('/users/profile/', profileData);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post('/users/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });

export default api;