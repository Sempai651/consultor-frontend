import api from './api.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiResponse
} from '../interfaces/usuario.interface'

export const authService = {

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    if (response.data.data?.token) {
      await AsyncStorage.setItem('@Auth:token', response.data.data.token)
    }
    return response.data
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data)
    if (response.data.data?.token) {
      await AsyncStorage.setItem('@Auth:token', response.data.data.token)
    }
    return response.data
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('@Auth:token')
    await AsyncStorage.removeItem('@Auth:user')
  },

  async recuperarClave(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/recuperar-clave', { email })
    return response.data
  },

  async nuevaClave(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/auth/nueva-clave/${token}`, { password })
    return response.data
  },
}