import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/register');
  
  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't reload if the request was to the login endpoint, 
      // otherwise we lose the ability to show the login error message on the screen.
      const isLoginRequest = error.config?.url?.includes('/login');
      if (!isLoginRequest && window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shop');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
