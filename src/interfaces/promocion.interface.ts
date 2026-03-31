export type Categoria = 'Firmas' | 'Ventas' | 'Consentimientos' | 'Otros';
export type Estado = 'activo' | 'inactivo';

export interface Promocion {
  id: number;
  titulo: string;
  categoria: Categoria;
  descripcion: string;
  imagen: string;
  fecha_creacion: string;
  fecha_vencimiento: string;
  estado: Estado;
}

export interface CreatePromocionDTO {
  titulo: string;
  categoria: Categoria;
  descripcion: string;
  imagen: string;
  fecha_vencimiento: string;
}

export interface UpdatePromocionDTO extends Partial<CreatePromocionDTO> {
  estado?: Estado;
}