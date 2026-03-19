import React, { createContext, useState, useContext, useEffect } from 'react';
import { Usuario } from '../interfaces/usuario.interface';
import { authService } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (ci: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('@Auth:user');
      const storedToken = await AsyncStorage.getItem('@Auth:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(ci: string, password: string) {
    try {
      const response = await authService.login({ ci, password });
      setUser(response.usuario);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.usuario));
      await AsyncStorage.setItem('@Auth:token', response.token);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('@Auth:user');
      await AsyncStorage.removeItem('@Auth:token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}