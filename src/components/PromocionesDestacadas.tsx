import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { promocionesService } from '../services/promociones.service';
import { Promocion } from '../interfaces/promocion.interface';
import { formatDate, getEstadoInfo, isVencida, ordenarPorFechaCercana } from '../utils/dateValidators';

interface PromocionesDestacadasProps {
  busqueda?: string;
  onPressPromocion?: (id: number) => void;
  onEditPromocion?: (id: number) => void;
  navigation?: any;
}

export const PromocionesDestacadas: React.FC<PromocionesDestacadasProps> = ({ 
  busqueda, 
  onPressPromocion,
  onEditPromocion,
  navigation 
}) => {
  const { isAdmin } = useAuth();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [todasPromociones, setTodasPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [modalVisible, setModalVisible] = useState(false);

  const categorias = ['Todas', 'Firmas', 'Ventas', 'Consentimientos', 'Otros'];

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await promocionesService.getActivas();
      const ordenadas = ordenarPorFechaCercana(data);
      
      setTodasPromociones(ordenadas);
      const primeras10 = ordenadas.slice(0, 10);
      setPromociones(primeras10);
    } catch (error) {
      console.error('Error cargando promociones destacadas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarPromociones();
    }, [])
  );

  const confirmarEliminacion = (promo: Promocion) => {
    if (!isAdmin) {
      alert('Acceso denegado. Solo los administradores pueden eliminar promociones.');
      return;
    }
    
    const confirmar = window.confirm(`¿Estás seguro de eliminar "${promo.titulo}"?`);
    if (confirmar) {
      eliminarPromocion(promo.id);
    }
  };

  const eliminarPromocion = async (id: number) => {
    try {
      await promocionesService.delete(id);
      alert('Promoción eliminada correctamente');
      await cargarPromociones();
    } catch (error: any) {
      alert(error?.response?.data?.msg || 'No se pudo eliminar');
    }
  };

  const handleEdit = (id: number) => {
    if (!isAdmin) {
      alert('Acceso denegado. Solo los administradores pueden editar promociones.');
      return;
    }
    onEditPromocion?.(id);
  };

  const getPromocionesFiltradas = () => {
    let filtradas = [...promociones];
    
    if (busqueda && busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      filtradas = filtradas.filter(p => 
        p.titulo.toLowerCase().includes(termino)
      );
    }
    
    if (categoriaSeleccionada !== 'Todas') {
      filtradas = filtradas.filter(p => p.categoria === categoriaSeleccionada);
    }
    
    return ordenarPorFechaCercana(filtradas);
  };

  const getCategoriaColor = (categoria: string): string => {
    switch (categoria) {
      case 'Firmas': return '#2A4494';
      case 'Ventas': return '#0F973D';
      case 'Consentimientos': return '#ffa200';
      default: return '#88816a';
    }
  };

  const getImagenUri = (imagen: string | null): string | null => {
    if (!imagen) return null;
    if (imagen.startsWith('data:image') || imagen.startsWith('http')) {
      return imagen;
    }
    return `data:image/jpeg;base64,${imagen}`;
  };

  const renderModalPromocion = ({ item }: { item: Promocion }) => {
    const estadoInfo = getEstadoInfo(item.fecha_vencimiento);
    const vencida = isVencida(item.fecha_vencimiento);
    const imagenUri = getImagenUri(item.imagen);
    
    return (
      <View style={[styles.modalCard, vencida && styles.promoCardVencida]}>
        {imagenUri ? (
          <Image source={{ uri: imagenUri }} style={styles.modalImage} />
        ) : (
          <View style={[styles.modalImage, styles.modalImagePlaceholder]}>
            <Feather name="image" size={24} color={COLORS.textLight} />
          </View>
        )}
        
        <View style={styles.modalCardContent}>
          <View style={styles.modalCardHeader}>
            <Text style={[styles.modalCardTitle, vencida && styles.textVencida]} numberOfLines={1}>
              {item.titulo}
            </Text>
            {isAdmin && (
              <View style={[styles.modalEstadoBadge, { backgroundColor: estadoInfo.color }]}>
                <Text style={styles.modalEstadoText}>{estadoInfo.texto}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.modalCategoriaContainer}>
            <View style={[styles.modalCategoriaBadge, { backgroundColor: getCategoriaColor(item.categoria) }]}>
              <Text style={styles.modalCategoriaText}>{item.categoria}</Text>
            </View>
          </View>
          
          <Text style={[styles.modalCardDesc, vencida && styles.textVencida]} numberOfLines={2}>
            {item.descripcion}
          </Text>
          
          <View style={styles.modalCardFooter}>
            <Feather name="calendar" size={12} color={vencida ? COLORS.error : COLORS.textLight} />
            <Text style={[styles.modalCardFecha, vencida && styles.textVencida]}>
              Vence: {formatDate(item.fecha_vencimiento)}
            </Text>
          </View>

          {isAdmin && (
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.modalEditButton} 
                onPress={() => {
                  setModalVisible(false);
                  handleEdit(item.id);
                }}
              >
                <Feather name="edit-2" size={14} color={COLORS.white} />
                <Text style={styles.modalButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalDeleteButton} 
                onPress={() => {
                  setModalVisible(false);
                  confirmarEliminacion(item);
                }}
              >
                <Feather name="trash-2" size={14} color={COLORS.white} />
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const promocionesFiltradas = getPromocionesFiltradas();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promociones Destacadas</Text>
        <TouchableOpacity 
          onPress={() => {
            if (isAdmin) {
              navigation?.navigate('Promociones');
            } else {
              setModalVisible(true);
            }
          }}
        >
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.categoriasWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContainer}
          style={styles.categoriasScroll}
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
                categoriaSeleccionada === cat && styles.categoriaTextActive,
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PROMOCIONES - SCROLL HORIZONTAL CON SEPARACIÓN EXTRA */}
      <View style={styles.promocionesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.promocionesContainer}
          style={styles.promocionesScroll}
          decelerationRate="fast"
        >
          {promocionesFiltradas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay promociones activas disponibles</Text>
            </View>
          ) : (
            promocionesFiltradas.map((promo) => {
              const estadoInfo = getEstadoInfo(promo.fecha_vencimiento);
              const vencida = isVencida(promo.fecha_vencimiento);
              const imagenUri = getImagenUri(promo.imagen);
              
              return (
                <View key={promo.id} style={[styles.promoCard, vencida && styles.promoCardVencida]}>
                  {imagenUri ? (
                    <Image source={{ uri: imagenUri }} style={styles.promoImage} />
                  ) : (
                    <View style={[styles.promoImage, styles.promoImagePlaceholder]}>
                      <Feather name="image" size={32} color={COLORS.textLight} />
                    </View>
                  )}
                  
                  <View style={styles.promoContent}>
                    <View style={styles.promoHeader}>
                      <Text style={[styles.promoTitulo, vencida && styles.textVencida]} numberOfLines={2}>
                        {promo.titulo}
                      </Text>
                      {isAdmin && (
                        <View style={[styles.estadoBadge, { backgroundColor: estadoInfo.color }]}>
                          <Text style={styles.estadoText}>{estadoInfo.texto}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.categoriaContainer}>
                      <View style={[styles.categoriaBadge, { backgroundColor: getCategoriaColor(promo.categoria) }]}>
                        <Text style={styles.categoriaBadgeText}>{promo.categoria}</Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.promoDescripcion, vencida && styles.textVencida]} numberOfLines={3}>
                      {promo.descripcion}
                    </Text>
                    
                    <View style={styles.promoFooter}>
                      <Feather name="calendar" size={12} color={vencida ? COLORS.error : COLORS.textLight} />
                      <Text style={[styles.promoFecha, vencida && styles.textVencida]}>
                        Vence: {formatDate(promo.fecha_vencimiento)}
                      </Text>
                    </View>

                    {isAdmin && (
                      <View style={styles.buttonRow}>
                        <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={() => handleEdit(promo.id)}
                        >
                          <Feather name="edit-2" size={14} color={COLORS.white} />
                          <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteButton} 
                          onPress={() => confirmarEliminacion(promo)}
                        >
                          <Feather name="trash-2" size={14} color={COLORS.white} />
                          <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* MODAL PARA CLIENTE */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Todas las Promociones</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={todasPromociones}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderModalPromocion}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalListContent}
              ListEmptyComponent={
                <View style={styles.emptyModalContainer}>
                  <Text style={styles.emptyText}>No hay promociones disponibles</Text>
                </View>
              }
            />
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
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  
  // CATEGORÍAS
  categoriasWrapper: { marginBottom: 24, marginTop: 8 },
  categoriasScroll: { flexGrow: 0 },
  categoriasContainer: { paddingHorizontal: 16, alignItems: 'center', gap: 12 },
  categoriaChip: { 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 25, 
    backgroundColor: COLORS.surface, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoriaChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoriaText: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  categoriaTextActive: { color: COLORS.white },
  
  // PROMOCIONES - Scroll más abajo
  promocionesWrapper: { marginTop: 16 },
  promocionesScroll: { flexGrow: 0 },
  promocionesContainer: { paddingHorizontal: 16, alignItems: 'center', gap: 16 },
  
  promoCard: { 
    width: 280, 
    minHeight: 380,
    backgroundColor: COLORS.white, 
    borderRadius: 20, 
    marginRight: 16, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 4,
    justifyContent: 'space-between'
  },
  promoCardVencida: { opacity: 0.7, backgroundColor: '#F9FAFB' },
  promoImage: { width: '100%', height: 160, resizeMode: 'cover' },
  promoImagePlaceholder: { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  promoContent: { 
    padding: 14, 
    flex: 1, 
    justifyContent: 'space-between'
  },
  promoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 10,
    minHeight: 50
  },
  promoTitulo: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    flex: 1, 
    marginRight: 8,
    lineHeight: 22
  },
  textVencida: { color: COLORS.textLight, textDecorationLine: 'line-through' },
  estadoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  estadoText: { fontSize: 10, color: COLORS.white, fontWeight: 'bold' },
  categoriaContainer: { marginBottom: 10 },
  categoriaBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  categoriaBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: 'bold' },
  promoDescripcion: { 
    fontSize: 13, 
    color: COLORS.textSecondary, 
    marginBottom: 10, 
    lineHeight: 18,
    minHeight: 54,
    maxHeight: 54
  },
  promoFooter: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  promoFecha: { fontSize: 11, color: COLORS.textLight, marginLeft: 5 },
  buttonRow: { 
    flexDirection: 'row', 
    marginTop: 8, 
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  editButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.primary, 
    paddingVertical: 8, 
    borderRadius: 10, 
    gap: 6 
  },
  deleteButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.error, 
    paddingVertical: 8, 
    borderRadius: 10, 
    gap: 6 
  },
  buttonText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  
  loaderContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyContainer: { paddingHorizontal: 20, paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: COLORS.textLight },
  
  // Estilos para el modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  modalListContent: { padding: 16 },
  modalCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  modalImage: { width: 80, height: 80, resizeMode: 'cover' },
  modalImagePlaceholder: { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  modalCardContent: { flex: 1, padding: 10 },
  modalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalCardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, flex: 1, marginRight: 8 },
  modalEstadoBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  modalEstadoText: { fontSize: 9, color: COLORS.white, fontWeight: 'bold' },
  modalCategoriaContainer: { marginBottom: 4 },
  modalCategoriaBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  modalCategoriaText: { fontSize: 9, color: COLORS.white, fontWeight: 'bold' },
  modalCardDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4, lineHeight: 16 },
  modalCardFooter: { flexDirection: 'row', alignItems: 'center' },
  modalCardFecha: { fontSize: 10, color: COLORS.textLight, marginLeft: 4 },
  modalButtonRow: { flexDirection: 'row', marginTop: 8, gap: 8 },
  modalEditButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 6, borderRadius: 6, gap: 4 },
  modalDeleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.error, paddingVertical: 6, borderRadius: 6, gap: 4 },
  modalButtonText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  emptyModalContainer: { padding: 40, alignItems: 'center' },
});

export default PromocionesDestacadas;