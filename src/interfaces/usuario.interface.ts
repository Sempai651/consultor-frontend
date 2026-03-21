// src/interfaces/usuario.interface.ts

// ─── USUARIO ──────────────────────────────────────────
export interface Usuario {
  id: number
  nombre: string
  apellido?: string
  cedula: string      // ← cambia de ci a cedula
  email: string
}

// ─── LOGIN ────────────────────────────────────────────
export interface LoginRequest {
  cedula: string      // ← cambia de ci a cedula
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    usuario: Usuario
  }
}

// ─── REGISTRO ─────────────────────────────────────────
export interface RegisterRequest {
  nombre: string
  apellido: string
  cedula: string
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    token: string
    usuario: Usuario
  }
}

// ─── RESPUESTA GENÉRICA ───────────────────────────────
// Para endpoints que solo devuelven success y message
export interface ApiResponse {
  success: boolean
  message: string
}