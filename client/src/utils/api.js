import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('travelUser') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travelUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser  = (data)   => api.post('/auth/register', data);
export const loginUser     = (data)   => api.post('/auth/login', data);
export const getMe         = ()       => api.get('/auth/me');
export const updateProfile = (data)   => api.put('/auth/profile', data);

// ─── Packages ─────────────────────────────────────────────────────────────────
export const getPackages       = (params) => api.get('/packages', { params });
export const getPackageById    = (id)     => api.get(`/packages/${id}`);
export const createPackage     = (data)   => api.post('/packages', data);
export const updatePackage     = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage     = (id)     => api.delete(`/packages/${id}`);

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking     = (data)   => api.post('/bookings', data);
export const getUserBookings   = (userId) => api.get(`/bookings/user/${userId}`);
export const getAllBookings     = (params) => api.get('/bookings', { params });
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
export const cancelBooking     = (id)     => api.delete(`/bookings/${id}`);

export default api;
