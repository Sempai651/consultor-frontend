import axios from 'axios';
import { API_CONFIG } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@Auth:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@Auth:token')
      
    }
    return Promise.reject(error)
  }
)
export default api;