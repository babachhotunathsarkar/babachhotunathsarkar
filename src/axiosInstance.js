// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Zaroori hai agar backend cookies check kar raha hai
});

// ✅ Ye interceptor har request se pehle token attach karta hai
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Silently fail — do NOT use window.location.href here.
      // Redirecting here would cause an infinite reload loop:
      // 401 → redirect → page reloads → API called again → 401 → ...
      // Let individual components/thunks handle auth errors.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;