import api from './api.service';
import { LoginRequest, LoginResponse } from '../interfaces/usuario.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Error in login service:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@Auth:token');
      await AsyncStorage.removeItem('@Auth:user');
    } catch (error) {
      console.error('Error in logout service:', error);
      throw error;
    }
  }
};