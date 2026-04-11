import axios from 'axios'
import { API_CONFIG } from '../constants/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor de REQUEST — agrega el token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@Auth:token')
    console.log('🔑 Token enviado a:', config.url, token ? '✅ Token presente' : '❌ Sin token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.error('Error getting token:', error)
  }
  return config
})

// Interceptor de RESPONSE — detecta token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('❌ Error en petición:', error?.response?.status, error?.config?.url)
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@Auth:token')
      await AsyncStorage.removeItem('@Auth:user')
    }
    return Promise.reject(error)
  }
)

export default api