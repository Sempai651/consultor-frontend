import api from './api.service';
import { Promocion, CreatePromocionDTO, UpdatePromocionDTO } from '../interfaces/promocion.interface';

export const promocionesService = {
  async getAll(): Promise<Promocion[]> {
    const response = await api.get('/promociones');
    return response.data.data || response.data;
  },

  async getById(id: number): Promise<Promocion> {
    const response = await api.get(`/promociones/${id}`);
    return response.data.data || response.data;
  },

  async create(data: CreatePromocionDTO): Promise<Promocion> {
    const response = await api.post('/promociones', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: UpdatePromocionDTO): Promise<Promocion> {
    const response = await api.put(`/promociones/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<any> {
    console.log('🗑️ Servicio delete llamado con ID:', id);
    const response = await api.delete(`/promociones/${id}`);
    console.log('✅ Respuesta del servicio delete:', response.data);
    return response.data;
  },

  // ✅ TOGGLE ESTADO CORREGIDO Y FUNCIONAL
  async toggleEstado(id: number, estado: 'activo' | 'inactivo'): Promise<Promocion> {
    console.log('🔄 Servicio toggleEstado - ID:', id, 'Nuevo estado:', estado);
    try {
      const response = await api.patch(`/promociones/${id}/estado`, { estado });
      console.log('✅ Respuesta del servicio toggleEstado:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error en toggleEstado:', error?.response?.data || error);
      throw error;
    }
  },

  // ========== MÉTODOS PARA FILTROS ==========

  async filtrar(params: {
    categoria?: string;
    estado?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<Promocion[]> {
    const response = await api.get('/promociones/filtros/aplicar', { params });
    return response.data.data || response.data;
  },

  async buscarPorTitulo(termino: string): Promise<Promocion[]> {
    const response = await api.get('/promociones/filtros/buscar', { 
      params: { q: termino } 
    });
    return response.data.data || response.data;
  },

  async getActivas(): Promise<Promocion[]> {
    const response = await api.get('/promociones/estado/activas');
    return response.data.data || response.data;
  },

  async getVencidas(): Promise<Promocion[]> {
    const response = await api.get('/promociones/estado/vencidas');
    return response.data.data || response.data;
  },
};