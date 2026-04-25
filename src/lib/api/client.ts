import axios, { AxiosInstance } from "axios";

let api: AxiosInstance | null = null;

export type CreateClientOptions = {
  baseURL?: string;
  getToken?: () => string | null | Promise<string | null>;
  onUnauthenticated?: () => void;
  onSubscriptionRequired?: () => void;
};

export function createClient({ baseURL, getToken, onUnauthenticated, onSubscriptionRequired }: CreateClientOptions = {}) {
  const envBase = process.env.EXPO_PUBLIC_API_BASE;
  api = axios.create({
    baseURL: baseURL ?? envBase ?? "https://myfarmsight-be.onrender.com/api/v1",
    timeout: 15000,
  });

  api.interceptors.request.use(async (config) => {
    if (getToken) {
      const token = await getToken();
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    (error) => {
      if (error.response?.status === 401 && onUnauthenticated) {
        onUnauthenticated();
      }
      if (error.response?.status === 403 && 
          error.response?.data?.message === "Active subscription required to access this resource" && 
          onSubscriptionRequired) {
        onSubscriptionRequired();
      }
      return Promise.reject(error);
    }
  );

  return api;
}

export function getClient() {
  if (!api) return createClient();
  return api;
}
