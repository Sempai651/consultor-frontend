// src/components/PromocionesHome.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { promocionesService } from '../services/promociones.service';
import { Promocion } from '../interfaces/promocion.interface';
import { formatDate, isActiva, ordenarPorFechaCercana, tomarPrimeras } from '../utils/dateValidators';

interface PromocionesHomeProps {
  navigation: any;
  onVerTodos?: () => void;
}

export const PromocionesHome: React.FC<PromocionesHomeProps> = ({ navigation, onVerTodos }) => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPromociones = async () => {
    try {
      const data = await promocionesService.getAll();
      
      // 1. Filtrar solo activas (no caducadas)
      const activas = data.filter(p => isActiva(p.fecha_vencimiento));
      
      // 2. ORDENAR POR FECHA MÁS CERCANA PRIMERO (las que vencen antes aparecen primero)
      const ordenadas = ordenarPorFechaCercana(activas);
      
      // 3. Tomar solo las 10 primeras
      const primeras10 = tomarPrimeras(ordenadas, 10);
      
      setPromociones(primeras10);
    } catch (error) {
      console.error('Error cargando promociones home:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  const getCategoriaColor = (categoria: string): string => {
    switch (categoria) {
      case 'Firmas': return '#2A4494';
      case 'Ventas': return '#E6B91E';
      case 'Consentimientos': return '#F59E0B';
      default: return '#0F973D';
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (promociones.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay promociones activas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promociones Destacadas</Text>
        {onVerTodos && (
          <TouchableOpacity onPress={onVerTodos}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {promociones.map((promo) => (
          <TouchableOpacity 
            key={promo.id} 
            style={styles.card}
            onPress={() => navigation.navigate('Promociones')}
          >
            <View style={[styles.categoriaBadge, { backgroundColor: getCategoriaColor(promo.categoria) }]}>
              <Text style={styles.categoriaText}>{promo.categoria}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>{promo.titulo}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{promo.descripcion}</Text>
            <View style={styles.cardFooter}>
              <Feather name="calendar" size={12} color={COLORS.textLight} />
              <Text style={styles.cardFecha}>Vence: {formatDate(promo.fecha_vencimiento)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  verTodos: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 12 },
  card: { width: 200, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  categoriaBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  categoriaText: { fontSize: 10, color: COLORS.white, fontWeight: 'bold' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  cardDescription: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 16 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  cardFecha: { fontSize: 10, color: COLORS.textLight, marginLeft: 4 },
  loaderContainer: { paddingVertical: 20, alignItems: 'center' },
  emptyContainer: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: COLORS.textLight },
});