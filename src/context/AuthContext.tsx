import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario.interface';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (cedula: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@Auth:user');
      const storedToken = await AsyncStorage.getItem('@Auth:token');
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        // Si el usuario no tiene rol, asignar 'cliente' por defecto
        if (!parsedUser.rol) {
          parsedUser.rol = 'cliente';
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(cedula: string, password: string) {
    const response = await authService.login({ cedula, password });

    if (response.success) {
      const { token, usuario } = response.data;
      
      // Asegurar que el usuario tenga rol (por si el backend no lo envía)
      const usuarioConRol = {
        ...usuario,
        rol: usuario.rol || 'cliente'
      };
      
      await AsyncStorage.setItem('@Auth:token', token);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(usuarioConRol));
      setUser(usuarioConRol);
    } else {
      throw new Error(response.message);
    }
  }

  async function signOut() {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      await AsyncStorage.removeItem('@Auth:token');
      await AsyncStorage.removeItem('@Auth:user');
      setUser(null);
    }
  }

  // Verificar si el usuario es administrador
  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};