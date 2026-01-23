
import axios from 'axios'
import { getToken, isTokenExpired, clearAuth } from '../utils/jwtUtil'

//https://xc4fn4b4-8080.inc1.devtunnels.ms
// baseURL:import.meta.env.VITE_API_BASE_URL
const api = axios.create({
    baseURL: "https://xc4fn4b4-8080.inc1.devtunnels.ms",
    headers: {
      // Do not set a default Content-Type so requests with FormData
      // let the browser set the proper multipart boundary header.
    },
    //timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token && !isTokenExpired()) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      // avoid repeatedly setting location (which can flood IPC if many requests fail)
      try {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);


export const fetchOverview = () => api.get("/analytics/admin/overview");
export const fetchUserAnalytics = () => api.get("/analytics/admin/users");
export const fetchTestAnalytics = () => api.get("/analytics/admin/tests");
export default api;