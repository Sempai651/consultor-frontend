import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { promocionesService } from '../../services/promociones.service';
import { Promocion } from '../../interfaces/promocion.interface';

export const ListaPromocionesScreen = ({ navigation }: any) => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await promocionesService.getAll();
      setPromociones(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarPromociones();
    });
    return unsubscribe;
  }, [navigation]);

  const eliminar = (id: number, titulo: string) => {
    Alert.alert(
      'Eliminar Promoción',
      `¿Estás seguro de eliminar "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await promocionesService.delete(id);
              Alert.alert('✅ Éxito', 'Promoción eliminada correctamente');
              cargarPromociones();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  const cambiarEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    try {
      await promocionesService.toggleEstado(id, nuevoEstado);
      Alert.alert('✅ Éxito', `Promoción ${nuevoEstado === 'activo' ? 'activada' : 'desactivada'}`);
      cargarPromociones();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  const renderItem = ({ item }: { item: Promocion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo}</Text>
        <TouchableOpacity onPress={() => cambiarEstado(item.id, item.estado)}>
          <View style={[styles.estadoBadge, item.estado === 'activo' ? styles.activo : styles.inactivo]}>
            <Text style={styles.estadoText}>
              {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.categoria}>{item.categoria}</Text>
      <Text style={styles.descripcion} numberOfLines={2}>{item.descripcion}</Text>
      <Text style={styles.fecha}>Vence: {new Date(item.fecha_vencimiento).toLocaleDateString()}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => navigation.navigate('EditarPromocion', { id: item.id })}>
          <Feather name="edit-2" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminar(item.id, item.titulo)}>
          <Feather name="trash-2" size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando promociones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promociones</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CrearPromocion')}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {promociones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="tag" size={60} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No hay promociones</Text>
          <Text style={styles.emptySubtext}>Toca + para crear una</Text>
        </View>
      ) : (
        <FlatList
          data={promociones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  list: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  estadoBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  activo: { backgroundColor: '#4CAF50' },
  inactivo: { backgroundColor: '#9E9E9E' },
  estadoText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' },
  categoria: { fontSize: 13, color: COLORS.primary, marginBottom: 4 },
  descripcion: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  fecha: { fontSize: 11, color: COLORS.textLight, marginBottom: 12 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
});