import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '../services/auth.service'

// ─── Interfaces ───────────────────────────────────────
interface Usuario {
  id: number
  nombre: string
  email: string
  cedula: string    
}

interface AuthContextData {
  user: Usuario | null
  loading: boolean
  signIn: (cedula: string, password: string) => Promise<void>
  signUp: (nombre: string, apellido: string, cedula: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  // Al arrancar la app verifica si hay sesión guardada
  useEffect(() => {
    loadStoredData()
  }, [])

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@Auth:user')
      const storedToken = await AsyncStorage.getItem('@Auth:token')
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error cargando sesión:', error)
    } finally {
      setLoading(false)
    }
  }

  // ─── LOGIN ────────────────────────────────────────────
  async function signIn(cedula: string, password: string) {
    // Llama al backend real
    const response = await authService.login({ cedula, password })

    if (response.success) {
      const { token, usuario } = response.data
      // Guarda token y usuario en el dispositivo
      await AsyncStorage.setItem('@Auth:token', token)
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(usuario))
      setUser(usuario)
    } else {
      throw new Error(response.message)
    }
  }

  // ─── REGISTRO ─────────────────────────────────────────
  async function signUp(
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    password: string
  ) {
    const response = await authService.register({
      nombre,
      apellido,
      cedula,
      email,
      password,
    })

    if (response.success) {
      const { token, usuario } = response.data
      await AsyncStorage.setItem('@Auth:token', token)
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(usuario))
      setUser(usuario)
    } else {
      throw new Error(response.message)
    }
  }

  // ─── LOGOUT ───────────────────────────────────────────
  async function signOut() {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}