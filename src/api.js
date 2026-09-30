import axios from 'axios';

// Create an Axios instance with the base URL from Vite environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Example: http://localhost:8000/api/v1
});

// Add a request interceptor to include the auth token (if exists) from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized - Token might be invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default api;
