export interface Usuario {
  id: string;
  nombre?: string;
  email: string;
  ci: string;
  token?: string;
}

export interface LoginRequest {
  ci: string;
  password: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}