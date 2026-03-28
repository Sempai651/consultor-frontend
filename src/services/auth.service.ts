import api from './api.service';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiResponse } from '../interfaces/usuario.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data.data?.token) {
      await AsyncStorage.setItem('@Auth:token', response.data.data.token);
      if (response.data.data?.usuario) {
        await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data.data.usuario));
      }
    }
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async recuperarClave(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/recuperar-clave', { email });
    return response.data;
  },

  async nuevaClave(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/auth/nueva-clave/${token}`, { password });
    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('@Auth:token');
    await AsyncStorage.removeItem('@Auth:user');
  },
};
