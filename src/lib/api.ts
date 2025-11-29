import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
});

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
