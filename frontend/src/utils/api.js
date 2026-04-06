import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://medicare-backend-z9io.onrender.com/api'
);

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
