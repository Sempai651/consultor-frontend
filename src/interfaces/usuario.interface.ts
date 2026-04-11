// src/interfaces/usuario.interface.ts

export interface RegisterDto {
    nombre: string
    apellido: string
    cedula: string      
    email: string
    password: string
}

export interface LoginDto {
    cedula: string      
    password: string
}

export interface JwtPayload {
    id: number
    cedula: string      
    rol?: string
}

export interface AuthResponse {
    token: string
    usuario: {
        id: number
        nombre: string
        cedula: string
        email: string
        rol: 'admin' | 'cliente'
    }
}

// ✅ Interface para el contexto de autenticación
export interface Usuario {
    id: number
    nombre: string
    email: string
    cedula: string
    rol: 'admin' | 'cliente'
}