import axios from "axios";
import { triggerLogout } from "./authEvents";

const axiosClient = axios.create({
  baseURL: "https://xc4fn4b4-8080.inc1.devtunnels.ms/",
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
