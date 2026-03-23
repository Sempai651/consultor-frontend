import axios from 'axios';
import { API_CONFIG } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 
    'Content-Type': 'application/json',
  },
  // Añadir esto para permitir credenciales
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@Auth:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

export default api;