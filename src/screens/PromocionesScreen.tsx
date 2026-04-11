import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { promocionesService } from '../services/promociones.service';
import { Promocion } from '../interfaces/promocion.interface';
import { formatDate, getEstadoInfo, isVencida, ordenarPorFechaCercana } from '../utils/dateValidators';

const PromocionesScreen = ({ navigation }: any) => {
  const { isAdmin } = useAuth();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');

  const categorias = ['Todas', 'Firmas', 'Ventas', 'Consentimientos', 'Otros'];
  const estadosFiltro = [
    { label: 'Todas', value: 'todas' },
    { label: 'Activas', value: 'activas' },
    { label: 'Caducadas', value: 'vencidas' },
  ];

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await promocionesService.getAll();
      const ordenadas = ordenarPorFechaCercana(data);
      setPromociones(ordenadas);
    } catch (error) {
      console.error('Error cargando promociones:', error);
      Alert.alert('Error', 'No se pudieron cargar las promociones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPromociones();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarPromociones();
  };

  const getPromocionesFiltradas = () => {
    let filtradas = [...promociones];
    
    if (categoriaSeleccionada !== 'Todas') {
      filtradas = filtradas.filter(p => p.categoria === categoriaSeleccionada);
    }
    
    if (filtroEstado === 'activas') {
      filtradas = filtradas.filter(p => !isVencida(p.fecha_vencimiento));
    } else if (filtroEstado === 'vencidas') {
      filtradas = filtradas.filter(p => isVencida(p.fecha_vencimiento));
    }
    
    return ordenarPorFechaCercana(filtradas);
  };

  const handleEdit = (id: number) => {
    navigation.navigate('EditarPromocion', { id });
  };

  const handleDelete = (promo: Promocion) => {
    Alert.alert(
      'Eliminar Promoción',
      `¿Estás seguro de eliminar "${promo.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await promocionesService.delete(promo.id);
              Alert.alert('Éxito', 'Promoción eliminada');
              await cargarPromociones();
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.msg || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const getCategoriaColor = (categoria: string): string => {
    switch (categoria) {
      case 'Firmas': return '#2A4494';
      case 'Ventas': return '#E6B91E';
      case 'Consentimientos': return '#F59E0B';
      default: return '#0F973D';
    }
  };

  const renderPromocion = ({ item }: { item: Promocion }) => {
    const estadoInfo = getEstadoInfo(item.fecha_vencimiento);
    const vencida = isVencida(item.fecha_vencimiento);
    
    return (
      <View style={[styles.card, vencida && styles.cardVencida]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, vencida && styles.textVencida]}>{item.titulo}</Text>
            <View style={[styles.categoriaBadge, { backgroundColor: getCategoriaColor(item.categoria) }]}>
              <Text style={styles.categoriaBadgeText}>{item.categoria}</Text>
            </View>
          </View>
          
          <View style={styles.estadoContainer}>
            <View style={[styles.estadoBadge, { backgroundColor: estadoInfo.color }]}>
              <Text style={styles.estadoText}>{estadoInfo.texto}</Text>
            </View>
          </View>
          
          <Text style={[styles.cardDescription, vencida && styles.textVencida]}>{item.descripcion}</Text>
          
          <View style={styles.cardFooter}>
            <Feather name="calendar" size={14} color={vencida ? COLORS.error : COLORS.textLight} />
            <Text style={[styles.cardFecha, vencida && styles.textVencida]}>
              Vence: {formatDate(item.fecha_vencimiento)}
            </Text>
          </View>
        </View>
        
        {isAdmin && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
              <Feather name="edit-2" size={18} color={COLORS.white} />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
              <Feather name="trash-2" size={18} color={COLORS.white} />
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const promocionesFiltradas = getPromocionesFiltradas();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todas las Promociones</Text>
        {isAdmin ? (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CrearPromocion')}
          >
            <Feather name="plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <View style={styles.estadosFiltroContainer}>
        {estadosFiltro.map((estado) => (
          <TouchableOpacity
            key={estado.value}
            style={[
              styles.estadoFiltroChip,
              filtroEstado === estado.value && styles.estadoFiltroChipActive,
            ]}
            onPress={() => setFiltroEstado(estado.value)}
          >
            <Text style={[
              styles.estadoFiltroText,
              filtroEstado === estado.value && styles.estadoFiltroTextActive
            ]}>
              {estado.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriasScroll}
        contentContainerStyle={styles.categoriasContent}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoriaChip,
              categoriaSeleccionada === cat && styles.categoriaChipActive,
            ]}
            onPress={() => setCategoriaSeleccionada(cat)}
          >
            <Text style={[
              styles.categoriaText,
              categoriaSeleccionada === cat && styles.categoriaTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Text>Cargando promociones...</Text>
        </View>
      ) : (
        <FlatList
          data={promocionesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPromocion}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="tag" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No hay promociones disponibles</Text>
              {isAdmin && (
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('CrearPromocion')}
                >
                  <Text style={styles.emptyButtonText}>Crear primera promoción</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  createButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  estadosFiltroContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  estadoFiltroChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  estadoFiltroChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  estadoFiltroText: { fontSize: 14, color: COLORS.text },
  estadoFiltroTextActive: { color: COLORS.white },
  categoriasScroll: { maxHeight: 50, marginVertical: 12 },
  categoriasContent: { paddingHorizontal: 16 },
  categoriaChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  categoriaChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoriaText: { fontSize: 14, color: COLORS.text },
  categoriaTextActive: { color: COLORS.white },
  listContent: { padding: 16, paddingBottom: 30 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardVencida: { opacity: 0.7, backgroundColor: '#F9FAFB' },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  textVencida: { color: COLORS.textLight, textDecorationLine: 'line-through' },
  categoriaBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoriaBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: 'bold' },
  estadoContainer: { marginBottom: 8 },
  estadoBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  estadoText: { fontSize: 10, color: COLORS.white, fontWeight: 'bold' },
  cardDescription: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  cardFecha: { fontSize: 12, color: COLORS.textLight, marginLeft: 6 },
  buttonRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: COLORS.primary, gap: 8 },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: COLORS.error, gap: 8 },
  buttonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: COLORS.textLight, marginTop: 16, marginBottom: 20 },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyButtonText: { color: COLORS.white, fontWeight: '600' },
});

export default PromocionesScreen;