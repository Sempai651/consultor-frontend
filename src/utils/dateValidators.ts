// src/utils/dateValidators.ts

export const formatDate = (fecha: string | Date): string => {
  if (!fecha) return 'Sin fecha';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

export const formatDateForInput = (fecha: string | Date): string => {
  if (!fecha) return '';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return '';
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const anio = date.getFullYear();
  return `${anio}-${mes}-${dia}`;
};

export const isValidDate = (fecha: string | Date): boolean => {
  if (!fecha) return false;
  const date = new Date(fecha);
  return !isNaN(date.getTime());
};

export const isVencida = (fechaVencimiento: string | Date): boolean => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  return vencimiento < hoy;
};

export const isActiva = (fechaVencimiento: string | Date): boolean => {
  return !isVencida(fechaVencimiento);
};

export const isVenceHoy = (fechaVencimiento: string | Date): boolean => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  return vencimiento.getTime() === hoy.getTime();
};

export const diasRestantes = (fechaVencimiento: string | Date): number => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  const diffTime = vencimiento.getTime() - hoy.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isValidVencimiento = (fechaVencimiento: string | Date): boolean => {
  return !isVencida(fechaVencimiento);
};

export const getEstadoPorFecha = (fechaVencimiento: string | Date): 'activa' | 'vencida' | 'vence_hoy' => {
  if (isVencida(fechaVencimiento)) return 'vencida';
  if (isVenceHoy(fechaVencimiento)) return 'vence_hoy';
  return 'activa';
};

export const getEstadoInfo = (fechaVencimiento: string | Date) => {
  const estado = getEstadoPorFecha(fechaVencimiento);
  switch (estado) {
    case 'vencida':
      return { texto: 'Caducada', color: '#EF4444' };
    case 'vence_hoy':
      return { texto: 'Vence hoy', color: '#F59E0B' };
    default:
      return { texto: 'Activo', color: '#0F973D' };
  }
};

// ORDENAR POR FECHA MÁS CERCANA PRIMERO (las que vencen antes aparecen primero)
export const ordenarPorFechaCercana = <T extends { fecha_vencimiento: string | Date }>(
  promociones: T[]
): T[] => {
  return [...promociones].sort((a, b) => {
    const fechaA = new Date(a.fecha_vencimiento).getTime();
    const fechaB = new Date(b.fecha_vencimiento).getTime();
    return fechaA - fechaB; // Ascendente: más cercana primero
  });
};

// ORDENAR POR FECHA MÁS LEJANA PRIMERO (las que vencen después aparecen primero)
export const ordenarPorFechaLejana = <T extends { fecha_vencimiento: string | Date }>(
  promociones: T[]
): T[] => {
  return [...promociones].sort((a, b) => {
    const fechaA = new Date(a.fecha_vencimiento).getTime();
    const fechaB = new Date(b.fecha_vencimiento).getTime();
    return fechaB - fechaA;
  });
};

// FILTRAR SOLO ACTIVAS (no vencidas)
export const filtrarActivas = <T extends { fecha_vencimiento: string | Date }>(
  promociones: T[]
): T[] => {
  return promociones.filter(p => !isVencida(p.fecha_vencimiento));
};

// OBTENER SOLO LAS PRIMERAS N PROMOCIONES
export const tomarPrimeras = <T>(promociones: T[], limite: number = 10): T[] => {
  return promociones.slice(0, limite);
};