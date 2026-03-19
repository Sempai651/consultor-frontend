export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  marca: string;
  descripcion?: string;
}

export interface Obligacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: 'pendiente' | 'completada' | 'vencida';
}