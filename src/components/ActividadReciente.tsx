import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { actividadService, Actividad } from '../services/actividad.service';

interface Props {
  onPressActividad?: (actividad: Actividad) => void;
}

export const ActividadReciente: React.FC<Props> = ({ onPressActividad }) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const data = await actividadService.getActividadReciente();
      setActividades(data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffHoras = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60));
    
    if (diffHoras < 1) return 'Hace unos minutos';
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    return `Hace ${Math.floor(diffHoras / 24)} días`;
  };

  const renderItem = ({ item, index }: { item: Actividad; index: number }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => onPressActividad?.(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Feather name={item.icono as any} size={20} color={item.color} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.fecha}>{formatFecha(item.fecha)}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={COLORS.textLight} />
      {index < actividades.length - 1 && <View style={styles.separator} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (actividades.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay actividad reciente</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={actividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  descripcion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  fecha: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 52,
    right: 0,
    height: 1,
    backgroundColor: COLORS.border,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});