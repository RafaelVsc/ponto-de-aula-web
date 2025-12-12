import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// Axios retorna apenas o body por causa do interceptor abaixo.
type ApiClient = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> & {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
}) as ApiClient;

// Interceptor de requisição - adiciona token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('pda:token');
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta - trata 401
api.interceptors.response.use(
  response => response.data,
  error => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('pda:token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);

export { api };
