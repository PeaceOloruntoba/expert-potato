import axios from 'axios';

const API_BASE_URL = 'https://refactored-couscous-psi.vercel.app/api/v1'; // Fallback to production URL if needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use(async (config: any) => {
  // The token will now be set via setAuthToken, so we don't need to get it from useAuth.getState() here
  // This interceptor can remain for other purposes if needed, but token handling is externalized.
  return config;
});

export default api;
