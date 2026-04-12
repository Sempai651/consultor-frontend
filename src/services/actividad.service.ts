import api from './api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Actividad {
  id: number;
  tipo: 'login' | 'proveedor' | 'pago' | 'mensaje' | 'promocion' | 'logout';
  titulo: string;
  descripcion: string;
  fecha: string;
  icono: string;
  color: string;
}

// Almacenamiento local de actividades
let actividadesLocales: Actividad[] = [];

// Cargar actividades guardadas
const cargarActividadesGuardadas = async () => {
  try {
    const guardadas = await AsyncStorage.getItem('@Actividades');
    if (guardadas) {
      actividadesLocales = JSON.parse(guardadas);
    }
  } catch (error) {
    // Silenciado - no mostrar error
  }
};

// Guardar actividades
const guardarActividades = async () => {
  try {
    await AsyncStorage.setItem('@Actividades', JSON.stringify(actividadesLocales));
  } catch (error) {
    // Silenciado - no mostrar error
  }
};

// Registrar una nueva actividad
export const registrarActividad = async (
  tipo: Actividad['tipo'],
  titulo: string,
  descripcion: string
) => {
  const nuevaActividad: Actividad = {
    id: Date.now(),
    tipo,
    titulo,
    descripcion,
    fecha: new Date().toISOString(),
    icono: getIconoPorTipo(tipo),
    color: getColorPorTipo(tipo),
  };
  
  actividadesLocales.unshift(nuevaActividad);
  // Mantener solo las últimas 20 actividades
  if (actividadesLocales.length > 20) {
    actividadesLocales = actividadesLocales.slice(0, 20);
  }
  
  await guardarActividades();
  
  // Intentar enviar al backend (silenciosamente, sin mostrar error)
  try {
    await api.post('/actividad', nuevaActividad);
  } catch (error) {
    // Silenciado - no mostrar error en consola
  }
  
  return nuevaActividad;
};

// Obtener actividades recientes
export const getActividadesRecientes = async (): Promise<Actividad[]> => {
  await cargarActividadesGuardadas();
  
  // Intentar obtener del backend (silenciosamente)
  try {
    const response = await api.get('/actividad/reciente');
    const actividadesBackend = response.data.data || response.data;
    if (actividadesBackend && actividadesBackend.length > 0) {
      return actividadesBackend;
    }
  } catch (error) {
    // Silenciado - no mostrar error en consola
  }
  
  return actividadesLocales;
};

// Limpiar actividades
export const limpiarActividades = async () => {
  actividadesLocales = [];
  await guardarActividades();
};

const getIconoPorTipo = (tipo: Actividad['tipo']): string => {
  switch (tipo) {
    case 'login': return 'log-in';
    case 'logout': return 'log-out';
    case 'proveedor': return 'truck';
    case 'pago': return 'credit-card';
    case 'mensaje': return 'message-circle';
    case 'promocion': return 'tag';
    default: return 'bell';
  }
};

const getColorPorTipo = (tipo: Actividad['tipo']): string => {
  switch (tipo) {
    case 'login': return '#10B981';
    case 'logout': return '#EF4444';
    case 'proveedor': return '#3B82F6';
    case 'pago': return '#F59E0B';
    case 'mensaje': return '#8B5CF6';
    case 'promocion': return '#EC4899';
    default: return '#6B7280';
  }
};