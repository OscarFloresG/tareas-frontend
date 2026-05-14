import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:3000/api',
  withCredentials: true // PERMITE EL PASO DE COOKIES JWT
});

// Variable en memoria para el Token CSRF (Segura contra XSS)
let csrfToken = '';

export const setCsrfToken = (token) => {
  csrfToken = token;
};

// INTERCEPTOR: Antes de cada petición, pega el header CSRF automáticamente
api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

export default api;