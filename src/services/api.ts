// src/services/api.ts

import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/transaction';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Erro ao conectar com o servidor',
      status: error.response?.status || 500,
      timestamp: new Date().toISOString(),
    };
    
    return Promise.reject(apiError);
  }
);