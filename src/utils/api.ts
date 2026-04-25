import axios from 'axios';
import { useAuth } from '../stores/auth';

const API_BASE_URL = 'https://refactored-couscous-psi.vercel.app/api/v1'; // Fallback to production URL if needed

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
