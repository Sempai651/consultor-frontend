import api from './api.service';
import { Proveedor, Obligacion } from '../interfaces/api.interface';

export const funcionesService = {
  async getProveedores(): Promise<Proveedor[]> {
    const response = await api.get('/proveedores');
    return response.data;
  },

  async getObligaciones(): Promise<Obligacion[]> {
    const response = await api.get('/obligaciones');
    return response.data;
  },
};