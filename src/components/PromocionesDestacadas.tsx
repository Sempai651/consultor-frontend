import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { promocionesService } from '../services/promociones.service';
import { Promocion } from '../interfaces/promocion.interface';

interface Props {
  onPressPromocion?: (id: number) => void;
  busqueda?: string;
}

export const PromocionesDestacadas: React.FC<Props> = ({ onPressPromocion, busqueda = '' }) => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');
  const isFocused = useIsFocused();

  const categorias = ['Todas', 'Firmas', 'Ventas', 'Consentimientos', 'Otros'];

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await promocionesService.getAll();
      setPromociones(data.filter(p => p.estado === 'activo'));
    } catch (error) {
      console.error('Error cargando promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, [isFocused]); // Recarga cuando la pantalla recibe foco

  const getPromocionesFiltradas = () => {
    let filtradas = promociones;
    
    if (categoriaSeleccionada !== 'Todas') {
      filtradas = filtradas.filter(p => p.categoria === categoriaSeleccionada);
    }
    
    if (busqueda && busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim();
      filtradas = filtradas.filter(p => 
        p.titulo.toLowerCase().includes(busquedaLower) ||
        p.descripcion.toLowerCase().includes(busquedaLower) ||
        p.categoria.toLowerCase().includes(busquedaLower)
      );
    }
    
    return filtradas;
  };

  const promocionesFiltradas = getPromocionesFiltradas();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promociones Destacadas</Text>
        {promocionesFiltradas.length > 0 && (
          <TouchableOpacity>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoriaChip,
              categoriaSeleccionada === cat && styles.categoriaChipActive,
            ]}
            onPress={() => setCategoriaSeleccionada(cat)}
          >
            <Text style={[styles.categoriaText, categoriaSeleccionada === cat && styles.categoriaTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {busqueda && busqueda.trim() !== '' && (
        <Text style={styles.resultadosTexto}>
          {promocionesFiltradas.length} resultado(s) para "{busqueda}"
        </Text>
      )}

      {promocionesFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="tag" size={40} color={COLORS.textLight} />
          <Text style={styles.emptyText}>
            {busqueda ? 'No hay promociones que coincidan' : 'No hay promociones activas'}
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promocionesScroll}>
          {promocionesFiltradas.slice(0, 5).map((promo) => (
            <TouchableOpacity
              key={promo.id}
              style={styles.promocionCard}
              onPress={() => onPressPromocion?.(promo.id)}
            >
              {promo.imagen ? (
                <Image source={{ uri: `data:image/jpeg;base64,${promo.imagen}` }} style={styles.promocionImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={30} color={COLORS.textLight} />
                </View>
              )}
              <View style={styles.promocionInfo}>
                <Text style={styles.promocionTitulo} numberOfLines={1}>{promo.titulo}</Text>
                <Text style={styles.promocionCategoria}>{promo.categoria}</Text>
                <Text style={styles.promocionDescripcion} numberOfLines={2}>{promo.descripcion}</Text>
                <View style={styles.promocionFooter}>
                  <Feather name="calendar" size={10} color={COLORS.textLight} />
                  <Text style={styles.promocionFecha}>
                    Vence: {new Date(promo.fecha_vencimiento).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.promocionTag}>
                <Text style={styles.promocionTagText}>OFERTA</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  verTodos: { fontSize: 13, color: COLORS.primary },
  resultadosTexto: { fontSize: 13, color: COLORS.textSecondary, paddingHorizontal: 20, marginBottom: 12 },
  categoriasScroll: { paddingHorizontal: 16, marginBottom: 16 },
  categoriaChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  categoriaChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoriaText: { fontSize: 14, color: COLORS.text },
  categoriaTextActive: { color: COLORS.white },
  loaderContainer: { paddingVertical: 20, alignItems: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { fontSize: 14, color: COLORS.textLight, marginTop: 10 },
  promocionesScroll: { paddingHorizontal: 16 },
  promocionCard: { width: 260, backgroundColor: COLORS.surface, borderRadius: 16, marginRight: 16, marginBottom: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  promocionImage: { width: '100%', height: 120, resizeMode: 'cover' },
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  promocionInfo: { padding: 12 },
  promocionTitulo: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  promocionCategoria: { fontSize: 12, color: COLORS.primary, marginBottom: 4 },
  promocionDescripcion: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 16 },
  promocionFooter: { flexDirection: 'row', alignItems: 'center' },
  promocionFecha: { fontSize: 10, color: COLORS.textLight, marginLeft: 4 },
  promocionTag: { position: 'absolute', top: 8, left: 8, backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  promocionTagText: { fontSize: 10, color: '#FFF', fontWeight: 'bold' },
});