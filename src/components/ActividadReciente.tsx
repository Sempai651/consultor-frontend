import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);

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
            if (onPressActividad) {
              onPressActividad(actividad);
            }
          }
        }
      ]
    );
  };

  const actividadesMostrar = actividades.slice(0, 5);
  const hayMasActividades = actividades.length > 5;

  const renderActividadCard = (item: Actividad, isModal: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, isModal && styles.modalCard]}
      onPress={() => {
        if (isModal) setModalVisible(false);
        handlePressActividad(item);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Feather name={item.icono as any} size={isModal ? 18 : 20} color={item.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isModal && styles.modalCardTitle]} numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text style={[styles.cardDescription, isModal && styles.modalCardDesc]} numberOfLines={isModal ? 2 : 1}>
          {item.descripcion}
        </Text>
        <Text style={styles.cardFecha}>{formatFecha(item.fecha)}</Text>
      </View>
      <Feather name="chevron-right" size={isModal ? 16 : 18} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
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
      <View style={styles.header}>
        <Text style={styles.title}>Actividad Reciente</Text>
        {hayMasActividades && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        decelerationRate="fast"
      >
        {actividadesMostrar.map((item) => renderActividadCard(item, false))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Todas las Actividades</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {actividades.map((item) => renderActividadCard(item, true))}
              {actividades.length === 0 && (
                <View style={styles.emptyModalContainer}>
                  <Text style={styles.emptyText}>No hay actividades registradas</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  verTodos: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  
  scrollView: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 12, alignItems: 'center' },
  
  card: { width: 260, backgroundColor: COLORS.surface, borderRadius: 16, padding: 12, marginRight: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  modalCard: { width: '100%', marginRight: 0, marginBottom: 8 },
  
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  modalCardTitle: { fontSize: 15 },
  cardDescription: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  modalCardDesc: { fontSize: 13 },
  cardFecha: { fontSize: 10, color: COLORS.textLight },
  
  loaderContainer: { padding: 20, alignItems: 'center' },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: COLORS.textLight, marginTop: 10 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  emptyModalContainer: { padding: 40, alignItems: 'center' },
});

export default ActividadReciente;