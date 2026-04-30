import axios from 'axios';
import toast from 'react-hot-toast';

// In dev mode (vite dev on port 5173), the proxy handles /api.
// In production/preview mode, connect directly to the backend on port 6000.
const isDev = window.location.port === '5173';
const apiBaseUrl = isDev
  ? '/api'
  : `${window.location.protocol}//${window.location.hostname}:5001/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${apiBaseUrl}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for common errors
    const message = error.response?.data?.message;
    if (error.response?.status >= 400 && error.response?.status !== 401) {
      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else if (message) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
