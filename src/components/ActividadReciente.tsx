import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { getActividadesRecientes, Actividad } from '../services/actividad.service';

interface Props {
  onPressActividad?: (actividad: Actividad) => void;
  navigation?: any;
}

export const ActividadReciente: React.FC<Props> = ({ onPressActividad, navigation }) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const data = await getActividadesRecientes();
      setActividades(data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarActividades();
    }, [])
  );

  const formatFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`;
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    
    return fecha.toLocaleDateString();
  };

  const getDetalleActividad = (actividad: Actividad) => {
    switch (actividad.tipo) {
      case 'login':
        return {
          titulo: '📱 Inicio de sesión',
          mensaje: `Ingresaste al sistema el ${new Date(actividad.fecha).toLocaleString()}`,
          accion: 'Ver sesiones',
        };
      case 'logout':
        return {
          titulo: '🚪 Cierre de sesión',
          mensaje: `Cerraste sesión el ${new Date(actividad.fecha).toLocaleString()}`,
          accion: 'Ver historial',
        };
      case 'proveedor':
        return {
          titulo: '🏢 Módulo de Proveedores',
          mensaje: `Accediste a la gestión de proveedores.\n${actividad.descripcion}`,
          accion: 'Ir a Proveedores',
        };
      case 'pago':
        return {
          titulo: '💰 Módulo de Pagos',
          mensaje: `Accediste a herramientas financieras.\n${actividad.descripcion}`,
          accion: 'Ir a Pagos',
        };
      case 'promocion':
        return {
          titulo: '🎯 Módulo de Promociones',
          mensaje: `Gestionaste promociones.\n${actividad.descripcion}`,
          accion: 'Ir a Promociones',
        };
      case 'mensaje':
        return {
          titulo: '💬 Mensajes',
          mensaje: `Revisaste mensajes del sistema.\n${actividad.descripcion}`,
          accion: 'Ver mensajes',
        };
      default:
        return {
          titulo: '📋 Actividad',
          mensaje: actividad.descripcion,
          accion: 'Ver detalles',
        };
    }
  };

  const handlePressActividad = (actividad: Actividad) => {
    const detalle = getDetalleActividad(actividad);
    
    Alert.alert(
      detalle.titulo,
      detalle.mensaje,
      [
        { text: 'Cerrar', style: 'cancel' },
        { 
          text: detalle.accion, 
          onPress: () => {
            if (actividad.tipo === 'proveedor' && navigation) {
              navigation.navigate('Funciones');
            } else if (actividad.tipo === 'pago' && navigation) {
              navigation.navigate('Herramientas');
            } else if (actividad.tipo === 'promocion' && navigation) {
              navigation.navigate('Promociones');
            }
          }
        }
      ]
    );
    
    if (onPressActividad) {
      onPressActividad(actividad);
    }
  };

  const renderItem = ({ item, index }: { item: Actividad; index: number }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => handlePressActividad(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Feather name={item.icono as any} size={20} color={item.color} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion} numberOfLines={1}>{item.descripcion}</Text>
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
        <Feather name="activity" size={40} color={COLORS.textLight} />
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
    marginTop: 10,
  },
});