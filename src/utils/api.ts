import axios from 'axios';
import { useAuth } from '../stores/auth';

const API_BASE_URL = 'https://campus-transit-api.vercel.app'; // Fallback to production URL if needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config: any) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
