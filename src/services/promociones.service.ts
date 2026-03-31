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

  async delete(id: number): Promise<void> {
    console.log('🗑️ Eliminando promoción ID:', id);
    await api.delete(`/promociones/${id}`);
    console.log('✅ Eliminación exitosa');
  },

  async toggleEstado(id: number, estado: 'activo' | 'inactivo'): Promise<Promocion> {
    const response = await api.patch(`/promociones/${id}/estado`, { estado });
    return response.data.data || response.data;
  },
};