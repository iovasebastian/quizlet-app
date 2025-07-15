// utils/axiosInstance.js
import axios from "axios";

//const baseURL = "https://server-three-taupe.vercel.app/api/items";
const baseURL = "http://localhost:3000/";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 || // no token
      error.response?.status === 403    // invalid or expired token
    ) {
      localStorage.removeItem("token");
      window.location.href = "/#/?expired=1"; // send them to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
