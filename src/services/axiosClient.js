import axios from "axios";
import { triggerLogout } from "./authEvents";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------
   REQUEST INTERCEPTOR
------------------------------------ */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------
   RESPONSE INTERCEPTOR
------------------------------------ */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 🔐 Token invalid / expired
    if (status === 401) {
      triggerLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
