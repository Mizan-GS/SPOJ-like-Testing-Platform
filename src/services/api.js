
import axios from 'axios'

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
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      method: error.config?.method,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

export const fetchOverview = () => api.get("/analytics/admin/overview");
export const fetchUserAnalytics = () => api.get("/analytics/admin/users");
export const fetchTestAnalytics = () => api.get("/analytics/admin/tests");
export default api;