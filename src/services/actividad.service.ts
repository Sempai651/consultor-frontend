import api from './api.service';

export interface Actividad {
  id: number;
  tipo: 'proveedor' | 'pago' | 'mensaje' | 'promocion';
  titulo: string;
  descripcion: string;
  fecha: string;
  icono: string;
  color: string;
}

export const actividadService = {
  async getActividadReciente(): Promise<Actividad[]> {
    try {
      // Intentar obtener del backend
      const response = await api.get('/actividad/reciente');
      return response.data.data || response.data;
    } catch (error) {
      console.log('Usando datos locales (backend no disponible)');
      // Datos de ejemplo mientras el backend no está listo
      return [
        {
          id: 1,
          tipo: 'proveedor',
          titulo: 'Nuevo proveedor registrado',
          descripcion: 'Proveedor de servicios',
          fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icono: 'truck',
          color: '#3B82F6',
        },
        {
          id: 2,
          tipo: 'pago',
          titulo: 'Pago programado',
          descripcion: 'Factura #001234',
          fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          icono: 'credit-card',
          color: '#F59E0B',
        },
        {
          id: 3,
          tipo: 'mensaje',
          titulo: 'Mensaje de soporte',
          descripcion: 'Nuevo mensaje del cliente',
          fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          icono: 'message-circle',
          color: '#10B981',
        },
      ];
    }
  },
};